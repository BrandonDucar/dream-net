import { APIKey, APIKeyStatus } from "../types";
import { APIStore } from "../store/apiStore";

let keyCounter = 0;
function nextKeyId() {
  keyCounter += 1;
  return `key:${Date.now()}:${keyCounter}`;
}

/**
 * Register a new API key
 */
export function registerKey(
  providerId: string,
  key: string,
  secret?: string,
  options?: {
    name?: string;
    quotaLimit?: number;
    tags?: string[];
  }
): APIKey {
  const apiKey: APIKey = {
    id: nextKeyId(),
    providerId,
    name: options?.name || `Key for ${providerId}`,
    key, // In production, encrypt this
    secret, // In production, encrypt this
    status: "active",
    usageCount: 0,
    usageThisMonth: 0,
    quotaLimit: options?.quotaLimit,
    quotaUsed: 0,
    costThisMonth: 0,
    costTotal: 0,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
    tags: options?.tags || [],
  };

  APIStore.addKey(apiKey);
  console.log(`[KeyManager] Registered key for ${providerId}: ${apiKey.id}`);
  return apiKey;
}

/**
 * Update key status based on usage/errors
 */
export function updateKeyStatus(
  keyId: string,
  status: APIKeyStatus,
  reason?: string
): boolean {
  const key = APIStore.getKey(keyId);
  if (!key) return false;

  key.status = status;
  APIStore.updateKey(keyId, { status });

  if (reason) {
    console.log(`[KeyManager] Key ${keyId} status: ${status} - ${reason}`);
  }

  return true;
}

/**
 * Record API usage
 */
export function recordUsage(
  keyId: string,
  cost: number = 0
): boolean {
  const key = APIStore.getKey(keyId);
  if (!key) return false;

  const now = Date.now();
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const monthStart = thisMonth.getTime();

  // Reset monthly usage if new month
  if (key.lastUsedAt < monthStart) {
    key.usageThisMonth = 0;
    key.costThisMonth = 0;
    key.quotaUsed = 0;
  }

  key.usageCount += 1;
  key.usageThisMonth += 1;
  key.costThisMonth += cost;
  key.costTotal += cost;
  key.lastUsedAt = now;

  // Check quota
  if (key.quotaLimit && key.quotaUsed !== undefined) {
    key.quotaUsed += 1;
    if (key.quotaUsed >= key.quotaLimit) {
      updateKeyStatus(keyId, "quota-exceeded", "Monthly quota exceeded");
    }
  }

  APIStore.updateKey(keyId, key);
  return true;
}

/**
 * Get best available key for a provider
 */
export function getBestKey(providerId: string): APIKey | null {
  const keys = APIStore.listKeysForProvider(providerId)
    .filter((k) => k.status === "active");

  if (keys.length === 0) return null;

  // Prefer keys with lowest usage this month (load balancing)
  keys.sort((a, b) => {
    // First, prefer keys with quota remaining
    if (a.quotaLimit && a.quotaUsed !== undefined) {
      const aRemaining = a.quotaLimit - a.quotaUsed;
      const bRemaining = b.quotaLimit ? (b.quotaLimit - (b.quotaUsed || 0)) : Infinity;
      if (aRemaining <= 0 && bRemaining > 0) return 1;
      if (bRemaining <= 0 && aRemaining > 0) return -1;
    }

    // Then prefer keys with lower usage
    return a.usageThisMonth - b.usageThisMonth;
  });

  return keys[0];
}

