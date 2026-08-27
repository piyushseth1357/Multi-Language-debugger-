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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDebuggerEngine = void 0;
const patternMatcher_1 = require("./explainers/patternMatcher");
const llmFallback_1 = require("./explainers/llmFallback");
const compileErrorParser_1 = require("./detectors/compileErrorParser");
const runtimeErrorParser_1 = require("./detectors/runtimeErrorParser");
const gitErrorParser_1 = require("./detectors/gitErrorParser");
class ErrorDebuggerEngine {
    patternMatcher;
    llmFallback;
    compileParser;
    runtimeParser;
    gitParser;
    constructor() {
        this.patternMatcher = new patternMatcher_1.PatternMatcher();
        this.llmFallback = new llmFallback_1.LLMFallback();
        this.compileParser = new compileErrorParser_1.CompileErrorParser();
        this.runtimeParser = new runtimeErrorParser_1.RuntimeErrorParser();
        this.gitParser = new gitErrorParser_1.GitErrorParser();
    }
    async processError(rawError, config) {
        // Tier 1: Fast local pattern lookup (Offline, zero cost)
        const tier1Match = this.patternMatcher.match(rawError, config.language);
        if (tier1Match) {
            return tier1Match;
        }
        // Tier 2: LLM Fallback (Gemini / Groq / OpenAI / Ollama)
        return await this.llmFallback.explain(rawError, config);
    }
}
exports.ErrorDebuggerEngine = ErrorDebuggerEngine;
__exportStar(require("./detectors/compileErrorParser"), exports);
__exportStar(require("./detectors/runtimeErrorParser"), exports);
__exportStar(require("./detectors/gitErrorParser"), exports);
__exportStar(require("./explainers/patternMatcher"), exports);
__exportStar(require("./explainers/llmFallback"), exports);
