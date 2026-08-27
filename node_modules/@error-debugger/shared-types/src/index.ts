export type ErrorSource = 'compile' | 'runtime' | 'git';

export type SupportedLanguage = 'hi' | 'es' | 'fr' | 'en';

export type LLMProviderType = 'gemini' | 'groq' | 'openai' | 'ollama' | 'none';

export interface RawErrorEvent {
  id: string;
  source: ErrorSource;
  rawText: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  codeContext?: string;
  timestamp: number;
}

export interface Explanation {
  id: string;
  source: ErrorSource;
  file: string;
  line: number;
  problemSummary: string;
  cause: string;
  fixSteps: string[];
  exampleFixCode?: string;
  confidence: 'pattern-db' | 'llm-generated';
  language: SupportedLanguage;
  rawText: string;
  timestamp: number;
}

export interface DebuggerConfig {
  language: SupportedLanguage;
  llmProvider: LLMProviderType;
  apiKey?: string;
  apiEndpoint?: string;
  modelName?: string;
  enableAutoFix: boolean;
  enableTerminalListener: boolean;
  enableDiagnosticsListener: boolean;
  enableGitListener: boolean;
}

export interface PatternRule {
  id: string;
  category: ErrorSource;
  keywords: string[];
  regex?: string;
  causeKey: string;
  fixKey: string;
  exampleFixCode?: string;
}

export interface LocaleTranslations {
  name: string;
  ui: {
    title: string;
    fileLabel: string;
    lineLabel: string;
    problemLabel: string;
    causeLabel: string;
    fixLabel: string;
    confidenceLabel: string;
    applyFixBtn: string;
    copyFixBtn: string;
    askAiPlaceholder: string;
    askAiBtn: string;
    tierPattern: string;
    tierLlm: string;
    noErrorYet: string;
  };
  patterns: Record<string, any>;
}
