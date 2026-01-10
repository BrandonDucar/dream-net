"use strict";
/**
 * Env Keeper Core
 * Centralized environment variable management system
 * Never manually manage env vars again - auto-discovery, secure storage, unified interface
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvKeeperCore = void 0;
const envDiscoverer_1 = require("./logic/envDiscoverer");
const envStorage_1 = require("./logic/envStorage");
const envClassifier_1 = require("./logic/envClassifier");
let isInitialized = false;
let lastSyncAt = null;
exports.EnvKeeperCore = {
    /**
     * Initialize Env Keeper
     * Auto-discovers ALL env vars and automatically applies them to process.env
     */
    async init(context) {
        console.log("[EnvKeeper] 🔍 Initializing Env Keeper - Auto-discovering ALL environment variables...");
        try {
            // Auto-discover all environment variables from ALL sources
            const discovered = await (0, envDiscoverer_1.discoverAllEnvVars)();
            // Classify and register discovered vars
            let secretCount = 0;
            let internalCount = 0;
            let publicCount = 0;
            // Store discovered vars AND auto-apply to process.env (if not already set)
            let appliedCount = 0;
            for (const envVar of discovered) {
                (0, envStorage_1.storeEnvVar)(envVar);
                // Classify and register
                const descriptor = (0, envClassifier_1.createEnvVarDescriptor)(envVar.key, envVar.value, "process");
                (0, envClassifier_1.updateEnvRegistry)(descriptor);
                if (descriptor.sensitivity === "secret")
                    secretCount++;
                else if (descriptor.sensitivity === "internal")
                    internalCount++;
                else
                    publicCount++;
                // Auto-apply to process.env if not already set
                if (!process.env[envVar.key]) {
                    // Decrypt if needed
                    let value = envVar.value;
                    if (envVar.isSecret && envVar.value.includes(":")) {
                        // Try to decrypt (if encrypted)
                        try {
                            const { decrypt } = require("./logic/envStorage");
                            value = decrypt(envVar.value);
                        }
                        catch (e) {
                            // Not encrypted, use as-is
                            value = envVar.value;
                        }
                    }
                    process.env[envVar.key] = value;
                    appliedCount++;
                }
            }
            lastSyncAt = Date.now();
            isInitialized = true;
            // Emit Nerve event for sync
            try {
                const { NERVE_BUS } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/bus")));
                const { createNerveEvent } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/factory")));
                const event = createNerveEvent({
                    channelId: "SYSTEM_METRIC",
                    kind: "METRIC_SNAPSHOT",
                    priority: 4,
                    context: {
                        clusterId: "ENVKEEPER_CORE",
                    },
                    payload: {
                        metric: "envkeeper.sync",
                        total: discovered.length,
                        secretCount,
                        internalCount,
                        publicCount,
                    },
                    defaultSampleRate: 1.0,
                });
                NERVE_BUS.publish(event);
            }
            catch (error) {
                // Nerve not available, continue
            }
            console.log(`[EnvKeeper] ✅ Initialized - Discovered ${discovered.length} environment variable(s)`);
            console.log(`[EnvKeeper] 🔒 Classified: ${secretCount} secret(s), ${internalCount} internal, ${publicCount} public`);
            console.log(`[EnvKeeper] 🚀 Auto-applied ${appliedCount} variable(s) to process.env`);
            console.log(`[EnvKeeper] 💡 You never need to manually set env vars again!`);
            return true;
        }
        catch (error) {
            console.error("[EnvKeeper] Initialization error:", error.message);
            return false;
        }
    },
    /**
     * Get status
     */
    status() {
        const vars = (0, envStorage_1.listEnvVars)(false);
        const categories = {};
        for (const envVar of vars) {
            categories[envVar.category] = (categories[envVar.category] || 0) + 1;
        }
        return {
            initialized: isInitialized,
            totalVars: vars.length,
            secretsCount: vars.filter((v) => v.isSecret).length,
            categories: categories,
            lastSyncAt,
            syncSources: ["process-env", "env-files"],
        };
    },
    /**
     * Auto-discover and sync environment variables
     */
    async sync() {
        console.log("[EnvKeeper] 🔄 Syncing environment variables...");
        const discovered = await (0, envDiscoverer_1.discoverAllEnvVars)();
        let secretCount = 0;
        let internalCount = 0;
        let publicCount = 0;
        for (const envVar of discovered) {
            (0, envStorage_1.storeEnvVar)(envVar);
            // Classify and register
            const descriptor = (0, envClassifier_1.createEnvVarDescriptor)(envVar.key, envVar.value, "process");
            (0, envClassifier_1.updateEnvRegistry)(descriptor);
            if (descriptor.sensitivity === "secret")
                secretCount++;
            else if (descriptor.sensitivity === "internal")
                internalCount++;
            else
                publicCount++;
        }
        lastSyncAt = Date.now();
        // Emit Nerve event for sync
        try {
            const { NERVE_BUS } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/bus")));
            const { createNerveEvent } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/factory")));
            const event = createNerveEvent({
                channelId: "SYSTEM_METRIC",
                kind: "METRIC_SNAPSHOT",
                priority: 4,
                context: {
                    clusterId: "ENVKEEPER_CORE",
                },
                payload: {
                    metric: "envkeeper.sync",
                    total: discovered.length,
                    secretCount,
                    internalCount,
                    publicCount,
                },
                defaultSampleRate: 1.0,
            });
            NERVE_BUS.publish(event);
        }
        catch (error) {
            // Nerve not available, continue
        }
        console.log(`[EnvKeeper] ✅ Synced ${discovered.length} environment variable(s)`);
        console.log(`[EnvKeeper] 🔒 Classified: ${secretCount} secret(s), ${internalCount} internal, ${publicCount} public`);
        return discovered;
    },
    /**
     * Get environment variable
     */
    get(key, decryptValue = false) {
        return (0, envStorage_1.getEnvVarByKey)(key, decryptValue);
    },
    /**
     * Get all environment variables
     */
    list(decryptValues = false) {
        return (0, envStorage_1.listEnvVars)(decryptValues);
    },
    /**
     * Set environment variable
     */
    set(key, value, options) {
        const existing = (0, envStorage_1.getEnvVarByKey)(key);
        const envVar = {
            id: existing?.id || `env_${key.toLowerCase()}`,
            key,
            value,
            category: options?.category || "other",
            isSecret: options?.isSecret ?? (key.includes("SECRET") || key.includes("TOKEN") || key.includes("KEY") || key.includes("PASSWORD")),
            required: false,
            environments: options?.environments || ["local", "development", "staging", "production"],
            createdAt: existing?.createdAt || Date.now(),
            updatedAt: Date.now(),
            tags: existing?.tags || [],
            description: options?.description || existing?.description,
        };
        const stored = (0, envStorage_1.storeEnvVar)(envVar);
        // Classify and register
        const descriptor = (0, envClassifier_1.createEnvVarDescriptor)(key, value, "runtime");
        (0, envClassifier_1.updateEnvRegistry)(descriptor);
        // Emit Nerve event if secret
        if (descriptor.sensitivity === "secret") {
            try {
                const { NERVE_BUS } = require("@dreamnet/nerve/bus");
                const { createNerveEvent } = require("@dreamnet/nerve/factory");
                const event = createNerveEvent({
                    channelId: "DREAMSTATE_EVENT",
                    kind: "DREAMSTATE_DECISION",
                    priority: 5,
                    context: {
                        clusterId: "ENVKEEPER_CORE",
                    },
                    payload: {
                        action: "ENV_SECRET_MUTATION",
                        key: envVar.key,
                        sensitivity: descriptor.sensitivity,
                        // Never include value
                    },
                    defaultSampleRate: 1.0,
                });
                NERVE_BUS.publish(event);
            }
            catch (error) {
                // Nerve not available, continue
            }
        }
        return stored;
    },
    /**
     * Delete environment variable
     */
    delete(key) {
        const envVar = (0, envStorage_1.getEnvVarByKey)(key);
        if (!envVar)
            return false;
        // Get descriptor before deletion
        const { getEnvDescriptor } = require("./logic/envClassifier");
        const descriptor = getEnvDescriptor(key);
        const deleted = (0, envStorage_1.deleteEnvVar)(envVar.id);
        // Emit Nerve event if secret
        if (deleted && descriptor && descriptor.sensitivity === "secret") {
            try {
                const { NERVE_BUS } = require("@dreamnet/nerve/bus");
                const { createNerveEvent } = require("@dreamnet/nerve/factory");
                const event = createNerveEvent({
                    channelId: "DREAMSTATE_EVENT",
                    kind: "DREAMSTATE_DECISION",
                    priority: 5,
                    context: {
                        clusterId: "ENVKEEPER_CORE",
                    },
                    payload: {
                        action: "ENV_SECRET_DELETION",
                        key: envVar.key,
                        sensitivity: descriptor.sensitivity,
                        // Never include value
                    },
                    defaultSampleRate: 1.0,
                });
                NERVE_BUS.publish(event);
            }
            catch (error) {
                // Nerve not available, continue
            }
        }
        return deleted;
    },
    /**
     * Generate .env file content
     */
    generateEnvFile(environment, includeComments = true) {
        const vars = (0, envStorage_1.getAllAsKeyValue)(environment, true);
        let content = "";
        if (includeComments) {
            content += `# DreamNet Environment Variables\n`;
            content += `# Generated by Env Keeper Core\n`;
            content += `# Environment: ${environment || "all"}\n`;
            content += `# Generated: ${new Date().toISOString()}\n\n`;
        }
        for (const [key, value] of Object.entries(vars)) {
            const envVar = (0, envStorage_1.getEnvVarByKey)(key);
            if (envVar?.description && includeComments) {
                content += `# ${envVar.description}\n`;
            }
            content += `${key}=${value}\n`;
        }
        return content;
    },
    /**
     * Export as JSON (for backup/sharing)
     */
    export(decryptValues = false) {
        const vars = (0, envStorage_1.listEnvVars)(decryptValues);
        return {
            version: "1.0",
            generatedAt: new Date().toISOString(),
            variables: vars.map((v) => ({
                key: v.key,
                value: decryptValues && v.isSecret ? v.value : "[ENCRYPTED]",
                category: v.category,
                isSecret: v.isSecret,
                description: v.description,
                environments: v.environments,
                tags: v.tags,
            })),
        };
    },
    /**
     * Get sync sources
     */
    getSyncSources() {
        return [
            {
                id: "process-env",
                type: "local",
                name: "Process Environment",
                status: "connected",
                lastSyncAt: lastSyncAt,
                varCount: (0, envStorage_1.getCount)(),
            },
            {
                id: "env-files",
                type: "env_file",
                name: ".env Files",
                status: "connected",
                lastSyncAt: lastSyncAt,
                varCount: (0, envStorage_1.getCount)(),
            },
        ];
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./logic/envClassifier"), exports);
exports.default = exports.EnvKeeperCore;
