import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { bootManager } from './bootSequence.js';
import { DockerPilot } from './pilots/DockerPilot.js';
import { SovereignPresence } from './pilots/SovereignPresence.js';
import { VirtualsFleetManager } from './suits/VirtualsFleetManager.js';
import { NearSuit } from './suits/NearSuit.js';
import { VeChainSuit } from './suits/VeChainSuit.js';
import { SolanaSuit } from './suits/SolanaSuit.js';
import { DiscordSuit } from './suits/DiscordSuit.js';
import { coherenceEngine } from './engine/CoherenceEngine.js';
import { UniversalSuit } from './suits/UniversalSuit.js';
import { DexScreenerSuit } from './suits/DexScreenerSuit.js';
import { CoinGeckoSuit } from './suits/CoinGeckoSuit.js';
import { BaseSuit } from './suits/BaseSuit.js';
import { HyperionSuit } from './suits/HyperionSuit.js';
import dotenv from 'dotenv';
// @ts-ignore - Sister package import
import { memorySystem } from '@dreamnet/memory-dna';
// @ts-ignore - Sister package import
import { dreamEventBus } from '@dreamnet/nerve';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Signal broadcast utility
export function swarmLog(source: string, message: string) {
    const log = {
        id: Math.random().toString(36).substr(2, 9),
        source,
        message,
        timestamp: new Date().toLocaleTimeString()
    };
    io.emit('swarm_log', log);
    console.log(`[${source}] ${message}`);

    // [INTELLIGENCE PERSISTENCE]
    // Every signal from Hyperion or other suits is inscribed into the Lizard Brain
    memorySystem.lizard.store(`LOG_${source}_${log.id}`, log, 3600).catch(() => { });
}

async function main() {
    console.log("🧠 [Control Core] Initializing Neural Pathways...");

    // 1. Run Homeostatic Boot
    const bootSuccess = await bootManager.boot();

    if (!bootSuccess) {
        console.error("❌ [FATAL] Boot Sequence Failed. Initiating shutdown.");
        process.exit(1);
    }

    // 2. Initialize Memory DNA
    try {
        await memorySystem.initialize();
        swarmLog('CORE', 'Triune Memory System Online (Lizard, Mammal, Cosmic).');
    } catch (e) {
        console.error("⚠️ [CRITICAL] Memory System Initialization Failed:", e);
    }

    // 2. Start Pulse Listener (Heartbeat)
    app.get('/health', (req, res) => {
        res.json({
            status: 'ALIVE',
            bootState: bootManager.getState(),
            uptime: process.uptime()
        });
    });

    // 2.1 Bridge Nerve Bus to Swarm Logs (Omni-Vision)
    dreamEventBus.subscribe('Agent.Thought', (envelope: any) => {
        const { agentName, step, totalSteps, thought } = envelope.payload;
        swarmLog(agentName.toUpperCase(), `[Thinking ${step}/${totalSteps}] ${thought}`);
    });

    io.on('connection', (socket) => {
        swarmLog('NERVE', `Terminal Handshake Established: ${socket.id}`);
    });

    // 3. Initialize Pilots
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
        const primos = new SovereignPresence(githubToken);
        await primos.wake();

        // We don't await the deploy cycle to keep server boot fast
        primos.deployToGitHub();
    } else {
        swarmLog('CORE', '⚠️ GITHUB_TOKEN missing. Primos is in stasis.');
    }

    // 3.1 Initialize Docker Orchestration
    const dockerPilot = new DockerPilot();
    await dockerPilot.wake();

    // 3.2 Initialize Virtuals Mercenary Fleet
    const virtualsFleet = new VirtualsFleetManager();
    // Virtuals wake is implicit in constructor for now

    // 3.3 Initialize NearSuit and VeChainSuit
    const nearSuit = new NearSuit();
    try { await nearSuit.wake(); } catch (e) { console.error('Failed to wake NearSuit', e); }

    const veChainSuit = new VeChainSuit();
    try {
        await veChainSuit.wake();
        // Arm the engine with the VeChain (MetaMask) suit
        coherenceEngine.setVeChainExecutionSuit(veChainSuit);
    } catch (e) {
        console.error('Failed to wake VeChainSuit', e);
    }

    const solanaSuit = new SolanaSuit();
    try {
        await solanaSuit.wake();
        // Arm the engine with the suit
        coherenceEngine.setExecutionSuit(solanaSuit);
    } catch (e) {
        console.error('Failed to wake SolanaSuit', e);
    }

    const discordSuit = new DiscordSuit();
    try { await discordSuit.wake(); } catch (e) { console.error('Failed to wake DiscordSuit', e); }

    const dexScreenerSuit = new DexScreenerSuit();
    try { await dexScreenerSuit.wake(); } catch (e) { console.error('Failed to wake DexScreenerSuit', e); }

    const coinGeckoSuit = new CoinGeckoSuit();
    try {
        await coinGeckoSuit.wake();
        // Feed intelligence to the engine
        coherenceEngine.setIntelligenceSuits(coinGeckoSuit, dexScreenerSuit);
    } catch (e) {
        console.error('Failed to wake CoinGeckoSuit', e);
    }

    const baseSuit = new BaseSuit();
    try {
        await baseSuit.wake();
    } catch (e) {
        console.error('Failed to wake BaseSuit', e);
    }

    const hyperionSuit = new HyperionSuit();
    try {
        await hyperionSuit.wake();
    } catch (e) {
        console.error('Failed to wake HyperionSuit', e);
    }

    // 3.5 Initialize The Swarm (Universal Suit)
    // Wakes up the 138+ Non-Financial Agents from the Registry
    const universalSuit = new UniversalSuit();
    try { await universalSuit.wake(); } catch (e) { console.error('Failed to wake UniversalSuit', e); }

    // 3.6 Start Mercenary Engines
    coherenceEngine.start();

    // 4. Start Server
    httpServer.listen(PORT, () => {
        console.log(`🚀 [Control Core] Cortex Active on PORT ${PORT}`);
        console.log(`   - Mode: ${process.env.NODE_ENV}`);
        console.log(`   - Identity: DreamNet Prime ($DREAM)`);

        // Demo Pulse
        setInterval(() => {
            swarmLog('CORE', 'Homeostasis within normal parameters.');
        }, 15000);
    });
}

// Handle termination signals for graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 [SIGTERM] Shutting down Control Core...');
    process.exit(0);
});

// Only run the server if this file is executed directly
import { fileURLToPath } from 'url';
if (import.meta.url === `file://${fileURLToPath(import.meta.url)}` || process.argv[1]?.endsWith('server.ts')) {
    main();
}
