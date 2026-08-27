import * as vscode from 'vscode';
import { DebuggerConfig, SupportedLanguage, LLMProviderType } from '@error-debugger/shared-types';

export class ExtensionSettings {
  public static getConfig(): DebuggerConfig {
    const config = vscode.workspace.getConfiguration('errorDebugger');

    const language = config.get<SupportedLanguage>('language', 'hi');
    const llmProvider = config.get<LLMProviderType>('llmProvider', 'gemini');
    const apiKey = config.get<string>('apiKey', '');
    const apiEndpoint = config.get<string>('apiEndpoint', '');
    const modelName = config.get<string>('modelName', '');
    const enableAutoFix = config.get<boolean>('enableAutoFix', true);
    const enableTerminalListener = config.get<boolean>('enableTerminalListener', true);
    const enableDiagnosticsListener = config.get<boolean>('enableDiagnosticsListener', true);
    const enableGitListener = config.get<boolean>('enableGitListener', true);

    return {
      language,
      llmProvider,
      apiKey,
      apiEndpoint,
      modelName,
      enableAutoFix,
      enableTerminalListener,
      enableDiagnosticsListener,
      enableGitListener
    };
  }
}
