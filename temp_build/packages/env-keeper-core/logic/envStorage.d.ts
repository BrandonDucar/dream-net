/**
 * Env Keeper - Storage
 * Stores environment variables securely (encrypted)
 */
import { EnvVariable } from "../types";
/**
 * Decrypt value
 */
export declare function decrypt(encryptedText: string): string;
/**
 * Store environment variable
 */
export declare function storeEnvVar(envVar: EnvVariable): EnvVariable;
/**
 * Get environment variable
 */
export declare function getEnvVar(id: string, decryptValue?: boolean): EnvVariable | null;
/**
 * Get environment variable by key
 */
export declare function getEnvVarByKey(key: string, decryptValue?: boolean): EnvVariable | null;
/**
 * List all environment variables
 */
export declare function listEnvVars(decryptValues?: boolean): EnvVariable[];
/**
 * Delete environment variable
 */
export declare function deleteEnvVar(id: string): boolean;
/**
 * Get all env vars as key-value pairs (for .env file generation)
 */
export declare function getAllAsKeyValue(environment?: string, decryptValues?: boolean): Record<string, string>;
/**
 * Get count
 */
export declare function getCount(): number;
