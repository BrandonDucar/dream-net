export declare const SUPPORTED_TOKENS: ({
    symbol: string;
    name: string;
    logo: string;
    decimals: number;
    address: string;
    default: boolean;
    hiddenFromDreamNetwork?: undefined;
} | {
    symbol: string;
    name: string;
    logo: string;
    decimals: number;
    address: string;
    default: boolean;
    hiddenFromDreamNetwork: boolean;
})[];
export interface Token {
    symbol: string;
    name: string;
    logo: string;
    decimals: number;
    address: string;
    default: boolean;
    hiddenFromDreamNetwork?: boolean;
}
export declare function getDefaultToken(): Token;
export declare function getVisibleTokens(): Token[];
export declare function getTokenBySymbol(symbol: string): Token | undefined;
export type BountyToken = 'SHEEP' | 'FLBY' | 'CORE';
export interface BountyEnhancement {
    type: 'double_xp' | 'priority_boost' | 'viral_spread' | 'expert_review';
    token: BountyToken;
    cost: number;
}
export declare const BOUNTY_ENHANCEMENTS: BountyEnhancement[];
export declare function getEnhancementInfo(type: BountyEnhancement['type']): BountyEnhancement | undefined;
export declare function getEnhancementDescription(type: BountyEnhancement['type']): string;
export declare function formatTokenAmount(amount: string, decimals: number): string;
export declare function parseTokenAmount(amount: string, decimals: number): string;
export declare function formatUnits(value: string, decimals?: number): string;
