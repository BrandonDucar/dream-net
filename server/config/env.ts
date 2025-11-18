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
  DATABASE_URL?: string;
  
  // API Keys (optional - some features may be unavailable)
  OPENAI_API_KEY?: string;
  
  // CORS & Security
  ALLOWED_ORIGINS?: string[];
  OPERATOR_WALLETS?: string[];
  
  // Feature flags
  INIT_SUBSYSTEMS?: boolean;
  MESH_AUTOSTART?: boolean;
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
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ALLOWED_ORIGINS: allowedOrigins,
    OPERATOR_WALLETS: operatorWallets,
    INIT_SUBSYSTEMS: process.env.INIT_SUBSYSTEMS === 'true',
    MESH_AUTOSTART: process.env.MESH_AUTOSTART !== 'false',
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
export const OPENAI_API_KEY = envConfig.OPENAI_API_KEY;
export const ALLOWED_ORIGINS = envConfig.ALLOWED_ORIGINS;
export const OPERATOR_WALLETS = envConfig.OPERATOR_WALLETS;
export const INIT_SUBSYSTEMS = envConfig.INIT_SUBSYSTEMS;
export const MESH_AUTOSTART = envConfig.MESH_AUTOSTART;

