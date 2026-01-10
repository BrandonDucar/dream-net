/**
 * Zero-Touch API Key Auto-Discovery
 * Never manually set keys again - they're discovered automatically from:
 * - Environment variables (all patterns)
 * - .env files (multiple locations)
 * - Config files (package.json, config.json, etc.)
 * - Secrets managers (Vercel, AWS Secrets Manager, etc.)
 * - Runtime detection (checking active connections)
 * - Provider-specific locations
 */
import { APIKey } from "../types";
/**
 * Scan ALL environment variables and auto-register keys
 */
export declare function autoDiscoverKeysFromEnv(): APIKey[];
/**
 * Scan .env file for keys (multiple locations)
 */
export declare function scanEnvFile(): Map<string, string>;
/**
 * Scan config files (package.json, config.json, etc.)
 */
export declare function scanConfigFiles(): Map<string, string>;
/**
 * Check Vercel environment (if running on Vercel)
 */
export declare function scanVercelEnv(): Map<string, string>;
/**
 * Auto-discover ALL keys from ALL sources
 * This is the main function that runs continuously
 */
export declare function autoDiscoverAllKeys(): APIKey[];
/**
 * Continuous auto-discovery - runs every cycle
 * This ensures keys are always up-to-date
 */
export declare function continuousAutoDiscovery(): APIKey[];
