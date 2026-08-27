import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
export declare class TerminalListener {
    private engine;
    private webviewProvider;
    private statusBar;
    private buffer;
    private debounceTimer?;
    constructor(engine: ErrorDebuggerEngine, webviewProvider: ErrorDebuggerWebviewProvider, statusBar: StatusBarManager);
    register(context: vscode.ExtensionContext): void;
    private processTerminalBuffer;
}
