import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
import { ExtensionSettings } from '../settings';

export class TerminalListener {
  private buffer: string = '';
  private debounceTimer?: NodeJS.Timeout;

  constructor(
    private engine: ErrorDebuggerEngine,
    private webviewProvider: ErrorDebuggerWebviewProvider,
    private statusBar: StatusBarManager
  ) {}

  public register(context: vscode.ExtensionContext) {
    try {
      if ('onDidWriteTerminalData' in vscode.window) {
        const disposable = (vscode.window as any).onDidWriteTerminalData(async (e: any) => {
          const config = ExtensionSettings.getConfig();
          if (!config.enableTerminalListener) return;

          this.buffer += e.data;

          if (this.debounceTimer) clearTimeout(this.debounceTimer);

          this.debounceTimer = setTimeout(async () => {
            await this.processTerminalBuffer(config);
          }, 1000);
        });

        context.subscriptions.push(disposable);
      }
    } catch (err) {
      console.warn('Terminal Listener registration safely skipped:', err);
    }
  }

  private async processTerminalBuffer(config: any) {
    if (!this.buffer) return;

    const rawEvent = this.engine.runtimeParser.parseTerminalOutput(this.buffer);
    this.buffer = ''; // reset buffer

    if (rawEvent) {
      const explanation = await this.engine.processError(rawEvent, config);
      this.webviewProvider.updateExplanation(explanation, rawEvent);
      this.statusBar.notifyErrorDetected();
    }
  }
}
