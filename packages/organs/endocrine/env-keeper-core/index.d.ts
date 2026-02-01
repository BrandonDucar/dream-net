/**
 * Env Keeper Core
 * Centralized environment variable management system
 * Never manually manage env vars again - auto-discovery, secure storage, unified interface
 */
import type { EnvVariable, EnvKeeperStatus, EnvSyncSource, EnvKeeperContext } from './types.js';
export declare const EnvKeeperCore: {
    /**
     * Initialize Env Keeper
     * Auto-discovers ALL env vars and automatically applies them to process.env
     */
    init(context?: EnvKeeperContext): Promise<boolean>;
    /**
     * Get status
     */
    status(): EnvKeeperStatus;
    /**
     * Auto-discover and sync environment variables
     */
    sync(): Promise<EnvVariable[]>;
    /**
     * Get environment variable
     */
    get(key: string, decryptValue?: boolean): EnvVariable | null;
    /**
     * Get all environment variables
     */
    list(decryptValues?: boolean): EnvVariable[];
    /**
     * Set environment variable
     */
    set(key: string, value: string, options?: {
        category?: string;
        isSecret?: boolean;
        description?: string;
        environments?: string[];
    }): EnvVariable;
    /**
     * Delete environment variable
     */
    delete(key: string): boolean;
    /**
     * Generate .env file content
     */
    generateEnvFile(environment?: string, includeComments?: boolean): string;
    /**
     * Export as JSON (for backup/sharing)
     */
    export(decryptValues?: boolean): Record<string, any>;
    /**
     * Get sync sources
     */
    getSyncSources(): EnvSyncSource[];
};
export * from './types.js';
export * from './logic/envClassifier.js';
export default EnvKeeperCore;
//# sourceMappingURL=index.d.ts.map