/**
 * Env Keeper - Auto-Discovery
 * Automatically discovers environment variables from all sources
 */
import fs from "fs";
import path from "path";
/**
 * Discover environment variables from process.env
 */
export function discoverFromProcessEnv() {
    const discovered = [];
    const knownPatterns = {
        // API Keys
        OPENAI_API_KEY: { category: "api_keys", isSecret: true, description: "OpenAI API key for GPT-4o" },
        ANTHROPIC_API_KEY: { category: "api_keys", isSecret: true, description: "Anthropic API key for Claude" },
        TWILIO_ACCOUNT_SID: { category: "api_keys", isSecret: false, description: "Twilio Account SID" },
        TWILIO_AUTH_TOKEN: { category: "api_keys", isSecret: true, description: "Twilio Auth Token" },
        TWILIO_PHONE_NUMBER: { category: "services", isSecret: false, description: "Twilio phone number" },
        VERCEL_TOKEN: { category: "api_keys", isSecret: true, description: "Vercel API token" },
        VERCEL_API_TOKEN: { category: "api_keys", isSecret: true, description: "Vercel API token (alternate)" },
        // Database
        DATABASE_URL: { category: "database", isSecret: true, description: "PostgreSQL database connection string" },
        PGHOST: { category: "database", isSecret: false, description: "PostgreSQL host" },
        PGDATABASE: { category: "database", isSecret: false, description: "PostgreSQL database name" },
        PGUSER: { category: "database", isSecret: false, description: "PostgreSQL user" },
        PGPASSWORD: { category: "database", isSecret: true, description: "PostgreSQL password" },
        PGPORT: { category: "database", isSecret: false, description: "PostgreSQL port" },
        // Auth
        JWT_SECRET: { category: "auth", isSecret: true, description: "JWT signing secret" },
        SESSION_SECRET: { category: "auth", isSecret: true, description: "Session secret" },
        // Services
        DREAMNET_VOICE_RECIPIENT: { category: "services", isSecret: false, description: "SMS recipient phone number" },
        TWILIO_RECIPIENT: { category: "services", isSecret: false, description: "Twilio recipient (alternate)" },
        // Deployment
        NODE_ENV: { category: "deployment", isSecret: false, description: "Node environment" },
        PORT: { category: "deployment", isSecret: false, description: "Server port" },
        VERCEL: { category: "deployment", isSecret: false, description: "Vercel deployment flag" },
        VERCEL_TEAM_ID: { category: "deployment", isSecret: false, description: "Vercel team ID" },
        // Monitoring
        SENTRY_DSN: { category: "monitoring", isSecret: true, description: "Sentry DSN" },
        LOG_LEVEL: { category: "monitoring", isSecret: false, description: "Log level" },
    };
    for (const [key, value] of Object.entries(process.env)) {
        if (!value || value.length < 3)
            continue;
        const pattern = knownPatterns[key];
        if (pattern) {
            discovered.push({
                id: `env_${key.toLowerCase()}`,
                key,
                value, // Will be encrypted in storage
                category: pattern.category,
                isSecret: pattern.isSecret,
                required: false, // Can be determined later
                environments: ["local", "development", "staging", "production"],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                tags: ["auto-discovered", "process-env"],
                description: pattern.description,
            });
        }
        else {
            // Skip system/env vars that aren't relevant
            if (key.startsWith("npm_") || key.startsWith("PNPM_") ||
                key.includes("PROGRAM") || key.includes("PATH") ||
                key === "OS" || key === "TEMP" || key === "TMP" ||
                key.includes("USER") || key.includes("HOME") ||
                key.includes("WINDIR") || key.includes("SYSTEM")) {
                continue; // Skip system vars
            }
            // Generic pattern matching for app-specific vars
            const isSecret = key.includes("SECRET") || key.includes("TOKEN") || key.includes("KEY") || key.includes("PASSWORD");
            const category = key.includes("DB") || key.includes("DATABASE") ? "database" :
                key.includes("API") && key.includes("KEY") ? "api_keys" :
                    key.includes("AUTH") || key.includes("JWT") ? "auth" :
                        "other";
            discovered.push({
                id: `env_${key.toLowerCase()}`,
                key,
                value,
                category,
                isSecret,
                required: false,
                environments: ["local", "development", "staging", "production"],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                tags: ["auto-discovered", "generic"],
            });
        }
    }
    return discovered;
}
/**
 * Discover from .env files (AGGRESSIVE - finds ALL .env files)
 */
export function discoverFromEnvFiles() {
    const discovered = [];
    try {
        // Find ALL .env files recursively
        const envPaths = [];
        function findEnvFiles(dir, depth = 0) {
            if (depth > 3)
                return; // Limit depth
            try {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory() && !file.startsWith("node_modules") && !file.startsWith(".") && file !== "dist" && file !== "build") {
                        findEnvFiles(fullPath, depth + 1);
                    }
                    else if (file.startsWith(".env")) {
                        envPaths.push(fullPath);
                    }
                }
            }
            catch (e) {
                // Can't read directory
            }
        }
        // Check common locations
        const commonPaths = [
            process.cwd(),
            path.join(process.cwd(), ".."),
            path.join(process.cwd(), "../.."),
            path.join(process.cwd(), ".env"),
            path.join(process.cwd(), ".env.local"),
            path.join(process.cwd(), ".env.production"),
            path.join(process.cwd(), ".env.development"),
            path.join(process.cwd(), ".env.staging"),
            path.join(process.cwd(), "server", ".env"),
            path.join(process.cwd(), "server", ".env.local"),
            path.join(process.cwd(), "client", ".env"),
            path.join(process.cwd(), "client", ".env.local"),
        ];
        // Add all .env files from common paths
        for (const basePath of commonPaths) {
            try {
                if (fs.existsSync(basePath)) {
                    if (fs.statSync(basePath).isFile() && basePath.includes(".env")) {
                        envPaths.push(basePath);
                    }
                    else if (fs.statSync(basePath).isDirectory()) {
                        findEnvFiles(basePath, 0);
                    }
                }
            }
            catch (e) {
                // Skip
            }
        }
        // Parse all found .env files
        for (const envPath of envPaths) {
            try {
                if (!fs.existsSync(envPath))
                    continue;
                const content = fs.readFileSync(envPath, "utf-8");
                const lines = content.split("\n");
                let fileVarCount = 0;
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("#") || !trimmed.includes("="))
                        continue;
                    const [key, ...valueParts] = trimmed.split("=");
                    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
                    if (key && value && value.length > 0) {
                        const keyTrimmed = key.trim();
                        const isSecret = keyTrimmed.includes("SECRET") ||
                            keyTrimmed.includes("TOKEN") ||
                            keyTrimmed.includes("KEY") ||
                            keyTrimmed.includes("PASSWORD") ||
                            keyTrimmed.includes("PRIVATE");
                        const category = keyTrimmed.includes("DB") || keyTrimmed.includes("DATABASE") || keyTrimmed.includes("POSTGRES") ? "database" :
                            keyTrimmed.includes("API") && keyTrimmed.includes("KEY") ? "api_keys" :
                                keyTrimmed.includes("AUTH") || keyTrimmed.includes("JWT") || keyTrimmed.includes("SESSION") ? "auth" :
                                    keyTrimmed.includes("TWILIO") || keyTrimmed.includes("SMS") || keyTrimmed.includes("VOICE") ? "services" :
                                        keyTrimmed.includes("VERCEL") || keyTrimmed.includes("DEPLOY") ? "deployment" :
                                            keyTrimmed.includes("SENTRY") || keyTrimmed.includes("LOG") ? "monitoring" :
                                                "other";
                        discovered.push({
                            id: `env_${keyTrimmed.toLowerCase()}_${path.basename(envPath)}`,
                            key: keyTrimmed,
                            value,
                            category,
                            isSecret,
                            required: false,
                            environments: envPath.includes("production") ? ["production"] :
                                envPath.includes("staging") ? ["staging"] :
                                    envPath.includes("development") ? ["development"] :
                                        ["local", "development", "staging", "production"],
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            tags: ["env-file", path.basename(envPath)],
                        });
                        fileVarCount++;
                    }
                }
                if (fileVarCount > 0) {
                    console.log(`[EnvKeeper] 📄 Discovered ${fileVarCount} vars from ${path.basename(envPath)}`);
                }
            }
            catch (error) {
                console.warn(`[EnvKeeper] ⚠️  Could not read ${envPath}:`, error.message);
            }
        }
    }
    catch (error) {
        console.warn("[EnvKeeper] ⚠️  Error discovering .env files:", error.message);
    }
    return discovered;
}
/**
 * Discover from Vercel (if available)
 */
export async function discoverFromVercel() {
    try {
        const { discoverFromVercel: vercelDiscover } = await import("./vercelSync");
        return await vercelDiscover();
    }
    catch (error) {
        console.warn("[EnvKeeper] Vercel discovery error:", error.message);
        return [];
    }
}
/**
 * Discover from all sources
 */
export async function discoverAllEnvVars() {
    const discovered = [];
    const seen = new Set();
    // 1. Process.env (filter out system vars)
    const processVars = discoverFromProcessEnv();
    for (const envVar of processVars) {
        if (!seen.has(envVar.key)) {
            discovered.push(envVar);
            seen.add(envVar.key);
        }
    }
    // 2. .env files (SYNC - finds ALL files)
    const fileVars = discoverFromEnvFiles();
    for (const envVar of fileVars) {
        if (!seen.has(envVar.key)) {
            discovered.push(envVar);
            seen.add(envVar.key);
        }
        else {
            // Update existing with value from .env file (prefer .env files)
            const existing = discovered.findIndex(e => e.key === envVar.key);
            if (existing >= 0) {
                discovered[existing] = envVar; // Replace with .env file value
            }
        }
    }
    // 3. Vercel (async)
    const vercelVars = await discoverFromVercel();
    for (const envVar of vercelVars) {
        if (!seen.has(envVar.key)) {
            discovered.push(envVar);
            seen.add(envVar.key);
        }
    }
    return discovered;
}
