import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { bootManager } from './bootSequence.js';
import { Primo } from './pilots/Primo.js';
import { DockerPilot } from './pilots/DockerPilot.js';
import { SovereignPresence } from './pilots/SovereignPresence.js';
import { VirtualsFleetManager } from './suits/VirtualsFleetManager.js';
import { NearSuit } from './suits/NearSuit.js';
import { VeChainSuit } from './suits/VeChainSuit.js';
import { SolanaSuit } from './suits/SolanaSuit.js';
import { DiscordSuit } from './suits/DiscordSuit.js';
import { coherenceEngine } from './engine/CoherenceEngine.js';
import dotenv from 'dotenv';

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
}

async function main() {
    console.log("🧠 [Control Core] Initializing Neural Pathways...");

    // 1. Run Homeostatic Boot
    const bootSuccess = await bootManager.boot();

    if (!bootSuccess) {
        console.error("❌ [FATAL] Boot Sequence Failed. Initiating shutdown.");
        process.exit(1);
    }

    // 2. Start Pulse Listener (Heartbeat)
    app.get('/health', (req, res) => {
        res.json({
            status: 'ALIVE',
            bootState: bootManager.getState(),
            uptime: process.uptime()
        });
    });

    io.on('connection', (socket) => {
        swarmLog('NERVE', `Terminal Handshake Established: ${socket.id}`);
    });

    // 3. Initialize Pilots
    /*
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
        const primos = new Primo(githubToken);
     // 2. Initialize Pilots (Agents)
    await primos.wake();
    
    // We don't await the deploy cycle to keep server boot fast
    primos.deployToGitHub(); 
    } else {
        swarmLog('CORE', '⚠️ GITHUB_TOKEN missing. Primos is in stasis.');
    }
    */

    // 3.1 Initialize Docker Orchestration
    const dockerPilot = new DockerPilot();
    await dockerPilot.wake();

    // 3.2 Initialize Virtuals Mercenary Fleet
    // const virtualsFleet = new VirtualsFleetManager();

    // 3.3 Initialize NearSuit and VeChainSuit
    const nearSuit = new NearSuit();
    try { await nearSuit.wake(); } catch (e) { console.error('Failed to wake NearSuit', e); }

    const veChainSuit = new VeChainSuit();
    try { await veChainSuit.wake(); } catch (e) { console.error('Failed to wake VeChainSuit', e); }

    const solanaSuit = new SolanaSuit();
    try { await solanaSuit.wake(); } catch (e) { console.error('Failed to wake SolanaSuit', e); }

    const discordSuit = new DiscordSuit();
    try { await discordSuit.wake(); } catch (e) { console.error('Failed to wake DiscordSuit', e); }

    // 3.4 Start Mercenary Engines
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

main();
