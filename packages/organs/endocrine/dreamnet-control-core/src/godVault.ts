/**
 * God Vault Configuration
 * Internal-only configuration for founder/root operator access
 * DO NOT expose this as a normal tier/plan
 * 
 * @module @dreamnet/dreamnet-control-core/godVault
 */

import type { TierId } from './tierConfig.js';

export interface GodVaultConfig {
  /** Logical ID for the founder/root operator. */
  ownerId: string;

  /** All EVM wallet addresses that should resolve to GOD_MODE (lowercased). */
  walletAddresses: string[];

  /**
   * Names of env vars that contain internal API keys which SHOULD resolve
   * to GOD_MODE when presented as x-dreamnet-api-key.
   *
   * Example:
   *   DN_INTERNAL_GOD_API_KEY
   *   DN_INTERNAL_GOD_AGENT_KEY
   */
  internalApiKeyEnvVars: string[];

  /** The tier for the God Vault (always "GOD_MODE" here). */
  tierId: TierId;

  /** Optional safety flags for dangerous operations. */
  safety: {
    /** Require extra confirmations for nuclear actions (global kill, treasury). */
    requireMultiConfirmForNuclearOps: boolean;
    /** Enforce that some paths only run when initiated from a hardware wallet. */
    requireHardwareWalletForCriticalOps: boolean;
  };
}

/**
 * Internal-only configuration describing the founder's God Vault.
 * DO NOT expose this as a normal tier/plan.
 */
export const GOD_VAULT: GodVaultConfig = {
  ownerId: "FOUNDER_BRANDON",
  walletAddresses: [
    // Fill in with your actual addresses, normalized to lowercase:
    // "0x4a6775abfd8cc67cbe9585c95c089fdc2ae81c77".toLowerCase(),
    // "0x57d7789e4e90f6fe692cab607d69ec591581d354".toLowerCase(),
  ],
  internalApiKeyEnvVars: [
    "DN_INTERNAL_GOD_API_KEY",
    "DN_INTERNAL_GOD_AGENT_KEY",
  ],
  tierId: "GOD_MODE",
  safety: {
    requireMultiConfirmForNuclearOps: true,
    requireHardwareWalletForCriticalOps: true,
  },
};

/**
 * Helper to load all actual God API keys from env.
 * This keeps secrets out of the repo while still giving us a list
 * to check against incoming x-dreamnet-api-key values.
 */
export function getGodVaultApiKeysFromEnv(): string[] {
  return GOD_VAULT.internalApiKeyEnvVars
    .map((name) => process.env[name])
    .filter((v): v is string => Boolean(v && v.trim().length > 0));
}

/**
 * Quick helper to determine if a given wallet address belongs to the God Vault.
 * Input should already be normalized to lowercase.
 */
export function isGodVaultWallet(address: string | undefined | null): boolean {
  if (!address) return false;
  const normalized = address.toLowerCase();
  return GOD_VAULT.walletAddresses.includes(normalized);
}

