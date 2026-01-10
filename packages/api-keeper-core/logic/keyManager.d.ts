import { APIKey, APIKeyStatus } from '../types.js';
/**
 * Register a new API key
 */
export declare function registerKey(providerId: string, key: string, secret?: string, options?: {
    name?: string;
    quotaLimit?: number;
    tags?: string[];
}): APIKey;
/**
 * Update key status based on usage/errors
 */
export declare function updateKeyStatus(keyId: string, status: APIKeyStatus, reason?: string): boolean;
/**
 * Record API usage
 */
export declare function recordUsage(keyId: string, cost?: number): boolean;
/**
 * Get best available key for a provider
 */
export declare function getBestKey(providerId: string): APIKey | null;
//# sourceMappingURL=keyManager.d.ts.map