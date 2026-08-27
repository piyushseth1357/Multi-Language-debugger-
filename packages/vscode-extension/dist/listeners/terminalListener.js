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
exports.TerminalListener = void 0;
const vscode = __importStar(require("vscode"));
const settings_1 = require("../settings");
class TerminalListener {
    engine;
    webviewProvider;
    statusBar;
    buffer = '';
    debounceTimer;
    constructor(engine, webviewProvider, statusBar) {
        this.engine = engine;
        this.webviewProvider = webviewProvider;
        this.statusBar = statusBar;
    }
    register(context) {
        try {
            if ('onDidWriteTerminalData' in vscode.window) {
                const disposable = vscode.window.onDidWriteTerminalData(async (e) => {
                    const config = settings_1.ExtensionSettings.getConfig();
                    if (!config.enableTerminalListener)
                        return;
                    this.buffer += e.data;
                    if (this.debounceTimer)
                        clearTimeout(this.debounceTimer);
                    this.debounceTimer = setTimeout(async () => {
                        await this.processTerminalBuffer(config);
                    }, 1000);
                });
                context.subscriptions.push(disposable);
            }
        }
        catch (err) {
            console.warn('Terminal Listener registration safely skipped:', err);
        }
    }
    async processTerminalBuffer(config) {
        if (!this.buffer)
            return;
        const rawEvent = this.engine.runtimeParser.parseTerminalOutput(this.buffer);
        this.buffer = ''; // reset buffer
        if (rawEvent) {
            const explanation = await this.engine.processError(rawEvent, config);
            this.webviewProvider.updateExplanation(explanation, rawEvent);
            this.statusBar.notifyErrorDetected();
        }
    }
}
exports.TerminalListener = TerminalListener;
