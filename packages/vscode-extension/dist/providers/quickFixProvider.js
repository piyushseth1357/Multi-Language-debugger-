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
exports.ErrorQuickFixProvider = void 0;
const vscode = __importStar(require("vscode"));
const settings_1 = require("../settings");
class ErrorQuickFixProvider {
    engine;
    static providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];
    constructor(engine) {
        this.engine = engine;
    }
    async provideCodeActions(document, range, context, token) {
        const config = settings_1.ExtensionSettings.getConfig();
        if (!config.enableAutoFix || context.diagnostics.length === 0) {
            return [];
        }
        const actions = [];
        for (const diagnostic of context.diagnostics) {
            const lineNo = diagnostic.range.start.line + 1;
            const rawEvent = this.engine.compileParser.parseDiagnostic(diagnostic.message, document.fileName, lineNo, diagnostic.range.start.character + 1, document.lineAt(diagnostic.range.start.line).text);
            const explanation = await this.engine.processError(rawEvent, config);
            // Action 1: Open explanation in Webview
            const openWebviewAction = new vscode.CodeAction(`💡 Debugger (${config.language.toUpperCase()}): ${explanation.problemSummary}`, vscode.CodeActionKind.QuickFix);
            openWebviewAction.command = {
                command: 'errorDebugger.explainCurrentError',
                title: 'Explain Error',
                arguments: [explanation]
            };
            actions.push(openWebviewAction);
            // Action 2: Apply example fix code directly if available
            if (explanation.exampleFixCode) {
                const applyFixAction = new vscode.CodeAction(`✨ Quick Fix: Insert fix snippet for ${diagnostic.message.substring(0, 30)}...`, vscode.CodeActionKind.QuickFix);
                applyFixAction.edit = new vscode.WorkspaceEdit();
                applyFixAction.edit.insert(document.uri, new vscode.Position(diagnostic.range.start.line, 0), `// Fix suggested by Multi-Language Error Debugger:\n${explanation.exampleFixCode}\n`);
                actions.push(applyFixAction);
            }
        }
        return actions;
    }
}
exports.ErrorQuickFixProvider = ErrorQuickFixProvider;
