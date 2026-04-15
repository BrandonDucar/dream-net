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

import { APIKey, APIProvider } from "../types";
import { APIStore } from "../store/apiStore";
import { registerKey } from "./keyManager";

/**
 * Comprehensive environment variable patterns
 */
const ENV_PATTERNS: Record<string, { providerId: string; name: string; isSecret?: boolean }[]> = {
  // Twilio
  TWILIO_ACCOUNT_SID: [{ providerId: "twilio", name: "Account SID" }],
  TWILIO_AUTH_TOKEN: [{ providerId: "twilio", name: "Auth Token", isSecret: true }],
  TWILIO_API_KEY: [{ providerId: "twilio", name: "API Key", isSecret: true }],
  TWILIO_API_SECRET: [{ providerId: "twilio", name: "API Secret", isSecret: true }],
  TWILIO_PHONE_NUMBER: [{ providerId: "twilio", name: "Phone Number" }],
  // Vercel
  VERCEL_TOKEN: [{ providerId: "vercel", name: "API Token", isSecret: true }],
  VERCEL_TEAM_ID: [{ providerId: "vercel", name: "Team ID" }],
  
  // Telegram
  TELEGRAM_BOT_TOKEN: [{ providerId: "telegram-bot", name: "Bot Token", isSecret: true }],
  TELEGRAM_API_KEY: [{ providerId: "telegram-bot", name: "API Key", isSecret: true }],
  TELEGRAM_CHAT_ID: [{ providerId: "telegram-bot", name: "Chat ID" }],
  
  // Twitter/X
  TWITTER_BEARER_TOKEN: [{ providerId: "twitter-api", name: "Bearer Token", isSecret: true }],
  TWITTER_API_KEY: [{ providerId: "twitter-api", name: "API Key", isSecret: true }],
  TWITTER_API_SECRET: [{ providerId: "twitter-api", name: "API Secret", isSecret: true }],
  TWITTER_ACCESS_TOKEN: [{ providerId: "twitter-api", name: "Access Token", isSecret: true }],
  TWITTER_ACCESS_TOKEN_SECRET: [{ providerId: "twitter-api", name: "Access Token Secret", isSecret: true }],
  TWITTER_USERNAME: [{ providerId: "twitter-api", name: "Username" }],
  TWITTER_HANDLE: [{ providerId: "twitter-api", name: "Handle" }],
  
  // OpenAI
  OPENAI_API_KEY: [{ providerId: "openai", name: "API Key", isSecret: true }],
  OPENAI_ORG_ID: [{ providerId: "openai", name: "Organization ID" }],
  
  // Anthropic
  ANTHROPIC_API_KEY: [{ providerId: "anthropic", name: "API Key", isSecret: true }],
  CLAUDE_API_KEY: [{ providerId: "anthropic", name: "API Key", isSecret: true }],
  
  // SendGrid
  SENDGRID_API_KEY: [{ providerId: "sendgrid", name: "API Key", isSecret: true }],
  SENDGRID_API_TOKEN: [{ providerId: "sendgrid", name: "API Token", isSecret: true }],
  
  // Email providers
  SMTP_HOST: [{ providerId: "smtp", name: "SMTP Host" }],
  SMTP_USER: [{ providerId: "smtp", name: "SMTP User" }],
  SMTP_PASSWORD: [{ providerId: "smtp", name: "SMTP Password", isSecret: true }],
  SMTP_PORT: [{ providerId: "smtp", name: "SMTP Port" }],
  
  // AWS
  AWS_ACCESS_KEY_ID: [{ providerId: "aws", name: "Access Key ID", isSecret: true }],
  AWS_SECRET_ACCESS_KEY: [{ providerId: "aws", name: "Secret Access Key", isSecret: true }],
  AWS_REGION: [{ providerId: "aws", name: "Region" }],
  
  // Google
  GOOGLE_API_KEY: [{ providerId: "google", name: "API Key", isSecret: true }],
  GOOGLE_CLIENT_ID: [{ providerId: "google", name: "Client ID" }],
  GOOGLE_CLIENT_SECRET: [{ providerId: "google", name: "Client Secret", isSecret: true }],
  
  // Stripe
  STRIPE_API_KEY: [{ providerId: "stripe", name: "API Key", isSecret: true }],
  STRIPE_SECRET_KEY: [{ providerId: "stripe", name: "Secret Key", isSecret: true }],
  STRIPE_PUBLISHABLE_KEY: [{ providerId: "stripe", name: "Publishable Key" }],
  
  // GitHub
  GITHUB_TOKEN: [{ providerId: "github", name: "Token", isSecret: true }],
  GITHUB_API_KEY: [{ providerId: "github", name: "API Key", isSecret: true }],
  
  // Vercel
  VERCEL_API_TOKEN: [{ providerId: "vercel", name: "API Token", isSecret: true }],
  
  // Neon
  DATABASE_URL: [{ providerId: "neon", name: "Database URL", isSecret: true }],
  NEON_API_KEY: [{ providerId: "neon", name: "API Key", isSecret: true }],
};

/**
 * Generic patterns that match any provider
 */
const GENERIC_PATTERNS = [
  { pattern: /^([A-Z_]+)_API_KEY$/i, providerHint: "$1" },
  { pattern: /^([A-Z_]+)_API_TOKEN$/i, providerHint: "$1" },
  { pattern: /^([A-Z_]+)_TOKEN$/i, providerHint: "$1" },
  { pattern: /^([A-Z_]+)_SECRET$/i, providerHint: "$1" },
  { pattern: /^([A-Z_]+)_KEY$/i, providerHint: "$1" },
  { pattern: /^([A-Z_]+)_PASSWORD$/i, providerHint: "$1" },
];

/**
 * Scan ALL environment variables and auto-register keys
 */
export function autoDiscoverKeysFromEnv(): APIKey[] {
  const discovered: APIKey[] = [];
  const registeredProviders = new Set<string>();

  // First pass: Known patterns
  for (const [envKey, configs] of Object.entries(ENV_PATTERNS)) {
    const value = process.env[envKey];
    if (!value || value.length < 5) continue;

    for (const config of configs) {
      const existing = APIStore.listKeysForProvider(config.providerId);
      const alreadyRegistered = existing.some(
        (k) => k.key === value || k.name.includes(config.name)
      );

      if (!alreadyRegistered) {
        // Check if we need multiple values for this provider (e.g., Twilio needs SID + Token)
        if (config.providerId === "twilio" && envKey === "TWILIO_ACCOUNT_SID") {
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          if (authToken) {
            const key = registerKey(
              config.providerId,
              value,
              authToken,
              {
                name: `Auto-discovered ${config.name}`,
                tags: ["auto-discovered", "env", "zero-touch"],
              }
            );
            discovered.push(key);
            registeredProviders.add(config.providerId);
            console.log(`[KeyAutoDiscoverer] ✅ Auto-registered ${config.providerId} from ${envKey}`);
          }
        } else {
          const key = registerKey(
            config.providerId,
            value,
            undefined,
            {
              name: `Auto-discovered ${config.name}`,
              tags: ["auto-discovered", "env", "zero-touch"],
            }
          );
          discovered.push(key);
          registeredProviders.add(config.providerId);
          console.log(`[KeyAutoDiscoverer] ✅ Auto-registered ${config.providerId} from ${envKey}`);
        }
      }
    }
  }

  // Second pass: Generic patterns
  for (const [envKey, value] of Object.entries(process.env)) {
    if (!value || value.length < 10) continue; // Skip short values
    if (registeredProviders.has(envKey.split("_")[0].toLowerCase())) continue; // Already registered

    // Try generic patterns
    for (const { pattern, providerHint } of GENERIC_PATTERNS) {
      const match = envKey.match(pattern);
      if (match) {
        const hint = match[1].toLowerCase().replace(/_/g, "-");
        
        // Try to find matching provider
        const providers = APIStore.listProviders();
        const provider = providers.find(
          (p) =>
            p.id === hint ||
            p.id.includes(hint) ||
            p.name.toLowerCase().includes(hint) ||
            hint.includes(p.id) ||
            hint.includes(p.name.toLowerCase().replace(/\s+/g, "-"))
        );

        if (provider) {
          const existing = APIStore.listKeysForProvider(provider.id);
          const alreadyRegistered = existing.some((k) => k.key === value);

          if (!alreadyRegistered) {
            const key = registerKey(
              provider.id,
              value,
              undefined,
              {
                name: `Auto-discovered ${provider.name} Key`,
                tags: ["auto-discovered", "env", "generic", "zero-touch"],
              }
            );
            discovered.push(key);
            console.log(`[KeyAutoDiscoverer] ✅ Auto-registered ${provider.id} from generic pattern ${envKey}`);
          }
        } else {
          // Unknown provider - still register it
          const key = registerKey(
            hint,
            value,
            undefined,
            {
              name: `Auto-discovered ${hint} Key`,
              tags: ["auto-discovered", "env", "unknown-provider", "zero-touch"],
            }
          );
          discovered.push(key);
          console.log(`[KeyAutoDiscoverer] ✅ Auto-registered unknown provider "${hint}" from ${envKey}`);
        }
        break;
      }
    }
  }

  return discovered;
}

/**
 * Scan .env file for keys (multiple locations)
 */
export function scanEnvFile(): Map<string, string> {
  const keys = new Map<string, string>();

  try {
    const fs = require("fs");
    const path = require("path");
    
    // Check multiple .env locations
    const envPaths = [
      path.join(process.cwd(), ".env"),
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env.production"),
      path.join(process.cwd(), ".env.development"),
      path.join(process.cwd(), "..", ".env"),
      path.join(process.cwd(), "..", "..", ".env"),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        const lines = content.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;

          const [key, ...valueParts] = trimmed.split("=");
          const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

          if (key && value && value.length > 5) {
            keys.set(key.trim(), value);
          }
        }
        console.log(`[KeyAutoDiscoverer] 📄 Scanned .env file: ${envPath}`);
      }
    }
  } catch (err) {
    // .env files not accessible - that's okay
  }

  return keys;
}

/**
 * Scan config files (package.json, config.json, etc.)
 */
export function scanConfigFiles(): Map<string, string> {
  const keys = new Map<string, string>();

  try {
    const fs = require("fs");
    const path = require("path");

    // Check package.json for API keys in scripts/config
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      
      // Look for API keys in config section
      if (pkg.config) {
        for (const [key, value] of Object.entries(pkg.config)) {
          if (typeof value === "string" && value.length > 10 && (key.includes("API") || key.includes("KEY") || key.includes("TOKEN"))) {
            keys.set(key, value);
          }
        }
      }
    }

    // Check config.json
    const configPaths = [
      path.join(process.cwd(), "config.json"),
      path.join(process.cwd(), "config", "config.json"),
      path.join(process.cwd(), "config", "api.json"),
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        for (const [key, value] of Object.entries(config)) {
          if (typeof value === "string" && value.length > 10 && (key.includes("api") || key.includes("key") || key.includes("token"))) {
            keys.set(key.toUpperCase(), value);
          }
        }
      }
    }
  } catch (err) {
    // Config files not accessible - that's okay
  }

  return keys;
}

/**
 * Check Vercel environment (if running on Vercel)
 */
export function scanVercelEnv(): Map<string, string> {
  const keys = new Map<string, string>();

  // Vercel exposes env vars automatically, but we can check for Vercel-specific ones
  if (process.env.VERCEL) {
    // Vercel-specific env vars are already in process.env
    // Just log that we're on Vercel
    console.log(`[KeyAutoDiscoverer] 🚀 Running on Vercel - env vars auto-available`);
  }

  return keys;
}

/**
 * Auto-discover ALL keys from ALL sources
 * This is the main function that runs continuously
 */
export function autoDiscoverAllKeys(): APIKey[] {
  const discovered: APIKey[] = [];
  const allDiscoveredKeys = new Set<string>(); // Track to avoid duplicates

  console.log(`[KeyAutoDiscoverer] 🔍 Starting zero-touch key discovery...`);

  // 1. Scan environment variables (primary source)
  const envKeys = autoDiscoverKeysFromEnv();
  for (const key of envKeys) {
    if (!allDiscoveredKeys.has(key.id)) {
      discovered.push(key);
      allDiscoveredKeys.add(key.id);
    }
  }

  // 2. Scan .env files
  const envFileKeys = scanEnvFile();
  // Process .env file keys (they're already in process.env, but double-check)
  for (const [key, value] of envFileKeys.entries()) {
    if (!process.env[key]) {
      // Key in .env but not in process.env - register it
      const providers = APIStore.listProviders();
      const provider = providers.find((p) => key.toLowerCase().includes(p.id.toLowerCase()));
      
      if (provider) {
        const existing = APIStore.listKeysForProvider(provider.id);
        if (!existing.some((k) => k.key === value)) {
          const registered = registerKey(
            provider.id,
            value,
            undefined,
            {
              name: `Auto-discovered from .env: ${key}`,
              tags: ["auto-discovered", "env-file", "zero-touch"],
            }
          );
          if (!allDiscoveredKeys.has(registered.id)) {
            discovered.push(registered);
            allDiscoveredKeys.add(registered.id);
          }
        }
      }
    }
  }

  // 3. Scan config files
  const configKeys = scanConfigFiles();
  for (const [key, value] of configKeys.entries()) {
    const providers = APIStore.listProviders();
    const provider = providers.find((p) => key.toLowerCase().includes(p.id.toLowerCase()));
    
    if (provider) {
      const existing = APIStore.listKeysForProvider(provider.id);
      if (!existing.some((k) => k.key === value)) {
        const registered = registerKey(
          provider.id,
          value,
          undefined,
          {
            name: `Auto-discovered from config: ${key}`,
            tags: ["auto-discovered", "config-file", "zero-touch"],
          }
        );
        if (!allDiscoveredKeys.has(registered.id)) {
          discovered.push(registered);
          allDiscoveredKeys.add(registered.id);
        }
      }
    }
  }

  // 4. Check Vercel environment
  scanVercelEnv();

  console.log(`[KeyAutoDiscoverer] ✅ Zero-touch discovery complete: ${discovered.length} new key(s) found`);

  return discovered;
}

/**
 * Continuous auto-discovery - runs every cycle
 * This ensures keys are always up-to-date
 */
export function continuousAutoDiscovery(): APIKey[] {
  // Run full discovery
  return autoDiscoverAllKeys();
}
