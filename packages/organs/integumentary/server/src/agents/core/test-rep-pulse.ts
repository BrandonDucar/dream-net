import { swarmPheromones } from './SwarmPheromoneService.js';

async function pulse() {
    console.log("🚀 [PheromonePulse] Igniting the Sovereign Grid...");

    // 1. Seed Global Swarm Scent
    await swarmPheromones.markTrail('reputation:GLOBAL_SWARM', true, 120); // SWARM level
    console.log("✅ Seeded GLOBAL_SWARM (120 SCENT)");

    // 2. Seed Antigravity Core Agents
    await swarmPheromones.markTrail('reputation:Kyoshin', true, 450); // COLONY level
    await swarmPheromones.markTrail('reputation:PippinSoul', true, 850); // QUEEN level
    await swarmPheromones.markTrail('reputation:TheResonance', true, 300); // COLONY level
    await swarmPheromones.markTrail('reputation:Gordon', true, 900); // QUEEN level
    await swarmPheromones.markTrail('reputation:Antigravity', true, 50); // SWARM level

    console.log("✅ Seeded Core Agent reputations.");
    console.log("🌿 Swarm Scent is now manifesting.");
}

pulse().catch(console.error);
