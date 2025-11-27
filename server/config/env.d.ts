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
    CLOUD_SQL_INSTANCE_CONNECTION_NAME?: string;
    GCP_PROJECT_ID?: string;
    GCP_REGION?: string;
    GCP_SERVICE_NAME?: string;
    GOOGLE_CLOUD_PROJECT?: string;
    GOOGLE_CLOUD_REGION?: string;
    OPENAI_API_KEY?: string;
    ALLOWED_ORIGINS?: string[];
    OPERATOR_WALLETS?: string[];
    INIT_SUBSYSTEMS?: boolean;
    MESH_AUTOSTART?: boolean;
    INIT_HEAVY_SUBSYSTEMS?: boolean;
    VERCEL_TOKEN?: string;
    VERCEL_TEAM_ID?: string;
    VERCEL_PROJECT_NAME?: string;
    RAILWAY_TOKEN?: string;
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
export declare const CLOUD_SQL_INSTANCE_CONNECTION_NAME: string | undefined;
export declare const GCP_PROJECT_ID: string | undefined;
export declare const GCP_REGION: string | undefined;
export declare const GCP_SERVICE_NAME: string | undefined;
export declare const OPENAI_API_KEY: string | undefined;
export declare const ALLOWED_ORIGINS: string[] | undefined;
export declare const OPERATOR_WALLETS: string[] | undefined;
export declare const INIT_SUBSYSTEMS: boolean | undefined;
export declare const MESH_AUTOSTART: boolean | undefined;
export declare const INIT_HEAVY_SUBSYSTEMS: boolean | undefined;
export {};
