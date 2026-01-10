"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// Lazy import vite.ts to avoid issues in production
var viteModuleCache = null;
function loadViteModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!viteModuleCache) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./vite"); })];
                case 1:
                    viteModuleCache = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, viteModuleCache];
            }
        });
    });
}
// Lazy import legacy loader - only load when needed
var legacyRequire;
function loadLegacyLoader() {
    return __awaiter(this, void 0, void 0, function () {
        var loader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!legacyRequire) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./legacy/loader.js"); })];
                case 1:
                    loader = _a.sent();
                    legacyRequire = loader.legacyRequire;
                    _a.label = 2;
                case 2: return [2 /*return*/, legacyRequire];
            }
        });
    });
}
var index_js_1 = require("./mesh/index.js");
var router_js_1 = require("./mesh/router.js");
var agent_1 = require("./routes/agent");
// Environment configuration - load early to catch config errors
var env_1 = require("./config/env");
// Temporarily disabled - forge tables not in schema yet
// import { createForgeRouter } from "./routes/forge";
var express_2 = require("express");
var createForgeRouter = function () { return (0, express_2.Router)(); };
var graft_1 = require("./routes/graft");
var grafted_1 = require("./routes/grafted");
var dna_1 = require("./routes/dna");
var resonance_1 = require("./routes/resonance");
var alive_1 = require("./routes/alive");
var operator_1 = require("./routes/operator");
// Missing packages - using placeholders
var createSquadRouter = function () { return (0, express_2.Router)(); };
var createEventRouter = function () { return (0, express_2.Router)(); };
var createWormholeRouter = function () { return (0, express_2.Router)(); };
var createSporeRouter = function () { return (0, express_2.Router)(); };
var createFabricRouter = function () { return (0, express_2.Router)(); };
// import { createMediaRouter } from "./routes/media"; // Temporarily disabled - @dreamnet/media-vault missing
var metrics_1 = require("./routes/metrics");
var orders_1 = require("./routes/orders");
var public_1 = require("./routes/public");
// import { createPosterRouter } from "./routes/poster"; // Temporarily disabled - @dreamnet/media-vault missing
var rewards_1 = require("./routes/rewards");
var dream_1 = require("./routes/dream");
var createDreamRouter = function () { return dream_1.default; };
var dream_interactions_1 = require("./routes/dream-interactions");
var dream_contributions_1 = require("./routes/dream-contributions");
var wolf_pack_1 = require("./routes/wolf-pack");
var super_spine_1 = require("./routes/super-spine");
var fleets_1 = require("./routes/fleets");
var custom_gpt_fleets_1 = require("./routes/custom-gpt-fleets");
var social_media_ops_1 = require("./routes/social-media-ops");
var instant_mesh_1 = require("./routes/instant-mesh");
var foundry_1 = require("./routes/foundry");
var media_list_1 = require("./routes/media-list");
var email_1 = require("./routes/email");
var inbox_squared_1 = require("./routes/inbox-squared");
var coinsensei_1 = require("./routes/coinsensei");
var agent_wallets_1 = require("./routes/agent-wallets");
var dream_snail_1 = require("./routes/dream-snail");
var biomimetic_systems_1 = require("./routes/biomimetic-systems");
var whale_1 = require("./routes/whale");
var onboarding_1 = require("./routes/onboarding");
// haloTriggers imported conditionally - see error handler below
var haloTriggers = {};
// Lazy imports for workspace packages - loaded only when INIT_HEAVY_SUBSYSTEMS=true
// These will be dynamically imported to avoid startup issues
var NeuralMesh;
var QuantumAnticipation;
var SquadAlchemy;
var WolfPack;
var OctopusExecutor;
var SlugTimeMemory;
var StarBridgeLungs;
var PredatorScavengerLoop;
var DreamCortex;
var ReputationLattice;
var NarrativeField;
var IdentityGrid;
var DreamVault;
var DreamShop;
var FieldLayer;
var DreamBetCore;
var ZenGardenCore;
var CivicPanelCore;
var DreamTankCore;
var LiquidityEngine;
var SocialHubCore;
var InitRitualCore;
var EconomicEngineCore;
var AgentRegistryCore;
var DreamNetOSCore;
var WolfPackFundingCore;
var APIKeeperCore;
var AISEOCore;
var EnvKeeperCore;
var autoSEO_1 = require("./middleware/autoSEO");
var heartbeat_1 = require("./routes/heartbeat");
var jaggy_1 = require("./routes/jaggy");
var shield_1 = require("./routes/shield");
var star_bridge_1 = require("./routes/star-bridge");
var control_1 = require("./routes/control");
var billable_1 = require("./routes/billable");
var health_1 = require("./routes/health");
var audit_1 = require("./routes/audit");
var rbac_1 = require("./routes/rbac");
var voice_1 = require("./routes/voice");
var vercel_1 = require("./routes/vercel");
var api_keys_1 = require("./routes/api-keys");
var env_keeper_1 = require("./routes/env-keeper");
var chatgpt_agent_1 = require("./routes/chatgpt-agent");
var nerve_1 = require("./routes/nerve");
var debug_summary_1 = require("./routes/debug-summary");
var agent_gateway_1 = require("./routes/agent-gateway");
var ports_ops_1 = require("./routes/ports-ops");
var agent_ops_1 = require("./routes/agent-ops");
var shield_risk_1 = require("./routes/shield-risk");
var dead_letter_1 = require("./routes/dead-letter");
var grid_lines_1 = require("./routes/grid-lines");
var directory_1 = require("./routes/directory");
var networks_1 = require("./routes/networks");
var discovery_1 = require("./routes/discovery");
// Lazy imports for workspace packages - convert to relative paths
// import { initDirectory } from "@dreamnet/directory/bootstrap";
// import { WebhookNervousCore } from "@dreamnet/webhook-nervous-core";
// import { JaggyCore } from "@dreamnet/jaggy-core";
// import { DreamSnailCore } from "@dreamnet/dreamnet-snail-core";
// import { DreamNetVoiceTwilio } from "@dreamnet/dreamnet-voice-twilio";
// import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";
var traceId_1 = require("./middleware/traceId");
var idempotency_1 = require("./middleware/idempotency");
var tierResolver_1 = require("./middleware/tierResolver");
// import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
var controlCoreMiddleware_1 = require("../packages/dreamnet-control-core/controlCoreMiddleware");
var app = (0, express_1.default)();
// Request body size limits (prevent memory exhaustion)
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: false, limit: '10mb' }));
// Request timeouts (prevent hanging requests)
app.use(function (req, res, next) {
    req.setTimeout(30000); // 30 seconds
    res.setTimeout(30000);
    next();
});
// CORS configuration
app.use(function (req, res, next) {
    var envConfig = (0, env_1.getEnvConfig)();
    var allowedOrigins = envConfig.ALLOWED_ORIGINS || ['*'];
    var origin = req.headers.origin;
    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-dreamnet-api-key, x-wallet-address, x-idempotency-key, x-trace-id');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Global rate limiting (basic in-memory implementation)
// Note: For production, consider using Redis-based rate limiting
var rateLimitStore = new Map();
var RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
var RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window
app.use(function (req, res, next) {
    // Skip rate limiting for health checks
    if (req.path === '/health' || req.path === '/ready') {
        return next();
    }
    var ip = req.ip || req.socket.remoteAddress || 'unknown';
    var now = Date.now();
    var record = rateLimitStore.get(ip);
    // Clean up old entries periodically
    if (rateLimitStore.size > 10000) {
        for (var _i = 0, _a = rateLimitStore.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (now > value.resetAt) {
                rateLimitStore.delete(key);
            }
        }
    }
    if (!record || now > record.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }
    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
            ok: false,
            error: 'rate_limit_exceeded',
            message: 'Too many requests from this IP. Please try again later.',
            retryAfter: Math.ceil((record.resetAt - now) / 1000)
        });
    }
    record.count++;
    next();
});
// Database health check helper with timeout
function checkDbHealth() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, getPool, isDbAvailable, pool, timeoutPromise, queryPromise, error_1, logger;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!process.env.DATABASE_URL) {
                        return [2 /*return*/, null]; // Not configured
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./db'); })];
                case 2:
                    _a = _b.sent(), getPool = _a.getPool, isDbAvailable = _a.isDbAvailable;
                    if (!isDbAvailable()) {
                        return [2 /*return*/, false];
                    }
                    pool = getPool();
                    timeoutPromise = new Promise(function (_, reject) {
                        setTimeout(function () { return reject(new Error('Database health check timeout')); }, 1000);
                    });
                    queryPromise = pool.query('SELECT 1');
                    return [4 /*yield*/, Promise.race([queryPromise, timeoutPromise])];
                case 3:
                    _b.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_1 = _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('./utils/logger'); })];
                case 5:
                    logger = (_b.sent()).logger;
                    logger.warn('Database health check failed', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Lightweight health check endpoint - must be early and never depend on optional subsystems
app.get("/health", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dbHealthy, isHealthy;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkDbHealth()];
            case 1:
                dbHealthy = _a.sent();
                isHealthy = dbHealthy !== false;
                res.status(isHealthy ? 200 : 503).json({
                    ok: isHealthy,
                    service: "dreamnet-api",
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    database: dbHealthy === null ? 'not-configured' : dbHealthy ? 'healthy' : 'unhealthy',
                    // Document what database status means:
                    // - 'healthy': Database is configured and responding to queries
                    // - 'unhealthy': Database is configured but not responding (connection failed or timeout)
                    // - 'not-configured': DATABASE_URL not set (server can run without DB)
                });
                return [2 /*return*/];
        }
    });
}); });
// Ready endpoint - alias for /health/ready (backward compatible)
app.get("/ready", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var healthRouter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./routes/health"); })];
            case 1:
                healthRouter = _a.sent();
                // Note: This will be handled by health router's /ready endpoint
                // For now, keep simple compatibility
                res.status(200).json({
                    ready: true, // Will be properly checked by /health/ready
                    timestamp: new Date().toISOString(),
                    note: "Use /health/ready for detailed readiness checks"
                });
                return [2 /*return*/];
        }
    });
}); });
// Kubernetes health check endpoints (root level for liveness/readiness probes)
app.get("/health/live", function (_req, res) {
    // Liveness probe - just check if process is running
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        pid: process.pid
    });
});
app.get("/health/ready", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checks_1, dbHealthy, requiredEnvVars, envCheck, criticalChecks, ready, statusCode, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                checks_1 = {};
                if (!process.env.DATABASE_URL) return [3 /*break*/, 2];
                return [4 /*yield*/, checkDbHealth()];
            case 1:
                dbHealthy = _a.sent();
                checks_1.database = dbHealthy === true ? true : dbHealthy === null ? 'not-configured' : false;
                return [3 /*break*/, 3];
            case 2:
                checks_1.database = 'not-configured';
                _a.label = 3;
            case 3:
                requiredEnvVars = ['NODE_ENV'];
                envCheck = requiredEnvVars.every(function (v) { return !!process.env[v]; });
                checks_1.environment = envCheck;
                criticalChecks = ['database', 'environment'];
                ready = criticalChecks.every(function (key) {
                    var value = checks_1[key];
                    return value === true || value === 'not-configured'; // not-configured is OK
                });
                statusCode = ready ? 200 : 503;
                res.status(statusCode).json({
                    ready: ready,
                    checks: checks_1,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(503).json({
                    ready: false,
                    error: error_2.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Request flow: Trace → Idempotency → Tier Resolver → Control Core → Route Handler
// Trace ID middleware - adds X-Trace-Id to all requests
app.use(traceId_1.traceIdMiddleware);
// Idempotency middleware - handles X-Idempotency-Key header
app.use(idempotency_1.idempotencyMiddleware);
// Tier resolver middleware - resolves access tier from API key or wallet (includes God Vault detection)
app.use(tierResolver_1.tierResolverMiddleware);
// Control Core middleware - enforces cluster-level access, rate limits, and feature flags
// Note: This middleware only acts on routes that have clusterId attached via withCluster() helper
// Routes without clusterId will pass through (unclustered routes)
app.use(controlCoreMiddleware_1.controlCoreMiddleware);
// AUTO-SEO: Apply SEO optimization globally to all content
app.use(autoSEO_1.autoSEORequestMiddleware);
app.use(function (req, _res, next) {
    var _a;
    try {
        (_a = haloTriggers.recordRequest) === null || _a === void 0 ? void 0 : _a.call(haloTriggers);
    }
    catch (_b) {
        // Ignore if haloTriggers not available
    }
    next();
});
app.use("/api/mesh", (0, router_js_1.createMeshRouter)());
app.use("/api/graft", (0, graft_1.createGraftRouter)());
app.use("/api/grafted", (0, grafted_1.createGraftedRouter)());
app.use("/api", (0, agent_1.createAgentRouter)());
app.use("/api", createForgeRouter());
// Halo routes temporarily disabled - using placeholder metrics engine
// app.use("/api", createHaloRouter());
app.use("/api/dna", (0, dna_1.createDnaRouter)());
app.use("/api/resonance", (0, resonance_1.createResonanceRouter)());
app.use("/api/alive", (0, alive_1.createAliveRouter)());
// app.use("/api", createSquadRouter()); // Disabled - package not available
app.use("/api", createEventRouter());
app.use("/api", createWormholeRouter());
app.use("/api", createSporeRouter());
app.use("/api", createFabricRouter());
// Media router temporarily disabled - @dreamnet/media-vault missing
// app.use("/api", createMediaRouter());
app.use("/api", (0, metrics_1.createMetricsRouter)());
app.use("/api", (0, orders_1.createOrdersRouter)());
app.use("/api", (0, public_1.createPublicRouter)());
// Poster router temporarily disabled - @dreamnet/media-vault missing
// app.use("/api", createPosterRouter());
app.use("/api", (0, rewards_1.createRewardsRouter)());
app.use("/api", createDreamRouter());
app.use("/api", (0, dream_interactions_1.createDreamInteractionsRouter)());
app.use("/api", (0, dream_contributions_1.createDreamContributionsRouter)());
app.use("/api", (0, wolf_pack_1.createWolfPackRouter)());
app.use("/api", (0, super_spine_1.createSuperSpineRouter)());
app.use("/api", (0, fleets_1.createFleetsRouter)());
app.use("/api", (0, custom_gpt_fleets_1.createCustomGPTFleetsRouter)());
app.use("/api", (0, social_media_ops_1.createSocialMediaOpsRouter)());
app.use("/api", (0, instant_mesh_1.createInstantMeshRouter)());
app.use("/api", (0, foundry_1.createFoundryRouter)());
app.use("/api", (0, media_list_1.createMediaListRouter)());
app.use("/api", (0, email_1.createEmailRouter)());
app.use("/api/inbox-squared", (0, inbox_squared_1.createInboxSquaredRouter)());
app.use("/api/coinsensei", coinsensei_1.createCoinSenseiRouter);
app.use("/api/agent-wallets", agent_wallets_1.createAgentWalletRouter);
app.use("/api", (0, dream_snail_1.createDreamSnailRouter)());
app.use("/api", (0, biomimetic_systems_1.createBiomimeticSystemsRouter)());
// Initialize instant mesh, foundry, and social media ops on startup
console.log("⚡ [Instant Mesh] Zero-delay event routing active");
// Declare variables for systems that need to be shared across initialization
var ShieldCore;
var SpiderWebCore;
var OrcaPackCoreInstance;
var WhalePackCoreInstance;
var DreamStateCoreInstance;
// Optional subsystems initialization function - only runs when INIT_SUBSYSTEMS=true
function initOptionalSubsystems(app, server) {
    return __awaiter(this, void 0, void 0, function () {
        var envConfig, dreamNetOS, meshStatus, error_3, qalStatus, squadStatus, wolfStatus, octopusStatus, error_4, stmStatus, initialStatus, shouldInitHeavyEnvConfig, shouldInitHeavy, WebhookNervousCore, JaggyCore, DreamSnailCore, DreamNetVoiceTwilio, DreamNetVercelAgent, pslStatus, cortexStatus, repStatus, narrativeStatus, identityStatus, vaultStatus, shopStatus, fieldStatus, betStatus, zenStatus, panelStatus, tankStatus, envKeeperInitialized, envStatus, error_5, discoveredKeys, status_1, seoStatus, webhookModule, discoveredWebhooks, webhookStatus, error_6, jaggyModule, jaggyStatus, error_7, shieldModule, currentShieldCore_1, spiderModule, currentSpiderWebCore, shieldCtx_1, shieldStatus, error_8, orcaModule, orcaStatus, error_9, whaleModule, whaleStatus, error_10, spiderModule, spiderStatus, error_11, analystModule, WolfPackAnalystCore_1, analystStatus, error_12, WolfPackMailerCore_1, error_13, RuntimeBridgeCore, runtimeStatus, error_14, OrchestratorCore, orchestratorStatus, error_15, liquidityStatus, socialStatus, initState, _a, state, nextStep, initStatus, raw, applied, econStatus, agentStatus, DREAMKEEPER_CORE, DreamDefenseNet, SurgeonAgent, EvolutionEngine, error_16, osStatus, snapshot, registerAlertNotifier, notificationEngine_1, error_17, voiceModule, voiceInitialized, error_18, vercelModule, vercelInitialized, status_2, error_19, snailModule, error_20, error_21, _b, registerHaloLoopFn, haloTriggersObj, legacyReq, legacySeedModule, legacyDreamScoreEngine, error_22, envConfig_1, error_23, subsystemsReady;
        var _this = this;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    envConfig = (0, env_1.getEnvConfig)();
                    if (!envConfig.INIT_SUBSYSTEMS) {
                        console.log("[Optional Subsystems] Skipped (INIT_SUBSYSTEMS not set to 'true')");
                        return [2 /*return*/];
                    }
                    console.log("[Optional Subsystems] Initializing heavy subsystems...");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./core/dreamnet-os"); })];
                case 2:
                    dreamNetOS = (_e.sent()).dreamNetOS;
                    meshStatus = NeuralMesh.status();
                    console.log("\uD83E\uDDE0 [Neural Mesh] Initialized with ".concat(meshStatus.synapses.count, " synapses, ").concat(meshStatus.memory.count, " memory traces"));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _e.sent();
                    console.warn("[Neural Mesh] Initialization warning:", error_3);
                    return [3 /*break*/, 4];
                case 4:
                    // Initialize Quantum Anticipation Layer (QAL) - Tier II Subsystem
                    try {
                        qalStatus = QuantumAnticipation.status();
                        console.log("\uD83D\uDD2E [Quantum Anticipation] Initialized - Last run: ".concat(qalStatus.lastRunAt ? new Date(qalStatus.lastRunAt).toISOString() : "never"));
                    }
                    catch (error) {
                        console.warn("[Quantum Anticipation] Initialization warning:", error);
                    }
                    // Initialize Squad Alchemy Engine - Tier II Subsystem
                    try {
                        squadStatus = SquadAlchemy.status();
                        console.log("\u2697\uFE0F [Squad Alchemy] Initialized - ".concat(squadStatus.count, " squads registered"));
                    }
                    catch (error) {
                        console.warn("[Squad Alchemy] Initialization warning:", error);
                    }
                    // Initialize Wolf-Pack Protocol (WPP) - Tier II Subsystem
                    try {
                        wolfStatus = WolfPack.status();
                        console.log("\uD83D\uDC3A [Wolf-Pack] Initialized - Active targets: ".concat(wolfStatus.activeTargets.length));
                    }
                    catch (error) {
                        console.warn("[Wolf-Pack] Initialization warning:", error);
                    }
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, OctopusExecutor.init()];
                case 6:
                    _e.sent();
                    octopusStatus = OctopusExecutor.status();
                    console.log("\uD83D\uDC19 [Octopus Executor] Initialized - ".concat(octopusStatus.arms.length, " arms, ").concat(octopusStatus.queuedTasks, " queued tasks"));
                    // TODO: Move to more formal task generation layer later
                    // Enqueue a baseline health task to prove wiring works
                    OctopusExecutor.enqueue({
                        id: "health-batch-".concat(Date.now()),
                        type: "run-batch-job",
                        createdAt: Date.now(),
                        payload: { reason: "baseline octopus health job" },
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _e.sent();
                    console.warn("[Octopus Executor] Initialization warning:", error_4);
                    return [3 /*break*/, 8];
                case 8:
                    // Initialize Slug-Time Memory Layer (STM) - Tier II Subsystem
                    try {
                        stmStatus = SlugTimeMemory.status();
                        console.log("\uD83D\uDC0C [Slug-Time Memory] Initialized - ".concat(stmStatus.totalSamples, " samples, ").concat(stmStatus.snapshotCount, " snapshots"));
                    }
                    catch (error) {
                        console.warn("[Slug-Time Memory] Initialization warning:", error);
                    }
                    // Initialize Star-Bridge Lungs - Tier II Subsystem (Cross-Chain Breathwork) ⭐
                    try {
                        initialStatus = StarBridgeLungs.run({
                            neuralMesh: NeuralMesh,
                            quantumAnticipation: QuantumAnticipation,
                            slugTimeMemory: SlugTimeMemory,
                        });
                        console.log("\u2B50 [Star-Bridge Lungs] Initialized - ".concat(initialStatus.chainMetrics.length, " chains monitored"));
                        console.log("   \uD83C\uDF2C\uFE0F  ".concat(initialStatus.lastBreaths.length, " breath snapshots"));
                        console.log("   \uD83D\uDD17 Cross-chain breathwork active");
                        // Start continuous breath cycle (runs every 2 minutes)
                        setInterval(function () {
                            StarBridgeLungs.run({
                                neuralMesh: NeuralMesh,
                                quantumAnticipation: QuantumAnticipation,
                                slugTimeMemory: SlugTimeMemory,
                            });
                        }, 2 * 60 * 1000); // Every 2 minutes
                        console.log("   \u23F1\uFE0F  Breathing every 2 minutes - monitoring cross-chain activity");
                    }
                    catch (error) {
                        console.warn("[Star-Bridge Lungs] Initialization warning:", error);
                    }
                    shouldInitHeavyEnvConfig = (0, env_1.getEnvConfig)();
                    shouldInitHeavy = shouldInitHeavyEnvConfig.INIT_HEAVY_SUBSYSTEMS === true;
                    if (!shouldInitHeavy) {
                        console.log("[Simplified Startup] Heavy subsystems disabled (set INIT_HEAVY_SUBSYSTEMS=true to enable)");
                        console.log("[Simplified Startup] Core agents (LUCID, CANVAS, ROOT, ECHO) and Star Bridge are active ✅");
                    }
                    if (!shouldInitHeavy) return [3 /*break*/, 42];
                    try {
                        pslStatus = PredatorScavengerLoop.status();
                        console.log("\uD83E\uDD81 [Predator\u2013Scavenger Loop] Initialized - ".concat(pslStatus.decaySignals.length, " decay signals, ").concat(pslStatus.predatorActions.length, " predator actions, ").concat(pslStatus.scavengerActions.length, " scavenger actions"));
                        console.log("🌱 DreamNet is now a self-healing metabolic organism");
                    }
                    catch (error) {
                        console.warn("[Predator–Scavenger Loop] Initialization warning:", error);
                    }
                    // Initialize Dream Cortex - Tier III Subsystem (Global Intent + Goal Engine)
                    try {
                        // Seed core DreamNode for DreamNet stability
                        DreamCortex.upsertDream({
                            id: "dreamnet-core-stability",
                            name: "DreamNet Core Stability",
                            description: "Keep core routing, swarm, and infra in a healthy, non-crashing state.",
                            status: "active",
                            priority: "critical",
                            tags: ["infra", "routing", "health"],
                        });
                        cortexStatus = DreamCortex.status();
                        console.log("\uD83E\uDDE0 [Dream Cortex] Initialized - ".concat(cortexStatus.dreamCount, " dreams tracked, ").concat(cortexStatus.directiveCount, " directives synthesized"));
                    }
                    catch (error) {
                        console.warn("[Dream Cortex] Initialization warning:", error);
                    }
                    // Initialize Reputation Lattice - Tier III Subsystem (Trust Weave)
                    try {
                        repStatus = ReputationLattice.status();
                        console.log("\uD83D\uDD17 [Reputation Lattice] Initialized - ".concat(repStatus.entityCount, " entities, ").concat(repStatus.signalCount, " signals"));
                    }
                    catch (error) {
                        console.warn("[Reputation Lattice] Initialization warning:", error);
                    }
                    // Initialize Narrative Field - Tier III Subsystem (Global Story Stream)
                    try {
                        narrativeStatus = NarrativeField.status();
                        console.log("\uD83D\uDCD6 [Narrative Field] Initialized - ".concat(narrativeStatus.entryCount, " narrative entries"));
                        // TODO: Wire to API/UI endpoints for narrative access
                    }
                    catch (error) {
                        console.warn("[Narrative Field] Initialization warning:", error);
                    }
                    // Initialize Identity Grid - Tier III Subsystem (Wallet + Agent Identity Layer)
                    try {
                        // TODO: Replace with real wallet/user data when available
                        // Seed example wallet + user + agent relationship to prove graph works
                        IdentityGrid.upsertNode({
                            id: "wallet:example",
                            type: "wallet",
                            label: "Example Wallet",
                            chain: "base",
                            tags: ["demo"],
                        });
                        IdentityGrid.upsertNode({
                            id: "user:founder",
                            type: "user",
                            label: "Founder",
                            tags: ["core"],
                        });
                        IdentityGrid.addEdge({
                            id: "edge-wallet-owner",
                            fromId: "user:founder",
                            toId: "wallet:example",
                            linkType: "controls",
                            createdAt: Date.now(),
                        });
                        identityStatus = IdentityGrid.status();
                        console.log("\uD83C\uDD94 [Identity Grid] Initialized - ".concat(identityStatus.nodeCount, " nodes, ").concat(identityStatus.edgeCount, " edges"));
                    }
                    catch (error) {
                        console.warn("[Identity Grid] Initialization warning:", error);
                    }
                    // Initialize Dream Vault - Tier IV Subsystem (Central Repository: Filesystem + Library)
                    try {
                        // Seed core Vault items
                        DreamVault.upsertItem({
                            id: "blueprint:dreamnet-core",
                            kind: "blueprint",
                            state: "active",
                            title: "DreamNet Core Blueprint",
                            description: "High-level description of DreamNet OS, swarm systems, and tiers.",
                            content: "v1 core blueprint – to be expanded.",
                            tags: ["core", "architecture", "blueprint"],
                            links: [],
                            refs: [{ type: "dream", id: "dreamnet-core-stability", label: "Core Stability Dream" }],
                        });
                        DreamVault.upsertItem({
                            id: "template:zen-garden-ritual",
                            kind: "ritual",
                            state: "draft",
                            title: "Zen Garden Onboarding Ritual",
                            description: "Prototype flow for users planting their first dream seed.",
                            content: "Step-by-step ritual draft...",
                            tags: ["zen-garden", "onboarding", "ritual"],
                            links: [],
                            refs: [],
                        });
                        vaultStatus = DreamVault.status();
                        console.log("\uD83D\uDCDA [Dream Vault] Initialized - ".concat(vaultStatus.itemCount, " items, ").concat(vaultStatus.indexCount, " indexed"));
                    }
                    catch (error) {
                        console.warn("[Dream Vault] Initialization warning:", error);
                    }
                    // Initialize Dream Shop - Tier IV Subsystem (Marketplace Layer: Offer Engine)
                    try {
                        // Seed initial offers linked to DreamVault items
                        DreamShop.upsertOffer({
                            id: "offer:blueprint-dreamnet-core",
                            vaultItemId: "blueprint:dreamnet-core",
                            title: "DreamNet Core Blueprint (Founders' Edition)",
                            description: "Access to the core architecture blueprint and OS philosophy.",
                            category: "blueprint",
                            state: "listed",
                            price: {
                                kind: "token",
                                amount: 1,
                                currency: "SHEEP",
                                note: "Placeholder pricing – to be wired to real token rails later.",
                            },
                            tags: ["core", "architecture", "founders"],
                            trustHint: 0.9,
                            ownerIdentityId: "user:founder",
                        });
                        DreamShop.upsertOffer({
                            id: "offer:zen-garden-ritual",
                            vaultItemId: "template:zen-garden-ritual",
                            title: "Zen Garden Seed Ritual",
                            description: "Guided onboarding ritual to plant your first dream seed.",
                            category: "zen-garden",
                            state: "listed",
                            price: {
                                kind: "free",
                                note: "Free ritual to onboard new dreamers.",
                            },
                            tags: ["zen-garden", "onboarding", "ritual"],
                            trustHint: 0.8,
                            ownerIdentityId: "user:founder",
                        });
                        shopStatus = DreamShop.status();
                        console.log("\uD83D\uDED2 [Dream Shop] Initialized - ".concat(shopStatus.offerCount, " offers listed"));
                    }
                    catch (error) {
                        console.warn("[Dream Shop] Initialization warning:", error);
                    }
                    // Initialize Field Layer - Tier IV Subsystem (Global Parameter Fields: Invisible Physics)
                    try {
                        fieldStatus = FieldLayer.status();
                        console.log("\uD83C\uDF0A [Field Layer] Initialized - ".concat(fieldStatus.totalSamples, " field samples"));
                        // TODO: Other subsystems can sample fields for decision-making
                        // Example: const riskSample = FieldLayer.sample("risk", { kind: "service", id: "service:halo-loop" });
                    }
                    catch (error) {
                        console.warn("[Field Layer] Initialization warning:", error);
                    }
                    // Initialize DreamBet Core - Tier IV Subsystem (Games + Fairness Engine)
                    try {
                        // Seed demo games/rounds for testing
                        DreamBetCore.upsertGame({
                            id: "game:poker-demo",
                            type: "poker-table",
                            state: "active",
                            title: "Demo Poker Table",
                            players: [],
                            maxPlayers: 6,
                            ruleset: "demo-poker",
                        });
                        DreamBetCore.upsertRound({
                            id: "round:poker-demo-1",
                            gameId: "game:poker-demo",
                            index: 1,
                            state: "pending",
                            payload: { note: "Demo round payload" },
                        });
                        DreamBetCore.upsertGame({
                            id: "game:angel-slots-demo",
                            type: "angel-slots",
                            state: "active",
                            title: "Angel Slots Demo",
                            players: [],
                            ruleset: "demo-slots",
                        });
                        DreamBetCore.upsertRound({
                            id: "round:angel-slots-demo-1",
                            gameId: "game:angel-slots-demo",
                            index: 1,
                            state: "pending",
                            payload: { note: "Demo slots spin" },
                        });
                        betStatus = DreamBetCore.status();
                        console.log("\uD83C\uDFB2 [DreamBet Core] Initialized - ".concat(betStatus.gameCount, " games, ").concat(betStatus.roundCount, " rounds"));
                    }
                    catch (error) {
                        console.warn("[DreamBet Core] Initialization warning:", error);
                    }
                    // Initialize Zen Garden Core - Tier IV Subsystem (Ritual + Activity + Reward Engine)
                    try {
                        // Seed demo Zen session + activities
                        ZenGardenCore.upsertSession({
                            id: "zen-session:demo-1",
                            identityId: "user:founder",
                            state: "completed",
                            title: "Morning Meditation + Walk",
                            ritualVaultItemId: "template:zen-garden-ritual",
                            activityIds: [],
                            tags: ["demo", "morning"],
                        });
                        ZenGardenCore.upsertActivity({
                            id: "activity:demo-meditation",
                            sessionId: "zen-session:demo-1",
                            identityId: "user:founder",
                            kind: "meditation",
                            label: "Guided meditation",
                            durationMinutes: 20,
                            intensity: 0.7,
                            timestamp: Date.now(),
                        });
                        ZenGardenCore.upsertActivity({
                            id: "activity:demo-walk",
                            sessionId: "zen-session:demo-1",
                            identityId: "user:founder",
                            kind: "walk",
                            label: "Neighborhood walk",
                            durationMinutes: 25,
                            intensity: 0.6,
                            timestamp: Date.now(),
                        });
                        zenStatus = ZenGardenCore.status();
                        console.log("\uD83E\uDDD8 [Zen Garden Core] Initialized - ".concat(zenStatus.sessionCount, " sessions, ").concat(zenStatus.activityCount, " activities"));
                    }
                    catch (error) {
                        console.warn("[Zen Garden Core] Initialization warning:", error);
                    }
                    // Initialize Civic Panel Core - Tier IV Subsystem (Admin + Status Layer)
                    try {
                        // Seed initial safe refresh commands for testing
                        CivicPanelCore.enqueueCommand("refresh-vault", "Initial Vault Sync");
                        CivicPanelCore.enqueueCommand("refresh-fields", "Initial Field Refresh");
                        panelStatus = CivicPanelCore.status();
                        console.log("\uD83C\uDFDB\uFE0F [Civic Panel Core] Initialized - ".concat(panelStatus.widgetCount, " widgets, ").concat(panelStatus.commandCount, " commands"));
                    }
                    catch (error) {
                        console.warn("[Civic Panel Core] Initialization warning:", error);
                    }
                    // Initialize Dream Tank Core - Tier IV Subsystem (Incubator Engine)
                    try {
                        // Seed incubated dream with milestone
                        DreamTankCore.upsertDream({
                            id: "dreamnet-core-stability",
                            name: "DreamNet Core Stability",
                            description: "Keep core routing, swarm, and infra in a healthy, non-crashing state.",
                            stage: "seed",
                            health: "stable",
                            cortexDreamId: "dreamnet-core-stability",
                            vaultBlueprintId: "blueprint:dreamnet-core",
                            ownerIdentityId: "user:founder",
                            tags: ["core", "infra"],
                            priorityScore: 0.9,
                            trustScore: 0.8,
                            riskScore: 0.3,
                        });
                        DreamTankCore.upsertMilestone({
                            id: "milestone:dreamnet-core-1",
                            dreamId: "dreamnet-core-stability",
                            title: "Achieve stable multi-tier deployment",
                            description: "All Tier I–IV subsystems running with passing typecheck/build.",
                            state: "planned",
                            order: 1,
                        });
                        tankStatus = DreamTankCore.status();
                        console.log("\uD83D\uDC0B [Dream Tank Core] Initialized - ".concat(tankStatus.dreamCount, " dreams, ").concat(tankStatus.milestoneCount, " milestones"));
                    }
                    catch (error) {
                        console.warn("[Dream Tank Core] Initialization warning:", error);
                    }
                    _e.label = 9;
                case 9:
                    _e.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, EnvKeeperCore.init()];
                case 10:
                    envKeeperInitialized = _e.sent();
                    if (envKeeperInitialized) {
                        envStatus = EnvKeeperCore.status();
                        console.log("\uD83D\uDD10 [Env Keeper] ZERO-TOUCH mode initialized");
                        console.log("   \u2705 Auto-discovered ".concat(envStatus.totalVars, " environment variable(s)"));
                        console.log("   \uD83D\uDD12 ".concat(envStatus.secretsCount, " secret(s) protected"));
                        console.log("   \uD83D\uDCC1 Categories: ".concat(Object.keys(envStatus.categories).join(", ")));
                        console.log("   \uD83D\uDE80 Env vars are now auto-managed - no manual setup needed!");
                        // Start continuous sync cycle (runs every 10 minutes)
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, EnvKeeperCore.sync()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10 * 60 * 1000); // Every 10 minutes
                    }
                    else {
                        console.warn("\uD83D\uDD10 [Env Keeper] Initialization failed - continuing without auto-discovery");
                    }
                    return [3 /*break*/, 12];
                case 11:
                    error_5 = _e.sent();
                    console.warn("[Env Keeper] Initialization warning:", error_5.message || error_5);
                    return [3 /*break*/, 12];
                case 12:
                    // Initialize API Keeper - ZERO-TOUCH API Key Management (Runs Continuously)
                    try {
                        discoveredKeys = APIKeeperCore.forceDiscovery();
                        status_1 = APIKeeperCore.status();
                        console.log("\uD83D\uDD11 [API Keeper] ZERO-TOUCH mode initialized");
                        console.log("   \u2705 Auto-discovered ".concat(discoveredKeys.length, " API key(s) on startup"));
                        console.log("   \uD83D\uDCCA ".concat(status_1.providerCount, " providers, ").concat(status_1.keyCount, " keys total"));
                        console.log("   \uD83D\uDCB0 Cost today: $".concat(status_1.costToday.toFixed(2), ", this month: $").concat(status_1.costThisMonth.toFixed(2)));
                        console.log("   \uD83D\uDE80 Keys are now auto-managed - no manual setup needed!");
                        // Start continuous auto-discovery cycle (runs every 5 minutes)
                        setInterval(function () {
                            APIKeeperCore.run({
                                spiderWebCore: undefined,
                                dreamStateCore: undefined,
                                economicEngineCore: undefined,
                            });
                        }, 5 * 60 * 1000); // Every 5 minutes
                    }
                    catch (error) {
                        console.warn("[API Keeper] Initialization warning:", error);
                    }
                    // Initialize AI SEO - AUTO-SEO for ALL Content (Global, Zero-Touch)
                    try {
                        // Ensure default geofences
                        AISEOCore.ensureDefaultGeofences();
                        // Start continuous SEO cycle (runs every 10 minutes)
                        setInterval(function () {
                            AISEOCore.run({
                                spiderWebCore: undefined,
                                orcaPackCore: undefined,
                                whalePackCore: undefined,
                                narrativeField: undefined,
                                neuralMesh: undefined,
                            });
                        }, 10 * 60 * 1000); // Every 10 minutes
                        seoStatus = AISEOCore.status();
                        console.log("\uD83D\uDD0D [AI SEO] AUTO-SEO mode initialized (GLOBAL)");
                        console.log("   \u2705 SEO optimization applies to ALL content automatically");
                        console.log("   \uD83C\uDF0D Geofencing active: ".concat(seoStatus.geofenceCount, " geofences"));
                        console.log("   \uD83D\uDCCA ".concat(seoStatus.optimizationCount, " optimizations, ").concat(seoStatus.keywordCount, " keywords"));
                        console.log("   \uD83D\uDE80 Zero-touch SEO - no manual calls needed!");
                    }
                    catch (error) {
                        console.warn("[AI SEO] Initialization warning:", error);
                    }
                    _e.label = 13;
                case 13:
                    _e.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../packages/webhook-nervous-core"); })];
                case 14:
                    webhookModule = _e.sent();
                    WebhookNervousCore = webhookModule.WebhookNervousCore;
                    discoveredWebhooks = WebhookNervousCore.autoDiscoverWebhooks();
                    // Auto-create default security antibodies
                    WebhookNervousCore.autoCreateDefaultAntibodies();
                    // Start continuous maintenance cycle (runs every 5 minutes)
                    setInterval(function () {
                        WebhookNervousCore.runMaintenanceCycle();
                    }, 5 * 60 * 1000); // Every 5 minutes
                    webhookStatus = WebhookNervousCore.status();
                    console.log("\uD83E\uDDE0 [Webhook Nervous Core] ZERO-TOUCH mode initialized (BIOMIMETIC)");
                    console.log("   \u2705 Auto-discovered ".concat(discoveredWebhooks.length, " webhook(s)"));
                    console.log("   \uD83E\uDDE0 ".concat(webhookStatus.neurons.total, " neurons, ").concat(webhookStatus.synapses.total, " synapses"));
                    console.log("   \uD83D\uDEE1\uFE0F  ".concat(webhookStatus.immuneSystem.antibodies, " antibodies, ").concat(webhookStatus.immuneSystem.memoryCells, " memory cells"));
                    console.log("   \uD83C\uDF44 ".concat(webhookStatus.mycelium.networks, " networks, ").concat(webhookStatus.mycelium.totalHyphae, " paths"));
                    console.log("   \uD83D\uDC1C ".concat(webhookStatus.antColony.pheromoneTrails, " pheromone trails active"));
                    console.log("   \uD83D\uDE80 Zero-touch webhooks - auto-discovered, auto-managed, auto-secured!");
                    return [3 /*break*/, 16];
                case 15:
                    error_6 = _e.sent();
                    console.warn("[Webhook Nervous Core] Initialization warning:", error_6);
                    return [3 /*break*/, 16];
                case 16:
                    _e.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../packages/jaggy-core"); })];
                case 17:
                    jaggyModule = _e.sent();
                    JaggyCore = jaggyModule.JaggyCore;
                    JaggyCore.init();
                    // Jaggy watches the mesh automatically
                    // Every event that hits the mesh triggers Jaggy to hunt for webhooks
                    // Start prowling territories (runs every 10 minutes)
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, JaggyCore.prowlTerritories()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 10 * 60 * 1000); // Every 10 minutes
                    jaggyStatus = JaggyCore.status();
                    console.log("\uD83D\uDC31 [Jaggy] The Silent Sentinel is active");
                    console.log("   \uD83E\uDD77 Stealth: ".concat(jaggyStatus.stealthLevel, "/100 | Independence: ").concat(jaggyStatus.independence, "/100"));
                    console.log("   \uD83D\uDC51 Base Fame: ".concat(jaggyStatus.baseFame.toFixed(1), "/100"));
                    console.log("   \uD83C\uDFAF Status: ".concat(jaggyStatus.status, " | Kills: ").concat(jaggyStatus.kills));
                    console.log("   \uD83D\uDC3E Watching ".concat(jaggyStatus.territories.length, " territories"));
                    console.log("   \uD83D\uDD0D Auto-hunting webhooks when events hit the mesh");
                    console.log("   \uD83D\uDE80 Jaggy works alone, answers to few, moves silently");
                    return [3 /*break*/, 19];
                case 18:
                    error_7 = _e.sent();
                    console.warn("[Jaggy] Initialization warning:", error_7);
                    return [3 /*break*/, 19];
                case 19:
                    _e.trys.push([19, 22, , 23]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/shield-core"); })];
                case 20:
                    shieldModule = _e.sent();
                    currentShieldCore_1 = shieldModule.ShieldCore;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/spider-web-core"); })];
                case 21:
                    spiderModule = _e.sent();
                    currentSpiderWebCore = spiderModule.SpiderWebCore;
                    // Ensure shield phases exist
                    currentShieldCore_1.ensureShieldPhases();
                    console.log("\uD83D\uDEE1\uFE0F  [Shield Core] Shield phases initialized");
                    // Ensure modulators and emitters
                    currentShieldCore_1.ensureDefaultModulators();
                    currentShieldCore_1.ensureDefaultEmitters();
                    console.log("\uD83D\uDEE1\uFE0F  [Shield Core] Modulators and emitters initialized");
                    shieldCtx_1 = {
                        spiderWebCore: currentSpiderWebCore,
                        neuralMesh: undefined,
                        narrativeField: undefined,
                        dreamNetOSCore: DreamNetOSCore,
                        eventWormholes: undefined, // Will be connected when available
                    };
                    shieldStatus = currentShieldCore_1.run(shieldCtx_1);
                    console.log("\uD83D\uDEE1\uFE0F  [Shield Core] Initial shield cycle complete");
                    console.log("   \uD83D\uDEE1\uFE0F  Shield Health: ".concat(shieldStatus.shieldHealth.toUpperCase()));
                    console.log("   \uD83D\uDCCA Integrity: ".concat((shieldStatus.overallIntegrity * 100).toFixed(1), "%"));
                    console.log("   \uD83D\uDD04 Active Layers: ".concat(shieldStatus.activeLayers, "/").concat(shieldStatus.totalLayers));
                    console.log("   \u26A0\uFE0F  Threats Detected: ".concat(shieldStatus.threatsDetected, " | Blocked: ").concat(shieldStatus.threatsBlocked));
                    console.log("   \u26A1 Spikes Fired: ".concat(shieldStatus.spikesFired));
                    // Start continuous shield cycle (runs every 30 seconds)
                    setInterval(function () {
                        currentShieldCore_1.run(shieldCtx_1);
                    }, 30 * 1000); // Every 30 seconds
                    // Rotate frequencies periodically (every 5 minutes)
                    setInterval(function () {
                        currentShieldCore_1.rotateFrequencies();
                        console.log("\uD83D\uDEE1\uFE0F  [Shield Core] Frequencies rotated");
                    }, 5 * 60 * 1000); // Every 5 minutes
                    console.log("\uD83D\uDEE1\uFE0F  [Shield Core] Continuous protection active - 24/7 shield coverage");
                    // Store for later use
                    ShieldCore = currentShieldCore_1;
                    SpiderWebCore = currentSpiderWebCore;
                    return [3 /*break*/, 23];
                case 22:
                    error_8 = _e.sent();
                    console.warn("[Shield Core] Initialization warning:", error_8);
                    return [3 /*break*/, 23];
                case 23:
                    _e.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/orca-pack-core"); })];
                case 24:
                    orcaModule = _e.sent();
                    OrcaPackCoreInstance = orcaModule.OrcaPackCore;
                    // Start continuous Orca Pack cycle (runs every 15 minutes)
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, OrcaPackCoreInstance.run({
                                        spiderWebCore: SpiderWebCore,
                                        narrativeField: NarrativeField,
                                        neuralMesh: NeuralMesh,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 15 * 60 * 1000); // Every 15 minutes
                    orcaStatus = OrcaPackCoreInstance.status();
                    console.log("\uD83D\uDC0B [Orca Pack Core] Initialized - ".concat(orcaStatus.themeCount, " themes, ").concat(orcaStatus.ideaCount, " ideas, ").concat(orcaStatus.planCount, " plans"));
                    console.log("   \uD83D\uDCE2 Communications & narrative management active");
                    return [3 /*break*/, 26];
                case 25:
                    error_9 = _e.sent();
                    console.warn("[Orca Pack Core] Initialization warning:", error_9);
                    return [3 /*break*/, 26];
                case 26:
                    _e.trys.push([26, 28, , 29]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/whale-pack-core"); })];
                case 27:
                    whaleModule = _e.sent();
                    WhalePackCoreInstance = whaleModule.WhalePackCore;
                    // Start continuous Whale Pack cycle (runs every 20 minutes)
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, WhalePackCoreInstance.run({
                                        spiderWebCore: SpiderWebCore,
                                        dreamShop: DreamShop,
                                        economicEngineCore: EconomicEngineCore,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 20 * 60 * 1000); // Every 20 minutes
                    whaleStatus = WhalePackCoreInstance.status();
                    console.log("\uD83D\uDC33 [Whale Pack Core] Initialized - ".concat(whaleStatus.productCount, " products, ").concat(whaleStatus.audienceCount, " audiences, ").concat(whaleStatus.planCount, " plans"));
                    console.log("   \uD83D\uDCBC Commerce & product management active");
                    return [3 /*break*/, 29];
                case 28:
                    error_10 = _e.sent();
                    console.warn("[Whale Pack Core] Initialization warning:", error_10);
                    return [3 /*break*/, 29];
                case 29:
                    _e.trys.push([29, 32, , 33]);
                    if (!!SpiderWebCore) return [3 /*break*/, 31];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/spider-web-core"); })];
                case 30:
                    spiderModule = _e.sent();
                    SpiderWebCore = spiderModule.SpiderWebCore;
                    _e.label = 31;
                case 31:
                    // Ensure default sensors and templates
                    SpiderWebCore.ensureDefaultSensors();
                    SpiderWebCore.ensureDefaultTemplates();
                    // Start continuous Spider Web cycle (runs every 30 seconds)
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, SpiderWebCore.run({
                                        wolfPackCore: WolfPackFundingCore,
                                        whalePackCore: WhalePackCoreInstance,
                                        orcaPackCore: OrcaPackCoreInstance,
                                        dreamStateCore: DreamStateCoreInstance,
                                        dreamNetOSCore: DreamNetOSCore,
                                        narrativeField: NarrativeField,
                                        dataVaultCore: DreamVault,
                                        neuralMesh: NeuralMesh,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 30 * 1000); // Every 30 seconds
                    spiderStatus = SpiderWebCore.status();
                    console.log("\uD83D\uDD78\uFE0F  [Spider Web Core] Initialized - ".concat(spiderStatus.threadCount, " threads, ").concat(spiderStatus.templateCount, " templates"));
                    console.log("   \uD83E\uDEB0 Fly-catching & event threading active");
                    return [3 /*break*/, 33];
                case 32:
                    error_11 = _e.sent();
                    console.warn("[Spider Web Core] Initialization warning:", error_11);
                    return [3 /*break*/, 33];
                case 33:
                    _e.trys.push([33, 35, , 36]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/wolfpack-analyst-core"); })];
                case 34:
                    analystModule = _e.sent();
                    WolfPackAnalystCore_1 = analystModule.WolfPackAnalystCore || analystModule.default;
                    if (WolfPackAnalystCore_1 && WolfPackAnalystCore_1.run) {
                        // Start continuous Analyst cycle (runs every 10 minutes)
                        setInterval(function () {
                            WolfPackAnalystCore_1.run({
                                wolfPackFundingCore: WolfPackFundingCore,
                                neuralMesh: NeuralMesh,
                            });
                        }, 10 * 60 * 1000); // Every 10 minutes
                        analystStatus = WolfPackAnalystCore_1.status();
                        console.log("\uD83D\uDC3A\uD83D\uDCCA [Wolf Pack Analyst Core] Initialized - ".concat(analystStatus.patternCount || 0, " patterns, ").concat(analystStatus.insightCount || 0, " insights"));
                        console.log("   \uD83D\uDD0D Pattern learning & lead analysis active");
                    }
                    else {
                        console.log("\uD83D\uDC3A\uD83D\uDCCA [Wolf Pack Analyst Core] Available but not initialized (no run method)");
                    }
                    return [3 /*break*/, 36];
                case 35:
                    error_12 = _e.sent();
                    console.warn("[Wolf Pack Analyst Core] Initialization warning:", error_12);
                    return [3 /*break*/, 36];
                case 36:
                    _e.trys.push([36, 38, , 39]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/wolfpack-mailer-core"); })];
                case 37:
                    WolfPackMailerCore_1 = (_e.sent()).WolfPackMailerCore;
                    // Start continuous mailer cycle (runs every 1 minute)
                    setInterval(function () {
                        WolfPackMailerCore_1.processSendQueueOnce();
                    }, 60 * 1000); // Every 1 minute
                    console.log("\uD83D\uDCE7 [Wolf Pack Mailer Core] Initialized");
                    console.log("   \uD83D\uDCEC Email queue processing active (every 1 minute)");
                    return [3 /*break*/, 39];
                case 38:
                    error_13 = _e.sent();
                    console.warn("[Wolf Pack Mailer Core] Initialization warning:", error_13);
                    return [3 /*break*/, 39];
                case 39:
                    _e.trys.push([39, 41, , 42]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/runtime-bridge-core"); })];
                case 40:
                    RuntimeBridgeCore = (_e.sent()).RuntimeBridgeCore;
                    // Initialize runtime context
                    RuntimeBridgeCore.initContext({
                        DreamVault: DreamVault,
                        DreamShop: DreamShop,
                        NeuralMesh: NeuralMesh,
                    });
                    // Start runtime loop (runs every 30 seconds)
                    RuntimeBridgeCore.startLoop(30 * 1000);
                    runtimeStatus = RuntimeBridgeCore.getStatus();
                    console.log("\uD83C\uDF09 [Runtime Bridge Core] Initialized");
                    console.log("   \u2699\uFE0F  Runtime context & cycle management active");
                    return [3 /*break*/, 42];
                case 41:
                    error_14 = _e.sent();
                    console.warn("[Runtime Bridge Core] Initialization warning:", error_14);
                    return [3 /*break*/, 42];
                case 42:
                    if (!shouldInitHeavy) return [3 /*break*/, 84];
                    _e.label = 43;
                case 43:
                    _e.trys.push([43, 45, , 46]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/orchestrator-core"); })];
                case 44:
                    OrchestratorCore = (_e.sent()).OrchestratorCore;
                    // Start orchestrator loop (runs every 60 seconds)
                    OrchestratorCore.startIntervalLoop({
                        DreamVault: DreamVault,
                        DreamShop: DreamShop,
                        NeuralMesh: NeuralMesh,
                    }, 60 * 1000);
                    orchestratorStatus = OrchestratorCore.getStatus();
                    console.log("\uD83D\uDD04 [Orchestrator Core] Initialized - ".concat(orchestratorStatus.totalCycles || 0, " cycles"));
                    console.log("   \uD83C\uDFAF System orchestration active");
                    return [3 /*break*/, 46];
                case 45:
                    error_15 = _e.sent();
                    console.warn("[Orchestrator Core] Initialization warning:", error_15);
                    return [3 /*break*/, 46];
                case 46:
                    // Initialize Liquidity Engine - Tier IV Subsystem (Liquidity Pool Registry: Structure Only, No Seeding)
                    try {
                        // Initialize pool configs (DREAM/SHEEP vs AERO, ETH, USDT)
                        LiquidityEngine.initConfigs();
                        liquidityStatus = LiquidityEngine.status();
                        console.log("\uD83D\uDCA7 [Liquidity Engine] Initialized - ".concat(liquidityStatus.poolCount, " pools (").concat(liquidityStatus.plannedCount, " planned, ").concat(liquidityStatus.deployedCount, " deployed, ").concat(liquidityStatus.activeCount, " active)"));
                    }
                    catch (error) {
                        console.warn("[Liquidity Engine] Initialization warning:", error);
                    }
                    // Initialize Social Hub Core - Tier IV Subsystem (Social Feed + Posts Layer)
                    try {
                        // Seed demo posts for testing
                        SocialHubCore.createPost({
                            authorIdentityId: "user:founder",
                            kind: "text",
                            visibility: "public",
                            text: "Welcome to DreamNet. This is our living organism on Base.",
                            tags: ["intro", "dreamnet"],
                            refs: [{ type: "dream", id: "dreamnet-core-stability", label: "DreamNet Core" }],
                        });
                        SocialHubCore.createPost({
                            authorIdentityId: "system:dreamnet",
                            kind: "system",
                            visibility: "public",
                            text: "Tier IV subsystems online: Vault, Shop, Zen Garden, DreamBet, Dream Tank, Liquidity, Civic Panel.",
                            tags: ["system", "status"],
                        });
                        socialStatus = SocialHubCore.status();
                        console.log("\uD83D\uDCF1 [Social Hub Core] Initialized - ".concat(socialStatus.postCount, " posts, ").concat(socialStatus.commentCount, " comments, ").concat(socialStatus.reactionCount, " reactions"));
                    }
                    catch (error) {
                        console.warn("[Social Hub Core] Initialization warning:", error);
                    }
                    // Initialize Init & Ritual Core - Tier IV Subsystem (Onboarding + Initialization Layer)
                    try {
                        // Seed default init template
                        InitRitualCore.ensureDefaultTemplateSeeded();
                        initState = InitRitualCore.getOrCreateIdentityState("user:founder");
                        _a = InitRitualCore.advanceIdentity({}, "user:founder"), state = _a.state, nextStep = _a.nextStep;
                        initStatus = InitRitualCore.status();
                        console.log("\uD83C\uDF31 [Init & Ritual Core] Initialized - ".concat(initStatus.templateCount, " templates, ").concat(initStatus.activeIdentityCount, " active identities (").concat(initStatus.completedCount, " completed)"));
                    }
                    catch (error) {
                        console.warn("[Init & Ritual Core] Initialization warning:", error);
                    }
                    // Initialize Economic Engine Core - Tier IV Subsystem (Rewards + Tokens Layer)
                    try {
                        // Seed default token configs and emission rules
                        EconomicEngineCore.ensureDefaultConfigSeeded();
                        raw = EconomicEngineCore.recordRawReward({
                            identityId: "user:founder",
                            source: "zen-garden",
                            kind: "activity",
                            baseValue: 30,
                            meta: { note: "Demo zen session (30 minutes)" },
                        });
                        applied = EconomicEngineCore.applyEmissionForReward(raw);
                        econStatus = EconomicEngineCore.status();
                        console.log("\uD83D\uDCB0 [Economic Engine Core] Initialized - ".concat(econStatus.tokenCount, " tokens, ").concat(econStatus.emissionRuleCount, " emission rules, ").concat(econStatus.balanceCount, " balances, ").concat(econStatus.appliedRewardCount, " applied rewards"));
                    }
                    catch (error) {
                        console.warn("[Economic Engine Core] Initialization warning:", error);
                    }
                    // Initialize Agent Registry Core - Tier IV Subsystem (Agent Store + Health Layer)
                    try {
                        // Seed default agent configs
                        AgentRegistryCore.ensureDefaultAgentsSeeded();
                        agentStatus = AgentRegistryCore.status();
                        console.log("\uD83E\uDD16 [Agent Registry Core] Initialized - ".concat(agentStatus.agentCount, " agents registered (active=").concat(agentStatus.activeCount, ", degraded=").concat(agentStatus.degradedCount, ", error=").concat(agentStatus.errorCount, ")"));
                    }
                    catch (error) {
                        console.warn("[Agent Registry Core] Initialization warning:", error);
                    }
                    _e.label = 47;
                case 47:
                    _e.trys.push([47, 74, , 75]);
                    if (!(typeof global !== "undefined")) return [3 /*break*/, 54];
                    _e.label = 48;
                case 48:
                    _e.trys.push([48, 53, , 54]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../lib/dreamkeeperCore"); })];
                case 49:
                    DREAMKEEPER_CORE = (_e.sent()).DREAMKEEPER_CORE;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../lib/defenseBots"); })];
                case 50:
                    DreamDefenseNet = (_e.sent()).DreamDefenseNet;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../lib/aiSurgeonAgents"); })];
                case 51:
                    SurgeonAgent = (_e.sent()).SurgeonAgent;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../lib/evolutionEngine"); })];
                case 52:
                    EvolutionEngine = (_e.sent()).EvolutionEngine;
                    global.DREAMKEEPER_CORE = DREAMKEEPER_CORE;
                    global.DreamDefenseNet = DreamDefenseNet;
                    global.SurgeonAgent = SurgeonAgent;
                    global.EvolutionEngine = EvolutionEngine;
                    return [3 /*break*/, 54];
                case 53:
                    error_16 = _e.sent();
                    return [3 /*break*/, 54];
                case 54:
                    osStatus = DreamNetOSCore.run({
                        dreamVault: DreamVault,
                        dreamShop: DreamShop,
                        fieldLayer: FieldLayer,
                        dreamBetCore: DreamBetCore,
                        zenGardenCore: ZenGardenCore,
                        civicPanelCore: CivicPanelCore,
                        dreamTankCore: DreamTankCore,
                        liquidityEngine: LiquidityEngine,
                        socialHubCore: SocialHubCore,
                        initRitualCore: InitRitualCore,
                        economicEngineCore: EconomicEngineCore,
                        agentRegistryCore: AgentRegistryCore,
                        apiKeeperCore: APIKeeperCore,
                        aiSeoCore: AISEOCore,
                        shieldCore: ShieldCore,
                        wolfPackFundingCore: WolfPackFundingCore,
                        dreamStateCore: DreamStateCoreInstance,
                        spiderWebCore: SpiderWebCore,
                        neuralMesh: NeuralMesh,
                        starBridgeLungs: StarBridgeLungs,
                        webhookNervousCore: WebhookNervousCore,
                        jaggyCore: JaggyCore,
                        dreamSnailCore: DreamSnailCore,
                    });
                    snapshot = osStatus.snapshot;
                    console.log("\uD83D\uDDA5\uFE0F  [DreamNet OS Core] Initialized - Version ".concat(snapshot.version.major, ".").concat(snapshot.version.minor, ".").concat(snapshot.version.patch, " (").concat(snapshot.version.label, ")"));
                    console.log("   \uD83D\uDC93 Heartbeat active - ".concat(snapshot.subsystems.length, " subsystems monitored"));
                    console.log("   \uD83D\uDCCA Health: Infra=".concat((snapshot.globalHealth.infraHealth * 100).toFixed(0), "%, Economy=").concat((snapshot.globalHealth.economyHealth * 100).toFixed(0), "%, Social=").concat((snapshot.globalHealth.socialHealth * 100).toFixed(0), "%, Pipeline=").concat((snapshot.globalHealth.dreamPipelineHealth * 100).toFixed(0), "%"));
                    _e.label = 55;
                case 55:
                    _e.trys.push([55, 58, , 59]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/dreamnet-os-core/logic/alertNotifier"); })];
                case 56:
                    registerAlertNotifier = (_e.sent()).registerAlertNotifier;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./notification-engine"); })];
                case 57:
                    notificationEngine_1 = (_e.sent()).notificationEngine;
                    registerAlertNotifier(function (alert) { return __awaiter(_this, void 0, void 0, function () {
                        var error_24;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    // Send notification to admin/system wallet
                                    return [4 /*yield*/, notificationEngine_1.createNotification({
                                            recipientWallet: "system:admin", // Or get from config
                                            type: alert.severity === "critical" ? "system_alert" : "system_warning",
                                            title: "".concat(alert.subsystem || "System", " Alert"),
                                            message: alert.message,
                                            data: {
                                                alertId: alert.id,
                                                subsystem: alert.subsystem,
                                                severity: alert.severity,
                                                details: alert.details,
                                            },
                                        }, true)];
                                case 1:
                                    // Send notification to admin/system wallet
                                    _a.sent(); // Send email
                                    console.log("\uD83D\uDCEC [AlertNotifier] Sent notification for ".concat(alert.severity, " alert: ").concat(alert.message));
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_24 = _a.sent();
                                    console.error("[AlertNotifier] Failed to send notification:", error_24);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 59];
                case 58:
                    error_17 = _e.sent();
                    return [3 /*break*/, 59];
                case 59:
                    _e.trys.push([59, 62, , 63]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../packages/dreamnet-voice-twilio"); })];
                case 60:
                    voiceModule = _e.sent();
                    DreamNetVoiceTwilio = voiceModule.DreamNetVoiceTwilio;
                    return [4 /*yield*/, DreamNetVoiceTwilio.init()];
                case 61:
                    voiceInitialized = _e.sent();
                    if (voiceInitialized) {
                        console.log("\uD83D\uDCF1 [DreamNet Voice] Initialized - Twilio SMS active");
                        console.log("   \uD83D\uDDE3\uFE0F  DreamNet can now speak via SMS");
                    }
                    else {
                        console.warn("\uD83D\uDCF1 [DreamNet Voice] Not initialized - Twilio credentials not found");
                        console.warn("   \uD83D\uDCA1 Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and DREAMNET_VOICE_RECIPIENT env vars");
                    }
                    return [3 /*break*/, 63];
                case 62:
                    error_18 = _e.sent();
                    console.warn("[DreamNet Voice] Initialization warning:", error_18.message);
                    return [3 /*break*/, 63];
                case 63:
                    _e.trys.push([63, 69, , 70]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../packages/dreamnet-vercel-agent"); })];
                case 64:
                    vercelModule = _e.sent();
                    DreamNetVercelAgent = vercelModule.DreamNetVercelAgent;
                    return [4 /*yield*/, DreamNetVercelAgent.init()];
                case 65:
                    vercelInitialized = _e.sent();
                    if (!vercelInitialized) return [3 /*break*/, 67];
                    console.log("\uD83D\uDE80 [Vercel Agent] Initialized - Ready to manage deployments");
                    return [4 /*yield*/, DreamNetVercelAgent.status()];
                case 66:
                    status_2 = _e.sent();
                    console.log("   \uD83D\uDCE6 ".concat(status_2.projectsFound, " projects found"));
                    return [3 /*break*/, 68];
                case 67:
                    console.warn("\uD83D\uDE80 [Vercel Agent] Not initialized - Vercel token not found");
                    console.warn("   \uD83D\uDCA1 Set VERCEL_TOKEN env var or add via API Keeper");
                    _e.label = 68;
                case 68: return [3 /*break*/, 70];
                case 69:
                    error_19 = _e.sent();
                    console.warn("[Vercel Agent] Initialization warning:", error_19.message);
                    return [3 /*break*/, 70];
                case 70:
                    _e.trys.push([70, 72, , 73]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../packages/dreamnet-snail-core"); })];
                case 71:
                    snailModule = _e.sent();
                    DreamSnailCore = snailModule.DreamSnailCore;
                    // DreamSnailCore may not need explicit initialization, but we ensure it's loaded
                    console.log("\uD83D\uDC0C [DreamSnail Core] Loaded - Privacy Lattice available");
                    return [3 /*break*/, 73];
                case 72:
                    error_20 = _e.sent();
                    console.warn("[DreamSnail Core] Initialization warning:", error_20.message);
                    return [3 /*break*/, 73];
                case 73:
                    // Start continuous heartbeat (runs every 30 seconds)
                    setInterval(function () {
                        DreamNetOSCore.run({
                            dreamVault: DreamVault,
                            dreamShop: DreamShop,
                            fieldLayer: FieldLayer,
                            dreamBetCore: DreamBetCore,
                            zenGardenCore: ZenGardenCore,
                            civicPanelCore: CivicPanelCore,
                            dreamTankCore: DreamTankCore,
                            liquidityEngine: LiquidityEngine,
                            socialHubCore: SocialHubCore,
                            initRitualCore: InitRitualCore,
                            economicEngineCore: EconomicEngineCore,
                            agentRegistryCore: AgentRegistryCore,
                            apiKeeperCore: APIKeeperCore,
                            aiSeoCore: AISEOCore,
                            shieldCore: ShieldCore,
                            wolfPackFundingCore: WolfPackFundingCore,
                            dreamStateCore: DreamStateCoreInstance,
                            spiderWebCore: SpiderWebCore,
                            neuralMesh: NeuralMesh,
                            starBridgeLungs: StarBridgeLungs,
                            webhookNervousCore: WebhookNervousCore,
                            jaggyCore: JaggyCore,
                            dreamSnailCore: DreamSnailCore,
                        });
                    }, 30 * 1000); // Every 30 seconds
                    return [3 /*break*/, 75];
                case 74:
                    error_21 = _e.sent();
                    console.warn("[DreamNet OS Core] Initialization warning:", error_21);
                    return [3 /*break*/, 75];
                case 75:
                    console.log("🧬 [Instant Mesh] Agent hybridization enabled");
                    console.log("🔨 [Foundry] All agents connected - ready to build");
                    console.log("📱 [Social Media Ops] CampaignMasterAgent ready for activation");
                    console.log("🐌 [Dream Snail] Privacy layer active - Know-All Win-All mode");
                    console.log("🌿 [Biomimetic Systems] All systems online");
                    _e.label = 76;
                case 76:
                    _e.trys.push([76, 82, , 83]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@dreamnet/halo-loop"); })];
                case 77:
                    _b = _e.sent(), registerHaloLoopFn = _b.registerHaloLoop, haloTriggersObj = _b.haloTriggers;
                    registerHaloLoopFn();
                    haloTriggers = haloTriggersObj || {};
                    _e.label = 78;
                case 78:
                    _e.trys.push([78, 80, , 81]);
                    return [4 /*yield*/, loadLegacyLoader()];
                case 79:
                    legacyReq = _e.sent();
                    legacySeedModule = legacyReq("seed-dreams");
                    (_c = legacySeedModule === null || legacySeedModule === void 0 ? void 0 : legacySeedModule.seedDreams) === null || _c === void 0 ? void 0 : _c.call(legacySeedModule).catch(function (err) { return console.error("Failed to seed dreams:", err); });
                    legacyDreamScoreEngine = legacyReq("dream-score-engine");
                    return [3 /*break*/, 81];
                case 80:
                    error_22 = _e.sent();
                    console.warn("[Legacy] Failed to load legacy modules:", error_22);
                    return [3 /*break*/, 81];
                case 81:
                    (_d = legacyDreamScoreEngine === null || legacyDreamScoreEngine === void 0 ? void 0 : legacyDreamScoreEngine.startScheduledScoring) === null || _d === void 0 ? void 0 : _d.call(legacyDreamScoreEngine);
                    envConfig_1 = (0, env_1.getEnvConfig)();
                    if (envConfig_1.MESH_AUTOSTART) {
                        (0, index_js_1.startMesh)().catch(function (error) {
                            return console.error("Failed to start DreamNet mesh:", error.message);
                        });
                    }
                    return [3 /*break*/, 83];
                case 82:
                    error_23 = _e.sent();
                    console.warn("[Legacy Seeding] Initialization warning:", error_23);
                    return [3 /*break*/, 83];
                case 83:
                    subsystemsReady = true;
                    console.log("[Optional Subsystems] Initialization complete");
                    _e.label = 84;
                case 84:
                    // Heartbeat API routes
                    app.use("/api/heartbeat", heartbeat_1.default);
                    // Jaggy API routes (The Silent Sentinel)
                    app.use("/api/jaggy", jaggy_1.default);
                    // Shield Core API routes
                    app.use("/api/shield", shield_1.default);
                    // Star Bridge Lungs API routes
                    app.use("/api/star-bridge", star_bridge_1.default);
                    // Control Plane API routes (kill-switch, rate limits)
                    app.use("/api/control", control_1.default);
                    // Billable Actions API routes (two-phase commit)
                    app.use("/api/billable", billable_1.default);
                    app.use("/api/health", health_1.default);
                    // Note: /health endpoint is already defined above (line 205) with DB health check
                    app.use("/api/nerve", nerve_1.default);
                    app.use("/api/audit", audit_1.default);
                    app.use("/api/rbac", rbac_1.default);
                    // Voice API routes (Phase 2 - One Mouth)
                    app.use("/api/voice", voice_1.default);
                    app.use("/api/keys", api_keys_1.default);
                    app.use("/api/env-keeper", env_keeper_1.default);
                    // Vercel Agent API routes
                    app.use("/api/vercel", vercel_1.default);
                    // Debug summary endpoint (admin-only)
                    app.use("/api/debug-summary", debug_summary_1.default);
                    // Agent Gateway - AI-native ingress for ChatGPT, Cursor, Replit agents
                    app.use("/api", agent_gateway_1.default);
                    // Ports Ops Panel - Port health + Env/API/Vercel ops (admin-only)
                    app.use("/api", ports_ops_1.default);
                    // Agent Ops Panel - Agent activity tracking (admin-only)
                    app.use("/api", agent_ops_1.default);
                    // Shield Risk Panel - Risk profiles and adaptive decisions (admin-only)
                    app.use("/api", shield_risk_1.default);
                    // Dead-Letter Buffer - Quarantine for critical conduit failures (admin-only)
                    app.use("/api", dead_letter_1.default);
                    // Grid Lines API - Conduit heat metrics for DreamScope visualization (admin-only)
                    app.use("/api", grid_lines_1.default);
                    // Directory API - Entity discovery and lookup (admin-only)
                    app.use("/api", directory_1.default);
                    // Networks API - Network blueprint information and bootstrap status (admin-only)
                    app.use("/api", networks_1.default);
                    // Discovery API - Network discovery and mapping (admin-only)
                    app.use("/api", discovery_1.default);
                    // System Graph API - Internal topology inspection (ports, routes, wormholes)
                    app.get("/api/system/graph", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var getSystemSnapshot, snapshot, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./system/graph"); })];
                                case 1:
                                    getSystemSnapshot = (_a.sent()).getSystemSnapshot;
                                    return [4 /*yield*/, getSystemSnapshot()];
                                case 2:
                                    snapshot = _a.sent();
                                    res.json(snapshot);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    console.error("Failed to build system graph:", err_1);
                                    res.status(500).json({ message: "Failed to build system graph" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    // ChatGPT Agent Mode - Natural Language Interface (routes through AGENT_GATEWAY)
                    app.use("/api/chatgpt-agent", chatgpt_agent_1.default);
                    app.use("/api", (0, operator_1.createOperatorRouter)());
                    app.use("/api/whale", whale_1.default);
                    app.use("/api/onboarding", onboarding_1.default);
                    // Self-Managing DreamNet routes (meta!)
                    import selfManageRouter from "./routes/self-manage";
                    app.use("/api/self-manage", self_manage_1.default);
                    app.use(function (req, res, next) {
                        var start = Date.now();
                        var path = req.path;
                        var capturedJsonResponse = undefined;
                        var originalResJson = res.json;
                        res.json = function (bodyJson) {
                            var args = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                args[_i - 1] = arguments[_i];
                            }
                            capturedJsonResponse = bodyJson;
                            return originalResJson.apply(res, __spreadArray([bodyJson], args, true));
                        };
                        res.on("finish", function () {
                            var duration = Date.now() - start;
                            if (path.startsWith("/api")) {
                                var logLine = "".concat(req.method, " ").concat(path, " ").concat(res.statusCode, " in ").concat(duration, "ms");
                                if (capturedJsonResponse) {
                                    logLine += " :: ".concat(JSON.stringify(capturedJsonResponse));
                                }
                                if (logLine.length > 80) {
                                    logLine = logLine.slice(0, 79) + "…";
                                }
                                log(logLine);
                            }
                        });
                        next();
                    });
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var executeSafeBoot, bootResult, error_25, routesModule, error_26, server, viteModule, error_27, port, host;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./core/safe-boot"); })];
                                case 1:
                                    executeSafeBoot = (_a.sent()).executeSafeBoot;
                                    console.log('🚀 [Safe Boot] Starting health-gated boot sequence...');
                                    return [4 /*yield*/, executeSafeBoot()];
                                case 2:
                                    bootResult = _a.sent();
                                    if (!bootResult.success) {
                                        console.error("\u274C [Safe Boot] Boot failed at step: ".concat(bootResult.failedAt));
                                        console.error('   Boot sequence results:', bootResult.steps);
                                        // Don't exit - allow graceful degradation
                                    }
                                    else {
                                        console.log('✅ [Safe Boot] Boot sequence completed successfully');
                                        console.log("   Total duration: ".concat(bootResult.totalDuration, "ms"));
                                        bootResult.steps.forEach(function (step) {
                                            var status = step.success ? '✅' : '⚠️';
                                            console.log("   ".concat(status, " ").concat(step.step, " (").concat(step.duration, "ms)"));
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_25 = _a.sent();
                                    console.warn('[Safe Boot] Boot sequence error (continuing):', error_25.message);
                                    return [3 /*break*/, 4];
                                case 4:
                                    _a.trys.push([4, 6, , 7]);
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./routes"); })];
                                case 5:
                                    routesModule = _a.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_26 = _a.sent();
                                    console.error("[Server] Failed to import routes module:", error_26.message);
                                    throw new Error("Failed to load routes module: ".concat(error_26.message));
                                case 7:
                                    if (!(routesModule === null || routesModule === void 0 ? void 0 : routesModule.registerRoutes)) {
                                        throw new Error("Routes module does not export registerRoutes. Cannot start DreamNet server.");
                                    }
                                    return [4 /*yield*/, routesModule.registerRoutes(app)];
                                case 8:
                                    server = _a.sent();
                                    app.use(function (err, _req, res, _next) {
                                        var _a;
                                        var status = err.status || err.statusCode || 500;
                                        var message = err.message || "Internal Server Error";
                                        // Log error with structured logging
                                        var traceId = _req.traceId || 'unknown';
                                        var logEntry = {
                                            timestamp: new Date().toISOString(),
                                            level: 'error',
                                            traceId: traceId,
                                            method: _req.method,
                                            path: _req.path,
                                            ip: _req.ip || _req.socket.remoteAddress,
                                            userAgent: _req.get('user-agent'),
                                            error: {
                                                name: err.name || 'Error',
                                                message: err.message || String(err),
                                                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
                                            },
                                            statusCode: status
                                        };
                                        console.error('[ERROR]', JSON.stringify(logEntry, null, 2));
                                        // Don't expose internal error details in production
                                        var errorResponse = {
                                            ok: false,
                                            error: status >= 500 ? 'internal_server_error' : 'request_error',
                                            message: env_1.NODE_ENV === 'production' && status >= 500
                                                ? 'An internal error occurred'
                                                : message
                                        };
                                        // Include trace ID for debugging
                                        if (traceId !== 'unknown') {
                                            errorResponse.traceId = traceId;
                                        }
                                        res.status(status).json(errorResponse);
                                        if (status >= 500) {
                                            try {
                                                (_a = haloTriggers.recordError) === null || _a === void 0 ? void 0 : _a.call(haloTriggers);
                                            }
                                            catch (_b) {
                                                // Ignore if haloTriggers not available
                                            }
                                        }
                                        // Don't throw - error handler should not throw
                                    });
                                    _a.label = 9;
                                case 9:
                                    _a.trys.push([9, 14, , 15]);
                                    return [4 /*yield*/, loadViteModule()];
                                case 10:
                                    viteModule = _a.sent();
                                    if (!(app.get("env") === "development")) return [3 /*break*/, 12];
                                    return [4 /*yield*/, viteModule.setupVite(app, server)];
                                case 11:
                                    _a.sent();
                                    return [3 /*break*/, 13];
                                case 12:
                                    viteModule.serveStatic(app);
                                    _a.label = 13;
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    error_27 = _a.sent();
                                    console.error("[Vite] Failed to load vite module:", error_27.message);
                                    console.error("[Vite] Server will run API-only mode - frontend unavailable");
                                    return [3 /*break*/, 15];
                                case 15:
                                    port = env_1.PORT;
                                    host = "0.0.0.0";
                                    server.listen(port, host, function () {
                                        console.log("[DreamNet] Serving on port ".concat(port));
                                        console.log("[DreamNet] Server started - /health endpoint available");
                                        // Start Whale Pack control loop (runs every 5 minutes)
                                        Promise.resolve().then(function () { return require('./whale/controlLoop'); }).then(function (_a) {
                                            var startControlLoop = _a.startControlLoop;
                                            startControlLoop(5 * 60 * 1000);
                                            console.log('[WhalePack] Control loop started');
                                        }).catch(function (err) {
                                            console.error('[WhalePack] Failed to start control loop:', err);
                                        });
                                        // Initialize optional subsystems asynchronously (non-blocking)
                                        initOptionalSubsystems(app, server).catch(function (error) {
                                            console.error("[Optional Subsystems] Failed to initialize:", error);
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })().catch(function (error) {
                        console.error("[DreamNet] Failed to start:", error);
                        process.exit(1);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
