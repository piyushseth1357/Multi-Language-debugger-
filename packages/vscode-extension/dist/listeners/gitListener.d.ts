import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
export declare class GitListener {
    private engine;
    private webviewProvider;
    private statusBar;
    constructor(engine: ErrorDebuggerEngine, webviewProvider: ErrorDebuggerWebviewProvider, statusBar: StatusBarManager);
    register(context: vscode.ExtensionContext): Promise<void>;
    handleGitErrorText(gitErrorOutput: string): Promise<void>;
}
