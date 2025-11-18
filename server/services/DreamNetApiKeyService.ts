/**
 * DreamNet API Key Service
 * Generates and manages API keys for users to authenticate with DreamNet API
 */

import crypto from "crypto";
import { db } from "../db";
import { dreamnetApiKeys } from "../../shared/schema";
import { eq, and, isNull, gt, lt } from "drizzle-orm";

export interface CreateApiKeyOptions {
  userId?: string;
  walletAddress?: string;
  name: string;
  description?: string;
  permissions?: string[];
  rateLimit?: number;
  expiresInDays?: number;
  createdBy?: string;
}

export interface ApiKeyInfo {
  id: string;
  keyPrefix: string;
  name: string;
  description?: string;
  permissions: string[];
  rateLimit: number;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
}

/**
 * Generate a secure API key
 * Format: dn_live_<64 random hex chars>
 */
function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(32); // 32 bytes = 64 hex chars
  const key = `dn_live_${randomBytes.toString("hex")}`;
  return key;
}

/**
 * Hash API key for storage (SHA-256)
 */
function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

/**
 * Get key prefix for display (first 8 chars after dn_live_)
 */
function getKeyPrefix(key: string): string {
  const parts = key.split("_");
  if (parts.length >= 3) {
    return parts.slice(0, 3).join("_") + "_" + parts[2]?.substring(0, 8);
  }
  return key.substring(0, 16);
}

/**
 * Create a new API key
 * Returns the plaintext key (only shown once) and key info
 */
export async function createApiKey(options: CreateApiKeyOptions): Promise<{
  key: string; // Plaintext key (only shown once!)
  keyInfo: ApiKeyInfo;
}> {
  const {
    userId,
    walletAddress,
    name,
    description,
    permissions = [],
    rateLimit = 1000,
    expiresInDays,
    createdBy,
  } = options;

  if (!userId && !walletAddress) {
    throw new Error("Either userId or walletAddress must be provided");
  }

  // Generate API key
  const plaintextKey = generateApiKey();
  const keyHash = hashApiKey(plaintextKey);
  const keyPrefix = getKeyPrefix(plaintextKey);

  // Calculate expiration
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  // Insert into database
  const [inserted] = await db
    .insert(dreamnetApiKeys)
    .values({
      keyHash,
      keyPrefix,
      userId: userId || null,
      walletAddress: walletAddress || null,
      name,
      description: description || null,
      permissions,
      rateLimit,
      expiresAt: expiresAt || null,
      createdBy: createdBy || walletAddress || userId || null,
    })
    .returning();

  const keyInfo: ApiKeyInfo = {
    id: inserted.id,
    keyPrefix: inserted.keyPrefix,
    name: inserted.name,
    description: inserted.description || undefined,
    permissions: (inserted.permissions as string[]) || [],
    rateLimit: inserted.rateLimit || 1000,
    lastUsedAt: inserted.lastUsedAt || null,
    expiresAt: inserted.expiresAt || null,
    createdAt: inserted.createdAt,
    revokedAt: inserted.revokedAt || null,
  };

  return {
    key: plaintextKey, // Only returned once!
    keyInfo,
  };
}

/**
 * Validate API key and return key info
 */
export async function validateApiKey(key: string): Promise<ApiKeyInfo | null> {
  const keyHash = hashApiKey(key);

  const [keyRecord] = await db
    .select()
    .from(dreamnetApiKeys)
    .where(
      and(
        eq(dreamnetApiKeys.keyHash, keyHash),
        isNull(dreamnetApiKeys.revokedAt) // Not revoked
      )
    )
    .limit(1);

  if (!keyRecord) {
    return null;
  }

  // Check expiration
  if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(dreamnetApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(dreamnetApiKeys.id, keyRecord.id));

  return {
    id: keyRecord.id,
    keyPrefix: keyRecord.keyPrefix,
    name: keyRecord.name,
    description: keyRecord.description || undefined,
    permissions: (keyRecord.permissions as string[]) || [],
    rateLimit: keyRecord.rateLimit || 1000,
    lastUsedAt: keyRecord.lastUsedAt || null,
    expiresAt: keyRecord.expiresAt || null,
    createdAt: keyRecord.createdAt,
    revokedAt: keyRecord.revokedAt || null,
  };
}

/**
 * List API keys for a user/wallet
 */
export async function listApiKeys(
  userId?: string,
  walletAddress?: string
): Promise<ApiKeyInfo[]> {
  if (!userId && !walletAddress) {
    throw new Error("Either userId or walletAddress must be provided");
  }

  const conditions = [];
  if (userId) {
    conditions.push(eq(dreamnetApiKeys.userId, userId));
  }
  if (walletAddress) {
    conditions.push(eq(dreamnetApiKeys.walletAddress, walletAddress));
  }

  const keys = await db
    .select()
    .from(dreamnetApiKeys)
    .where(and(...conditions))
    .orderBy(dreamnetApiKeys.createdAt);

  return keys.map((key) => ({
    id: key.id,
    keyPrefix: key.keyPrefix,
    name: key.name,
    description: key.description || undefined,
    permissions: (key.permissions as string[]) || [],
    rateLimit: key.rateLimit || 1000,
    lastUsedAt: key.lastUsedAt || null,
    expiresAt: key.expiresAt || null,
    createdAt: key.createdAt,
    revokedAt: key.revokedAt || null,
  }));
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  keyId: string,
  userId?: string,
  walletAddress?: string
): Promise<boolean> {
  const conditions = [eq(dreamnetApiKeys.id, keyId)];
  
  // Ensure user owns the key
  if (userId) {
    conditions.push(eq(dreamnetApiKeys.userId, userId));
  }
  if (walletAddress) {
    conditions.push(eq(dreamnetApiKeys.walletAddress, walletAddress));
  }

  const [updated] = await db
    .update(dreamnetApiKeys)
    .set({ revokedAt: new Date() })
    .where(and(...conditions, isNull(dreamnetApiKeys.revokedAt)))
    .returning();

  return !!updated;
}

/**
 * Get API key by ID (for admin operations)
 */
export async function getApiKeyById(keyId: string): Promise<ApiKeyInfo | null> {
  const [key] = await db
    .select()
    .from(dreamnetApiKeys)
    .where(eq(dreamnetApiKeys.id, keyId))
    .limit(1);

  if (!key) {
    return null;
  }

  return {
    id: key.id,
    keyPrefix: key.keyPrefix,
    name: key.name,
    description: key.description || undefined,
    permissions: (key.permissions as string[]) || [],
    rateLimit: key.rateLimit || 1000,
    lastUsedAt: key.lastUsedAt || null,
    expiresAt: key.expiresAt || null,
    createdAt: key.createdAt,
    revokedAt: key.revokedAt || null,
  };
}

/**
 * Get or create default API key for a wallet/user
 * Auto-generates a default key if none exists
 * This is called automatically on first wallet connection
 */
export async function getOrCreateDefaultApiKey(
  walletAddress?: string,
  userId?: string
): Promise<{ key: string; keyInfo: ApiKeyInfo; isNew: boolean }> {
  if (!walletAddress && !userId) {
    throw new Error("Either walletAddress or userId must be provided");
  }

  // Check if user already has a default key
  const existingKeys = await listApiKeys(userId, walletAddress);
  const defaultKey = existingKeys.find(
    (k) => k.name === "Default API Key" && !k.revokedAt
  );

  if (defaultKey) {
    // User already has a default key - return null (we can't show plaintext again)
    // But we can return the key info
    return {
      key: "", // Can't return plaintext for existing keys
      keyInfo: defaultKey,
      isNew: false,
    };
  }

  // Create default key for new user
  const result = await createApiKey({
    walletAddress,
    userId,
    name: "Default API Key",
    description: "Auto-generated default API key for DreamNet access",
    permissions: ["read", "write"], // Default permissions
    rateLimit: 1000, // Default rate limit
    createdBy: walletAddress || userId || "system",
  });

  return {
    key: result.key, // Return plaintext for new keys
    keyInfo: result.keyInfo,
    isNew: true,
  };
}

