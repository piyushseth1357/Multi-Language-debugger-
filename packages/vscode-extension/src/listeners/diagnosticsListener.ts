import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
import { ExtensionSettings } from '../settings';
import { Explanation, RawErrorEvent } from '@error-debugger/shared-types';

export class DiagnosticsListener {
  private debounceTimer?: NodeJS.Timeout;

  constructor(
    private engine: ErrorDebuggerEngine,
    private webviewProvider: ErrorDebuggerWebviewProvider,
    private statusBar: StatusBarManager
  ) {}

  public register(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.onDidChangeDiagnostics((event) => {
      const config = ExtensionSettings.getConfig();
      if (!config.enableDiagnosticsListener) return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.handleDiagnosticsChange(event.uris, config);
      }, 600);
    });

    context.subscriptions.push(disposable);
  }

  private async handleDiagnosticsChange(uris: readonly vscode.Uri[], config: any) {
    const explanations: Explanation[] = [];
    const rawEvents: RawErrorEvent[] = [];

    const allDiagnostics = vscode.languages.getDiagnostics();

    for (const [uri, diagnostics] of allDiagnostics) {
      const errorDiags = diagnostics.filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
      if (errorDiags.length === 0) continue;

      const document = vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());

      for (const errorDiag of errorDiags.slice(0, 25)) {
        const lineNo = errorDiag.range.start.line + 1;
        const colNo = errorDiag.range.start.character + 1;

        let codeContext = '';
        if (document && errorDiag.range.start.line < document.lineCount) {
          codeContext = document.lineAt(errorDiag.range.start.line).text;
        }

        const rawEvent = this.engine.compileParser.parseDiagnostic(
          errorDiag.message,
          uri.fsPath,
          lineNo,
          colNo,
          codeContext
        );

        const explanation = await this.engine.processError(rawEvent, config);
        explanations.push(explanation);
        rawEvents.push(rawEvent);
      }
    }

    if (explanations.length > 0) {
      this.webviewProvider.updateExplanations(explanations, rawEvents);
      this.statusBar.notifyErrorDetected();
    }
  }
}
