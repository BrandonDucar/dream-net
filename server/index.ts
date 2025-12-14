
import express, { type Express, type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
// Lazy import vite.ts to avoid issues in production
let viteModuleCache: any = null;

async function loadViteModule() {
  if (!viteModuleCache) {
    viteModuleCache = await import("./vite");
  }
  return viteModuleCache;
}
// Lazy import legacy loader - only load when needed
let legacyRequire: <T = unknown>(modulePath: string) => T | undefined;
async function loadLegacyLoader() {
  if (!legacyRequire) {
    const loader = await import("./legacy/loader.js");
    legacyRequire = loader.legacyRequire;
  }
  return legacyRequire;
}
import { startMesh } from "./mesh/index.js";
import { createMeshRouter } from "./mesh/router.js";
import { createAgentRouter } from "./routes/agent";
// Environment configuration - load early to catch config errors
import { getEnvConfig, PORT as ENV_PORT, ALLOWED_ORIGINS, OPERATOR_WALLETS, INIT_SUBSYSTEMS, MESH_AUTOSTART, INIT_HEAVY_SUBSYSTEMS, NODE_ENV } from "./config/env";
// Temporarily disabled - forge tables not in schema yet
// import { createForgeRouter } from "./routes/forge";
import { Router } from "express";
const createForgeRouter = () => Router();
import { createHaloRouter } from "./routes/halo";
import { createGraftRouter } from "./routes/graft";
import { createGraftedRouter } from "./routes/grafted";
import { createDnaRouter } from "./routes/dna";
import { createResonanceRouter } from "./routes/resonance";
import { createAliveRouter } from "./routes/alive";
import { createOperatorRouter } from "./routes/operator";
// Missing packages - using placeholders
const createSquadRouter = () => Router();
const createEventRouter = () => Router();
const createWormholeRouter = () => Router();
const createSporeRouter = () => Router();
const createFabricRouter = () => Router();
// import { createMediaRouter } from "./routes/media"; // Temporarily disabled - @dreamnet/media-vault missing
import { createMetricsRouter } from "./routes/metrics";
import { createOrdersRouter } from "./routes/orders";
import { createPublicRouter } from "./routes/public";
// import { createPosterRouter } from "./routes/poster"; // Temporarily disabled - @dreamnet/media-vault missing
import { createRewardsRouter } from "./routes/rewards";
import dreamRouter from "./routes/dream";
const createDreamRouter = () => dreamRouter;
import { createDreamInteractionsRouter } from "./routes/dream-interactions";
import { createDreamContributionsRouter } from "./routes/dream-contributions";
import { createWolfPackRouter } from "./routes/wolf-pack";
import { createSuperSpineRouter } from "./routes/super-spine";
import { createFleetsRouter } from "./routes/fleets";
import { createCustomGPTFleetsRouter } from "./routes/custom-gpt-fleets";
import { createGPTAgentsRouter } from "./routes/gpt-agents";
import { createSocialMediaOpsRouter } from "./routes/social-media-ops";
import { createSocialMediaAuthRouter } from "./routes/social-media-auth";
import { createBrainRouter } from "./routes/brain";
import { createInstantMeshRouter } from "./routes/instant-mesh";
import { createFoundryRouter } from "./routes/foundry";
import { createMediaListRouter } from "./routes/media-list";
import { createEmailRouter } from "./routes/email";
import { createInboxSquaredRouter } from "./routes/inbox-squared";
import { createCoinSenseiRouter } from "./routes/coinsensei";
import { createAgentWalletRouter } from "./routes/agent-wallets";
import { createDreamSnailRouter } from "./routes/dream-snail";
import { createBiomimeticSystemsRouter } from "./routes/biomimetic-systems";
import { createAgentMarketplaceRouter } from "./routes/agent-marketplace";
import { createOrcaMarketplaceRouter } from "./routes/orca-marketplace";
import { createX402PaymentGatewayRouter } from "./routes/x402-payment-gateway";
import { createGuardianRouter } from "./routes/guardian";
import whaleRouter from "./routes/whale";
import onboardingRouter from "./routes/onboarding";
import agentOutputsRouter from "./routes/agent-outputs";
import snapshotRouter from "./routes/snapshot";
import droneDomeRouter from "./routes/drone-dome";
import eventFabricRouter from "./routes/event-fabric";
import dreamkeeperRouter from "./routes/dreamkeeper";
import citadelRouter from "./routes/citadel";
// haloTriggers imported conditionally - see error handler below
let haloTriggers: { recordError?: () => void } = {};
// Lazy imports for workspace packages - loaded only when INIT_HEAVY_SUBSYSTEMS=true
// These will be dynamically imported to avoid startup issues
let NeuralMesh: any;
let QuantumAnticipation: any;
let SquadAlchemy: any;
let WolfPack: any;
let OctopusExecutor: any;
let SlugTimeMemory: any;
let StarBridgeLungs: any;
let PredatorScavengerLoop: any;
let DreamCortex: any;
let ReputationLattice: any;
let NarrativeField: any;
let IdentityGrid: any;
let DreamVault: any;
let DreamShop: any;
let FieldLayer: any;
let DreamBetCore: any;
let ZenGardenCore: any;
let CivicPanelCore: any;
let DreamTankCore: any;
let LiquidityEngine: any;
let SocialHubCore: any;
let InitRitualCore: any;
let EconomicEngineCore: any;
let AgentRegistryCore: any;
let DreamNetOSCore: any;
let WolfPackFundingCore: any;
let APIKeeperCore: any;
let AISEOCore: any;
let EnvKeeperCore: any;
import { autoSEORequestMiddleware } from "./middleware/autoSEO";
import heartbeatRouter from "./routes/heartbeat";
import jaggyRouter from "./routes/jaggy";
import shieldRouter from "./routes/shield";
import starBridgeRouter from "./routes/star-bridge";
import controlRouter from "./routes/control";
import billableRouter from "./routes/billable";
import healthRouter from "./routes/health";
import auditRouter from "./routes/audit";
import rbacRouter from "./routes/rbac";
import adminRouter from "./routes/admin";
import voiceRouter from "./routes/voice";
import vercelRouter from "./routes/vercel";
import apiKeysRouter from "./routes/api-keys";
import envKeeperRouter from "./routes/env-keeper";
import chatgptAgentRouter from "./routes/chatgpt-agent";
import nerveRouter from "./routes/nerve";
import debugSummaryRouter from "./routes/debug-summary";
import agentGatewayRouter from "./routes/agent-gateway";
import portsOpsRouter from "./routes/ports-ops";
import agentOpsRouter from "./routes/agent-ops";
import shieldRiskRouter from "./routes/shield-risk";
import deadLetterRouter from "./routes/dead-letter";
import gridLinesRouter from "./routes/grid-lines";
import directoryRouter from "./routes/directory";
import networksRouter from "./routes/networks";
import discoveryRouter from "./routes/discovery";
// Lazy imports for workspace packages - convert to relative paths
// import { initDirectory } from "@dreamnet/directory/bootstrap";
// import { WebhookNervousCore } from "@dreamnet/webhook-nervous-core";
// import { JaggyCore } from "@dreamnet/jaggy-core";
// import { DreamSnailCore } from "@dreamnet/dreamnet-snail-core";
// import { DreamNetVoiceTwilio } from "@dreamnet/dreamnet-voice-twilio";
// import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";
import { traceIdMiddleware } from "./middleware/traceId";
import { idempotencyMiddleware } from "./middleware/idempotency";
import { tierResolverMiddleware } from "./middleware/tierResolver";
import { logger } from "./utils/logger";
// import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
import { controlCoreMiddleware } from "../packages/dreamnet-control-core/controlCoreMiddleware";
// Dynamic import to avoid ESM resolution issues
let DreamEventBus: any = null;
async function getDreamEventBus() {
  if (!DreamEventBus) {
    const module = await import("../spine/dreamnet-event-bus/DreamEventBus.js");
    DreamEventBus = module.DreamEventBus;
  }
  return DreamEventBus;
}

// Initialize Spine Event Bus for agent communication
let eventBus: any = null;
(async () => {
  try {
    const DreamEventBusClass = await getDreamEventBus();
    eventBus = new DreamEventBusClass();
    (global as any).dreamEventBus = eventBus; // Make available globally
    logger.info("🧠 [Spine] Dream Event Bus initialized");
  } catch (error: any) {
    logger.warn("[Spine] Event Bus initialization warning", { error: error.message });
  }
})();

const app = express();

// Request body size limits (prevent memory exhaustion)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request timeouts (prevent hanging requests)
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// CORS configuration
app.use((req, res, next) => {
  const envConfig = getEnvConfig();
  const allowedOrigins = envConfig.ALLOWED_ORIGINS || ['*'];
  const origin = req.headers.origin;
  
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

// Global rate limiting (enhanced in-memory implementation)
// Note: For production at scale, consider using Redis-based rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window
const RATE_LIMIT_CLEANUP_THRESHOLD = 10000; // Clean up when store exceeds this size
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Clean up every 5 minutes

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired entries`);
  }
}, RATE_LIMIT_CLEANUP_INTERVAL_MS);

app.use((req, res, next) => {
  // Skip rate limiting for health checks and internal routes
  if (req.path === '/health' || req.path === '/health/live' || req.path === '/health/ready' || req.path.startsWith('/api/health')) {
    return next();
  }
  
  const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']?.toString().split(',')[0] || 'unknown';
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  // Clean up old entries if store is getting large
  if (rateLimitStore.size > RATE_LIMIT_CLEANUP_THRESHOLD) {
    let cleaned = 0;
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetAt) {
        rateLimitStore.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      logger.warn(`[RateLimit] Emergency cleanup: removed ${cleaned} expired entries`);
    }
  }
  
  // Initialize or reset window
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - 1).toString());
    res.setHeader('X-RateLimit-Reset', new Date(now + RATE_LIMIT_WINDOW_MS).toISOString());
    return next();
  }
  
  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(record.resetAt).toISOString());
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      ok: false,
      error: 'rate_limit_exceeded',
      message: 'Too many requests from this IP. Please try again later.',
      retryAfter,
      limit: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    });
  }
  
  // Increment counter and add rate limit headers
  record.count++;
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - record.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(record.resetAt).toISOString());
  next();
});

// Database health check helper with timeout
async function checkDbHealth(): Promise<boolean | null> {
  if (!process.env.DATABASE_URL) {
    return null; // Not configured
  }
  
  try {
    const { getPool, isDbAvailable } = await import('./db');
    if (!isDbAvailable()) {
      return false;
    }
    const pool = getPool();
    
    // Simple query with 1 second timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database health check timeout')), 1000);
    });
    
    const queryPromise = pool.query('SELECT 1');
    await Promise.race([queryPromise, timeoutPromise]);
    return true;
  } catch (error) {
    // Log error but don't crash /health endpoint
    const { logger } = await import('./utils/logger');
    logger.warn('Database health check failed', {
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}

// Lightweight health check endpoint - must be early and never depend on optional subsystems
// CRITICAL: This must respond IMMEDIATELY for Cloud Run health checks
app.get("/health", async (_req, res) => {
  // For Cloud Run, we need to respond quickly - don't block on DB checks
  // If DB is not configured, that's OK - server can run without it
  const dbConfigured = !!process.env.DATABASE_URL;
  
  // Non-blocking DB check - don't wait if it's slow
  let dbHealthy: boolean | null = null;
  if (dbConfigured) {
    try {
      // Use Promise.race to timeout DB check after 1 second
      dbHealthy = await Promise.race([
        checkDbHealth(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);
    } catch {
      dbHealthy = null; // If check fails, assume not configured
    }
  }
  
  const isHealthy = dbHealthy !== false; // null (not configured) is OK, false is unhealthy
  
  res.status(isHealthy ? 200 : 503).json({ 
    ok: isHealthy, 
    service: "dreamnet-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealthy === null ? (dbConfigured ? 'checking' : 'not-configured') : dbHealthy ? 'healthy' : 'unhealthy',
    // Document what database status means:
    // - 'healthy': Database is configured and responding to queries
    // - 'unhealthy': Database is configured but not responding (connection failed or timeout)
    // - 'not-configured': DATABASE_URL not set (server can run without DB)
    // - 'checking': Database check timed out (still OK for health check)
  });
});

// Frontend route: /agents - serves agent list (JSON or redirects to frontend)
app.get("/agents", async (req, res, next) => {
  // If it's an API request (Accept: application/json), return JSON
  if (req.headers.accept?.includes("application/json") || req.query.format === "json") {
    try {
      const { gptAgentRegistry } = await import("./gpt-agents/GPTAgentRegistry");
      const allGPTs = gptAgentRegistry.getAllGPTs();
      const activeGPTs = allGPTs.filter(gpt => gpt.status === "Active");
      res.json({ 
        ok: true, 
        agents: activeGPTs.map(gpt => ({
          id: `gpt-${gpt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: gpt.name,
          category: gpt.category,
          purpose: gpt.purpose,
          status: gpt.status,
          link: gpt.link,
        })),
        total: activeGPTs.length,
      });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error.message });
    }
  } else {
    // Otherwise, let frontend handle it (SPA routing)
    next();
  }
});

// Ready endpoint - alias for /health/ready (backward compatible)
app.get("/ready", async (_req, res) => {
  // Forward to health router's readiness probe
  const healthRouter = await import("./routes/health");
  // Note: This will be handled by health router's /ready endpoint
  // For now, keep simple compatibility
  res.status(200).json({ 
    ready: true, // Will be properly checked by /health/ready
    timestamp: new Date().toISOString(),
    note: "Use /health/ready for detailed readiness checks"
  });
});

// Request flow: Trace → Metrics → Idempotency → Tier Resolver → Control Core → Route Handler
// Trace ID middleware - adds X-Trace-Id to all requests
app.use(traceIdMiddleware);

// Metrics collection middleware - tracks golden signals
try {
  const { metricsMiddleware } = await import('./middleware/metrics');
  app.use(metricsMiddleware);
} catch (error: any) {
  console.warn('[Metrics] Could not load metrics middleware:', error.message);
}

// Idempotency middleware - handles X-Idempotency-Key header
app.use(idempotencyMiddleware);

// Tier resolver middleware - resolves access tier from API key or wallet (includes God Vault detection)
app.use(tierResolverMiddleware);

// Control Core middleware - enforces cluster-level access, rate limits, and feature flags
// Note: This middleware only acts on routes that have clusterId attached via withCluster() helper
// Routes without clusterId will pass through (unclustered routes)
app.use(controlCoreMiddleware);

// AUTO-SEO: Apply SEO optimization globally to all content
app.use(autoSEORequestMiddleware);
app.use((req, _res, next) => {
  try {
    haloTriggers.recordRequest?.();
  } catch {
    // Ignore if haloTriggers not available
  }
  next();
});
app.use("/api/mesh", createMeshRouter());
app.use("/api/graft", createGraftRouter());
app.use("/api/grafted", createGraftedRouter());
app.use("/api", createAgentRouter());
app.use("/api", createForgeRouter());
  // Halo routes temporarily disabled - using placeholder metrics engine
  // app.use("/api", createHaloRouter());
app.use("/api/dna", createDnaRouter());
app.use("/api/resonance", createResonanceRouter());
app.use("/api/alive", createAliveRouter());
// app.use("/api", createSquadRouter()); // Disabled - package not available
app.use("/api", createEventRouter());
app.use("/api", createWormholeRouter());
app.use("/api", createSporeRouter());
app.use("/api", createFabricRouter());
  // Media router temporarily disabled - @dreamnet/media-vault missing
  // app.use("/api", createMediaRouter());
app.use("/api", createMetricsRouter());
app.use("/api", createOrdersRouter());
app.use("/api", createPublicRouter());
  // Poster router temporarily disabled - @dreamnet/media-vault missing
  // app.use("/api", createPosterRouter());
app.use("/api", createRewardsRouter());
app.use("/api", createDreamRouter());
  app.use("/api", createDreamInteractionsRouter());
  app.use("/api", createDreamContributionsRouter());
  app.use("/api", createWolfPackRouter());
  
  // 🚀 Activate Packs for Real-World Work
  const { createActivatePacksRouter } = await import("./routes/activate-packs");
  app.use("/api", createActivatePacksRouter());
  
  // 🧠 Super Brain API routes (autonomous orchestration)
  app.use("/api", createBrainRouter());
  app.use("/api", createSuperSpineRouter());
  app.use("/api", createFleetsRouter());
  app.use("/api", createCustomGPTFleetsRouter());
  app.use("/api", createGPTAgentsRouter());
  app.use("/api", createSocialMediaOpsRouter());
  app.use("/api/social-media-auth", createSocialMediaAuthRouter);
  app.use("/api", createInstantMeshRouter());
  app.use("/api", createFoundryRouter());
  app.use("/api", createMediaListRouter());
  app.use("/api", createEmailRouter());
  app.use("/api/inbox-squared", createInboxSquaredRouter());
  app.use("/api/coinsensei", createCoinSenseiRouter);
  app.use("/api/agent-wallets", createAgentWalletRouter);
  app.use("/api/marketplace", createAgentMarketplaceRouter);
  app.use("/api/x402", createX402PaymentGatewayRouter);
  app.use("/api/guardian", createGuardianRouter());
  app.use("/api/agent-outputs", agentOutputsRouter);
  app.use("/api/snapshot", snapshotRouter);
  app.use("/api/drone-dome", droneDomeRouter);
  app.use("/api/event-fabric", eventFabricRouter);
  app.use("/api/dreamkeeper", dreamkeeperRouter);
  app.use("/api/citadel", citadelRouter);
  
  // Market Data API routes
  const marketDataRouter = (await import("./routes/market-data")).default;
  app.use("/api/market-data", marketDataRouter);

  // Competitive Intelligence API Routes
  const competitiveIntelligenceRouter = (await import("./routes/competitive-intelligence")).default;
  app.use("/api/competitive-intelligence", competitiveIntelligenceRouter);

  // Data Integrity API Routes
  const dataIntegrityRouter = (await import("./routes/data-integrity")).default;
  app.use("/api/data-integrity", dataIntegrityRouter);
  
  // Browser Agent routes - safe, governed browser automation
  const { createBrowserAgentRouter } = await import("./routes/browser-agent");
  app.use("/api", createBrowserAgentRouter());
  app.use("/api/orca-marketplace", createOrcaMarketplaceRouter);
  app.use("/api", createDreamSnailRouter());
  app.use("/api", createBiomimeticSystemsRouter());
  
  // Initialize instant mesh, foundry, and social media ops on startup
  console.log("⚡ [Instant Mesh] Zero-delay event routing active");
  
  // Initialize Browser Agent Core integration
  try {
    const browserAgentModule = await import("../packages/browser-agent-core/integration/agent-registry");
    if (browserAgentModule.initBrowserAgentIntegration) {
      await browserAgentModule.initBrowserAgentIntegration();
    }
  } catch (error: any) {
    console.warn("[BrowserAgentCore] Integration warning:", error.message);
  }

  // Initialize Spine Wrappers and connect to Event Bus
  const spineEventBus = (global as any).dreamEventBus || eventBus;
  if (spineEventBus) {
    // Initialize Shield Core Wrapper
    try {
      const { ShieldCoreWrapper } = await import("../spine/wrappers/ShieldCoreWrapper.js");
      const shieldCoreWrapper = new ShieldCoreWrapper(spineEventBus);
      (global as any).shieldCoreWrapper = shieldCoreWrapper;
      console.log("🛡️ [Spine] Shield Core Wrapper initialized and connected to Event Bus");
    } catch (error: any) {
      console.warn("[Spine] Shield Core Wrapper initialization warning:", error.message);
    }
    
    // Initialize Browser Agent Wrapper (already initialized in routes, but ensure it's available)
    try {
      const { BrowserAgentWrapper } = await import("../spine/wrappers/BrowserAgentWrapper.js");
      const browserAgentWrapper = new BrowserAgentWrapper(spineEventBus);
      (global as any).browserAgentWrapper = browserAgentWrapper;
      console.log("🌐 [Spine] Browser Agent Wrapper initialized and connected to Event Bus");
    } catch (error: any) {
      console.warn("[Spine] Browser Agent Wrapper initialization warning:", error.message);
    }
    
    // Initialize Deployment Wrapper
    try {
      const { DeploymentWrapper } = await import("../spine/wrappers/DeploymentWrapper.js");
      const deploymentWrapper = new DeploymentWrapper(spineEventBus);
      (global as any).deploymentWrapper = deploymentWrapper;
      console.log("🚀 [Spine] Deployment Wrapper initialized and connected to Event Bus");
    } catch (error: any) {
      console.warn("[Spine] Deployment Wrapper initialization warning:", error.message);
    }
  }
  
  // Declare variables for systems that need to be shared across initialization
  let ShieldCore: any;
  let SpiderWebCore: any;
  let OrcaPackCoreInstance: any;
  let WhalePackCoreInstance: any;
  let DreamStateCoreInstance: any;
  
  // Optional subsystems initialization function - only runs when INIT_SUBSYSTEMS=true
  async function initOptionalSubsystems(app: Express, server: Server): Promise<void> {
    const envConfig = getEnvConfig();
    if (!envConfig.INIT_SUBSYSTEMS) {
      console.log("[Optional Subsystems] Skipped (INIT_SUBSYSTEMS not set to 'true')");
      return;
    }

    console.log("[Optional Subsystems] Initializing heavy subsystems...");
    
    // Initialize Neural Mesh (N-Mesh) - Tier II Subsystem
    // SKIPPED FOR MINIMAL STARTUP - Will add in Layer 6 after other subsystems work
    // TODO: Re-enable after fixing Neural Mesh initialization
    console.log(`🧠 [Neural Mesh] Skipped for minimal startup - will add in Layer 6`);

      // Initialize Quantum Anticipation Layer (QAL) - Tier II Subsystem
      try {
        const qalStatus = QuantumAnticipation.status();
        logger.info(`🔮 [Quantum Anticipation] Initialized - Last run: ${qalStatus.lastRunAt ? new Date(qalStatus.lastRunAt).toISOString() : "never"}`);
      } catch (error) {
        logSubsystemInit("Quantum Anticipation", false, undefined, error);
      }

      // Initialize Squad Alchemy Engine - Tier II Subsystem
      try {
        const squadStatus = SquadAlchemy.status();
        console.log(`⚗️ [Squad Alchemy] Initialized - ${squadStatus.count} squads registered`);
      } catch (error) {
        console.warn("[Squad Alchemy] Initialization warning:", error);
      }

      // Initialize Wolf-Pack Protocol (WPP) - Tier II Subsystem
      try {
        const wolfStatus = WolfPack.status();
        logger.info(`🐺 [Wolf-Pack] Initialized - Active targets: ${wolfStatus.activeTargets.length}`);
      } catch (error) {
        logSubsystemInit("Wolf-Pack", false, undefined, error);
      }

  // Initialize Octopus Executor - Tier II Subsystem (8-Arm Runtime)
  try {
    await OctopusExecutor.init();
    const octopusStatus = OctopusExecutor.status();
    console.log(`🐙 [Octopus Executor] Initialized - ${octopusStatus.arms.length} arms, ${octopusStatus.queuedTasks} queued tasks`);
    
    // TODO: Move to more formal task generation layer later
    // Enqueue a baseline health task to prove wiring works
    OctopusExecutor.enqueue({
      id: `health-batch-${Date.now()}`,
      type: "run-batch-job",
      createdAt: Date.now(),
      payload: { reason: "baseline octopus health job" },
    });
  } catch (error) {
    console.warn("[Octopus Executor] Initialization warning:", error);
  }

  // Initialize Slug-Time Memory Layer (STM) - Tier II Subsystem
  try {
    const stmStatus = SlugTimeMemory.status();
    console.log(`🐌 [Slug-Time Memory] Initialized - ${stmStatus.totalSamples} samples, ${stmStatus.snapshotCount} snapshots`);
  } catch (error) {
    console.warn("[Slug-Time Memory] Initialization warning:", error);
  }


  // ============================================================================
  // HEAVY SUBSYSTEMS - Only initialize if INIT_HEAVY_SUBSYSTEMS=true
  // These can be enabled gradually, one at a time, for smoother startup
  // ============================================================================
  const shouldInitHeavyEnvConfig = getEnvConfig();
  const shouldInitHeavy = shouldInitHeavyEnvConfig.INIT_HEAVY_SUBSYSTEMS === true;
  
  // Variables to hold dynamically imported modules
  let WebhookNervousCore: any;
  let JaggyCore: any;
  let DreamSnailCore: any;
  let DreamNetVoiceTwilio: any;
  let DreamNetVercelAgent: any;
  
  if (!shouldInitHeavy) {
    console.log("[Simplified Startup] Heavy subsystems disabled (set INIT_HEAVY_SUBSYSTEMS=true to enable)");
    console.log("[Simplified Startup] Core agents (LUCID, CANVAS, ROOT, ECHO) and Star Bridge are active ✅");
  }

  // Initialize Predator–Scavenger Loop (PSL) - Tier II Subsystem (Final Metabolic Organ)
  if (shouldInitHeavy) {
    try {
      const pslStatus = PredatorScavengerLoop.status();
      console.log(`🦁 [Predator–Scavenger Loop] Initialized - ${pslStatus.decaySignals.length} decay signals, ${pslStatus.predatorActions.length} predator actions, ${pslStatus.scavengerActions.length} scavenger actions`);
      console.log("🌱 DreamNet is now a self-healing metabolic organism");
    } catch (error) {
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

    const cortexStatus = DreamCortex.status();
    console.log(`🧠 [Dream Cortex] Initialized - ${cortexStatus.dreamCount} dreams tracked, ${cortexStatus.directiveCount} directives synthesized`);
  } catch (error) {
    console.warn("[Dream Cortex] Initialization warning:", error);
  }

  // Initialize Reputation Lattice - Tier III Subsystem (Trust Weave)
  try {
    const repStatus = ReputationLattice.status();
    console.log(`🔗 [Reputation Lattice] Initialized - ${repStatus.entityCount} entities, ${repStatus.signalCount} signals`);
  } catch (error) {
    console.warn("[Reputation Lattice] Initialization warning:", error);
  }

  // Initialize Narrative Field - Tier III Subsystem (Global Story Stream)
  try {
    const narrativeStatus = NarrativeField.status();
    console.log(`📖 [Narrative Field] Initialized - ${narrativeStatus.entryCount} narrative entries`);
    // TODO: Wire to API/UI endpoints for narrative access
  } catch (error) {
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

    const identityStatus = IdentityGrid.status();
    console.log(`🆔 [Identity Grid] Initialized - ${identityStatus.nodeCount} nodes, ${identityStatus.edgeCount} edges`);
  } catch (error) {
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

    const vaultStatus = DreamVault.status();
    console.log(`📚 [Dream Vault] Initialized - ${vaultStatus.itemCount} items, ${vaultStatus.indexCount} indexed`);
  } catch (error) {
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

    const shopStatus = DreamShop.status();
    console.log(`🛒 [Dream Shop] Initialized - ${shopStatus.offerCount} offers listed`);
  } catch (error) {
    console.warn("[Dream Shop] Initialization warning:", error);
  }

  // Initialize Field Layer - Tier IV Subsystem (Global Parameter Fields: Invisible Physics)
  try {
    const fieldStatus = FieldLayer.status();
    console.log(`🌊 [Field Layer] Initialized - ${fieldStatus.totalSamples} field samples`);
    // TODO: Other subsystems can sample fields for decision-making
    // Example: const riskSample = FieldLayer.sample("risk", { kind: "service", id: "service:halo-loop" });
  } catch (error) {
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

    const betStatus = DreamBetCore.status();
    console.log(`🎲 [DreamBet Core] Initialized - ${betStatus.gameCount} games, ${betStatus.roundCount} rounds`);
  } catch (error) {
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

    const zenStatus = ZenGardenCore.status();
    console.log(`🧘 [Zen Garden Core] Initialized - ${zenStatus.sessionCount} sessions, ${zenStatus.activityCount} activities`);
  } catch (error) {
    console.warn("[Zen Garden Core] Initialization warning:", error);
  }

  // Initialize Civic Panel Core - Tier IV Subsystem (Admin + Status Layer)
  try {
    // Seed initial safe refresh commands for testing
    CivicPanelCore.enqueueCommand("refresh-vault", "Initial Vault Sync");
    CivicPanelCore.enqueueCommand("refresh-fields", "Initial Field Refresh");

    const panelStatus = CivicPanelCore.status();
    console.log(`🏛️ [Civic Panel Core] Initialized - ${panelStatus.widgetCount} widgets, ${panelStatus.commandCount} commands`);
  } catch (error) {
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

    const tankStatus = DreamTankCore.status();
    console.log(`🐋 [Dream Tank Core] Initialized - ${tankStatus.dreamCount} dreams, ${tankStatus.milestoneCount} milestones`);
  } catch (error) {
    console.warn("[Dream Tank Core] Initialization warning:", error);
  }

  // Initialize Env Keeper - ZERO-TOUCH Environment Variable Management (Runs Early)
  try {
    // Initialize Env Keeper - auto-discovers ALL env vars and applies them to process.env
    const envKeeperInitialized = await EnvKeeperCore.init();
    
    if (envKeeperInitialized) {
      const envStatus = EnvKeeperCore.status();
      console.log(`🔐 [Env Keeper] ZERO-TOUCH mode initialized`);
      console.log(`   ✅ Auto-discovered ${envStatus.totalVars} environment variable(s)`);
      console.log(`   🔒 ${envStatus.secretsCount} secret(s) protected`);
      console.log(`   📁 Categories: ${Object.keys(envStatus.categories).join(", ")}`);
      console.log(`   🚀 Env vars are now auto-managed - no manual setup needed!`);
      
      // Start continuous sync cycle (runs every 10 minutes)
      setInterval(async () => {
        await EnvKeeperCore.sync();
      }, 10 * 60 * 1000); // Every 10 minutes
    } else {
      console.warn(`🔐 [Env Keeper] Initialization failed - continuing without auto-discovery`);
    }
  } catch (error: any) {
    console.warn("[Env Keeper] Initialization warning:", error.message || error);
  }

  // Initialize API Keeper - ZERO-TOUCH API Key Management (Runs Continuously)
  try {
    // Run initial discovery immediately on startup
    const discoveredKeys = APIKeeperCore.forceDiscovery();
    const status = APIKeeperCore.status();
    
    console.log(`🔑 [API Keeper] ZERO-TOUCH mode initialized`);
    console.log(`   ✅ Auto-discovered ${discoveredKeys.length} API key(s) on startup`);
    console.log(`   📊 ${status.providerCount} providers, ${status.keyCount} keys total`);
    console.log(`   💰 Cost today: $${status.costToday.toFixed(2)}, this month: $${status.costThisMonth.toFixed(2)}`);
    console.log(`   🚀 Keys are now auto-managed - no manual setup needed!`);
    
    // Start continuous auto-discovery cycle (runs every 5 minutes)
    setInterval(() => {
      APIKeeperCore.run({
        spiderWebCore: undefined,
        dreamStateCore: undefined,
        economicEngineCore: undefined,
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  } catch (error) {
    console.warn("[API Keeper] Initialization warning:", error);
  }

  // Initialize AI SEO - AUTO-SEO for ALL Content (Global, Zero-Touch)
  try {
    // Ensure default geofences
    AISEOCore.ensureDefaultGeofences();
    
    // Start continuous SEO cycle (runs every 10 minutes)
    setInterval(() => {
      AISEOCore.run({
        spiderWebCore: undefined,
        orcaPackCore: undefined,
        whalePackCore: undefined,
        narrativeField: undefined,
        neuralMesh: undefined,
      });
    }, 10 * 60 * 1000); // Every 10 minutes

    const seoStatus = AISEOCore.status();
    console.log(`🔍 [AI SEO] AUTO-SEO mode initialized (GLOBAL)`);
    console.log(`   ✅ SEO optimization applies to ALL content automatically`);
    console.log(`   🌍 Geofencing active: ${seoStatus.geofenceCount} geofences`);
    console.log(`   📊 ${seoStatus.optimizationCount} optimizations, ${seoStatus.keywordCount} keywords`);
    console.log(`   🚀 Zero-touch SEO - no manual calls needed!`);
  } catch (error) {
    console.warn("[AI SEO] Initialization warning:", error);
  }

  // Initialize Webhook Nervous Core - ZERO-TOUCH Webhook Management (Biomimetic)
  try {
    const webhookModule = await import("../packages/webhook-nervous-core");
    WebhookNervousCore = webhookModule.WebhookNervousCore;
    // Auto-discover all webhooks from env vars and config files
    const discoveredWebhooks = WebhookNervousCore.autoDiscoverWebhooks();
    
    // Auto-create default security antibodies
    WebhookNervousCore.autoCreateDefaultAntibodies();
    
    // Start continuous maintenance cycle (runs every 5 minutes)
    setInterval(() => {
      WebhookNervousCore.runMaintenanceCycle();
    }, 5 * 60 * 1000); // Every 5 minutes

    const webhookStatus = WebhookNervousCore.status();
    console.log(`🧠 [Webhook Nervous Core] ZERO-TOUCH mode initialized (BIOMIMETIC)`);
    console.log(`   ✅ Auto-discovered ${discoveredWebhooks.length} webhook(s)`);
    console.log(`   🧠 ${webhookStatus.neurons.total} neurons, ${webhookStatus.synapses.total} synapses`);
    console.log(`   🛡️  ${webhookStatus.immuneSystem.antibodies} antibodies, ${webhookStatus.immuneSystem.memoryCells} memory cells`);
    console.log(`   🍄 ${webhookStatus.mycelium.networks} networks, ${webhookStatus.mycelium.totalHyphae} paths`);
    console.log(`   🐜 ${webhookStatus.antColony.pheromoneTrails} pheromone trails active`);
    console.log(`   🚀 Zero-touch webhooks - auto-discovered, auto-managed, auto-secured!`);
  } catch (error) {
    console.warn("[Webhook Nervous Core] Initialization warning:", error);
  }

  // Initialize Jaggy - The Silent Sentinel 🐱
  try {
    const jaggyModule = await import("../packages/jaggy-core");
    JaggyCore = jaggyModule.JaggyCore;
    JaggyCore.init();
    
    // Jaggy watches the mesh automatically
    // Every event that hits the mesh triggers Jaggy to hunt for webhooks
    
    // Start prowling territories (runs every 10 minutes)
    setInterval(async () => {
      await JaggyCore.prowlTerritories();
    }, 10 * 60 * 1000); // Every 10 minutes

    const jaggyStatus = JaggyCore.status();
    console.log(`🐱 [Jaggy] The Silent Sentinel is active`);
    console.log(`   🥷 Stealth: ${jaggyStatus.stealthLevel}/100 | Independence: ${jaggyStatus.independence}/100`);
    console.log(`   👑 Base Fame: ${jaggyStatus.baseFame.toFixed(1)}/100`);
    console.log(`   🎯 Status: ${jaggyStatus.status} | Kills: ${jaggyStatus.kills}`);
    console.log(`   🐾 Watching ${jaggyStatus.territories.length} territories`);
    console.log(`   🔍 Auto-hunting webhooks when events hit the mesh`);
    console.log(`   🚀 Jaggy works alone, answers to few, moves silently`);
  } catch (error) {
    console.warn("[Jaggy] Initialization warning:", error);
  }

  // Initialize Shield Core - Multi-Phase Shield System 🛡️
  try {
    // Import Shield Core and Spider Web Core
    const shieldModule = await import("@dreamnet/shield-core");
    const currentShieldCore = shieldModule.ShieldCore;
    const spiderModule = await import("@dreamnet/spider-web-core");
    const currentSpiderWebCore = spiderModule.SpiderWebCore;
    
    // Ensure shield phases exist
    currentShieldCore.ensureShieldPhases();
    console.log(`🛡️  [Shield Core] Shield phases initialized`);
    
    // Ensure modulators and emitters
    currentShieldCore.ensureDefaultModulators();
    currentShieldCore.ensureDefaultEmitters();
    console.log(`🛡️  [Shield Core] Modulators and emitters initialized`);
    
    // Initialize shield context
    const shieldCtx = {
      spiderWebCore: currentSpiderWebCore,
      neuralMesh: undefined,
      narrativeField: undefined,
      dreamNetOSCore: DreamNetOSCore,
      eventWormholes: undefined, // Will be connected when available
    };
    
    // Run initial shield cycle
    const shieldStatus = currentShieldCore.run(shieldCtx);
    console.log(`🛡️  [Shield Core] Initial shield cycle complete`);
    console.log(`   🛡️  Shield Health: ${shieldStatus.shieldHealth.toUpperCase()}`);
    console.log(`   📊 Integrity: ${(shieldStatus.overallIntegrity * 100).toFixed(1)}%`);
    console.log(`   🔄 Active Layers: ${shieldStatus.activeLayers}/${shieldStatus.totalLayers}`);
    console.log(`   ⚠️  Threats Detected: ${shieldStatus.threatsDetected} | Blocked: ${shieldStatus.threatsBlocked}`);
    console.log(`   ⚡ Spikes Fired: ${shieldStatus.spikesFired}`);
    
    // Start continuous shield cycle (runs every 30 seconds)
    setInterval(() => {
      currentShieldCore.run(shieldCtx);
    }, 30 * 1000); // Every 30 seconds
    
    // Rotate frequencies periodically (every 5 minutes)
    setInterval(() => {
      currentShieldCore.rotateFrequencies();
      console.log(`🛡️  [Shield Core] Frequencies rotated`);
    }, 5 * 60 * 1000); // Every 5 minutes
    
    console.log(`🛡️  [Shield Core] Continuous protection active - 24/7 shield coverage`);
    
    // Store for later use
    ShieldCore = currentShieldCore;
    SpiderWebCore = currentSpiderWebCore;
  } catch (error) {
    console.warn("[Shield Core] Initialization warning:", error);
  }

  // Initialize Orca Pack Core - Communications & Narrative Management 🐋
  try {
    const orcaModule = await import("@dreamnet/orca-pack-core");
    OrcaPackCoreInstance = orcaModule.OrcaPackCore;
    
    // Start continuous Orca Pack cycle (runs every 15 minutes)
    setInterval(async () => {
      await OrcaPackCoreInstance.run({
        spiderWebCore: SpiderWebCore,
        narrativeField: NarrativeField,
        neuralMesh: NeuralMesh,
      });
    }, 15 * 60 * 1000); // Every 15 minutes

    const orcaStatus = OrcaPackCoreInstance.status();
    console.log(`🐋 [Orca Pack Core] Initialized - ${orcaStatus.themeCount} themes, ${orcaStatus.ideaCount} ideas, ${orcaStatus.planCount} plans`);
    console.log(`   📢 Communications & narrative management active`);
  } catch (error) {
    console.warn("[Orca Pack Core] Initialization warning:", error);
  }

  // Initialize Whale Pack Core - Commerce & Product Management 🐳
  try {
    const whaleModule = await import("@dreamnet/whale-pack-core");
    WhalePackCoreInstance = whaleModule.WhalePackCore;
    
    // Start continuous Whale Pack cycle (runs every 20 minutes)
    setInterval(async () => {
      await WhalePackCoreInstance.run({
        spiderWebCore: SpiderWebCore,
        dreamShop: DreamShop,
        economicEngineCore: EconomicEngineCore,
      });
    }, 20 * 60 * 1000); // Every 20 minutes

    const whaleStatus = WhalePackCoreInstance.status();
    console.log(`🐳 [Whale Pack Core] Initialized - ${whaleStatus.productCount} products, ${whaleStatus.audienceCount} audiences, ${whaleStatus.planCount} plans`);
    console.log(`   💼 Commerce & product management active`);
  } catch (error) {
    console.warn("[Whale Pack Core] Initialization warning:", error);
  }

  // ============================================================================
  // OPTIONAL SUBSYSTEMS - Commented out for simplified startup
  // Uncomment these one at a time as needed, testing after each addition
  // ============================================================================
  
  // Initialize Dream State Core - Governance, Passports, Proposals 🏛️
  // DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
  /*
  try {
    const dreamStateModule = await import("@dreamnet/dream-state-core");
    DreamStateCoreInstance = dreamStateModule.DreamStateCore;
    
    // Ensure government departments (including Jaggy & Mycelium)
    // Run initial cycle to create departments and symbols
    DreamStateCoreInstance.run({
      identityGrid: IdentityGrid,
      wolfPackFundingCore: WolfPackFundingCore,
      economicEngineCore: EconomicEngineCore,
      narrativeField: NarrativeField,
      neuralMesh: NeuralMesh,
      agentRegistryCore: AgentRegistryCore,
    });
    
    // Start continuous Dream State cycle (runs every 5 minutes)
    setInterval(() => {
      DreamStateCoreInstance.run({
        identityGrid: IdentityGrid,
        wolfPackFundingCore: WolfPackFundingCore,
        economicEngineCore: EconomicEngineCore,
        narrativeField: NarrativeField,
        neuralMesh: NeuralMesh,
        agentRegistryCore: AgentRegistryCore,
      });
    }, 5 * 60 * 1000); // Every 5 minutes

    const stateStatus = DreamStateCoreInstance.status();
    console.log(`🏛️  [Dream State Core] Initialized - ${stateStatus.passportCount} passports, ${stateStatus.departmentCount} departments`);
    console.log(`   🗳️  ${stateStatus.proposalCount} proposals, ${stateStatus.openProposals} open`);
    console.log(`   🌍 ${stateStatus.diplomaticRelationsCount} diplomatic relations`);
    console.log(`   👑 Head of State: ${stateStatus.headOfState}`);
  } catch (error) {
    console.warn("[Dream State Core] Initialization warning:", error);
  }
  */

  // Initialize DreamState (Governance Layer: Passports, Offices, Cabinets) 🏛️
  // DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
  /*
  try {
    const { DREAMSTATE } = await import("@dreamnet/dreamstate/registry");
    
    console.log(`🏛️  [DreamState] Governance layer initialized`);
    console.log(`   👤 Founder: ${DREAMSTATE.founderCitizenId}`);
    console.log(`   📋 ${Object.keys(DREAMSTATE.offices).length} offices, ${Object.keys(DREAMSTATE.cabinets).length} cabinets`);
    console.log(`   🎫 ${Object.keys(DREAMSTATE.passports).length} passports seeded`);
    console.log(`   ✅ DreamState integrated with identity resolver and control core`);
    console.log(`   🔐 Governance enforcement active (office/cabinet requirements)`);
  } catch (error) {
    console.warn("[DreamState] Initialization warning:", error);
  }
  */

  // Initialize Directory - Entity Discovery & ID Registry 🔍
  // DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
  /*
  try {
    await initDirectory();
  } catch (error: any) {
    console.warn("[Directory] Initialization warning:", error.message || error);
  }
  */

  // Bootstrap from DreamNetCoreBlueprint - Network Configuration Template 🌐
  // DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
  /*
  try {
    const { DreamNetCoreBlueprint, bootstrapFromBlueprint } = await import("@dreamnet/network-blueprints");
    // Only bootstrap DreamNetCoreBlueprint - this is the default active network
    const bootstrapResult = bootstrapFromBlueprint(DreamNetCoreBlueprint);
    console.log(`🌐 [Network Blueprint] Bootstrapped ${DreamNetCoreBlueprint.label}`);
    console.log(`   ✅ Citizens: ${bootstrapResult.citizensRegistered}, Agents: ${bootstrapResult.agentsRegistered}, Dreams: ${bootstrapResult.dreamsRegistered}`);
    console.log(`   ✅ Ports: ${bootstrapResult.portsRegistered}, Conduits: ${bootstrapResult.conduitsRegistered}`);
    if (bootstrapResult.errors && bootstrapResult.errors.length > 0) {
      console.warn(`   ⚠️  Bootstrap warnings: ${bootstrapResult.errors.length} errors`);
    }
    console.info("[dreamnet] Network boot complete (blueprint + directory + discovery online)");
  } catch (error: any) {
    console.warn("[Network Blueprint] Bootstrap warning:", error.message || error);
  }
  */

  // Initialize Nerve Fiber Event Fabric 🧠
  // DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
  /*
  try {
    const { initNerveFabric } = await import("@dreamnet/nerve/init");
    const { NERVE_BUS } = await import("@dreamnet/nerve/bus");
    
    // Initialize fabric and register subscribers
    const { dreamScope } = initNerveFabric();
    
    // Store dreamScope for API endpoint access
    (global as any).dreamScopeNerve = dreamScope;
    
    // Log stats
    const stats = NERVE_BUS.getStats();
    console.log(`🧠 [Nerve Fabric] Event bus online`);
    console.log(`   ✅ Shield Core subscribed`);
    console.log(`   ✅ Jaggy subscribed`);
    console.log(`   ✅ DreamScope subscribed`);
    console.log(`   📡 Nerve Fiber Event Fabric active - events routing through channels`);
    console.log(`   📊 Stats: ${stats.published} published, ${stats.dropped} dropped, queue: ${stats.queueSize}`);
  } catch (error) {
    console.warn("[Nerve Fabric] Initialization warning:", error);
  }
  */

  // Initialize Spider Web Core - Event Threading & Fly-Catching 🕸️
  try {
    if (!SpiderWebCore) {
      const spiderModule = await import("@dreamnet/spider-web-core");
      SpiderWebCore = spiderModule.SpiderWebCore;
    }
    
    // Ensure default sensors and templates
    SpiderWebCore.ensureDefaultSensors();
    SpiderWebCore.ensureDefaultTemplates();
    
    // Start continuous Spider Web cycle (runs every 30 seconds)
    setInterval(async () => {
      await SpiderWebCore.run({
        wolfPackCore: WolfPackFundingCore,
        whalePackCore: WhalePackCoreInstance,
        orcaPackCore: OrcaPackCoreInstance,
        dreamStateCore: DreamStateCoreInstance,
        dreamNetOSCore: DreamNetOSCore,
        narrativeField: NarrativeField,
        dataVaultCore: DreamVault,
        neuralMesh: NeuralMesh,
      });
    }, 30 * 1000); // Every 30 seconds

    const spiderStatus = SpiderWebCore.status();
    console.log(`🕸️  [Spider Web Core] Initialized - ${spiderStatus.threadCount} threads, ${spiderStatus.templateCount} templates`);
    console.log(`   🪰 Fly-catching & event threading active`);
  } catch (error) {
    console.warn("[Spider Web Core] Initialization warning:", error);
  }

  // Initialize Market Data Core - Real-Time Market Data Spikes with Intelligent Agents 💰📈🤖
  try {
    const marketDataModule = await import("@dreamnet/market-data-core");
    const MarketDataCore = marketDataModule.MarketDataCore || marketDataModule.default;
    const { initSpikeAgentIntegration } = marketDataModule;

    // Register spike agents with Agent Registry
    initSpikeAgentIntegration();

    // Configure market data agents (wrappers around spikes)
    const marketDataCore = new MarketDataCore({
      useAgents: true, // Use intelligent agent wrappers
      metals: {
        enabled: process.env.METALS_API_KEY ? true : false,
        frequency: parseInt(process.env.METALS_FETCH_INTERVAL || "60000"), // 1 minute default
        apiKey: process.env.METALS_API_KEY,
      },
      crypto: {
        enabled: true, // CoinGecko free tier doesn't require API key
        frequency: parseInt(process.env.CRYPTO_FETCH_INTERVAL || "60000"), // 1 minute default
        symbols: process.env.CRYPTO_SYMBOLS?.split(",") || ["bitcoin", "ethereum", "base", "solana"],
      },
      stocks: {
        enabled: process.env.ALPHA_VANTAGE_API_KEY ? true : false,
        frequency: parseInt(process.env.STOCKS_FETCH_INTERVAL || "300000"), // 5 minutes default (rate limits)
        apiKey: process.env.ALPHA_VANTAGE_API_KEY,
        symbols: process.env.STOCK_SYMBOLS?.split(",") || ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"],
      },
    });

    // Start all enabled agents (which start their spikes)
    marketDataCore.start();

    // Store globally for API access
    (global as any).marketDataCore = marketDataCore;

    const status = marketDataCore.getStatus();
    console.log(`💰📈🤖 [Market Data Core] Initialized with Intelligent Agents`);
    console.log(`   🥇 Metals Agent: ${status.metals?.isRunning ? "✅ Running" : "❌ Disabled"}`);
    console.log(`   🪙 Crypto Agent: ${status.crypto?.isRunning ? "✅ Running" : "❌ Disabled"}`);
    console.log(`   📊 Stock Agent: ${status.stocks?.isRunning ? "✅ Running" : "❌ Disabled"}`);
    console.log(`   📡 Real-time market data collection active`);
    console.log(`   🤖 Agents monitoring data quality, API health, and using browser automation for verification`);
  } catch (error) {
    console.warn("[Market Data Core] Initialization warning:", error);
  }

  // Initialize Competitive Intelligence Core - Company Research & Analysis 🔍📊
  try {
    const { CompetitiveIntelligenceCore } = await import("@dreamnet/competitive-intelligence-core");
    const { seedCompanies } = await import("../scripts/seed-competitive-companies");
    const competitiveIntelligenceCore = new CompetitiveIntelligenceCore();
    
    // Seed with all companies to research
    await seedCompanies();
    
    (global as any).competitiveIntelligenceCore = competitiveIntelligenceCore;
    console.log(`🔍📊 [Competitive Intelligence Core] Initialized`);
    console.log(`   🕵️ Research Agent ready for web scraping and data collection`);
    console.log(`   📈 Analysis Engine ready for company analysis`);
    console.log(`   💡 Opportunity Finder ready to identify market opportunities`);
    console.log(`   🗺️ Roadmap Generator ready to create innovation roadmaps`);
    console.log(`   🌱 Companies seeded - ready for research`);
  } catch (error) {
    console.warn("[Competitive Intelligence Core] Initialization warning:", error);
  }

  // Enable Zero-Trust Middleware if configured
  if (process.env.ZERO_TRUST_ENABLED === "true") {
    try {
      const { zeroTrustVerifier } = await import("@dreamnet/shield-core");
      // Insert middleware before routes (after other security middlewares)
      // We need to add it to the app, but since routes are already registered,
      // we'll add it as a route-specific middleware for API routes
      app.use("/api", zeroTrustVerifier.middleware());
      console.log("🔒 [Zero-Trust] Middleware enabled for /api routes - all requests require verification");
    } catch (error) {
      console.warn("[Zero-Trust] Failed to enable middleware:", error);
    }
  }

  // Initialize Data Integrity Core - Blockchain-Based Audit Trails 🔗📋
  try {
    const { initDataIntegrityCore } = await import("@dreamnet/data-integrity-core");
    
    const dataIntegrityCore = initDataIntegrityCore({
      enabled: process.env.DATA_INTEGRITY_ENABLED === "true",
      blockchain: (process.env.DATA_INTEGRITY_BLOCKCHAIN as any) || "base",
      chainId: process.env.DATA_INTEGRITY_CHAIN_ID || "8453",
      contractAddress: process.env.DATA_INTEGRITY_CONTRACT_ADDRESS,
      rpcUrl: process.env.DATA_INTEGRITY_RPC_URL || process.env.BASE_MAINNET_RPC_URL,
      privateKey: process.env.DATA_INTEGRITY_PRIVATE_KEY || process.env.PRIVATE_KEY,
      batchSize: parseInt(process.env.DATA_INTEGRITY_BATCH_SIZE || "100"),
      batchInterval: parseInt(process.env.DATA_INTEGRITY_BATCH_INTERVAL || "60000"),
    });

    // Store globally for access
    (global as any).dataIntegrityCore = dataIntegrityCore;

    const status = dataIntegrityCore.getStatus();
    console.log(`🔗📋 [Data Integrity Core] Initialized`);
    console.log(`   Blockchain: ${status.blockchain} (chain: ${status.chainId})`);
    console.log(`   Enabled: ${status.enabled ? "✅" : "❌"}`);
    console.log(`   Queue size: ${status.queueSize}`);
    console.log(`   Batch size: ${status.batchSize}, interval: ${status.batchInterval}ms`);
    console.log(`   📋 Immutable audit trails active`);
  } catch (error) {
    console.warn("[Data Integrity Core] Initialization warning:", error);
  }

  // Initialize Wolf Pack Analyst Core - Pattern Learning & Lead Analysis 🐺📊
  try {
    const analystModule = await import("@dreamnet/wolfpack-analyst-core");
    const WolfPackAnalystCore = analystModule.WolfPackAnalystCore || analystModule.default;
    
    if (WolfPackAnalystCore && WolfPackAnalystCore.run) {
      // Start continuous Analyst cycle (runs every 10 minutes)
      setInterval(() => {
        WolfPackAnalystCore.run({
          wolfPackFundingCore: WolfPackFundingCore,
          neuralMesh: NeuralMesh,
        });
      }, 10 * 60 * 1000); // Every 10 minutes

      const analystStatus = WolfPackAnalystCore.status();
      console.log(`🐺📊 [Wolf Pack Analyst Core] Initialized - ${analystStatus.patternCount || 0} patterns, ${analystStatus.insightCount || 0} insights`);
      console.log(`   🔍 Pattern learning & lead analysis active`);
    } else {
      console.log(`🐺📊 [Wolf Pack Analyst Core] Available but not initialized (no run method)`);
    }
  } catch (error) {
    console.warn("[Wolf Pack Analyst Core] Initialization warning:", error);
  }

  // Initialize Wolf Pack Mailer Core - Email Sending & Queue Management 📧
  try {
    const { WolfPackMailerCore } = await import("@dreamnet/wolfpack-mailer-core");
    
    // Start continuous mailer cycle (runs every 1 minute)
    setInterval(() => {
      WolfPackMailerCore.processSendQueueOnce();
    }, 60 * 1000); // Every 1 minute

    console.log(`📧 [Wolf Pack Mailer Core] Initialized`);
    console.log(`   📬 Email queue processing active (every 1 minute)`);
  } catch (error) {
    console.warn("[Wolf Pack Mailer Core] Initialization warning:", error);
  }

  // Initialize Runtime Bridge Core - Runtime Context & Cycle Management 🌉
  try {
    const { RuntimeBridgeCore } = await import("@dreamnet/runtime-bridge-core");
    const { LatentCollaborationCore } = await import("../packages/latent-collaboration-core");
    const { getAgentWalletManager } = await import("@dreamnet/agent-wallet-manager");
    
    // Initialize Latent Collaboration Core if enabled
    let latentCollaboration: any = null;
    if (process.env.USE_LATENT_COLLABORATION === 'true') {
      latentCollaboration = new LatentCollaborationCore();
      console.log(`🧠 [Latent Collaboration] Initialized`);
    }
    
    // Initialize runtime context
    RuntimeBridgeCore.initContext({
      DreamVault: DreamVault,
      DreamShop: DreamShop,
      NeuralMesh: NeuralMesh,
      LatentCollaboration: latentCollaboration ? {
        run: (context: any) => latentCollaboration.run(context),
      } : undefined,
      AgentWalletManager: getAgentWalletManager(),
    });
    
    // Start runtime loop (runs every 30 seconds)
    RuntimeBridgeCore.startLoop(30 * 1000);

    const runtimeStatus = RuntimeBridgeCore.getStatus();
    console.log(`🌉 [Runtime Bridge Core] Initialized`);
    console.log(`   ⚙️  Runtime context & cycle management active`);
  } catch (error) {
    console.warn("[Runtime Bridge Core] Initialization warning:", error);
  }
  } // End of shouldInitHeavy conditional - heavy subsystems disabled by default

  // ============================================================================
  // 19 NEW INTEGRATION PACKAGES - Initialized in initOptionalSubsystems
  // ============================================================================
  
  // Agent Foundry Vertical (3)
  try {
    const { DreamNetLangChainBridge } = await import("@dreamnet/agent-langchain");
    const langChainBridge = new DreamNetLangChainBridge();
    dreamNetOS.langChainBridge = langChainBridge;
    (global as any).langChainBridge = langChainBridge;
    console.log(`🤖 [LangChain] Integration initialized`);
  } catch (error: any) {
    console.warn("[LangChain] Initialization warning:", error.message);
  }

  try {
    const { CrewAICrewOrchestrator } = await import("@dreamnet/agent-crewai");
    const crewAI = new CrewAICrewOrchestrator({
      agents: [],
      tasks: [],
      process: "sequential",
    });
    dreamNetOS.crewAICrewOrchestrator = crewAI;
    (global as any).crewAICrewOrchestrator = crewAI;
    console.log(`👥 [CrewAI] Integration initialized`);
  } catch (error: any) {
    console.warn("[CrewAI] Initialization warning:", error.message);
  }

  try {
    const { SuperAGIMarketplace } = await import("@dreamnet/agent-superagi");
    const superAGI = new SuperAGIMarketplace({
      apiUrl: process.env.SUPERAGI_API_URL,
      apiKey: process.env.SUPERAGI_API_KEY,
    });
    dreamNetOS.superAGIMarketplace = superAGI;
    (global as any).superAGIMarketplace = superAGI;
    console.log(`🏪 [SuperAGI Marketplace] Integration initialized`);
  } catch (error: any) {
    console.warn("[SuperAGI Marketplace] Initialization warning:", error.message);
  }

  // Crypto Social Vertical (2)
  try {
    const { LensProtocolClient } = await import("@dreamnet/social-lens");
    const lensClient = new LensProtocolClient({
      rpcUrl: process.env.LENS_RPC_URL || process.env.BASE_MAINNET_RPC_URL,
      chainId: parseInt(process.env.LENS_CHAIN_ID || "8453"),
    });
    await lensClient.initialize();
    dreamNetOS.lensProtocolClient = lensClient;
    (global as any).lensProtocolClient = lensClient;
    console.log(`🔗 [Lens Protocol] Integration initialized`);
  } catch (error: any) {
    console.warn("[Lens Protocol] Initialization warning:", error.message);
  }

  try {
    const { FarcasterClient } = await import("@dreamnet/social-farcaster");
    const farcasterClient = new FarcasterClient({
      rpcUrl: process.env.FARCASTER_RPC_URL || process.env.BASE_MAINNET_RPC_URL,
      chainId: parseInt(process.env.FARCASTER_CHAIN_ID || "8453"),
      hubUrl: process.env.FARCASTER_HUB_URL,
    });
    await farcasterClient.initialize();
    dreamNetOS.farcasterClient = farcasterClient;
    (global as any).farcasterClient = farcasterClient;
    console.log(`📡 [Farcaster Protocol] Integration initialized`);
  } catch (error: any) {
    console.warn("[Farcaster Protocol] Initialization warning:", error.message);
  }

  // OTT Streaming Vertical (2)
  try {
    const { JellyfinMediaServer } = await import("@dreamnet/media-jellyfin");
    const jellyfin = new JellyfinMediaServer({
      serverUrl: process.env.JELLYFIN_SERVER_URL || "",
      apiKey: process.env.JELLYFIN_API_KEY,
      username: process.env.JELLYFIN_USERNAME,
      password: process.env.JELLYFIN_PASSWORD,
    });
    await jellyfin.authenticate();
    dreamNetOS.jellyfinMediaServer = jellyfin;
    (global as any).jellyfinMediaServer = jellyfin;
    console.log(`🎬 [Jellyfin Media Server] Integration initialized`);
  } catch (error: any) {
    console.warn("[Jellyfin Media Server] Initialization warning:", error.message);
  }

  try {
    const { PeerTubeClient } = await import("@dreamnet/media-peertube");
    const peerTube = new PeerTubeClient({
      instanceUrl: process.env.PEERTUBE_INSTANCE_URL || "",
      apiKey: process.env.PEERTUBE_API_KEY,
    });
    dreamNetOS.peerTubeClient = peerTube;
    (global as any).peerTubeClient = peerTube;
    console.log(`📺 [PeerTube P2P] Integration initialized`);
  } catch (error: any) {
    console.warn("[PeerTube P2P] Initialization warning:", error.message);
  }

  // Science Vertical (2)
  try {
    const { ResearchHubClient } = await import("@dreamnet/research-researchhub");
    const researchHub = new ResearchHubClient({
      apiUrl: process.env.RESEARCHHUB_API_URL,
      apiKey: process.env.RESEARCHHUB_API_KEY,
    });
    dreamNetOS.researchHubClient = researchHub;
    (global as any).researchHubClient = researchHub;
    console.log(`🔬 [ResearchHub Platform] Integration initialized`);
  } catch (error: any) {
    console.warn("[ResearchHub Platform] Initialization warning:", error.message);
  }

  try {
    const { DeSciProtocols } = await import("@dreamnet/research-desci");
    const deSci = new DeSciProtocols({
      rpcUrl: process.env.DESCI_RPC_URL || process.env.BASE_MAINNET_RPC_URL,
      chainId: parseInt(process.env.DESCI_CHAIN_ID || "8453"),
      ipfsGateway: process.env.IPFS_GATEWAY_URL,
    });
    await deSci.initialize();
    dreamNetOS.deSciProtocols = deSci;
    (global as any).deSciProtocols = deSci;
    console.log(`🧪 [DeSci Protocols] Integration initialized`);
  } catch (error: any) {
    console.warn("[DeSci Protocols] Initialization warning:", error.message);
  }

  // Travel Vertical (2)
  try {
    const { OpenTripPlannerClient } = await import("@dreamnet/travel-opentripplanner");
    const otp = new OpenTripPlannerClient({
      apiUrl: process.env.OPENTRIPPLANNER_API_URL || "",
      routerId: process.env.OPENTRIPPLANNER_ROUTER_ID,
    });
    dreamNetOS.openTripPlannerClient = otp;
    (global as any).openTripPlannerClient = otp;
    console.log(`🗺️  [OpenTripPlanner] Integration initialized`);
  } catch (error: any) {
    console.warn("[OpenTripPlanner] Initialization warning:", error.message);
  }

  try {
    const { ValhallaRouter } = await import("@dreamnet/travel-valhalla");
    const valhalla = new ValhallaRouter({
      apiUrl: process.env.VALHALLA_API_URL || "",
    });
    dreamNetOS.valhallaRouter = valhalla;
    (global as any).valhallaRouter = valhalla;
    console.log(`⚔️  [Valhalla Routing] Integration initialized`);
  } catch (error: any) {
    console.warn("[Valhalla Routing] Initialization warning:", error.message);
  }

  // Military Vertical (2)
  try {
    const { GhidraSecurityAnalyzer } = await import("@dreamnet/security-ghidra");
    const ghidra = new GhidraSecurityAnalyzer({
      serverUrl: process.env.GHIDRA_SERVER_URL,
      apiKey: process.env.GHIDRA_API_KEY,
      headless: process.env.GHIDRA_HEADLESS === "true",
    });
    dreamNetOS.ghidraSecurityAnalyzer = ghidra;
    (global as any).ghidraSecurityAnalyzer = ghidra;
    console.log(`🔒 [Ghidra Security] Integration initialized`);
  } catch (error: any) {
    console.warn("[Ghidra Security] Initialization warning:", error.message);
  }

  try {
    const { MetasploitFramework } = await import("@dreamnet/security-metasploit");
    const metasploit = new MetasploitFramework({
      apiUrl: process.env.METASPLOIT_API_URL || "",
      apiKey: process.env.METASPLOIT_API_KEY || "",
    });
    dreamNetOS.metasploitFramework = metasploit;
    (global as any).metasploitFramework = metasploit;
    console.log(`🛡️  [Metasploit Framework] Integration initialized`);
  } catch (error: any) {
    console.warn("[Metasploit Framework] Initialization warning:", error.message);
  }

  // Government Vertical (2)
  try {
    const { AragonGovernanceClient } = await import("@dreamnet/governance-aragon");
    const aragon = new AragonGovernanceClient({
      rpcUrl: process.env.ARAGON_RPC_URL || process.env.BASE_MAINNET_RPC_URL,
      chainId: parseInt(process.env.ARAGON_CHAIN_ID || "8453"),
      daoAddress: process.env.ARAGON_DAO_ADDRESS,
      votingAddress: process.env.ARAGON_VOTING_ADDRESS,
    });
    await aragon.initialize();
    dreamNetOS.aragonGovernanceClient = aragon;
    (global as any).aragonGovernanceClient = aragon;
    console.log(`🏛️  [Aragon Governance] Integration initialized`);
  } catch (error: any) {
    console.warn("[Aragon Governance] Initialization warning:", error.message);
  }

  try {
    const { SnapshotVoting } = await import("@dreamnet/governance-snapshot");
    const snapshot = new SnapshotVoting({
      apiUrl: process.env.SNAPSHOT_API_URL,
      space: process.env.SNAPSHOT_SPACE,
    });
    dreamNetOS.snapshotVoting = snapshot;
    (global as any).snapshotVoting = snapshot;
    console.log(`📊 [Snapshot Voting] Integration initialized`);
  } catch (error: any) {
    console.warn("[Snapshot Voting] Initialization warning:", error.message);
  }

  // Music Vertical (2)
  try {
    const { MusicGenClient } = await import("@dreamnet/music-musicgen");
    const musicGen = new MusicGenClient({
      apiUrl: process.env.MUSICGEN_API_URL,
      apiKey: process.env.MUSICGEN_API_KEY,
      model: process.env.MUSICGEN_MODEL as any,
    });
    dreamNetOS.musicGenClient = musicGen;
    (global as any).musicGenClient = musicGen;
    console.log(`🎵 [MusicGen AI] Integration initialized`);
  } catch (error: any) {
    console.warn("[MusicGen AI] Initialization warning:", error.message);
  }

  try {
    const { MusicLMClient } = await import("@dreamnet/music-musiclm");
    const musicLM = new MusicLMClient({
      apiUrl: process.env.MUSICLM_API_URL,
      apiKey: process.env.MUSICLM_API_KEY,
    });
    dreamNetOS.musicLMClient = musicLM;
    (global as any).musicLMClient = musicLM;
    console.log(`🎶 [MusicLM] Integration initialized`);
  } catch (error: any) {
    console.warn("[MusicLM] Initialization warning:", error.message);
  }

  // Pods Vertical (2)
  try {
    const { MatrixFederationClient } = await import("@dreamnet/chat-matrix");
    const matrix = new MatrixFederationClient({
      homeserverUrl: process.env.MATRIX_HOMESERVER_URL || "",
      accessToken: process.env.MATRIX_ACCESS_TOKEN,
      userId: process.env.MATRIX_USER_ID,
      password: process.env.MATRIX_PASSWORD,
    });
    dreamNetOS.matrixFederationClient = matrix;
    (global as any).matrixFederationClient = matrix;
    console.log(`💬 [Matrix Federation] Integration initialized`);
  } catch (error: any) {
    console.warn("[Matrix Federation] Initialization warning:", error.message);
  }

  try {
    const { RocketChatClient } = await import("@dreamnet/chat-rocketchat");
    const rocketChat = new RocketChatClient({
      serverUrl: process.env.ROCKETCHAT_SERVER_URL || "",
      userId: process.env.ROCKETCHAT_USER_ID,
      authToken: process.env.ROCKETCHAT_AUTH_TOKEN,
    });
    dreamNetOS.rocketChatClient = rocketChat;
    (global as any).rocketChatClient = rocketChat;
    console.log(`🚀 [Rocket.Chat] Integration initialized`);
  } catch (error: any) {
    console.warn("[Rocket.Chat] Initialization warning:", error.message);
  }

  console.log(`✅ [Integration Packages] All 19 integrations initialized`);

  // Initialize The Citadel - Strategic command center
  try {
    const { CitadelCore } = await import("../packages/citadel-core");
    dreamNetOS.citadelCore = CitadelCore;
    (global as any).citadelCore = CitadelCore;
    console.log(`🏰 [Citadel] Initialized - Strategic command center active`);
  } catch (error: any) {
    console.warn("[Citadel] Initialization warning:", error.message);
  }

  // Initialize Orchestrator Core - System Orchestration 🔄
  if (shouldInitHeavy) {
  try {
    const { OrchestratorCore } = await import("@dreamnet/orchestrator-core");
    
    // Start orchestrator loop (runs every 60 seconds)
    OrchestratorCore.startIntervalLoop({
      CitadelCore: dreamNetOS.citadelCore,
      DreamVault: DreamVault,
      DreamShop: DreamShop,
      NeuralMesh: NeuralMesh,
    }, 60 * 1000);

    const orchestratorStatus = OrchestratorCore.getStatus();
    console.log(`🔄 [Orchestrator Core] Initialized - ${orchestratorStatus.totalCycles || 0} cycles`);
    console.log(`   🎯 System orchestration active`);
  } catch (error) {
    console.warn("[Orchestrator Core] Initialization warning:", error);
  }

  // Initialize Liquidity Engine - Tier IV Subsystem (Liquidity Pool Registry: Structure Only, No Seeding)
  try {
    // Initialize pool configs (DREAM/SHEEP vs AERO, ETH, USDT)
    LiquidityEngine.initConfigs();

    const liquidityStatus = LiquidityEngine.status();
    console.log(`💧 [Liquidity Engine] Initialized - ${liquidityStatus.poolCount} pools (${liquidityStatus.plannedCount} planned, ${liquidityStatus.deployedCount} deployed, ${liquidityStatus.activeCount} active)`);
  } catch (error) {
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

    const socialStatus = SocialHubCore.status();
    console.log(`📱 [Social Hub Core] Initialized - ${socialStatus.postCount} posts, ${socialStatus.commentCount} comments, ${socialStatus.reactionCount} reactions`);
  } catch (error) {
    console.warn("[Social Hub Core] Initialization warning:", error);
  }

  // Initialize Init & Ritual Core - Tier IV Subsystem (Onboarding + Initialization Layer)
  try {
    // Seed default init template
    InitRitualCore.ensureDefaultTemplateSeeded();

    // Seed initial identity state for testing (user:founder)
    const initState = InitRitualCore.getOrCreateIdentityState("user:founder");
    const { state, nextStep } = InitRitualCore.advanceIdentity({}, "user:founder");

    const initStatus = InitRitualCore.status();
    console.log(`🌱 [Init & Ritual Core] Initialized - ${initStatus.templateCount} templates, ${initStatus.activeIdentityCount} active identities (${initStatus.completedCount} completed)`);
  } catch (error) {
    console.warn("[Init & Ritual Core] Initialization warning:", error);
  }

  // Initialize Economic Engine Core - Tier IV Subsystem (Rewards + Tokens Layer)
  try {
    // Seed default token configs and emission rules
    EconomicEngineCore.ensureDefaultConfigSeeded();

    // Seed demo reward for testing: give "user:founder" a Zen Garden activity reward
    const raw = EconomicEngineCore.recordRawReward({
      identityId: "user:founder",
      source: "zen-garden",
      kind: "activity",
      baseValue: 30,
      meta: { note: "Demo zen session (30 minutes)" },
    });

    const applied = EconomicEngineCore.applyEmissionForReward(raw);

    const econStatus = EconomicEngineCore.status();
    console.log(`💰 [Economic Engine Core] Initialized - ${econStatus.tokenCount} tokens, ${econStatus.emissionRuleCount} emission rules, ${econStatus.balanceCount} balances, ${econStatus.appliedRewardCount} applied rewards`);
  } catch (error) {
    console.warn("[Economic Engine Core] Initialization warning:", error);
  }

  // Initialize Agent Registry Core - Tier IV Subsystem (Agent Store + Health Layer)
  try {
    // Seed default agent configs
    AgentRegistryCore.ensureDefaultAgentsSeeded();

    const agentStatus = AgentRegistryCore.status();
    console.log(`🤖 [Agent Registry Core] Initialized - ${agentStatus.agentCount} agents registered (active=${agentStatus.activeCount}, degraded=${agentStatus.degradedCount}, error=${agentStatus.errorCount})`);
  } catch (error) {
    console.warn("[Agent Registry Core] Initialization warning:", error);
  }

  // Initialize GPT Agent Registry - Register all Custom GPTs as agents
  try {
    const { gptAgentRegistry } = await import("./gpt-agents/GPTAgentRegistry");
    // Auto-register all GPTs on startup (optional - can be done via API)
    if (process.env.AUTO_REGISTER_GPT_AGENTS === "true") {
      const results = await gptAgentRegistry.registerAll();
      console.log(`🤖 [GPT Agent Registry] Auto-registered ${results.success} GPTs (${results.failed} failed)`);
    } else {
      const stats = gptAgentRegistry.getStats();
      const activeCount = stats.byStatus?.Active || 0;
      const draftCount = stats.byStatus?.Draft || 0;
      console.log(`🤖 [GPT Agent Registry] Loaded ${stats.total} GPTs (${activeCount} Active, ${draftCount} Draft - ready for registration via API)`);
    }

    // Initialize Guardian Framework with Active agents
    try {
      const { guardianFramework } = await import("@dreamnet/guardian-framework-core");
      const allGPTs = gptAgentRegistry.getAllGPTs();
      const activeAgents = allGPTs
        .filter(gpt => gpt.status === "Active")
        .map(gpt => ({
          id: `gpt-${gpt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: gpt.name,
        }));
      
      if (activeAgents.length === 0) {
        console.warn("[Guardian Framework] No active agents found, skipping initialization");
      } else {
        await guardianFramework.initialize(activeAgents);
        console.log(`🛡️ [Guardian Framework] Initialized with ${activeAgents.length} personal drones`);

        // Start Guardian monitoring cycle (every 5 minutes)
        setInterval(async () => {
          try {
            await guardianFramework.runCycle();
          } catch (error: any) {
            console.warn("[Guardian Framework] Cycle warning:", error.message);
          }
        }, 5 * 60 * 1000); // Every 5 minutes
      }
    } catch (error: any) {
      console.error("[Guardian Framework] Initialization failed:", error.message);
      console.error("[Guardian Framework] Stack:", error.stack);
      console.warn("[Guardian Framework] Guardian routes will return 503 until initialized");
    }
  } catch (error) {
    console.warn("[GPT Agent Registry] Initialization warning:", error);
  }

    // Initialize DreamNet OS Core - Tier IV Subsystem (Global Status + Heartbeat Layer)
    try {
    // ShieldCore, SpiderWebCore, and DreamStateCoreInstance are already initialized above
    
    // Make systems available globally for auto-detection
    if (typeof global !== "undefined") {
      try {
        const { DREAMKEEPER_CORE } = await import("../../lib/dreamkeeperCore");
        const { DreamDefenseNet } = await import("../../lib/defenseBots");
        const { SurgeonAgent } = await import("../../lib/aiSurgeonAgents");
        const { EvolutionEngine } = await import("../../lib/evolutionEngine");
        
        (global as any).DREAMKEEPER_CORE = DREAMKEEPER_CORE;
        (global as any).DreamDefenseNet = DreamDefenseNet;
        (global as any).SurgeonAgent = SurgeonAgent;
        (global as any).EvolutionEngine = EvolutionEngine;
      } catch (error) {
        // Systems may not be available, continue
      }
    }

    // Run initial heartbeat with all subsystems
    const osStatus = DreamNetOSCore.run({
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
    
    const snapshot = osStatus.snapshot;
    console.log(`🖥️  [DreamNet OS Core] Initialized - Version ${snapshot.version.major}.${snapshot.version.minor}.${snapshot.version.patch} (${snapshot.version.label})`);
    console.log(`   💓 Heartbeat active - ${snapshot.subsystems.length} subsystems monitored`);
    console.log(`   📊 Health: Infra=${(snapshot.globalHealth.infraHealth * 100).toFixed(0)}%, Economy=${(snapshot.globalHealth.economyHealth * 100).toFixed(0)}%, Social=${(snapshot.globalHealth.socialHealth * 100).toFixed(0)}%, Pipeline=${(snapshot.globalHealth.dreamPipelineHealth * 100).toFixed(0)}%`);
    
    // Register alert notification handler (if available)
    try {
      const { registerAlertNotifier } = await import("@dreamnet/dreamnet-os-core/logic/alertNotifier");
      const { notificationEngine } = await import("./notification-engine");
      
      registerAlertNotifier(async (alert: any) => {
        try {
          // Send notification to admin/system wallet
          await notificationEngine.createNotification({
            recipientWallet: "system:admin", // Or get from config
            type: alert.severity === "critical" ? "system_alert" : "system_warning",
            title: `${alert.subsystem || "System"} Alert`,
            message: alert.message,
            data: {
              alertId: alert.id,
              subsystem: alert.subsystem,
              severity: alert.severity,
              details: alert.details,
            },
          }, true); // Send email
          
          console.log(`📬 [AlertNotifier] Sent notification for ${alert.severity} alert: ${alert.message}`);
        } catch (error) {
          console.error("[AlertNotifier] Failed to send notification:", error);
        }
      });
    } catch (error) {
      // Alert notifier not available, continue
    }

    // Initialize DreamNet Voice - Twilio SMS (Phase 2 - One Mouth) 📱
    try {
      const voiceModule = await import("../packages/dreamnet-voice-twilio");
      DreamNetVoiceTwilio = voiceModule.DreamNetVoiceTwilio;
      const voiceInitialized = await DreamNetVoiceTwilio.init();
      if (voiceInitialized) {
        console.log(`📱 [DreamNet Voice] Initialized - Twilio SMS active`);
        console.log(`   🗣️  DreamNet can now speak via SMS`);
      } else {
        console.warn(`📱 [DreamNet Voice] Not initialized - Twilio credentials not found`);
        console.warn(`   💡 Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and DREAMNET_VOICE_RECIPIENT env vars`);
      }
    } catch (error: any) {
      console.warn("[DreamNet Voice] Initialization warning:", error.message);
    }

    // Initialize Vercel Agent - Deployment Management 🚀 (LEGACY - Disabled by default)
    // Only initialize if explicitly enabled via ENABLE_VERCEL_AGENT env var
    if (process.env.ENABLE_VERCEL_AGENT === 'true') {
      try {
        const vercelModule = await import("../packages/dreamnet-vercel-agent");
        DreamNetVercelAgent = vercelModule.DreamNetVercelAgent;
        const vercelInitialized = await DreamNetVercelAgent.init();
        if (vercelInitialized) {
          console.log(`🚀 [Vercel Agent] Initialized - Ready to manage deployments`);
          const status = await DreamNetVercelAgent.status();
          console.log(`   📦 ${status.projectsFound} projects found`);
        } else {
          console.warn(`🚀 [Vercel Agent] Not initialized - Vercel token not found`);
          console.warn(`   💡 Set VERCEL_TOKEN env var or add via API Keeper`);
        }
      } catch (error: any) {
        console.warn("[Vercel Agent] Initialization warning:", error.message);
      }
    } else {
      console.log(`🚀 [Vercel Agent] Skipped (LEGACY - set ENABLE_VERCEL_AGENT=true to enable)`);
    }
    
    // Initialize DreamSnail Core - Privacy Lattice 🐌
    try {
      const snailModule = await import("../packages/dreamnet-snail-core");
      DreamSnailCore = snailModule.DreamSnailCore;
      // DreamSnailCore may not need explicit initialization, but we ensure it's loaded
      console.log(`🐌 [DreamSnail Core] Loaded - Privacy Lattice available`);
    } catch (error: any) {
      console.warn("[DreamSnail Core] Initialization warning:", error.message);
    }
    
    // Start continuous heartbeat (runs every 30 seconds)
    setInterval(() => {
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
    } catch (error) {
      console.warn("[DreamNet OS Core] Initialization warning:", error);
    }
    
    console.log("🧬 [Instant Mesh] Agent hybridization enabled");
    console.log("🔨 [Foundry] All agents connected - ready to build");
    console.log("📱 [Social Media Ops] CampaignMasterAgent ready for activation");
    console.log("🐌 [Dream Snail] Privacy layer active - Know-All Win-All mode");
    console.log("🌿 [Biomimetic Systems] All systems online");
    
    // 🧠 Initialize Super Brain + Drive Engine + Biomimetic Integration
    try {
      const { brainIntegration } = await import("./core/BrainIntegration");
      await brainIntegration.initialize();
      console.log("🧠 [Super Brain] Initialized - Autonomous orchestration active");
      console.log("🚀 [Drive Engine] Initialized - Packs are now self-motivated");
      console.log("🧬 [Biomimetic Integration] All systems hooked to Super Brain");
    } catch (error: any) {
      console.warn("[Super Brain] Initialization warning:", error.message);
    }
    
    // Legacy seeding and scheduled tasks
    try {
      const { registerHaloLoop: registerHaloLoopFn, haloTriggers: haloTriggersObj } = await import("@dreamnet/halo-loop");
      registerHaloLoopFn();
      haloTriggers = haloTriggersObj || {};
      
      try {
        const legacyReq = await loadLegacyLoader();
        const legacySeedModule = legacyReq<{ seedDreams?: () => Promise<void> }>("seed-dreams");
        legacySeedModule?.seedDreams?.().catch((err) => console.error("Failed to seed dreams:", err));
        
        const legacyDreamScoreEngine = legacyReq<{ startScheduledScoring?: () => void }>("dream-score-engine");
      } catch (error) {
        console.warn("[Legacy] Failed to load legacy modules:", error);
      }
      legacyDreamScoreEngine?.startScheduledScoring?.();
      
      const envConfig = getEnvConfig();
      if (envConfig.MESH_AUTOSTART) {
        startMesh().catch((error) =>
          console.error("Failed to start DreamNet mesh:", (error as Error).message),
        );
      }
    } catch (error) {
      console.warn("[Legacy Seeding] Initialization warning:", error);
    }
    
    let subsystemsReady = true;
    console.log("[Optional Subsystems] Initialization complete");
} // End of initOptionalSubsystems function
  
  // Heartbeat API routes
  app.use("/api/heartbeat", heartbeatRouter);
  
  // Jaggy API routes (The Silent Sentinel)
  app.use("/api/jaggy", jaggyRouter);
  
  // Shield Core API routes
  app.use("/api/shield", shieldRouter);
  
  // Star Bridge Lungs API routes
  app.use("/api/star-bridge", starBridgeRouter);
  
  // Control Plane API routes (kill-switch, rate limits)
  app.use("/api/control", controlRouter);
app.use("/api/admin", adminRouter);
  
  // Billable Actions API routes (two-phase commit)
  app.use("/api/billable", billableRouter);
  app.use("/api/health", healthRouter);
  
  // Standardized healthz endpoint for all services
  const healthzRouter = await import("./routes/healthz");
  app.use("/", healthzRouter.default);
  app.use("/api", healthzRouter.default);
  
  // Sunrise Report API routes
  const sunriseReportRouter = await import("./routes/sunrise-report");
  app.use("/api/sunrise-report", sunriseReportRouter.default);
  
  // DreamOps Constellation API routes
  const dreamopsRouter = await import("./routes/dreamops-constellation");
  app.use("/api/dreamops", dreamopsRouter.default);
  
  // Brand Grading API routes
  const brandGradingRouter = await import("./routes/brand-grading");
  app.use("/api/brand-grading", brandGradingRouter.default);
  
  // Geofencing API routes
  const geofenceRouter = await import("./routes/geofence");
  app.use("/api/geofence", geofenceRouter.default);
  
  // Heartbeat Cron API route (for Vercel cron)
  const heartbeatCronRouter = await import("./routes/heartbeat-cron");
  app.use("/api", heartbeatCronRouter.default);
  
  // Namecheap API routes
  const namecheapRouter = await import("./routes/namecheap");
  app.use("/api/namecheap", namecheapRouter.default);
  
  // Immune Swarm API routes
  const immuneSwarmRouter = await import("./routes/immune-swarm");
  app.use("/api/immune-swarm", immuneSwarmRouter.default);
  
  // Threat Memory API routes
  const threatMemoryRouter = await import("./routes/threat-memory");
  app.use("/api/threat-memory", threatMemoryRouter.default);
  
  // Swarm Fitness API routes
  const swarmFitnessRouter = await import("./routes/swarm-fitness");
  app.use("/api/swarm-fitness", swarmFitnessRouter.default);
  
  // Note: /health endpoint is already defined above (line 205) with DB health check
  app.use("/api/nerve", nerveRouter);
  app.use("/api/audit", auditRouter);
  app.use("/api/rbac", rbacRouter);
  
  // Voice API routes (Phase 2 - One Mouth)
  app.use("/api/voice", voiceRouter);
  app.use("/api/keys", apiKeysRouter);
  app.use("/api/env-keeper", envKeeperRouter);
  
  // Vercel Agent API routes (LEGACY - Only register if enabled)
  if (process.env.ENABLE_VERCEL_AGENT === 'true') {
    app.use("/api/vercel", vercelRouter);
  }
  
  // Debug summary endpoint (admin-only)
  app.use("/api/debug-summary", debugSummaryRouter);
  
  // Agent Gateway - AI-native ingress for ChatGPT, Cursor, Replit agents
  app.use("/api", agentGatewayRouter);
  
  // Ports Ops Panel - Port health + Env/API/Vercel ops (admin-only)
  app.use("/api", portsOpsRouter);
  
  // Agent Ops Panel - Agent activity tracking (admin-only)
  app.use("/api", agentOpsRouter);
  
  // Shield Risk Panel - Risk profiles and adaptive decisions (admin-only)
  app.use("/api", shieldRiskRouter);
  
  // Dead-Letter Buffer - Quarantine for critical conduit failures (admin-only)
  app.use("/api", deadLetterRouter);
  
  // Grid Lines API - Conduit heat metrics for DreamScope visualization (admin-only)
  app.use("/api", gridLinesRouter);
  
  // Directory API - Entity discovery and lookup (admin-only)
  app.use("/api", directoryRouter);
  
  // Networks API - Network blueprint information and bootstrap status (admin-only)
  app.use("/api", networksRouter);
  
  // Discovery API - Network discovery and mapping (admin-only)
  app.use("/api", discoveryRouter);
  
  // System Graph API - Internal topology inspection (ports, routes, wormholes)
  app.get("/api/system/graph", async (req, res) => {
    try {
      const { getSystemSnapshot } = await import("./system/graph");
      const snapshot = await getSystemSnapshot();
      res.json(snapshot);
    } catch (err) {
      console.error("Failed to build system graph:", err);
      res.status(500).json({ message: "Failed to build system graph" });
    }
  });
  
  // ChatGPT Agent Mode - Natural Language Interface (routes through AGENT_GATEWAY)
  app.use("/api/chatgpt-agent", chatgptAgentRouter);
  
  app.use("/api", createOperatorRouter());
  app.use("/api/whale", whaleRouter);
  app.use("/api/onboarding", onboardingRouter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// CRITICAL: Create server IMMEDIATELY - synchronous creation for Cloud Run
// Cloud Run requires the server to respond to health checks within seconds
console.log("[DreamNet] 🚀 Starting server initialization...");
console.log(`[DreamNet] Environment: ${NODE_ENV}, Port: ${ENV_PORT || 8080}`);

(async () => {
  try {
    console.log("[DreamNet] 📦 Creating HTTP server...");
    const server = createServer(app);
    console.log("[DreamNet] ✅ HTTP server created successfully");

  // Error handling middleware - must be last
  // Use centralized errorLogger for consistent error logging
  app.use(errorLogger);
  
  // Final error response handler (runs after errorLogger logs the error)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const traceId = (_req as any).traceId || 'unknown';

    // Don't expose internal error details in production
    const errorResponse: any = {
      ok: false,
      error: status >= 500 ? 'internal_server_error' : 'request_error',
      message: NODE_ENV === 'production' && status >= 500
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
        haloTriggers.recordError?.();
      } catch {
        // Ignore if haloTriggers not available
      }
    }
    
    // Don't throw - error handler should not throw
  });

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 8080 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = ENV_PORT || 8080;
    const host = "0.0.0.0";

    console.log(`[DreamNet] 🔧 Configuring server for ${host}:${port}...`);

    // Add error handlers BEFORE listen to catch any errors
    server.on('error', (error: any) => {
      console.error('[Server] HTTP server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${port} is already in use`);
        process.exit(1);
      }
      // Don't exit on other errors - let the server try to recover
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit - log and continue
    });

    process.on('uncaughtException', (error) => {
      console.error('[Server] Uncaught Exception:', error);
      console.error('[Server] Stack:', error.stack);
      // Don't exit immediately - give server a chance to log
      setTimeout(() => {
        console.error('[Server] Exiting due to uncaught exception');
        process.exit(1);
      }, 1000);
    });

    // Start listening IMMEDIATELY - don't wait for anything else
    // This is CRITICAL for Cloud Run - server must respond to health checks quickly
    console.log(`[DreamNet] 🎯 Starting server.listen() on ${host}:${port}...`);
    server.listen(port, host, () => {
      console.log(`[DreamNet] ✅ Server listening on ${host}:${port}`);
      console.log(`[DreamNet] ✅ Server started - /health endpoint available`);
    
    // Register routes asynchronously AFTER server is listening (non-blocking)
    (async () => {
      try {
        const routesIndex = await import("./routes/index");
        if (routesIndex.registerRoutes) {
          // Call it but ignore the returned server - we already have one
          await routesIndex.registerRoutes(app);
          console.log("✅ [Server] Routes registered");
        }
      } catch (error: any) {
        console.error("[Server] Failed to register some routes:", error.message);
        // Don't crash - server can still run with partial routes
      }
    })();
    
    // Setup vite AFTER server is listening (non-blocking)
    // This way if vite fails, server can still start
    (async () => {
      console.log("🔍 [Debug] Setting up Vite (non-blocking)...");
      try {
        const viteModule = await loadViteModule();
        if (app.get("env") === "development") {
          await viteModule.setupVite(app, server);
        } else {
          viteModule.serveStatic(app);
        }
        console.log("✅ [Vite] Static file serving configured");
      } catch (error: any) {
        console.error("[Vite] Failed to load vite module:", error.message);
        console.error("[Vite] Server will run API-only mode - frontend unavailable");
        // Server can still run - API routes will work fine
        // Don't let vite errors crash the server
      }
    })();
    
    // Initialize subsystems AFTER server is listening (non-blocking)
    // This ensures Cloud Run health checks pass immediately
    (async () => {
      try {
        console.log("⭐ [Star-Bridge Lungs] Starting initialization...");
        // Import Star Bridge Lungs package
        const starBridgeModule = await import("../packages/star-bridge-lungs");
        StarBridgeLungs = starBridgeModule.StarBridgeLungs || starBridgeModule.default;
        
        if (!StarBridgeLungs) {
          throw new Error("StarBridgeLungs not found in package");
        }
        
        // Run initial breath cycle
        const initialStatus = StarBridgeLungs.run({
          neuralMesh: NeuralMesh || null,
          quantumAnticipation: QuantumAnticipation || null,
          slugTimeMemory: SlugTimeMemory || null,
        });
        
        console.log(`⭐ [Star-Bridge Lungs] Initialized - ${initialStatus.chainMetrics.length} chains monitored`);
        console.log(`   🌬️  ${initialStatus.lastBreaths.length} breath snapshots`);
        console.log(`   🔗 Cross-chain breathwork active`);
        
        // Start continuous breath cycle (runs every 2 minutes)
        setInterval(() => {
          try {
            StarBridgeLungs.run({
              neuralMesh: NeuralMesh || null,
              quantumAnticipation: QuantumAnticipation || null,
              slugTimeMemory: SlugTimeMemory || null,
            });
          } catch (error) {
            console.warn("[Star-Bridge Lungs] Breath cycle warning:", error);
          }
        }, 2 * 60 * 1000);
        
        console.log(`   ⏱️  Breathing every 2 minutes - monitoring cross-chain activity`);
      } catch (error) {
        console.error("❌ [Star-Bridge Lungs] CRITICAL: Failed to initialize:", error instanceof Error ? error.message : error);
      }
    })();
    
    // Start Whale Pack control loop (runs every 5 minutes)
    import('./whale/controlLoop').then(({ startControlLoop }) => {
      startControlLoop(5 * 60 * 1000);
      console.log('[WhalePack] Control loop started');
    }).catch((err) => {
      console.error('[WhalePack] Failed to start control loop:', err);
    });
    
    // Initialize reliability system (if enabled)
    if (process.env.USE_RELIABILITY_SYSTEM === 'true') {
      (async () => {
        try {
          const { initializeReliabilitySystem } = await import('./core/dag-loader');
          await initializeReliabilitySystem().catch((error) => {
            console.warn('[Reliability] Failed to initialize:', error);
          });
        } catch (error: any) {
          console.warn('[Reliability] Could not load reliability system:', error.message);
        }
      })();
    }
    
    // Initialize optional subsystems asynchronously (non-blocking)
    // This runs in parallel with reliability system (if enabled)
    initOptionalSubsystems(app, server).catch((error) => {
      console.error("[Optional Subsystems] Failed to initialize:", error);
    });
    });
  } catch (error: any) {
    console.error("[DreamNet] ❌ Error during server initialization:", error);
    console.error("[DreamNet] Error stack:", error.stack);
    // CRITICAL: Even if initialization fails, try to start listening
    // Cloud Run needs the server to respond to health checks
    const port = ENV_PORT || 8080;
    const host = "0.0.0.0";
    console.log(`[DreamNet] ⚠️  Attempting emergency server start on ${host}:${port}...`);
    try {
      const emergencyServer = createServer(app);
      emergencyServer.listen(port, host, () => {
        console.log(`[DreamNet] ✅ Emergency server listening on ${host}:${port}`);
        console.log(`[DreamNet] ⚠️  Server running in degraded mode - some features may be unavailable`);
      });
    } catch (emergencyError: any) {
      console.error("[DreamNet] ❌ CRITICAL: Emergency server start failed:", emergencyError);
      console.error("[DreamNet] Exiting...");
      process.exit(1);
    }
  }
})();
}