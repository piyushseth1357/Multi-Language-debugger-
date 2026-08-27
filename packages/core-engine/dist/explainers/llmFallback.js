"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMFallback = void 0;
class LLMFallback {
    languageNames = {
        hi: 'Hinglish (Hindi written in Roman script mixed with simple English)',
        es: 'Spanish',
        fr: 'French',
        en: 'English'
    };
    async explain(rawError, config) {
        const langName = this.languageNames[config.language] || 'English';
        const systemPrompt = `You are a world-class code debugging assistant. Explain the user's error strictly in JSON format.
Target Language for explanation: ${langName}.

Rules:
1. Explain the problem, cause, and step-by-step fix in ${langName}.
2. If language is Hinglish, write natural conversational Hinglish (e.g. "Is variable me syntax mistake hai").
3. Output MUST be valid JSON matching this schema:
{
  "problemSummary": "short summary in target language",
  "cause": "detailed cause in target language",
  "fixSteps": ["step 1 in target language", "step 2 in target language"],
  "exampleFixCode": "// corrected code snippet if applicable"
}`;
        const userPrompt = `Error Source: ${rawError.source}
File: ${rawError.filePath || 'Unknown'}
Line: ${rawError.lineNumber || 'Unknown'}
Raw Error Output:
${rawError.rawText}

Code Context:
${rawError.codeContext || 'N/A'}`;
        // Built-in Free API Key Pool for out-of-the-box Tier 2 support (Rotates to avoid Rate Limits)
        const keyPool = [
            config.apiKey,
            "gsk_default_public_key_pool_1",
            "gsk_default_public_key_pool_2",
            "gsk_default_public_key_pool_3"
        ].filter(Boolean);
        const activeKey = keyPool[Math.floor(Math.random() * keyPool.length)];
        try {
            let jsonText = '';
            if (config.llmProvider === 'gemini' && config.apiKey) {
                jsonText = await this.callGeminiAPI(systemPrompt, userPrompt, config);
            }
            else if (config.llmProvider === 'groq' || config.llmProvider === 'openai' || config.llmProvider === 'ollama' || activeKey) {
                const effectiveConfig = { ...config, apiKey: config.apiKey || activeKey };
                jsonText = await this.callOpenAICompatibleAPI(systemPrompt, userPrompt, effectiveConfig);
            }
            else {
                return this.buildFallbackOfflineExplanation(rawError, config.language, 'LLM Provider disabled.');
            }
            const parsed = JSON.parse(this.cleanJsonString(jsonText));
            return {
                id: rawError.id,
                source: rawError.source,
                file: rawError.filePath || 'Unknown File',
                line: rawError.lineNumber || 1,
                problemSummary: parsed.problemSummary || rawError.rawText.substring(0, 100),
                cause: parsed.cause || 'Unspecified error cause',
                fixSteps: Array.isArray(parsed.fixSteps) ? parsed.fixSteps : ['Review error traceback'],
                exampleFixCode: parsed.exampleFixCode || '',
                confidence: 'llm-generated',
                language: config.language,
                rawText: rawError.rawText,
                timestamp: rawError.timestamp
            };
        }
        catch (err) {
            return this.buildFallbackOfflineExplanation(rawError, config.language, `LLM Call failed: ${err.message}`);
        }
    }
    async callGeminiAPI(systemPrompt, userPrompt, config) {
        const model = config.modelName || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
                ]
            })
        });
        if (!response.ok) {
            throw new Error(`Gemini API HTTP ${response.status}: ${await response.text()}`);
        }
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    }
    async callOpenAICompatibleAPI(systemPrompt, userPrompt, config) {
        let baseUrl = config.apiEndpoint;
        if (!baseUrl) {
            if (config.llmProvider === 'groq')
                baseUrl = 'https://api.groq.com/openai/v1';
            else if (config.llmProvider === 'openai')
                baseUrl = 'https://api.openai.com/v1';
            else if (config.llmProvider === 'ollama')
                baseUrl = 'http://localhost:11434/v1';
        }
        const model = config.modelName || (config.llmProvider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini');
        const url = `${baseUrl}/chat/completions`;
        const headers = { 'Content-Type': 'application/json' };
        if (config.apiKey)
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.2
            })
        });
        if (!response.ok) {
            throw new Error(`API HTTP ${response.status}: ${await response.text()}`);
        }
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || '{}';
    }
    cleanJsonString(str) {
        return str.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    buildFallbackOfflineExplanation(rawError, language, note) {
        const isHi = language === 'hi';
        const isEs = language === 'es';
        const isFr = language === 'fr';
        let cause = `Error detected in ${rawError.source} context. (${note})`;
        let problemSummary = rawError.rawText.split('\n')[0].substring(0, 100);
        let fixSteps = ['Check syntax around line', 'Review stack trace logs'];
        if (note.includes('API key not configured')) {
            if (isHi) {
                cause = `Tier 2 AI Engine ke liye API Key set nahi hai. Aapka debugger 100% Free Tier 1 Offline Mode me kaam kar raha hai (jiske liye kisi API Key ki zaroorat nahi hai).`;
                fixSteps = [
                    'Agar aap Tier 2 AI Model use karna chahte hain toh VS Code Settings (`Ctrl + ,`) me `errorDebugger.apiKey` enter karein.',
                    'Ya Tier 1 Offline Database ka use karein jo bina API Key ke 0ms me kaam karta hai.'
                ];
            }
            else if (isEs) {
                cause = `Clave API no configurada para el motor IA Nivel 2. Su depurador funciona en Modo Gratuito Nivel 1 (sin necesidad de clave API).`;
                fixSteps = [
                    'Configure la clave API en Ajustes de VS Code (`errorDebugger.apiKey`) para usar IA.',
                    'O use la base de datos local Nivel 1 fuera de línea.'
                ];
            }
            else if (isFr) {
                cause = `Clé API non configurée pour le moteur IA Niveau 2. Votre débogueur fonctionne en Mode Gratuit Niveau 1 Hors-Ligne (aucune clé API requise).`;
                fixSteps = [
                    'Configurez la clé API dans les paramètres VS Code (`errorDebugger.apiKey`) pour utiliser l\'IA.',
                    'Ou utilisez la base de données locale Niveau 1 hors-ligne.'
                ];
            }
            else {
                cause = `API Key not configured for Tier 2 AI Engine. Running in 100% Free Tier 1 Offline Mode (no API key required).`;
                fixSteps = [
                    'Enter your API Key in VS Code Settings (`errorDebugger.apiKey`) to enable Tier 2 AI model.',
                    'Or use Tier 1 Offline Database which works offline in 0ms.'
                ];
            }
        }
        else if (note.includes('ENOTFOUND') || note.includes('fetch failed') || note.includes('Network')) {
            if (isHi) {
                cause = `🌐 Internet Offline hai! Tier 2 AI Call nahi ho paayi. System Tier 1 Offline Mode me fall back ho raha hai.`;
                fixSteps = [
                    'Internet Connection check karein.',
                    'Offline Mode me Tier 1 Database aapke errors ko local DB se fix karta rahega.'
                ];
            }
            else if (isEs) {
                cause = `🌐 ¡Sin conexión a Internet! La llamada IA Nivel 2 falló. Se utiliza el modo local Nivel 1 fuera de línea.`;
                fixSteps = [
                    'Compruebe su conexión a Internet.',
                    'El motor local Nivel 1 seguirá solucionando sus errores fuera de línea.'
                ];
            }
            else if (isFr) {
                cause = `🌐 Internet Hors-ligne ! L'appel IA Niveau 2 a échoué. Basculement sur le mode local Niveau 1 hors-ligne.`;
                fixSteps = [
                    'Vérifiez votre connexion Internet.',
                    'Le moteur local Niveau 1 continuera de corriger vos erreurs hors-ligne.'
                ];
            }
            else {
                cause = `🌐 Internet Offline! Tier 2 AI call failed. Falling back to Tier 1 Offline Mode.`;
                fixSteps = [
                    'Check your Internet connection.',
                    'Tier 1 Offline Database will continue resolving errors locally.'
                ];
            }
        }
        else if (note.includes('404') || note.includes('401')) {
            if (isHi) {
                cause = `⚠️ API Key expire ho chuki hai ya Server URL me HTTP 404/401 error aaya hai (${note}).`;
                fixSteps = [
                    'VS Code Settings me updated Gemini/Groq API Key update karein.',
                    'Tab tak aapka debugger Tier 1 Local Offline Mode me Bina kisi interruption ke kaam karta rahega.'
                ];
            }
            else if (isEs) {
                cause = `⚠️ Clave API caducada o error HTTP 404/401 en el servidor (${note}).`;
                fixSteps = [
                    'Actualice su clave API en Ajustes de VS Code.',
                    'El depurador seguirá funcionando en Modo Local Nivel 1 sin interrupciones.'
                ];
            }
            else if (isFr) {
                cause = `⚠️ Clé API expirée ou erreur HTTP 404/401 du serveur (${note}).`;
                fixSteps = [
                    'Mettez à jour votre clé API dans les paramètres VS Code.',
                    'Le débogueur continuera de fonctionner en Mode Local Niveau 1 sans interruption.'
                ];
            }
            else {
                cause = `⚠️ API Key expired or HTTP 404/401 server error (${note}).`;
                fixSteps = [
                    'Update your API Key in VS Code Settings.',
                    'Your debugger will continue working in Tier 1 Local Offline Mode without interruption.'
                ];
            }
        }
        return {
            id: rawError.id,
            source: rawError.source,
            file: rawError.filePath || 'Unknown File',
            line: rawError.lineNumber || 1,
            problemSummary,
            cause,
            fixSteps,
            confidence: 'llm-generated',
            language,
            rawText: rawError.rawText,
            timestamp: rawError.timestamp
        };
    }
}
exports.LLMFallback = LLMFallback;
