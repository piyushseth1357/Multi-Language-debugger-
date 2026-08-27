import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ExtensionSettings } from '../settings';

export class ErrorQuickFixProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  constructor(private engine: ErrorDebuggerEngine) {}

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CodeAction[]> {
    const config = ExtensionSettings.getConfig();
    if (!config.enableAutoFix || context.diagnostics.length === 0) {
      return [];
    }

    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      const lineNo = diagnostic.range.start.line + 1;
      const rawEvent = this.engine.compileParser.parseDiagnostic(
        diagnostic.message,
        document.fileName,
        lineNo,
        diagnostic.range.start.character + 1,
        document.lineAt(diagnostic.range.start.line).text
      );

      const explanation = await this.engine.processError(rawEvent, config);

      // Action 1: Open explanation in Webview
      const openWebviewAction = new vscode.CodeAction(
        `💡 Debugger (${config.language.toUpperCase()}): ${explanation.problemSummary}`,
        vscode.CodeActionKind.QuickFix
      );
      openWebviewAction.command = {
        command: 'errorDebugger.explainCurrentError',
        title: 'Explain Error',
        arguments: [explanation]
      };
      actions.push(openWebviewAction);

      // Action 2: Apply example fix code directly if available
      if (explanation.exampleFixCode) {
        const applyFixAction = new vscode.CodeAction(
          `✨ Quick Fix: Insert fix snippet for ${diagnostic.message.substring(0, 30)}...`,
          vscode.CodeActionKind.QuickFix
        );
        applyFixAction.edit = new vscode.WorkspaceEdit();
        applyFixAction.edit.insert(
          document.uri,
          new vscode.Position(diagnostic.range.start.line, 0),
          `// Fix suggested by Multi-Language Error Debugger:\n${explanation.exampleFixCode}\n`
        );
        actions.push(applyFixAction);
      }
    }

    return actions;
  }
}
