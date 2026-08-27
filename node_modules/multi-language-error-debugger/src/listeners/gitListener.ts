import * as vscode from 'vscode';
import { ErrorDebuggerEngine } from '@error-debugger/core-engine';
import { ErrorDebuggerWebviewProvider } from '../ui/webviewPanel';
import { StatusBarManager } from '../ui/statusBar';
import { ExtensionSettings } from '../settings';

export class GitListener {
  constructor(
    private engine: ErrorDebuggerEngine,
    private webviewProvider: ErrorDebuggerWebviewProvider,
    private statusBar: StatusBarManager
  ) {}

  public async register(context: vscode.ExtensionContext) {
    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      if (gitExtension) {
        if (!gitExtension.isActive) {
          await gitExtension.activate();
        }
        const exports = gitExtension.exports;
        if (exports && typeof exports.getAPI === 'function') {
          const git = exports.getAPI(1);
          if (git) {
            git.onDidChangeState(async () => {
              const repos = git.repositories;
              for (const repo of repos) {
                const state = repo.state;
                if (state.mergeChanges && state.mergeChanges.length > 0) {
                  const config = ExtensionSettings.getConfig();
                  if (!config.enableGitListener) continue;

                  const conflictFile = state.mergeChanges[0].uri.fsPath;
                  const gitErrorText = `CONFLICT (content): Merge conflict in ${conflictFile}`;
                  const rawEvent = this.engine.gitParser.parseGitOutput(gitErrorText);

                  if (rawEvent) {
                    const explanation = await this.engine.processError(rawEvent, config);
                    this.webviewProvider.updateExplanation(explanation);
                    this.statusBar.notifyErrorDetected();
                  }
                }
              }
            });
          }
        }
      }
    } catch (err) {
      console.warn('Git Listener safely skipped:', err);
    }
  }

  public async handleGitErrorText(gitErrorOutput: string) {
    const config = ExtensionSettings.getConfig();
    if (!config.enableGitListener) return;

    const rawEvent = this.engine.gitParser.parseGitOutput(gitErrorOutput);
    if (rawEvent) {
      const explanation = await this.engine.processError(rawEvent, config);
      this.webviewProvider.updateExplanation(explanation);
      this.statusBar.notifyErrorDetected();
    }
  }
}
