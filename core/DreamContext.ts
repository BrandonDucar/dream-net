/**
 * DreamContext factory for DreamNet multi-agent system
 * Creates a shared context with env vars and logger
 */

import type { DreamContext } from "./types";

let cachedContext: DreamContext | null = null;

export function createDreamContext(): DreamContext {
  if (cachedContext) return cachedContext;

  const env = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GROK_API_KEY: process.env.GROK_API_KEY,
    ZORA_API_KEY: process.env.ZORA_API_KEY,
    BASE_RPC_URL: process.env.BASE_RPC_URL,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  };

  const logger = {
    log: (...args: any[]) => {
      if (process.env.LOG_LEVEL !== "silent") {
        console.log("[DreamNet]", ...args);
      }
    },
    error: (...args: any[]) => {
      console.error("[DreamNet:ERROR]", ...args);
    },
    warn: (...args: any[]) => {
      if (process.env.LOG_LEVEL !== "silent" && process.env.LOG_LEVEL !== "error") {
        console.warn("[DreamNet:WARN]", ...args);
      }
    },
    info: (...args: any[]) => {
      if (process.env.LOG_LEVEL !== "silent" && process.env.LOG_LEVEL !== "error") {
        console.info("[DreamNet:INFO]", ...args);
      }
    },
  };

  const config = {
    baseUrl: process.env.API_URL || "http://localhost:3000",
    chainId: parseInt(process.env.CHAIN_ID || "8453", 10), // Base mainnet default
  };

  cachedContext = { env, logger, config };
  return cachedContext;
}

/**
 * Clear cached context (useful for testing or env changes)
 */
export function clearDreamContext(): void {
  cachedContext = null;
}

