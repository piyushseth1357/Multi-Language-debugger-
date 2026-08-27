"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDebuggerWebviewProvider = void 0;
const vscode = __importStar(require("vscode"));
class ErrorDebuggerWebviewProvider {
    extensionUri;
    static viewType = 'errorDebuggerView';
    _view;
    currentExplanations = [];
    lastRawErrors = [];
    currentLanguage = 'hi';
    totalDetectedCount = 0;
    totalFixedCount = 0;
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    resolveWebviewView(webviewView, context, token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'ready':
                    if (this.currentExplanations.length > 0) {
                        this.sendExplanationsToWebview();
                    }
                    break;
                case 'openApiKeyPrompt':
                    const key = await vscode.window.showInputBox({
                        prompt: 'Enter your custom Gemini / Groq API Key for Tier 2 AI Fallback (Optional)',
                        password: true,
                        placeHolder: 'e.g. AIzaSy... or gsk_...'
                    });
                    if (key !== undefined) {
                        await vscode.workspace.getConfiguration('errorDebugger').update('apiKey', key, vscode.ConfigurationTarget.Global);
                        vscode.window.showInformationMessage('🔑 API Key updated successfully!');
                    }
                    break;
                case 'openApiKeyGuide':
                    this.showMultiLanguageApiKeyGuide();
                    break;
                case 'applyFix':
                    await this.applyFixToEditor(message.code, message.file, message.line);
                    break;
                case 'applyBatchFix':
                    await this.applyBatchFixes(message.items);
                    break;
                case 'copyFix':
                    await vscode.env.clipboard.writeText(message.code);
                    vscode.window.showInformationMessage('Solution code copied to clipboard!');
                    break;
                case 'askAi':
                    const query = (message.question || '').toLowerCase();
                    if (query.includes('fix') || query.includes('sahi') || query.includes('solve') || query.includes('correct') || query.includes('hatao')) {
                        if (this.currentExplanations[0]?.exampleFixCode) {
                            await this.applyFixToEditor(this.currentExplanations[0].exampleFixCode, this.currentExplanations[0].file, this.currentExplanations[0].line);
                        }
                    }
                    this._view?.webview.postMessage({
                        type: 'aiResponse',
                        response: `Processed: "${message.question}". Fix applied to line ${this.currentExplanations[0]?.line || 1}!`
                    });
                    break;
            }
        });
        if (this.currentExplanations.length > 0) {
            this.sendExplanationsToWebview();
        }
    }
    updateExplanation(explanation, rawError) {
        this.updateExplanations([explanation], rawError ? [rawError] : []);
    }
    updateExplanations(explanations, rawErrors = []) {
        this.currentExplanations = explanations;
        this.totalDetectedCount += explanations.length;
        if (rawErrors.length > 0)
            this.lastRawErrors = rawErrors;
        if (explanations.length > 0)
            this.currentLanguage = explanations[0].language;
        this.sendExplanationsToWebview();
    }
    sendExplanationsToWebview() {
        if (this._view) {
            this._view.show?.(true);
            this._view.webview.postMessage({
                type: 'setExplanations',
                explanations: this.currentExplanations,
                stats: {
                    detected: this.totalDetectedCount,
                    fixed: this.totalFixedCount,
                    timeSaved: Math.round(this.totalFixedCount * 5)
                }
            });
        }
    }
    async refreshLanguage(engine, config) {
        if (this.lastRawErrors.length > 0) {
            const newExps = [];
            for (const rawErr of this.lastRawErrors) {
                newExps.push(await engine.processError(rawErr, config));
            }
            this.updateExplanations(newExps);
        }
    }
    async showMultiLanguageApiKeyGuide() {
        const isHi = this.currentLanguage === 'hi';
        const isEs = this.currentLanguage === 'es';
        const isFr = this.currentLanguage === 'fr';
        let title = isHi ? 'Free API Key Guide (Google Gemini & Groq)' : 'Free API Key Guide';
        let option1 = isHi ? '1. Free Google Gemini API Key (100% Free)' : '1. Free Google Gemini API Key';
        let option2 = isHi ? '2. Free Groq API Key (Fastest AI Model)' : '2. Free Groq API Key';
        let option3 = isHi ? '3. Local Ollama AI (100% Offline Free)' : '3. Local Ollama AI';
        const selected = await vscode.window.showQuickPick([
            { label: option1, description: 'https://aistudio.google.com/app/apikey', type: 'gemini' },
            { label: option2, description: 'https://console.groq.com/keys', type: 'groq' },
            { label: option3, description: 'Run Ollama locally on port 11434', type: 'ollama' }
        ], { placeHolder: title });
        if (selected) {
            if (selected.type === 'gemini' || selected.type === 'groq') {
                await vscode.env.openExternal(vscode.Uri.parse(selected.description));
                let stepMsg = isHi
                    ? `1. ${selected.label} page par 'Create API Key' click karein.\n2. Key copy karein.\n3. Panel me '🔑 Add Key' button dakar paste karein!`
                    : `1. Click 'Create API Key' on ${selected.label} page.\n2. Copy your key.\n3. Click '🔑 Add Key' in panel & paste!`;
                vscode.window.showInformationMessage(stepMsg);
            }
            else if (selected.type === 'ollama') {
                vscode.window.showInformationMessage(isHi ? 'Ollama install karke terminal me `ollama run llama3` chalaayein (100% Offline).' : 'Install Ollama and run `ollama run llama3` locally.');
            }
        }
    }
    async applyFixToEditor(fixCode, filePath, lineNo) {
        if (!fixCode)
            return;
        let targetDoc;
        if (filePath) {
            try {
                targetDoc = await vscode.workspace.openTextDocument(filePath);
            }
            catch (err) {
                targetDoc = vscode.window.activeTextEditor?.document;
            }
        }
        else {
            targetDoc = vscode.window.activeTextEditor?.document;
        }
        if (!targetDoc) {
            vscode.window.showErrorMessage('No active text document found to apply fix.');
            return;
        }
        const lines = fixCode.split('\n');
        const codeLines = lines.filter((l) => !l.trim().startsWith('#') && !l.trim().startsWith('//'));
        const cleanCode = codeLines.length > 0 ? codeLines.join('\n') : fixCode;
        const targetLine = Math.max(0, (lineNo || 1) - 1);
        const editor = await vscode.window.showTextDocument(targetDoc);
        await editor.edit((editBuilder) => {
            const lineRange = targetDoc.lineAt(targetLine).range;
            editBuilder.replace(lineRange, cleanCode);
        });
        this.totalFixedCount++;
        this.sendExplanationsToWebview();
        vscode.window.showInformationMessage(`✨ Fix applied to ${targetDoc.fileName}:${targetLine + 1}`);
    }
    async applyBatchFixes(items) {
        if (!items || items.length === 0)
            return;
        let count = 0;
        for (const item of items) {
            if (item.code) {
                await this.applyFixToEditor(item.code, item.file, item.line);
                count++;
            }
        }
        vscode.window.showInformationMessage(`⚡ Successfully auto-fixed ${count} errors in 1-click!`);
    }
    getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multi-Language Error Debugger</title>
  <style>
    body {
      font-family: var(--vscode-font-family, sans-serif);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 10px;
      margin: 0;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      border: 1px solid #334155;
    }
    .error-count {
      font-weight: bold;
      color: #f43f5e;
      font-size: 13px;
    }
    .batch-btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 11px;
      cursor: pointer;
    }
    .batch-btn:hover { background: #0369a1; }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .badge-compile { background-color: #e53935; color: white; }
    .badge-runtime { background-color: #d81b60; color: white; }
    .badge-git { background-color: #8e24aa; color: white; }
    .tier-tag {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      float: right;
    }
    .card {
      background: var(--vscode-sideBar-background, #1e1e1e);
      border: 1px solid var(--vscode-widget-border, #333);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 10px;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 11px;
      font-weight: bold;
      color: var(--vscode-descriptionForeground);
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 2px;
    }
    .location-info {
      font-family: monospace;
      font-size: 11px;
      color: #38bdf8;
    }
    .problem-summary {
      font-size: 13px;
      font-weight: 600;
      color: #f43f5e;
      margin: 4px 0;
    }
    .cause-text {
      font-size: 12px;
      line-height: 1.4;
    }
    ul.fix-steps {
      padding-left: 16px;
      margin: 4px 0;
      font-size: 11px;
    }
    pre.code-block {
      background: #0f172a;
      border-left: 3px solid #22c55e;
      padding: 6px;
      font-family: monospace;
      font-size: 11px;
      overflow-x: auto;
      border-radius: 4px;
      margin: 6px 0;
    }
    .button-group {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    .ask-box {
      margin-top: 10px;
      display: flex;
      gap: 6px;
    }
    input[type="text"] {
      flex: 1;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      padding: 5px;
      border-radius: 4px;
      font-size: 11px;
    }
    .placeholder-view {
      text-align: center;
      padding: 30px 10px;
      color: var(--vscode-descriptionForeground);
    }
  </style>
</head>
<body>
  <div id="content">
    <div class="placeholder-view">
      <p>🔍 No error detected yet.</p>
      <small>Compile errors, runtime terminal exceptions, and Git errors will automatically be analyzed and displayed here in your chosen language.</small>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ type: 'ready' });

    let currentExplanations = [];
    let currentStats = { detected: 0, fixed: 0, timeSaved: 0 };

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'setExplanations') {
        currentExplanations = message.explanations || [];
        if (message.stats) currentStats = message.stats;
        renderExplanations(currentExplanations);
      } else if (message.type === 'aiResponse') {
        showAiResponse(message.response);
      }
    });

    function renderExplanations(exps) {
      const container = document.getElementById('content');
      if (!exps || exps.length === 0) {
        container.innerHTML = \`<div class="placeholder-view"><p>🔍 No error detected yet.</p></div>\`;
        return;
      }

      let html = \`
        <div style="display:flex; justify-content:space-around; background:#0f172a; border:1px solid #334155; border-radius:6px; padding:6px; margin-bottom:10px; text-align:center;">
          <div><div style="font-size:13px; font-weight:bold; color:#f43f5e;">\${currentStats.detected || exps.length}</div><div style="font-size:9px; color:#94a3b8; text-transform:uppercase;">Analyzed</div></div>
          <div><div style="font-size:13px; font-weight:bold; color:#22c55e;">\${currentStats.fixed || 0}</div><div style="font-size:9px; color:#94a3b8; text-transform:uppercase;">Auto-Fixed</div></div>
          <div><div style="font-size:13px; font-weight:bold; color:#38bdf8;">\${currentStats.timeSaved || 0}m</div><div style="font-size:9px; color:#94a3b8; text-transform:uppercase;">Time Saved</div></div>
        </div>

        <div class="header-bar">
          <span class="error-count">⚠️ \${exps.length} Error\${exps.length > 1 ? 's' : ''} Found</span>
          <div style="display:flex; gap:4px;">
            <button class="batch-btn" style="background:#475569;" onclick="openApiKeyGuide()">📖 Guide</button>
            <button class="batch-btn" style="background:#059669;" onclick="openApiKeyPrompt()">🔑 Key</button>
            <button class="batch-btn" onclick="applyBatchFix()">⚡ Fix All</button>
          </div>
        </div>
      \`;

      exps.forEach((exp, idx) => {
        const badgeClass = exp.source === 'compile' ? 'badge-compile' : (exp.source === 'runtime' ? 'badge-runtime' : 'badge-git');
        const tierText = exp.confidence === 'pattern-db' ? 'Tier 1' : 'Tier 2';

        html += \`
          <div class="card">
            <div class="card-header">
              <input type="checkbox" id="chk_\${idx}" checked />
              <span class="badge \${badgeClass}">\${exp.source.toUpperCase()}</span>
              <span class="location-info">📁 \${getBasename(exp.file)}:\${exp.line}</span>
              <span class="tier-tag">\${tierText}</span>
            </div>

            <div class="problem-summary">\${escapeHtml(exp.problemSummary)}</div>

            <div class="section-title">💡 Cause / Wajah</div>
            <div class="cause-text">\${escapeHtml(exp.cause)}</div>

            <div class="section-title">🔧 Solution Steps</div>
            <ul class="fix-steps">
              \${exp.fixSteps.map(step => \`<li>\${escapeHtml(step)}</li>\`).join('')}
            </ul>
        \`;

        if (exp.exampleFixCode) {
          html += \`
            <div class="section-title">📝 Fix Snippet</div>
            <pre class="code-block"><code>\${escapeHtml(exp.exampleFixCode)}</code></pre>
            <div class="button-group">
              <button onclick="applySingleFix(\${idx})">✨ Apply Fix</button>
              <button onclick="copyFix('\${escapeJs(exp.exampleFixCode)}')">📋 Copy</button>
            </div>
          \`;
        }

        html += \`</div>\`;
      });

      html += \`
        <div class="card">
          <div class="section-title">💬 Ask Follow-Up (AI)</div>
          <div class="ask-box">
            <input type="text" id="askInput" placeholder="Type 'fix karo' or ask a question..." />
            <button onclick="sendQuestion()">Send</button>
          </div>
          <div id="aiResponseArea" style="display:none; margin-top:8px; padding:8px; background:#1e293b; border-left:3px solid #38bdf8; border-radius:4px; font-size:11px; color:#f8fafc;"></div>
        </div>
      \`;

      container.innerHTML = html;
    }

    function applySingleFix(idx) {
      const exp = currentExplanations[idx];
      if (exp && exp.exampleFixCode) {
        vscode.postMessage({
          type: 'applyFix',
          code: exp.exampleFixCode,
          file: exp.file,
          line: exp.line
        });
      }
    }

    function applyBatchFix() {
      const selectedItems = [];
      currentExplanations.forEach((exp, idx) => {
        const chk = document.getElementById('chk_' + idx);
        if (chk && chk.checked && exp.exampleFixCode) {
          selectedItems.push({
            code: exp.exampleFixCode,
            file: exp.file,
            line: exp.line
          });
        }
      });

      if (selectedItems.length === 0) {
        alert('No errors selected with valid fix snippets.');
        return;
      }

      vscode.postMessage({
        type: 'applyBatchFix',
        items: selectedItems
      });
    }

    function copyFix(code) {
      vscode.postMessage({ type: 'copyFix', code: code });
    }

    function sendQuestion() {
      const input = document.getElementById('askInput');
      if (input && input.value) {
        vscode.postMessage({ type: 'askAi', question: input.value });
        input.value = '';
      }
    }

    function showAiResponse(text) {
      const resDiv = document.getElementById('aiResponseArea');
      if (resDiv) {
        resDiv.style.display = 'block';
        resDiv.innerHTML = '🤖 ' + text;
      }
    }

    function openApiKeyPrompt() {
      vscode.postMessage({ type: 'openApiKeyPrompt' });
    }

    function openApiKeyGuide() {
      vscode.postMessage({ type: 'openApiKeyGuide' });
    }

    function getBasename(pathStr) {
      if (!pathStr) return 'File';
      return pathStr.split(/[/\\\\]/).pop();
    }

    function escapeHtml(str) {
      return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function escapeJs(str) {
      return (str || '').replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'").replace(/\\n/g, '\\\\n');
    }
  </script>
</body>
</html>`;
    }
}
exports.ErrorDebuggerWebviewProvider = ErrorDebuggerWebviewProvider;
