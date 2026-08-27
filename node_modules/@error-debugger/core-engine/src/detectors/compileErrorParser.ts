import { RawErrorEvent } from '@error-debugger/shared-types';

export class CompileErrorParser {
  public parseDiagnostic(
    message: string,
    file?: string,
    line?: number,
    column?: number,
    codeContext?: string
  ): RawErrorEvent {
    return {
      id: `compile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source: 'compile',
      rawText: message,
      filePath: file,
      lineNumber: line,
      columnNumber: column,
      codeContext: codeContext,
      timestamp: Date.now()
    };
  }
}
