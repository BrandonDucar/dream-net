export interface WalletData {
    wallet: string;
    trustScore: number;
    tokens: {
        SHEEP: string;
        FLBY: string;
        CORE?: string;
    };
    unlockedAgents: string[];
}
export interface WalletAnalysis {
    wallet: string;
    trustScore: number;
    trustLevel: string;
    tokens: {
        SHEEP: string;
        FLBY: string;
        CORE?: string;
    };
    unlockedAgents: string[];
    completedDreams: number;
    stakedAmount: number;
    hasTokenBoost: boolean;
}
export declare function calculateTrustLevel(score: number): string;
export declare function determineUnlockedAgents(trustScore: number, stakedSheep: number, completedDreams: number, hasTokenBoost?: boolean): string[];
export declare function analyzeWallet(walletData: WalletData, completedDreams?: number, hasTokenBoost?: boolean): WalletAnalysis;
export declare const MOCK_WALLETS: WalletData[];
export declare function getWalletData(address: string): WalletData | null;
