import { RawErrorEvent, Explanation, DebuggerConfig } from '@error-debugger/shared-types';
import { CompileErrorParser } from './detectors/compileErrorParser';
import { RuntimeErrorParser } from './detectors/runtimeErrorParser';
import { GitErrorParser } from './detectors/gitErrorParser';
export declare class ErrorDebuggerEngine {
    private patternMatcher;
    private llmFallback;
    compileParser: CompileErrorParser;
    runtimeParser: RuntimeErrorParser;
    gitParser: GitErrorParser;
    constructor();
    processError(rawError: RawErrorEvent, config: DebuggerConfig): Promise<Explanation>;
}
export * from './detectors/compileErrorParser';
export * from './detectors/runtimeErrorParser';
export * from './detectors/gitErrorParser';
export * from './explainers/patternMatcher';
export * from './explainers/llmFallback';
//# sourceMappingURL=index.d.ts.map