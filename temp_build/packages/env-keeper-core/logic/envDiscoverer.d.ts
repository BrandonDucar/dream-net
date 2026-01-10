/**
 * Env Keeper - Auto-Discovery
 * Automatically discovers environment variables from all sources
 */
import { EnvVariable } from "../types";
/**
 * Discover environment variables from process.env
 */
export declare function discoverFromProcessEnv(): EnvVariable[];
/**
 * Discover from .env files (AGGRESSIVE - finds ALL .env files)
 */
export declare function discoverFromEnvFiles(): EnvVariable[];
/**
 * Discover from Vercel (if available)
 */
export declare function discoverFromVercel(): Promise<EnvVariable[]>;
/**
 * Discover from all sources
 */
export declare function discoverAllEnvVars(): Promise<EnvVariable[]>;
