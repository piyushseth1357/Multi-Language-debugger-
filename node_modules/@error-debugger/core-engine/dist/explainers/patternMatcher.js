"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternMatcher = void 0;
const compile_errors_json_1 = __importDefault(require("../data/patterns/compile-errors.json"));
const runtime_errors_json_1 = __importDefault(require("../data/patterns/runtime-errors.json"));
const git_errors_json_1 = __importDefault(require("../data/patterns/git-errors.json"));
const hi_json_1 = __importDefault(require("../data/locales/hi.json"));
const es_json_1 = __importDefault(require("../data/locales/es.json"));
const fr_json_1 = __importDefault(require("../data/locales/fr.json"));
const en_json_1 = __importDefault(require("../data/locales/en.json"));
class PatternMatcher {
    locales = {
        hi: hi_json_1.default,
        es: es_json_1.default,
        fr: fr_json_1.default,
        en: en_json_1.default
    };
    rules;
    constructor() {
        this.rules = [
            ...compile_errors_json_1.default,
            ...runtime_errors_json_1.default,
            ...git_errors_json_1.default
        ];
    }
    match(rawError, language) {
        const locale = this.locales[language] || this.locales.en;
        const text = rawError.rawText;
        for (const rule of this.rules) {
            // Filter by source if category matches
            if (rule.category !== rawError.source)
                continue;
            let regexMatch = null;
            let matched = false;
            if (rule.regex) {
                const regex = new RegExp(rule.regex, 'i');
                regexMatch = text.match(regex);
                if (regexMatch)
                    matched = true;
            }
            if (!matched && rule.keywords && rule.keywords.length > 0) {
                matched = rule.keywords.every((kw) => text.toLowerCase().includes(kw.toLowerCase()));
            }
            if (matched) {
                const causeTemplate = locale.patterns[rule.causeKey] || this.locales.en.patterns[rule.causeKey] || 'Unknown Cause';
                const fixStepsTemplate = locale.patterns[rule.fixKey] || this.locales.en.patterns[rule.fixKey] || ['Check line syntax'];
                // Replace placeholders if regex matched
                let cause = causeTemplate;
                let exampleFixCode = rule.exampleFixCode;
                if (regexMatch) {
                    regexMatch.forEach((groupVal, idx) => {
                        if (idx > 0 && groupVal) {
                            const placeholder = `$${idx}`;
                            cause = cause.replace(new RegExp(`\\${placeholder}`, 'g'), groupVal);
                            if (exampleFixCode) {
                                exampleFixCode = exampleFixCode.replace(new RegExp(`\\${placeholder}`, 'g'), groupVal);
                            }
                        }
                    });
                }
                return {
                    id: rawError.id,
                    source: rawError.source,
                    file: rawError.filePath || 'Unknown File',
                    line: rawError.lineNumber || 1,
                    problemSummary: text.split('\n')[0].substring(0, 120),
                    cause,
                    fixSteps: fixStepsTemplate,
                    exampleFixCode,
                    confidence: 'pattern-db',
                    language,
                    rawText: rawError.rawText,
                    timestamp: rawError.timestamp
                };
            }
        }
        // Generic Tier 1 Local Fallback if no specific rule matched
        const isHi = language === 'hi';
        const isEs = language === 'es';
        const isFr = language === 'fr';
        let cause = `Syntax ya diagnostic error detect hua hai: "${text.substring(0, 100)}".`;
        let fixSteps = ['Error line ke paas syntax alignment check karein', 'Surrounding code block review karein'];
        let exampleFixCode = '    pass';
        const lowerText = text.toLowerCase();
        if (lowerText.includes('indent')) {
            cause = isHi ? 'Python indentation misaligned hai (4 spaces gap check karein).' : 'Python indentation mismatch (check 4 spaces).';
            fixSteps = [isHi ? 'Line ke start me 4-space block gap align karein.' : 'Align line indentation with 4 spaces.'];
            exampleFixCode = '        pass';
        }
        else if (lowerText.includes('return')) {
            cause = isHi ? 'Return statement function (def) ke bahar use hua hai.' : 'Return statement used outside of function.';
            fixSteps = [isHi ? 'Return statement ko def function ke andar move karein.' : 'Move return statement inside function body.'];
            exampleFixCode = '    # Move return statement inside def function';
        }
        else if (lowerText.includes('separated') || lowerText.includes('const') || lowerText.includes('let')) {
            cause = isHi ? 'Python file me JS syntax (const/let ya semicolon) use hua hai.' : 'JS syntax used in Python file.';
            fixSteps = [isHi ? 'const/let keyword line ke start se remove karein.' : 'Remove const/let keyword from start of line.'];
            exampleFixCode = rawError.codeContext ? rawError.codeContext.replace(/\bconst\b|\blet\b/g, '').trim() : '    # Fix python statement syntax';
        }
        return {
            id: rawError.id,
            source: rawError.source,
            file: rawError.filePath || 'Unknown File',
            line: rawError.lineNumber || 1,
            problemSummary: text.split('\n')[0].substring(0, 120),
            cause,
            fixSteps,
            exampleFixCode,
            confidence: 'pattern-db',
            language,
            rawText: rawError.rawText,
            timestamp: rawError.timestamp
        };
    }
}
exports.PatternMatcher = PatternMatcher;
