/**
 * Env Keeper - Storage
 * Stores environment variables securely (encrypted)
 */

import { EnvVariable } from '../types.js';
import crypto from "crypto";

// In-memory storage (in production, use database)
const envStore = new Map<string, EnvVariable>();

// Encryption key (in production, use proper key management)
const ENCRYPTION_KEY = process.env.ENV_KEEPER_ENCRYPTION_KEY || "default-key-change-in-production";
const ALGORITHM = "aes-256-cbc";

/**
 * Encrypt value
 */
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32).padEnd(32)), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt value
 */
export function decrypt(encryptedText: string): string {
  try {
    // Check if it's encrypted (has iv:encrypted format)
    if (!encryptedText.includes(":")) {
      return encryptedText; // Not encrypted
    }
    
    const parts = encryptedText.split(":");
    if (parts.length < 2) {
      return encryptedText; // Invalid format, return as-is
    }
    
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32).padEnd(32)), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    // Decryption failed, return as-is (might not be encrypted)
    return encryptedText;
  }
}

/**
 * Store environment variable
 */
export function storeEnvVar(envVar: EnvVariable): EnvVariable {
  const stored = {
    ...envVar,
    value: envVar.isSecret ? encrypt(envVar.value) : envVar.value, // Encrypt secrets
    updatedAt: Date.now(),
  };
  envStore.set(envVar.id, stored);
  return stored;
}

/**
 * Get environment variable
 */
export function getEnvVar(id: string, decryptValue: boolean = false): EnvVariable | null {
  const stored = envStore.get(id);
  if (!stored) return null;

  if (decryptValue && stored.isSecret) {
    return {
      ...stored,
      value: decrypt(stored.value),
    };
  }

  return stored;
}

/**
 * Get environment variable by key
 */
export function getEnvVarByKey(key: string, decryptValue: boolean = false): EnvVariable | null {
  for (const envVar of envStore.values()) {
    if (envVar.key === key) {
      if (decryptValue && envVar.isSecret) {
        return {
          ...envVar,
          value: decrypt(envVar.value),
        };
      }
      return envVar;
    }
  }
  return null;
}

/**
 * List all environment variables
 */
export function listEnvVars(decryptValues: boolean = false): EnvVariable[] {
  return Array.from(envStore.values()).map((envVar) => {
    if (decryptValues && envVar.isSecret) {
      return {
        ...envVar,
        value: decrypt(envVar.value),
      };
    }
    return envVar;
  });
}

/**
 * Delete environment variable
 */
export function deleteEnvVar(id: string): boolean {
  return envStore.delete(id);
}

/**
 * Get all env vars as key-value pairs (for .env file generation)
 */
export function getAllAsKeyValue(environment?: string, decryptValues: boolean = false): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const envVar of envStore.values()) {
    if (environment && !envVar.environments.includes(environment as any)) continue;
    
    let value = envVar.value;
    if (decryptValues && envVar.isSecret) {
      value = decrypt(value);
    }
    
    result[envVar.key] = value;
  }
  
  return result;
}

/**
 * Get count
 */
export function getCount(): number {
  return envStore.size;
}

