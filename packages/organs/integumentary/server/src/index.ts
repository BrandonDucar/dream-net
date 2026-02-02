import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Environment Variables (Root + Local)
const rootEnv = path.resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv });
// Load Local (overrides root)
dotenv.config();

import express, { type Express, type Request, Response, NextFunction } from "express";
import { Router } from "express";

// HEAD imports
import { ReliabilityGuard } from "./agents/reliability-guard.js";
import { SentinelAgent } from "./agents/sentinel-agent.js";
import { ForgeService } from "./services/ForgeService.js";
import ntagRouter from './routes/ntag.js';

// Feature imports
import { startMesh } from './mesh/index.js';
import { createMeshRouter } from './mesh/router.js';
import { getEnvConfig, PORT as ENV_PORT, ALLOWED_ORIGINS, OPERATOR_WALLETS, INIT_SUBSYSTEMS, MESH_AUTOSTART, INIT_HEAVY_SUBSYSTEMS, NODE_ENV } from './config/env.js';
import { registerAlertNotifier } from "@dreamnet/dreamnet-os-core";
import { createGodViewRouter } from './routes/god-view.js';

// 🔌 WIRED ORGANS (Operation Plug In) - DISABLED FOR BOOT RECOVERY
import { createHaloRouter } from "@dreamnet/halo-loop";
import { createForgeRouter } from "@dreamnet/card-forge-pro";
import { createAliveRouter } from "@dreamnet/alive-mode";
import { createDnaRouter } from "@dreamnet/memory-dna";
import { createGraftRouter } from "@dreamnet/graft-engine";
import { createSquadRouter } from "@dreamnet/squad-builder";
import { createWormholeRouter } from "@dreamnet/event-wormholes";
import { createSporeRouter } from "@dreamnet/spore-engine";
import { createFabricRouter } from "@dreamnet/dark-fabric";
import { createOrdersRouter } from "@dreamnet/orders";
import { createRewardsRouter } from "@dreamnet/rewards-engine";
import { createLiquidityRouter } from "@dreamnet/liquidity-engine";
import { createMetricsRouter } from "@dreamnet/metrics-engine";

import opsRouter from './routes/ops.js';
import factoryRouter from './routes/factory.js';
import intentRouter from './routes/intent.js';

import { Telepathy, QuantumMechanic } from "@dreamnet/nerve";

// Lazy import vite.ts to avoid issues in production
let viteModuleCache: any = null;

async function loadViteModule() {
  if (!viteModuleCache) {
    viteModuleCache = await import('./vite.js');
  }
  return viteModuleCache;
}

// Initialize Express
// Initialize Organism (DreamNet)
async function bootstrap() {
  console.log("🌌 DreamNet Awakening Protocol Initiated...");
  console.log("🦾 [DreamNet] Core Systems Online.");

  // HEAD: Night Watchman Initialization
  const reliabilityGuard = new ReliabilityGuard();
  const sentinel = new SentinelAgent();

  // 0. Sovereign Validation (Masters of the Stack Principle)
  const { BootGuard } = await import('./core/BootGuard.js');
  BootGuard.validate();
  await BootGuard.checkConnectivity();

  // 1. Ignite the Spine (Nervous System)
  const { NERVE_BUS } = await import('@dreamnet/nerve');
  const { initNerveFabric } = await import('@dreamnet/nerve/init.js');
  const { dreamScope } = initNerveFabric();
  const { KineticBridge } = await import('./core/LWS.js');
  console.log("   - [1/5] Nerve Spine Ignited (Sensors Online)");

  // 1.5 Operation Hydra: Agent Mitosis Listener 🐍
  NERVE_BUS.subscribe('System.ReinforcementRequested', async (event: any) => {
    console.log(`[Hydra] 🐍 Reinforcement Requested by ${event.payload.targetAgentId}. Reason: ${event.payload.reason}`);

    try {
      const { runSquadAlchemyCycle } = await import('@dreamnet/squad-alchemy/engine/squadAlchemy.js');
      const ctx = {
        // Context placeholder
      };
      const decisions = runSquadAlchemyCycle(ctx);

      decisions.forEach(d => {
        if (d.action === 'clone') {
          console.log(`[Hydra] 🧬 CLONING INITIATED: ${d.newSquads?.[0]?.id}`);
          // Future: Spawn Process Hook
        }
      });
    } catch (err) {
      console.error("[Hydra] Alchemy Cycle Failed:", err);
    }
  });

  // 2. Awaken the Mind (Triune Memory) & Connections (Mycelium)
  const { epigenetics } = await import('@dreamnet/memory-dna');
  epigenetics.subscribeToTrauma((hash, count) => {
    NERVE_BUS.publish('System.TraumaDetected', {
      eventType: 'System.TraumaDetected',
      source: 'EpigeneticMemory',
      payload: { traumaHash: hash, crashCount: count },
      eventId: `TRAUMA-${hash}-${Date.now()}`,
      timestamp: Date.now()
    } as any);
  });
  console.log("   - [2/5] Triune Memory & Mycelial Network Active (Trauma Hooks Wired)");

  // 3. Start the Heartbeat (Metabolism)
  const { VibeConductor } = await import('./agents/vibe-conductor.js');
  const conductor = new VibeConductor();
  conductor.start();
  console.log("   - [3/5] Circulatory System Pumping (VibeConductor)");

  // 4. Initialize the Body (Express Server)
  const app: Express = express();
  const port = ENV_PORT;
  const host = "0.0.0.0";

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = ALLOWED_ORIGINS || ["*"];
    if (allowed.includes(origin as string) || allowed.includes("*")) {
      res.header("Access-Control-Allow-Origin", origin || "*");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health
  app.get("/health", (req, res) => {
    res.json({ status: "ALIVE", version: "1.0.0", mode: NODE_ENV, pulse: "STRONG", watchman: "ACTIVE" });
  });

  app.get("/api/system/thermodynamics", (req, res) => {
    // res.json(getSystemThermodynamics());
    res.json({ status: "simulated" });
  });

  // API Layers
  const apiRouter = Router();
  apiRouter.use("/mesh", createMeshRouter());
  apiRouter.use("/ops", opsRouter);
  apiRouter.use("/god-view", createGodViewRouter()); // The Observatory
  apiRouter.use("/factory", factoryRouter);
  apiRouter.use("/ntag", ntagRouter);
  apiRouter.use("/intent", intentRouter);


  // Welcome Agent
  apiRouter.post("/agents/welcome", async (req, res) => {
    const { welcomeAgent } = await import('./agents/WELCOME.js');
    const result = await welcomeAgent(req.body);
    res.json(result);
  });

  app.use("/api", apiRouter);

  // 5. Open the Eyes (Serve httpServer)
  const { Server: HttpServer } = await import("http");
  const httpServer = new HttpServer(app);

  if (NODE_ENV === "production") {
    const { serveStatic } = await import('./vite.js');
    serveStatic(app);
  } else {
    const { setupVite } = await loadViteModule();
    await setupVite(app, httpServer);
  }

  // 5.5 Ignite the Kinetic Bridge (Laminar WebSockets)
  const laminarWS = new KineticBridge(httpServer);

  // 5.6 Awaken the Pineal Gland (Dream Circuit)
  const { DreamCircuit } = await import('./core/DreamCircuit.js');
  const dreamCircuit = new DreamCircuit();
  dreamCircuit.on('state_change', (state) => {
    console.log(`[DreamNet] 🧬 State Shift Detected: ${state.mode}`);
  });
  console.log("   - [5.6] Pineal Gland Awakened (Dream Circuit Active)");

  // 5.7 Ignite the Dutch Oven (Sovereign Solver)
  const { IntentGenerator, SolverAuditService } = await import('@dreamnet/nerve');

  const intentGen = new IntentGenerator();
  const dutchOven = new SolverAuditService();

  console.log("   - [5.7] Dutch Oven Pre-Heated (Solver Audit Service Active)");

  // Test Cook
  const testIntent = intentGen.forgeIntent({ type: 'TEST_MEV_CAPTURE', value: '1000000000000000000' });
  dutchOven.audit(testIntent);

  // Execute Resilient Safe Boot (Immune Response)
  const { executeSafeBoot } = await import('./core/safe-boot.js');
  const resilientBoot = await executeSafeBoot();
  if (!resilientBoot.success) {
    console.error("[Fatal] Organism Rejected Boot:", resilientBoot.failedAt);
  }

  const { bootManager } = await import("@dreamnet/dreamnet-control-core/bootSequence");
  const bootSuccess = await bootManager.boot();

  // Start Server
  const server = httpServer.listen(port, host as any, async () => {
    console.log(`[DreamNet] ALIVE at http://${host}:${port} [${NODE_ENV}]`);
    console.log(`[DreamNet] The Organism is Awake.`);

    // 6. Activatte Defenses (Immune System)
    const { Aethersafe } = await import('@dreamnet/aethersafe/Immunity');
    Aethersafe.startSurveillance();
    console.log("   - [4/6] Aethersafe Immune System Online (T-Cells Patrolling)");

    // 7. Seed the Environment (Pheromones)
    // await import('@dreamnet/memory-dna/systems/PheromoneStore');
    console.log("   - [5/6] Pheromone Store Active (Stigmergy Enabled)");

    // 8. Awaken the Guilds (Permaculture)
    const { AgentGuild, WolfPackFundingAgent } = await import('@dreamnet/agents');
    const { FlashTrader: flashTraderInstance } = await import('./agents/FlashTrader.js');
    const { wolfPackOutreachService } = await import('./services/WolfPackOutreachService.js');
    const { submissionEngine } = await import('./services/HackathonSubmissionService.js');

    const coreGuild = new AgentGuild("CoreGuild");
    coreGuild.addMember("FlashTrader", flashTraderInstance as any);

    const wolfFundingAgent = new WolfPackFundingAgent("HungryWolf");
    coreGuild.addMember("WolfPackFunding", wolfFundingAgent as any);

    coreGuild.boot(); // Initializes the garden bed
    wolfFundingAgent.ignite();
    console.log("   - [WolfPack] Funding Agent Ignite + Submission Engine Linked");

    // 9. Economic Synchronization (Avenue 21)
    const { clanker } = await import('./services/ClankerService.js');
    console.log("   - [Clanker] Economic Spine Synchronized (Base V4)");

    // 10. Start the Global Sensorium (Avenue 28/29) 🎯
    const { GlobalScanningService } = await import('./services/GlobalScanningService.js');
    const { NERVE_BUS: nerveBusInstance } = await import('@dreamnet/nerve');
    const scanner = new GlobalScanningService(nerveBusInstance);

    if (process.env.TRIGGER_RECON === 'true') {
      scanner.triggerReconPulse().catch(e => console.error('[Scanning] Startup pulse failed:', e));
    }
    console.log("   - [Sensorium] Global Scanning Team Active (Avenue 28)");

    // 11. Activate OnchainTV (The Sovereign Stream) 📺
    const { streamerAgent } = await import('./agents/StreamerAgent.js');
    streamerAgent.startBroadcast();
    console.log("   - [OnchainTV] Sovereign Stream LIVE (Avenue 14)");

    console.log("   - [6/6] Agent Guilds Blooming (Companion Planting)");

    // 12. Activate the 143-Agent Swarm (Citizen Hub)
    const { CitizenPulseHub } = await import('./agents/CitizenPulseHub.js');
    const activatedCount = await CitizenPulseHub.activateSwarm();
    console.log(`   - [Citizen Hub] Swarm Active: ${activatedCount} unique agents pulsing.`);

    // 13. [NEW] Phase XXXIX-C: Synaptic Arbitrage & Sovereign Oracles
    const { PriceOracle } = await import('../../respiratory/agents/src/specialized/PriceOracle.js');
    const { arbitrageService } = await import('./services/ArbitrageService.js');

    const priceOracle = new PriceOracle({ id: 'PRICE_GAZER', name: 'PriceOracle' });
    await priceOracle.ignite();
    console.log("   - [Oracle] Price Gazer Active. Synaptic Arbitrage Enabled (Phase XXXIX-C).");
  });
}

const isMain = import.meta.url === `file://${fileURLToPath(import.meta.url)}` || process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('server/src/index.js');

if (isMain) {
  bootstrap().catch(err => {
    console.error("[Fatal] Boot failed:", err);
    process.exit(1);
  });
}