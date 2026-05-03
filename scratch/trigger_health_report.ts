import "dotenv/config";
import { swarmOps } from '../server/workers/SwarmOpsWorker.ts';
import { waitDb, getDb } from '../server/db.ts';
import { swarmAgents, farcasterOutboundActions } from '../shared/schema.ts';
import { sql } from 'drizzle-orm';

async function main() {
    console.log("🛠️ [ManualOps] Triggering Swarm Health Check...");
    
    await waitDb;
    const db = getDb();
    
    // Get counts from DB
    const [agentCountResult] = await db.select({ count: sql<number>`count(*)` }).from(swarmAgents);
    const [actionCountResult] = await db.select({ count: sql<number>`count(*)` }).from(farcasterOutboundActions).where(sql`status = 'pending'`);
    
    const agentCount = Number(agentCountResult.count);
    const actionCount = Number(actionCountResult.count);
    
    console.log(`📊 Swarm Stats: ${agentCount} agents, ${actionCount} pending actions.`);
    
    await swarmOps.reportSwarmHealth(agentCount, actionCount);
    
    console.log("✅ Report dispatched.");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
