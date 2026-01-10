import type { DreamOnchainAccount } from "./types";
/**
 * Get on-chain balance for an address
 * TODO: Once DREAM ERC-20 is live on Base, call provider to fetch actual balance
 */
export declare function getOnchainBalance(address: string): Promise<string>;
/**
 * Request mint (for owner/admin only)
 * TODO: Once token is deployed, implement actual minting logic
 */
export declare function requestMint(userId: string, amount: string): Promise<void>;
/**
 * Request burn
 * TODO: Once token is deployed, implement actual burning logic
 */
export declare function requestBurn(userId: string, amount: string): Promise<void>;
/**
 * Sync on-chain balance for a user
 * For now: simulates by using internal rewards-engine DREAM balance
 */
export declare function syncOnchainForUser(userId: string): Promise<DreamOnchainAccount>;
/**
 * Move internal DREAM to claimable balance (pre-mint buffer)
 */
export declare function moveToClaimable(userId: string, amount: number): Promise<DreamOnchainAccount>;
