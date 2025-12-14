/**
 * Environment Variable Validation & Configuration
 * 
 * Uses Zod for runtime validation of environment variables.
 * Provides better error messages and type safety.
 * 
 * This module should be imported early in server startup to catch config errors early.
 */

import { z } from 'zod';

// Zod schema for environment variables
const envSchema = z.object({
  // Core server config (required)
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: 'NODE_ENV must be one of: development, production, test' })
  }),
  PORT: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 3000)
    .pipe(z.number().int().positive().max(65535)),
  
  // Database (optional - server can start without DB)
  DATABASE_URL: z.string().url().optional(),
  CLOUD_SQL_INSTANCE_CONNECTION_NAME: z.string().optional(),
  
  // Google Cloud Platform (optional)
  GCP_PROJECT_ID: z.string().optional(),
  GCP_REGION: z.string().optional(),
  GCP_SERVICE_NAME: z.string().optional(),
  GOOGLE_CLOUD_PROJECT: z.string().optional(),
  GOOGLE_CLOUD_REGION: z.string().optional(),
  
  // API Keys (optional)
  OPENAI_API_KEY: z.string().optional(),
  
  // Latent Collaboration (optional)
  USE_LATENT_COLLABORATION: z.string().transform((val) => val === 'true').optional(),
  LATENT_EMBEDDING_MODEL: z.string().optional(),
  LATENT_VECTOR_SIZE: z.string()
    .transform((val) => val ? parseInt(val, 10) : 1536)
    .pipe(z.number().int().positive())
    .optional(),
  
  // CORS & Security (optional)
  ALLOWED_ORIGINS: z.string()
    .transform((val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : undefined)
    .optional(),
  OPERATOR_WALLETS: z.string()
    .transform((val) => val ? val.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : undefined)
    .optional(),
  
  // Feature flags (optional)
  INIT_SUBSYSTEMS: z.string().transform((val) => val === 'true').optional(),
  MESH_AUTOSTART: z.string().transform((val) => val !== 'false').optional(),
  INIT_HEAVY_SUBSYSTEMS: z.string().transform((val) => val === 'true').optional(),
  
  // Legacy provider support (optional)
  VERCEL_TOKEN: z.string().optional(),
  VERCEL_TEAM_ID: z.string().optional(),
  VERCEL_PROJECT_NAME: z.string().optional(),
  RAILWAY_TOKEN: z.string().optional(),
});

// Infer TypeScript type from schema
type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates and loads environment variables using Zod
 * Throws a ZodError with detailed validation messages if invalid
 */
function loadEnvConfig(): EnvConfig {
  try {
    // Parse with defaults for optional fields
    const parsed = envSchema.parse({
      ...process.env,
      // Apply defaults
      LATENT_EMBEDDING_MODEL: process.env.LATENT_EMBEDDING_MODEL || 'text-embedding-3-small',
    });
    
    // Handle alternative env var names
    return {
      ...parsed,
      GCP_PROJECT_ID: parsed.GCP_PROJECT_ID || parsed.GOOGLE_CLOUD_PROJECT,
      GCP_REGION: parsed.GCP_REGION || parsed.GOOGLE_CLOUD_REGION,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

// Load config on module import (fail fast if invalid)
let envConfig: EnvConfig;
try {
  envConfig = loadEnvConfig();
} catch (error) {
  // Use console.error here since logger may not be initialized yet
  // (env config loads very early in startup)
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
export const USE_LATENT_COLLABORATION = envConfig.USE_LATENT_COLLABORATION;
export const LATENT_EMBEDDING_MODEL = envConfig.LATENT_EMBEDDING_MODEL;
export const LATENT_VECTOR_SIZE = envConfig.LATENT_VECTOR_SIZE;
export const ALLOWED_ORIGINS = envConfig.ALLOWED_ORIGINS;
export const OPERATOR_WALLETS = envConfig.OPERATOR_WALLETS;
export const INIT_SUBSYSTEMS = envConfig.INIT_SUBSYSTEMS;
export const MESH_AUTOSTART = envConfig.MESH_AUTOSTART;
export const INIT_HEAVY_SUBSYSTEMS = envConfig.INIT_HEAVY_SUBSYSTEMS;

