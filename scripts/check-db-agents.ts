import "dotenv/config";
import { db, waitDb } from '../server/db';
import { swarmAgents } from '../shared/schema';

async function checkDbAgents() {
    await waitDb;
    console.log("🔍 [Database] Querying Swarm Agents...");

    const agents = await db.select().from(swarmAgents);
    
    console.log(`\nFound ${agents.length} agents in registry.\n`);
    
    for (const agent of agents) {
        console.log(`👤 ID: ${agent.id}`);
        console.log(`   Name: ${agent.name}`);
        console.log(`   Username: ${agent.metadata?.username || 'N/A'}`);
        console.log(`   FID: ${agent.fid}`);
        console.log(`   Signer: ${agent.signerUuid || 'NONE'}`);
        console.log(`   Status: ${agent.status}`);
        console.log('-------------------');
    }
}

checkDbAgents().catch(console.error);
