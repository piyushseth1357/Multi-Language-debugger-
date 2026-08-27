import { RawErrorEvent, Explanation, SupportedLanguage, DebuggerConfig } from '@error-debugger/shared-types';
import { PatternMatcher } from './explainers/patternMatcher';
import { LLMFallback } from './explainers/llmFallback';
import { CompileErrorParser } from './detectors/compileErrorParser';
import { RuntimeErrorParser } from './detectors/runtimeErrorParser';
import { GitErrorParser } from './detectors/gitErrorParser';

export class ErrorDebuggerEngine {
  private patternMatcher: PatternMatcher;
  private llmFallback: LLMFallback;
  public compileParser: CompileErrorParser;
  public runtimeParser: RuntimeErrorParser;
  public gitParser: GitErrorParser;

  constructor() {
    this.patternMatcher = new PatternMatcher();
    this.llmFallback = new LLMFallback();
    this.compileParser = new CompileErrorParser();
    this.runtimeParser = new RuntimeErrorParser();
    this.gitParser = new GitErrorParser();
  }

  public async processError(rawError: RawErrorEvent, config: DebuggerConfig): Promise<Explanation> {
    // Tier 1: Fast local pattern lookup (Offline, zero cost)
    const tier1Match = this.patternMatcher.match(rawError, config.language);
    if (tier1Match) {
      return tier1Match;
    }

    // Tier 2: LLM Fallback (Gemini / Groq / OpenAI / Ollama)
    return await this.llmFallback.explain(rawError, config);
  }
}

export * from './detectors/compileErrorParser';
export * from './detectors/runtimeErrorParser';
export * from './detectors/gitErrorParser';
export * from './explainers/patternMatcher';
export * from './explainers/llmFallback';
