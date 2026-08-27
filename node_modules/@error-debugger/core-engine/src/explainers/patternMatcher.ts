import { RawErrorEvent, Explanation, SupportedLanguage, PatternRule, LocaleTranslations } from '@error-debugger/shared-types';

import compilePatterns from '../data/patterns/compile-errors.json';
import runtimePatterns from '../data/patterns/runtime-errors.json';
import gitPatterns from '../data/patterns/git-errors.json';

import hiLocale from '../data/locales/hi.json';
import esLocale from '../data/locales/es.json';
import frLocale from '../data/locales/fr.json';
import enLocale from '../data/locales/en.json';

export class PatternMatcher {
  private locales: Record<SupportedLanguage, LocaleTranslations> = {
    hi: hiLocale as LocaleTranslations,
    es: esLocale as LocaleTranslations,
    fr: frLocale as LocaleTranslations,
    en: enLocale as LocaleTranslations
  };

  private rules: PatternRule[];

  constructor() {
    this.rules = [
      ...(compilePatterns as PatternRule[]),
      ...(runtimePatterns as PatternRule[]),
      ...(gitPatterns as PatternRule[])
    ];
  }

  public match(rawError: RawErrorEvent, language: SupportedLanguage): Explanation | null {
    const locale = this.locales[language] || this.locales.en;
    const text = rawError.rawText;

    for (const rule of this.rules) {
      // Filter by source if category matches
      if (rule.category !== rawError.source) continue;

      let regexMatch: RegExpMatchArray | null = null;
      let matched = false;

      if (rule.regex) {
        const regex = new RegExp(rule.regex, 'i');
        regexMatch = text.match(regex);
        if (regexMatch) matched = true;
      }

      if (!matched && rule.keywords && rule.keywords.length > 0) {
        matched = rule.keywords.every((kw: string) => text.toLowerCase().includes(kw.toLowerCase()));
      }

      if (matched) {
        const causeTemplate = (locale.patterns[rule.causeKey] as string) || (this.locales.en.patterns[rule.causeKey] as string) || 'Unknown Cause';
        const fixStepsTemplate = (locale.patterns[rule.fixKey] as string[]) || (this.locales.en.patterns[rule.fixKey] as string[]) || ['Check line syntax'];

        // Replace placeholders if regex matched
        let cause = causeTemplate;
        let exampleFixCode = rule.exampleFixCode;

        if (regexMatch) {
          regexMatch.forEach((groupVal, idx) => {
            if (idx > 0 && groupVal) {
              const placeholder = `$${idx}`;
              cause = cause.replace(new RegExp(`\\${placeholder}`, 'g'), groupVal);
              if (exampleFixCode) {
                exampleFixCode = exampleFixCode.replace(new RegExp(`\\${placeholder}`, 'g'), groupVal);
              }
            }
          });
        }

        return {
          id: rawError.id,
          source: rawError.source,
          file: rawError.filePath || 'Unknown File',
          line: rawError.lineNumber || 1,
          problemSummary: text.split('\n')[0].substring(0, 120),
          cause,
          fixSteps: fixStepsTemplate,
          exampleFixCode,
          confidence: 'pattern-db',
          language,
          rawText: rawError.rawText,
          timestamp: rawError.timestamp
        };
      }
    }

    // Generic Tier 1 Local Fallback if no specific rule matched
    const isHi = language === 'hi';
    const isEs = language === 'es';
    const isFr = language === 'fr';

    let cause = `Syntax ya diagnostic error detect hua hai: "${text.substring(0, 100)}".`;
    let fixSteps = ['Error line ke paas syntax alignment check karein', 'Surrounding code block review karein'];
    let exampleFixCode = '    pass';

    const lowerText = text.toLowerCase();
    if (lowerText.includes('indent')) {
      cause = isHi ? 'Python indentation misaligned hai (4 spaces gap check karein).' : 'Python indentation mismatch (check 4 spaces).';
      fixSteps = [isHi ? 'Line ke start me 4-space block gap align karein.' : 'Align line indentation with 4 spaces.'];
      exampleFixCode = '        pass';
    } else if (lowerText.includes('return')) {
      cause = isHi ? 'Return statement function (def) ke bahar use hua hai.' : 'Return statement used outside of function.';
      fixSteps = [isHi ? 'Return statement ko def function ke andar move karein.' : 'Move return statement inside function body.'];
      exampleFixCode = '    # Move return statement inside def function';
    } else if (lowerText.includes('separated') || lowerText.includes('const') || lowerText.includes('let')) {
      cause = isHi ? 'Python file me JS syntax (const/let ya semicolon) use hua hai.' : 'JS syntax used in Python file.';
      fixSteps = [isHi ? 'const/let keyword line ke start se remove karein.' : 'Remove const/let keyword from start of line.'];
      exampleFixCode = rawError.codeContext ? rawError.codeContext.replace(/\bconst\b|\blet\b/g, '').trim() : '    # Fix python statement syntax';
    }

    return {
      id: rawError.id,
      source: rawError.source,
      file: rawError.filePath || 'Unknown File',
      line: rawError.lineNumber || 1,
      problemSummary: text.split('\n')[0].substring(0, 120),
      cause,
      fixSteps,
      exampleFixCode,
      confidence: 'pattern-db',
      language,
      rawText: rawError.rawText,
      timestamp: rawError.timestamp
    };
  }
}
