/**
 * Env Variable Classifier
 * Classifies environment variables by sensitivity (public/internal/secret)
 */

import type { EnvSensitivity, EnvVarDescriptor } from "../types";

/**
 * Secret key patterns
 */
const SECRET_KEY_PATTERNS = [
  /(KEY|SECRET|TOKEN|PASSWORD|PRIVATE|API)_?/i,
  /(AUTH|CREDENTIAL|PASSWD|PWD|PW)/i,
];

/**
 * Public key patterns (safe to expose)
 */
const PUBLIC_KEY_PATTERNS = [
  /^NODE_ENV$/i,
  /^PUBLIC_/i,
  /^VITE_/i,
  /^NEXT_PUBLIC_/i,
  /^PORT$/i,
  /^HOST$/i,
  /^ENV$/i,
];

/**
 * Classify environment variable by sensitivity
 */
export function classifyEnvVar(key: string, value?: string): EnvSensitivity {
  // Check for public patterns first
  if (PUBLIC_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
    return "public";
  }

  // Check for secret patterns
  if (SECRET_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
    return "secret";
  }

  // Check value characteristics for secrets
  if (value) {
    // Long alphanumeric strings (likely tokens)
    if (value.length > 32 && /^[A-Za-z0-9_-]+$/.test(value)) {
      return "secret";
    }

    // Base64-like strings
    if (value.length > 40 && /^[A-Za-z0-9+/=]+$/.test(value)) {
      return "secret";
    }

    // Contains common secret indicators
    if (/^(sk_|pk_|xoxb-|ghp_|gho_|ghu_|ghs_|ghr_)/.test(value)) {
      return "secret";
    }
  }

  // Default to internal for everything else
  return "internal";
}

/**
 * Create EnvVarDescriptor from key/value
 */
export function createEnvVarDescriptor(
  key: string,
  value: string,
  source: "process" | "file" | "runtime" = "process"
): EnvVarDescriptor {
  const sensitivity = classifyEnvVar(key, value);
  return {
    key,
    value: sensitivity === "secret" ? undefined : value, // Never store secret values in registry
    sensitivity,
    source,
    lastUpdatedAt: new Date().toISOString(),
  };
}

/**
 * Update registry with descriptor
 */
export function updateEnvRegistry(descriptor: EnvVarDescriptor): void {
  const { ENV_REGISTRY } = require("../types");
  ENV_REGISTRY[descriptor.key] = descriptor;
}

/**
 * Get descriptor from registry
 */
export function getEnvDescriptor(key: string): EnvVarDescriptor | undefined {
  const { ENV_REGISTRY } = require("../types");
  return ENV_REGISTRY[key];
}

/**
 * Get all descriptors by sensitivity
 */
export function getDescriptorsBySensitivity(
  sensitivity: EnvSensitivity
): EnvVarDescriptor[] {
  const { ENV_REGISTRY } = require("../types");
  return Object.values(ENV_REGISTRY).filter((d: EnvVarDescriptor) => d.sensitivity === sensitivity) as EnvVarDescriptor[];
}

