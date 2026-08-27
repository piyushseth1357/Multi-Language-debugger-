#!/usr/bin/env node

import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { SupportedLanguage, RawErrorEvent, DebuggerConfig } from '@error-debugger/shared-types';

async function main() {
  const args = process.argv.slice(2);

  let lang: SupportedLanguage = 'hi';
  let errorText = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && args[i + 1]) {
      lang = args[i + 1] as SupportedLanguage;
      i++;
    } else {
      errorText += (errorText ? ' ' : '') + args[i];
    }
  }

  if (!errorText) {
    console.log(`\x1b[36mMulti-Language Error Debugger CLI v1.0.0\x1b[0m`);
    console.log(`Usage: error-debugger [--lang hi|es|fr|en] "<raw error text or log>"\n`);
    console.log(`Example:`);
    console.log(`  npx error-debugger --lang hi "TypeError: Cannot read properties of undefined (reading 'name')"\n`);
    process.exit(0);
  }

  const engine = new ErrorDebuggerEngine();

  // Detect error type heuristics
  let source: 'compile' | 'runtime' | 'git' = 'runtime';
  if (errorText.includes('TS') || errorText.includes('SyntaxError')) source = 'compile';
  if (errorText.includes('git') || errorText.includes('push') || errorText.includes('merge')) source = 'git';

  const rawEvent: RawErrorEvent = {
    id: `cli-${Date.now()}`,
    source,
    rawText: errorText,
    timestamp: Date.now()
  };

  const config: DebuggerConfig = {
    language: lang,
    llmProvider: 'none',
    enableAutoFix: true,
    enableTerminalListener: true,
    enableDiagnosticsListener: true,
    enableGitListener: true
  };

  console.log(`\n\x1b[35m[Error Debugger Engine] Processing error in language: ${lang.toUpperCase()}...\x1b[0m\n`);
  const result = await engine.processError(rawEvent, config);

  console.log(`--------------------------------------------------`);
  console.log(`\x1b[31mProblem:\x1b[0m ${result.problemSummary}`);
  console.log(`\x1b[33mCause / Wajah:\x1b[0m ${result.cause}`);
  console.log(`\x1b[32mConfidence Tier:\x1b[0m ${result.confidence}`);
  console.log(`\x1b[34mSolution Steps:\x1b[0m`);
  result.fixSteps.forEach((step: string, idx: number) => {
    console.log(`  ${idx + 1}. ${step}`);
  });

  if (result.exampleFixCode) {
    console.log(`\x1b[36mCode Fix Snippet:\x1b[0m`);
    console.log(`\x1b[90m${result.exampleFixCode}\x1b[0m`);
  }
  console.log(`--------------------------------------------------\n`);
}

main().catch(err => {
  console.error("CLI Error:", err);
});
