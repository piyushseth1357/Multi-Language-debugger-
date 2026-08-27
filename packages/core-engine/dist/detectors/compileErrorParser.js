"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileErrorParser = void 0;
class CompileErrorParser {
    parseDiagnostic(message, file, line, column, codeContext) {
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
exports.CompileErrorParser = CompileErrorParser;
