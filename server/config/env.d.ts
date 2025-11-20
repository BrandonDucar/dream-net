/**
 * Environment Variable Validation & Configuration
 *
 * Lightweight env checker that:
 * - Loads env vars
 * - Asserts presence of required ones for server startup
 * - Exposes a typed config object
 *
 * This module should be imported early in server startup to catch config errors early.
 */
interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DATABASE_URL?: string;
    OPENAI_API_KEY?: string;
    ALLOWED_ORIGINS?: string[];
    OPERATOR_WALLETS?: string[];
    INIT_SUBSYSTEMS?: boolean;
    MESH_AUTOSTART?: boolean;
}
/**
 * Get the validated environment configuration
 * Use this instead of direct process.env access in critical paths
 */
export declare function getEnvConfig(): EnvConfig;
/**
 * Get a specific env var (with type safety)
 */
export declare function getEnvVar<K extends keyof EnvConfig>(key: K): EnvConfig[K];
export declare const env: EnvConfig;
export declare const NODE_ENV: "development" | "production" | "test";
export declare const PORT: number;
export declare const DATABASE_URL: string | undefined;
export declare const OPENAI_API_KEY: string | undefined;
export declare const ALLOWED_ORIGINS: string[] | undefined;
export declare const OPERATOR_WALLETS: string[] | undefined;
export declare const INIT_SUBSYSTEMS: boolean | undefined;
export declare const MESH_AUTOSTART: boolean | undefined;
export {};
