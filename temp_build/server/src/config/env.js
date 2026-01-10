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
/**
 * Validates and loads environment variables
 * Throws an error if required vars are missing
 */
function loadEnvConfig() {
    const errors = [];
    // Required env vars
    const nodeEnv = process.env.NODE_ENV;
    if (!nodeEnv || !['development', 'production', 'test'].includes(nodeEnv)) {
        errors.push('NODE_ENV must be one of: development, production, test');
    }
    // PORT is optional - defaults to 3000
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    if (isNaN(port) || port <= 0) {
        errors.push('PORT must be a valid positive number');
    }
    if (errors.length > 0) {
        throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
    // Optional env vars with defaults/parsing
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
        : undefined;
    const operatorWallets = process.env.OPERATOR_WALLETS
        ? process.env.OPERATOR_WALLETS.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : undefined;
    return {
        NODE_ENV: nodeEnv,
        PORT: port,
        DATABASE_URL: process.env.DATABASE_URL,
        CLOUD_SQL_INSTANCE_CONNECTION_NAME: process.env.CLOUD_SQL_INSTANCE_CONNECTION_NAME,
        GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
        GCP_REGION: process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION,
        GCP_SERVICE_NAME: process.env.GCP_SERVICE_NAME,
        GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
        GOOGLE_CLOUD_REGION: process.env.GOOGLE_CLOUD_REGION,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ALLOWED_ORIGINS: allowedOrigins,
        OPERATOR_WALLETS: operatorWallets,
        INIT_SUBSYSTEMS: process.env.INIT_SUBSYSTEMS === 'true',
        MESH_AUTOSTART: process.env.MESH_AUTOSTART !== 'false',
        INIT_HEAVY_SUBSYSTEMS: process.env.INIT_HEAVY_SUBSYSTEMS === 'true', // Defaults to false for simplified startup
        // Integrations
        LENS_API_KEY: process.env.LENS_API_KEY,
        FARCASTER_MNEMONIC: process.env.FARCASTER_MNEMONIC,
        MATRIX_HOMESERVER: process.env.MATRIX_HOMESERVER,
        JELLYFIN_HOST: process.env.JELLYFIN_HOST,
        PEERTUBE_HOST: process.env.PEERTUBE_HOST,
        RESEARCHHUB_KEY: process.env.RESEARCHHUB_KEY,
        OTP_HOST: process.env.OTP_HOST,
        VALHALLA_HOST: process.env.VALHALLA_HOST,
        GHIDRA_HOST: process.env.GHIDRA_HOST,
        MSF_HOST: process.env.MSF_HOST,
        // Feature Flags
        USE_SPINE_WRAPPERS: process.env.USE_SPINE_WRAPPERS === 'true',
        // Legacy provider support
        VERCEL_TOKEN: process.env.VERCEL_TOKEN,
        VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
        VERCEL_PROJECT_NAME: process.env.VERCEL_PROJECT_NAME,
        RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
    };
}
// Load config on module import (fail fast if invalid)
let envConfig;
try {
    envConfig = loadEnvConfig();
}
catch (error) {
    console.error('[Env Config] Failed to load environment configuration:', error);
    throw error;
}
/**
 * Get the validated environment configuration
 * Use this instead of direct process.env access in critical paths
 */
export function getEnvConfig() {
    return envConfig;
}
/**
 * Get a specific env var (with type safety)
 */
export function getEnvVar(key) {
    return envConfig[key];
}
// Export config object for convenience
export const env = envConfig;
// Export individual getters for common vars
export const NODE_ENV = envConfig.NODE_ENV;
export const PORT = envConfig.PORT;
export const DATABASE_URL = envConfig.DATABASE_URL;
export const CLOUD_SQL_INSTANCE_CONNECTION_NAME = envConfig.CLOUD_SQL_INSTANCE_CONNECTION_NAME;
export const GCP_PROJECT_ID = envConfig.GCP_PROJECT_ID;
export const GCP_REGION = envConfig.GCP_REGION;
export const GCP_SERVICE_NAME = envConfig.GCP_SERVICE_NAME;
export const OPENAI_API_KEY = envConfig.OPENAI_API_KEY;
export const ALLOWED_ORIGINS = envConfig.ALLOWED_ORIGINS;
export const OPERATOR_WALLETS = envConfig.OPERATOR_WALLETS;
export const INIT_SUBSYSTEMS = envConfig.INIT_SUBSYSTEMS;
export const MESH_AUTOSTART = envConfig.MESH_AUTOSTART;
export const INIT_HEAVY_SUBSYSTEMS = envConfig.INIT_HEAVY_SUBSYSTEMS;
