import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GenericFleetAgent } from '../server/core/agents/GenericFleetAgent';
import { natsService } from '../server/services/NatsService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function activateSwarm() {
    console.log("🚀 Initializing DreamNet Swarm Activation Protocol...");

    // 1. Initialize NATS for communication
    try {
        await natsService.initialize();
    } catch (err) {
        console.error("❌ Failed to connect to NATS. Is the server running?");
        return;
    }

    // 2. Load Agent Inventory
    const inventoryPath = join(__dirname, "..", "COMPREHENSIVE_AGENT_INVENTORY.json");
    let agents = [];
    try {
        const inventory = JSON.parse(readFileSync(inventoryPath, "utf-8"));
        agents = inventory.agents;
    } catch (err) {
        console.error("❌ Failed to load agent inventory:", err);
        return;
    }

    console.log(`📡 Discovered ${agents.length} potential agents in inventory.`);

    // 3. Instantiate Agents (Simulating the 500+ swarm)
    // We'll multiply the inventory if needed to reach 500+, 
    // but for now let's just activate the 143 we have as a first wave.
    const activeSwarm: GenericFleetAgent[] = [];
    
    for (const agentData of agents) {
        if (agentData.status === 'stub') continue;
        
        const agent = new GenericFleetAgent(
            agentData.id,
            agentData.name,
            agentData.type
        );
        activeSwarm.push(agent);
    }

    console.log(`✅ Wave 1: ${activeSwarm.length} agents activated and self-discovered.`);

    // 4. Handshake with ARIA
    console.log("🤝 Handshaking with ARIA Campaign Master...");
    await natsService.publish('dreamnet.agents.aria.onboarding', {
        swarmSize: activeSwarm.length,
        status: 'ready',
        timestamp: new Date().toISOString()
    });

    // 5. Broadcast first task to swarm
    console.log("📢 Broadcasting initial swarm task: 'Infrastructure Stabilization'...");
    await natsService.publish('dreamnet.swarm.broadcast.tasks', {
        task: 'Monitor system health and report any ERR_MODULE_NOT_FOUND to the Mesh.',
        requirements: ['server', 'system', 'package'],
        priority: 'high'
    });

    console.log("✨ Swarm Activation Sequence Complete.");
}

activateSwarm().catch(console.error);
