import { quantumFamily } from '../server/core/QuantumFamily.js';

async function checkSwarm() {
    const count = quantumFamily.getPopulationCount();
    console.log(`📊 [Status] Total Quantum Family Population: ${count}`);
    
    // Get a sample of the latest agents
    const agents = Array.from((quantumFamily as any).agents.values()).slice(-5);
    console.log("🏙️ [Status] Latest Citizens:");
    agents.forEach((a: any) => {
        console.log(` - ${a.id} (FID: ${a.fid}, Block: ${a.birthBlock})`);
    });
}

checkSwarm();
