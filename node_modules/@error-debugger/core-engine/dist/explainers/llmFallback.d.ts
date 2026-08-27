import { RawErrorEvent, Explanation, DebuggerConfig } from '@error-debugger/shared-types';
export declare class LLMFallback {
    private languageNames;
    explain(rawError: RawErrorEvent, config: DebuggerConfig): Promise<Explanation>;
    private callGeminiAPI;
    private callOpenAICompatibleAPI;
    private cleanJsonString;
    private buildFallbackOfflineExplanation;
}
//# sourceMappingURL=llmFallback.d.ts.map