import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
export declare class ErrorQuickFixProvider implements vscode.CodeActionProvider {
    private engine;
    static readonly providedCodeActionKinds: vscode.CodeActionKind[];
    constructor(engine: ErrorDebuggerEngine);
    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<vscode.CodeAction[]>;
}
