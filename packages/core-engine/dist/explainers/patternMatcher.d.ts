import { RawErrorEvent, Explanation, SupportedLanguage } from '@error-debugger/shared-types';
export declare class PatternMatcher {
    private locales;
    private rules;
    constructor();
    match(rawError: RawErrorEvent, language: SupportedLanguage): Explanation | null;
}
//# sourceMappingURL=patternMatcher.d.ts.map