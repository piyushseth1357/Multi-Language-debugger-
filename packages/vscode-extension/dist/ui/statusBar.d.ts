import { SupportedLanguage } from '@error-debugger/shared-types';
export declare class StatusBarManager {
    private item;
    constructor();
    updateLanguage(lang: SupportedLanguage): void;
    notifyErrorDetected(): void;
    dispose(): void;
}
