export interface MessageValidation {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validateMessage(content: string, tokenAmount: number): MessageValidation;
export declare function sanitizeMessage(content: string): string;
export declare function analyzeMessageSentiment(content: string): {
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
};
