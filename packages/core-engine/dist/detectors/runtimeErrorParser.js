"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeErrorParser = void 0;
class RuntimeErrorParser {
    parseTerminalOutput(terminalChunk) {
        if (!terminalChunk || terminalChunk.trim().length === 0) {
            return null;
        }
        // Heuristics for common runtime error patterns
        const isNodeError = terminalChunk.includes('Error:') || terminalChunk.includes('TypeError:') || terminalChunk.includes('ReferenceError:');
        const isPythonError = terminalChunk.includes('Traceback (most recent call last):') || terminalChunk.includes('SyntaxError:') || terminalChunk.includes('NameError:');
        const isJavaError = terminalChunk.includes('Exception in thread') || terminalChunk.includes('java.lang.');
        if (!isNodeError && !isPythonError && !isJavaError) {
            return null;
        }
        let filePath;
        let lineNumber;
        // Node stack trace pattern: at functionName (path/to/file.js:12:34)
        const nodeStackMatch = terminalChunk.match(/at\s+.*?\((.*?):(\d+):(\d+)\)/) || terminalChunk.match(/at\s+(.*?):(\d+):(\d+)/);
        if (nodeStackMatch) {
            filePath = nodeStackMatch[1];
            lineNumber = parseInt(nodeStackMatch[2], 10);
        }
        // Python stack trace pattern: File "path/to/file.py", line 12
        const pyStackMatch = terminalChunk.match(/File "([^"]+)", line (\d+)/);
        if (pyStackMatch) {
            filePath = pyStackMatch[1];
            lineNumber = parseInt(pyStackMatch[2], 10);
        }
        return {
            id: `runtime-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            source: 'runtime',
            rawText: terminalChunk,
            filePath,
            lineNumber,
            timestamp: Date.now()
        };
    }
}
exports.RuntimeErrorParser = RuntimeErrorParser;
