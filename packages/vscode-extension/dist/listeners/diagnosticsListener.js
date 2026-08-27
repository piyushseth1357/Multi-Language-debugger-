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
exports.DiagnosticsListener = void 0;
const vscode = __importStar(require("vscode"));
const settings_1 = require("../settings");
class DiagnosticsListener {
    engine;
    webviewProvider;
    statusBar;
    debounceTimer;
    constructor(engine, webviewProvider, statusBar) {
        this.engine = engine;
        this.webviewProvider = webviewProvider;
        this.statusBar = statusBar;
    }
    register(context) {
        const disposable = vscode.languages.onDidChangeDiagnostics((event) => {
            const config = settings_1.ExtensionSettings.getConfig();
            if (!config.enableDiagnosticsListener)
                return;
            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.handleDiagnosticsChange(event.uris, config);
            }, 600);
        });
        context.subscriptions.push(disposable);
    }
    async handleDiagnosticsChange(uris, config) {
        const explanations = [];
        const rawEvents = [];
        const allDiagnostics = vscode.languages.getDiagnostics();
        for (const [uri, diagnostics] of allDiagnostics) {
            const errorDiags = diagnostics.filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
            if (errorDiags.length === 0)
                continue;
            const document = vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());
            for (const errorDiag of errorDiags.slice(0, 25)) {
                const lineNo = errorDiag.range.start.line + 1;
                const colNo = errorDiag.range.start.character + 1;
                let codeContext = '';
                if (document && errorDiag.range.start.line < document.lineCount) {
                    codeContext = document.lineAt(errorDiag.range.start.line).text;
                }
                const rawEvent = this.engine.compileParser.parseDiagnostic(errorDiag.message, uri.fsPath, lineNo, colNo, codeContext);
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
exports.DiagnosticsListener = DiagnosticsListener;
