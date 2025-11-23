/**
 * Env Keeper - Storage
 * Stores environment variables securely (encrypted)
 */
import crypto from "crypto";
// In-memory storage (in production, use database)
const envStore = new Map();
// Encryption key (in production, use proper key management)
const ENCRYPTION_KEY = process.env.ENV_KEEPER_ENCRYPTION_KEY || "default-key-change-in-production";
const ALGORITHM = "aes-256-cbc";
/**
 * Encrypt value
 */
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.substring(0, 32).padEnd(32)), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}
/**
 * Decrypt value
 */
export function decrypt(encryptedText) {
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
    }
    catch (error) {
        // Decryption failed, return as-is (might not be encrypted)
        return encryptedText;
    }
}
/**
 * Store environment variable
 */
export function storeEnvVar(envVar) {
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
export function getEnvVar(id, decryptValue = false) {
    const stored = envStore.get(id);
    if (!stored)
        return null;
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
export function getEnvVarByKey(key, decryptValue = false) {
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
export function listEnvVars(decryptValues = false) {
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
export function deleteEnvVar(id) {
    return envStore.delete(id);
}
/**
 * Get all env vars as key-value pairs (for .env file generation)
 */
export function getAllAsKeyValue(environment, decryptValues = false) {
    const result = {};
    for (const envVar of envStore.values()) {
        if (environment && !envVar.environments.includes(environment))
            continue;
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
export function getCount() {
    return envStore.size;
}
