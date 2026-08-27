"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function runTests() {
    console.log('Running Core Engine Unit Tests...');
    const engine = new index_1.ErrorDebuggerEngine();
    // Test 1: TypeScript Cannot Find Name in Hinglish (Hindi)
    const tsError = {
        id: 'test-1',
        source: 'compile',
        rawText: "Cannot find name 'UserAccount'",
        filePath: 'src/app.ts',
        lineNumber: 15,
        timestamp: Date.now()
    };
    const configHi = {
        language: 'hi',
        llmProvider: 'none',
        enableAutoFix: true,
        enableTerminalListener: true,
        enableDiagnosticsListener: true,
        enableGitListener: true
    };
    const res1 = await engine.processError(tsError, configHi);
    console.assert(res1.confidence === 'pattern-db', 'Test 1 Failed: Should match Tier 1 Pattern DB');
    console.assert(res1.cause.includes('import nahi kiya gaya hai'), 'Test 1 Failed: Cause should be in Hinglish');
    console.log('✅ Test 1 Passed: TypeScript error matched in Hinglish');
    // Test 2: Git Push Rejected in Spanish
    const gitError = {
        id: 'test-2',
        source: 'git',
        rawText: 'error: failed to push some refs to remote. updates were rejected because the remote contains work',
        timestamp: Date.now()
    };
    const configEs = {
        language: 'es',
        llmProvider: 'none',
        enableAutoFix: true,
        enableTerminalListener: true,
        enableDiagnosticsListener: true,
        enableGitListener: true
    };
    const res2 = await engine.processError(gitError, configEs);
    console.assert(res2.confidence === 'pattern-db', 'Test 2 Failed: Should match Tier 1 Pattern DB');
    console.assert(res2.cause.includes('El repositorio remoto contiene'), 'Test 2 Failed: Cause should be in Spanish');
    console.log('✅ Test 2 Passed: Git push error matched in Spanish');
    // Test 3: Node JS Cannot Read Property in French
    const jsError = {
        id: 'test-3',
        source: 'runtime',
        rawText: "TypeError: Cannot read properties of undefined (reading 'items')",
        filePath: 'server.js',
        lineNumber: 42,
        timestamp: Date.now()
    };
    const configFr = {
        language: 'fr',
        llmProvider: 'none',
        enableAutoFix: true,
        enableTerminalListener: true,
        enableDiagnosticsListener: true,
        enableGitListener: true
    };
    const res3 = await engine.processError(jsError, configFr);
    console.assert(res3.confidence === 'pattern-db', 'Test 3 Failed: Should match Tier 1 Pattern DB');
    console.assert(res3.cause.includes('Tentative de lecture d\'une propriété'), 'Test 3 Failed: Cause should be in French');
    console.log('✅ Test 3 Passed: JS Runtime error matched in French');
    console.log('\nAll Core Engine Unit Tests Passed Successfully! 🎉');
}
runTests().catch(console.error);
