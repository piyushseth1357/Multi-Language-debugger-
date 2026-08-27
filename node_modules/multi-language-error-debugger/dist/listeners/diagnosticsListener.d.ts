import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
export declare class DiagnosticsListener {
    private engine;
    private webviewProvider;
    private statusBar;
    private debounceTimer?;
    constructor(engine: ErrorDebuggerEngine, webviewProvider: ErrorDebuggerWebviewProvider, statusBar: StatusBarManager);
    register(context: vscode.ExtensionContext): void;
    private handleDiagnosticsChange;
}
