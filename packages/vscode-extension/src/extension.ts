import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from './ui/webviewPanel';
import { StatusBarManager } from './ui/statusBar';
import { ErrorQuickFixProvider } from './providers/quickFixProvider';
import { DiagnosticsListener } from './listeners/diagnosticsListener';
import { TerminalListener } from './listeners/terminalListener';
import { GitListener } from './listeners/gitListener';
import { ExtensionSettings } from './settings';

export function activate(context: vscode.ExtensionContext) {
  console.log('Multi-Language Error Debugger Extension is now active!');

  const engine = new ErrorDebuggerEngine();
  const statusBar = new StatusBarManager();
  const webviewProvider = new ErrorDebuggerWebviewProvider(context.extensionUri);

  // Register Webview View Provider in Sidebar Activity Bar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ErrorDebuggerWebviewProvider.viewType,
      webviewProvider
    )
  );

  // Register Quick Fix Provider (1-Click Lightbulb menu in editor)
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      '*',
      new ErrorQuickFixProvider(engine),
      {
        providedCodeActionKinds: ErrorQuickFixProvider.providedCodeActionKinds
      }
    )
  );

  // Register Event Listeners
  const diagListener = new DiagnosticsListener(engine, webviewProvider, statusBar);
  diagListener.register(context);

  const termListener = new TerminalListener(engine, webviewProvider, statusBar);
  termListener.register(context);

  const gitListener = new GitListener(engine, webviewProvider, statusBar);
  gitListener.register(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('errorDebugger.openWebview', () => {
      vscode.commands.executeCommand('errorDebuggerView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('errorDebugger.changeLanguage', async () => {
      const selected = await vscode.window.showQuickPick(
        [
          { label: 'Hinglish / Hindi', description: 'hi' },
          { label: 'Spanish (Español)', description: 'es' },
          { label: 'French (Français)', description: 'fr' },
          { label: 'English', description: 'en' }
        ],
        { placeHolder: 'Select Error Debugger Language' }
      );
      if (selected) {
        const config = vscode.workspace.getConfiguration('errorDebugger');
        await config.update('language', selected.description, vscode.ConfigurationTarget.Global);
        const updatedConfig = ExtensionSettings.getConfig();
        statusBar.updateLanguage(updatedConfig.language);
        await webviewProvider.refreshLanguage(engine, updatedConfig);
        vscode.window.showInformationMessage(`Error Debugger language set to ${selected.label}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('errorDebugger.explainCurrentError', (explanation) => {
      if (explanation) {
        webviewProvider.updateExplanation(explanation);
      }
      vscode.commands.executeCommand('errorDebuggerView.focus');
    })
  );

  // Listen to configuration changes (e.g. user changes language or API key in settings)
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('errorDebugger.language')) {
        const config = ExtensionSettings.getConfig();
        statusBar.updateLanguage(config.language);
        await webviewProvider.refreshLanguage(engine, config);
      }
    })
  );

  context.subscriptions.push(statusBar);
}

export function deactivate() {}
