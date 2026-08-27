import * as vscode from 'vscode';
import { Explanation, RawErrorEvent, DebuggerConfig } from '@error-debugger/shared-types';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
export declare class ErrorDebuggerWebviewProvider implements vscode.WebviewViewProvider {
    private readonly extensionUri;
    static readonly viewType = "errorDebuggerView";
    private _view?;
    private currentExplanations;
    private lastRawErrors;
    private currentLanguage;
    private totalDetectedCount;
    private totalFixedCount;
    constructor(extensionUri: vscode.Uri);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void;
    updateExplanation(explanation: Explanation, rawError?: RawErrorEvent): void;
    updateExplanations(explanations: Explanation[], rawErrors?: RawErrorEvent[]): void;
    private sendExplanationsToWebview;
    refreshLanguage(engine: ErrorDebuggerEngine, config: DebuggerConfig): Promise<void>;
    private showMultiLanguageApiKeyGuide;
    private applyFixToEditor;
    private applyBatchFixes;
    private getHtmlForWebview;
}
