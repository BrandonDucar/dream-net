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
  // Core server config
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  
  // Database (optional - server can start without DB)
  // PRIMARY: Google Cloud SQL / AlloyDB PostgreSQL
  // LEGACY: Neon PostgreSQL (detected automatically)
  DATABASE_URL?: string;
  CLOUD_SQL_INSTANCE_CONNECTION_NAME?: string; // For Cloud SQL Proxy connections
  
  // Google Cloud Platform (primary deployment target)
  GCP_PROJECT_ID?: string;
  GCP_REGION?: string;
  GCP_SERVICE_NAME?: string;
  GOOGLE_CLOUD_PROJECT?: string; // Alternative name for GCP_PROJECT_ID
  GOOGLE_CLOUD_REGION?: string; // Alternative name for GCP_REGION
  
  // API Keys (optional - some features may be unavailable)
  OPENAI_API_KEY?: string;
  
  // CORS & Security
  ALLOWED_ORIGINS?: string[];
  OPERATOR_WALLETS?: string[];
  
  // Feature flags
  INIT_SUBSYSTEMS?: boolean;
  MESH_AUTOSTART?: boolean;
  INIT_HEAVY_SUBSYSTEMS?: boolean; // Set to 'true' to enable DreamState, Directory, Nerve Fabric, etc.
  
  // Legacy provider support (optional - for backward compatibility)
  VERCEL_TOKEN?: string; // Only needed if using Vercel integration features
  VERCEL_TEAM_ID?: string;
  VERCEL_PROJECT_NAME?: string;
  RAILWAY_TOKEN?: string; // Legacy - not needed for GCP deployment
}

/**
 * Validates and loads environment variables
 * Throws an error if required vars are missing
 */
function loadEnvConfig(): EnvConfig {
  const errors: string[] = [];
  
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
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
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
    // Legacy provider support
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    VERCEL_PROJECT_NAME: process.env.VERCEL_PROJECT_NAME,
    RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
  };
}

// Load config on module import (fail fast if invalid)
let envConfig: EnvConfig;
try {
  envConfig = loadEnvConfig();
} catch (error) {
  console.error('[Env Config] Failed to load environment configuration:', error);
  throw error;
}

/**
 * Get the validated environment configuration
 * Use this instead of direct process.env access in critical paths
 */
export function getEnvConfig(): EnvConfig {
  return envConfig;
}

/**
 * Get a specific env var (with type safety)
 */
export function getEnvVar<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
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

