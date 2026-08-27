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
exports.GitListener = void 0;
const vscode = __importStar(require("vscode"));
const settings_1 = require("../settings");
class GitListener {
    engine;
    webviewProvider;
    statusBar;
    constructor(engine, webviewProvider, statusBar) {
        this.engine = engine;
        this.webviewProvider = webviewProvider;
        this.statusBar = statusBar;
    }
    async register(context) {
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
                                    const config = settings_1.ExtensionSettings.getConfig();
                                    if (!config.enableGitListener)
                                        continue;
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
        }
        catch (err) {
            console.warn('Git Listener safely skipped:', err);
        }
    }
    async handleGitErrorText(gitErrorOutput) {
        const config = settings_1.ExtensionSettings.getConfig();
        if (!config.enableGitListener)
            return;
        const rawEvent = this.engine.gitParser.parseGitOutput(gitErrorOutput);
        if (rawEvent) {
            const explanation = await this.engine.processError(rawEvent, config);
            this.webviewProvider.updateExplanation(explanation);
            this.statusBar.notifyErrorDetected();
        }
    }
}
exports.GitListener = GitListener;
