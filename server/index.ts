import express, { type Express, type Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { legacyRequire } from "./legacy/loader";
import { startMesh } from "./mesh";
import { createMeshRouter } from "./mesh/router";
import { createAgentRouter } from "./routes/agent";
import { createForgeRouter } from "./routes/forge";
import { createHaloRouter } from "./routes/halo";
import { createGraftRouter } from "./routes/graft";
import { createGraftedRouter } from "./routes/grafted";
import { createDnaRouter } from "./routes/dna";
import { createResonanceRouter } from "./routes/resonance";
import { createAliveRouter } from "./routes/alive";
import { createOperatorRouter } from "./routes/operator";
import { createSquadRouter } from "@dreamnet/squad-builder";
import { createEventRouter, createWormholeRouter } from "@dreamnet/event-wormholes";
import { createSporeRouter } from "@dreamnet/spore-engine";
import { createFabricRouter } from "@dreamnet/dark-fabric";
// import { createMediaRouter } from "./routes/media"; // Temporarily disabled - @dreamnet/media-vault missing
import { createMetricsRouter } from "./routes/metrics";
import { createOrdersRouter } from "./routes/orders";
import { createPublicRouter } from "./routes/public";
// import { createPosterRouter } from "./routes/poster"; // Temporarily disabled - @dreamnet/media-vault missing
import { createRewardsRouter } from "./routes/rewards";
import { createDreamRouter } from "./routes/dream";
import { createDreamInteractionsRouter } from "./routes/dream-interactions";
import { createDreamContributionsRouter } from "./routes/dream-contributions";
import { createWolfPackRouter } from "./routes/wolf-pack";
import { createSuperSpineRouter } from "./routes/super-spine";
import { createFleetsRouter } from "./routes/fleets";
import { createCustomGPTFleetsRouter } from "./routes/custom-gpt-fleets";
import { createSocialMediaOpsRouter } from "./routes/social-media-ops";
import { createInstantMeshRouter } from "./routes/instant-mesh";
import { createFoundryRouter } from "./routes/foundry";
import { createMediaListRouter } from "./routes/media-list";
import { createEmailRouter } from "./routes/email";
import { createDreamSnailRouter } from "./routes/dream-snail";
import { createBiomimeticSystemsRouter } from "./routes/biomimetic-systems";
import { registerHaloLoop, haloTriggers } from "@dreamnet/halo-loop";
import { NeuralMesh } from "@dreamnet/neural-mesh";
import { QuantumAnticipation } from "@dreamnet/quantum-anticipation";
import { SquadAlchemy } from "@dreamnet/squad-alchemy";
import { WolfPack } from "@dreamnet/wolf-pack";
import { OctopusExecutor } from "@dreamnet/octopus-executor";
import { SlugTimeMemory } from "@dreamnet/slug-time-memory";
import { StarBridgeLungs } from "@dreamnet/star-bridge-lungs";
import { PredatorScavengerLoop } from "@dreamnet/predator-scavenger";
import { DreamCortex } from "@dreamnet/dream-cortex";
import { ReputationLattice } from "@dreamnet/reputation-lattice";
import { NarrativeField } from "@dreamnet/narrative-field";
import { IdentityGrid } from "@dreamnet/identity-grid";
import { DreamVault } from "@dreamnet/dream-vault";
import { DreamShop } from "@dreamnet/dream-shop";
import { FieldLayer } from "@dreamnet/field-layer";
import { DreamBetCore } from "@dreamnet/dreambet-core";
import { ZenGardenCore } from "@dreamnet/zen-garden-core";
import { CivicPanelCore } from "@dreamnet/civic-panel-core";
import { DreamTankCore } from "@dreamnet/dream-tank-core";
import { LiquidityEngine } from "@dreamnet/liquidity-engine";
import { SocialHubCore } from "@dreamnet/social-hub-core";
import { InitRitualCore } from "@dreamnet/init-ritual-core";
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";
import { DreamNetOSCore } from "@dreamnet/dreamnet-os-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { AISEOCore } from "@dreamnet/ai-seo-core";
import { EnvKeeperCore } from "@dreamnet/env-keeper-core";
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
import { initDirectory } from "@dreamnet/directory/bootstrap";
import { WebhookNervousCore } from "@dreamnet/webhook-nervous-core";
import { JaggyCore } from "@dreamnet/jaggy-core";
import { DreamSnailCore } from "@dreamnet/dreamnet-snail-core";
import { DreamNetVoiceTwilio } from "@dreamnet/dreamnet-voice-twilio";
import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";
import { traceIdMiddleware } from "./middleware/traceId";
import { idempotencyMiddleware } from "./middleware/idempotency";
import { tierResolverMiddleware } from "./middleware/tierResolver";
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
import { controlCoreMiddleware } from "@dreamnet/dreamnet-control-core/controlCoreMiddleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request flow: Trace → Idempotency → Tier Resolver → Control Core → Route Handler
// Trace ID middleware - adds X-Trace-Id to all requests
app.use(traceIdMiddleware);

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
  haloTriggers.recordRequest();
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
app.use("/api", createSquadRouter());
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
  app.use("/api", createSuperSpineRouter());
  app.use("/api", createFleetsRouter());
  app.use("/api", createCustomGPTFleetsRouter());
  app.use("/api", createSocialMediaOpsRouter());
  app.use("/api", createInstantMeshRouter());
  app.use("/api", createFoundryRouter());
  app.use("/api", createMediaListRouter());
  app.use("/api", createEmailRouter());
  app.use("/api", createDreamSnailRouter());
  app.use("/api", createBiomimeticSystemsRouter());
  
  // Initialize instant mesh, foundry, and social media ops on startup
  console.log("⚡ [Instant Mesh] Zero-delay event routing active");
  
  // Declare variables for systems that need to be shared across initialization
  let ShieldCore: any;
  let SpiderWebCore: any;
  let OrcaPackCoreInstance: any;
  let WhalePackCoreInstance: any;
  let DreamStateCoreInstance: any;
  
  // Initialize Neural Mesh (N-Mesh) - Tier II Subsystem
  try {
    const { dreamNetOS } = await import("./core/dreamnet-os");
    const meshStatus = NeuralMesh.status();
    console.log(`🧠 [Neural Mesh] Initialized with ${meshStatus.synapses.count} synapses, ${meshStatus.memory.count} memory traces`);
  } catch (error) {
    console.warn("[Neural Mesh] Initialization warning:", error);
  }

  // Initialize Quantum Anticipation Layer (QAL) - Tier II Subsystem
  try {
    const qalStatus = QuantumAnticipation.status();
    console.log(`🔮 [Quantum Anticipation] Initialized - Last run: ${qalStatus.lastRunAt ? new Date(qalStatus.lastRunAt).toISOString() : "never"}`);
  } catch (error) {
    console.warn("[Quantum Anticipation] Initialization warning:", error);
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
    console.log(`🐺 [Wolf-Pack] Initialized - Active targets: ${wolfStatus.activeTargets.length}`);
  } catch (error) {
    console.warn("[Wolf-Pack] Initialization warning:", error);
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

  // Initialize Star-Bridge Lungs - Tier II Subsystem (Cross-Chain Breathwork) ⭐
  try {
    // Run initial breath cycle
    const initialStatus = StarBridgeLungs.run({
      neuralMesh: NeuralMesh,
      quantumAnticipation: QuantumAnticipation,
      slugTimeMemory: SlugTimeMemory,
    });
    
    console.log(`⭐ [Star-Bridge Lungs] Initialized - ${initialStatus.chainMetrics.length} chains monitored`);
    console.log(`   🌬️  ${initialStatus.lastBreaths.length} breath snapshots`);
    console.log(`   🔗 Cross-chain breathwork active`);
    
    // Start continuous breath cycle (runs every 2 minutes)
    setInterval(() => {
      StarBridgeLungs.run({
        neuralMesh: NeuralMesh,
        quantumAnticipation: QuantumAnticipation,
        slugTimeMemory: SlugTimeMemory,
      });
    }, 2 * 60 * 1000); // Every 2 minutes
    
    console.log(`   ⏱️  Breathing every 2 minutes - monitoring cross-chain activity`);
  } catch (error) {
    console.warn("[Star-Bridge Lungs] Initialization warning:", error);
  }

  // Initialize Predator–Scavenger Loop (PSL) - Tier II Subsystem (Final Metabolic Organ)
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

  // Initialize Dream State Core - Governance, Passports, Proposals 🏛️
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

  // Initialize DreamState (Governance Layer: Passports, Offices, Cabinets) 🏛️
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

  // Initialize Directory - Entity Discovery & ID Registry 🔍
  try {
    await initDirectory();
  } catch (error: any) {
    console.warn("[Directory] Initialization warning:", error.message || error);
  }

  // Bootstrap from DreamNetCoreBlueprint - Network Configuration Template 🌐
  // IMPORTANT: Only DreamNetCoreBlueprint auto-bootstraps on startup.
  // Other blueprints (e.g., TravelNetBlueprint) are discoverable via /api/networks/blueprints
  // but remain inactive until explicitly bootstrapped via bootstrapFromBlueprint().
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

  // Initialize Nerve Fiber Event Fabric 🧠
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
    
    // Initialize runtime context
    RuntimeBridgeCore.initContext({
      DreamVault: DreamVault,
      DreamShop: DreamShop,
      NeuralMesh: NeuralMesh,
    });
    
    // Start runtime loop (runs every 30 seconds)
    RuntimeBridgeCore.startLoop(30 * 1000);

    const runtimeStatus = RuntimeBridgeCore.getStatus();
    console.log(`🌉 [Runtime Bridge Core] Initialized`);
    console.log(`   ⚙️  Runtime context & cycle management active`);
  } catch (error) {
    console.warn("[Runtime Bridge Core] Initialization warning:", error);
  }

  // Initialize Orchestrator Core - System Orchestration 🔄
  try {
    const { OrchestratorCore } = await import("@dreamnet/orchestrator-core");
    
    // Start orchestrator loop (runs every 60 seconds)
    OrchestratorCore.startIntervalLoop({
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

    // Initialize Vercel Agent - Deployment Management 🚀
    try {
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
  
  // Billable Actions API routes (two-phase commit)
  app.use("/api/billable", billableRouter);
  app.use("/api/health", healthRouter);
  
  // Simple public health check endpoint for Railway/Docker/K8s
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      ok: true, 
      service: "dreamnet-api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  app.use("/api/nerve", nerveRouter);
  app.use("/api/audit", auditRouter);
  app.use("/api/rbac", rbacRouter);
  
  // Voice API routes (Phase 2 - One Mouth)
  app.use("/api/voice", voiceRouter);
  app.use("/api/keys", apiKeysRouter);
  app.use("/api/env-keeper", envKeeperRouter);
  
  // Vercel Agent API routes
  app.use("/api/vercel", vercelRouter);
  
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
  
  // ChatGPT Agent Mode - Natural Language Interface (routes through AGENT_GATEWAY)
  app.use("/api/chatgpt-agent", chatgptAgentRouter);
  
  app.use("/api", createOperatorRouter());

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

// Public health endpoint used by Railway and other platforms for liveness checks
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "dreamnet-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

(async () => {
  const legacyRoutesModule = legacyRequire<{ registerRoutes?: (app: Express) => Promise<Server> }>("routes");

  if (!legacyRoutesModule?.registerRoutes) {
    throw new Error("Legacy routes module not available. Cannot start DreamNet server.");
  }

  const server = await legacyRoutesModule.registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    if (status >= 500) {
      haloTriggers.recordError();
    }
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 3000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    log(`serving on port ${port}`);
    console.log(`[DreamNet] Server started - /health endpoint available`);
    
    // Initialize optional subsystems asynchronously (non-blocking)
    initOptionalSubsystems(app, server).catch((error) => {
      console.error("[Optional Subsystems] Failed to initialize:", error);
    });
  });
})();
