export interface TrustValidation {
    valid: boolean;
    score: number;
    level: string;
    reasons: string[];
}
export declare function validateTrustScore(walletAddress: string): Promise<TrustValidation>;
export declare function calculateMessageTrustImpact(messageContent: string, tokenAmount: number, recipientTrust: number): number;
