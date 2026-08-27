import * as vscode from 'vscode';
import { SupportedLanguage } from '@error-debugger/shared-types';

export class StatusBarManager {
  private item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'errorDebugger.changeLanguage';
    this.updateLanguage('hi');
    this.item.show();
  }

  public updateLanguage(lang: SupportedLanguage) {
    this.item.text = `$(bug) Error Debugger [${lang.toUpperCase()}]`;
    this.item.tooltip = `Click to open Multi-Language Error Debugger Panel (${lang})`;
  }

  public notifyErrorDetected() {
    this.item.text = `$(warning) New Error Explained!`;
    setTimeout(() => {
      this.item.text = `$(bug) Error Debugger`;
    }, 4000);
  }

  public dispose() {
    this.item.dispose();
  }
}
