import "dotenv/config";
import { db, waitDb } from '../server/db';
import { farcasterOutboundActions, swarmAgents } from '../shared/schema';
import { desc, eq, not, and, sql } from 'drizzle-orm';

async function analyzeSwarm() {
    await waitDb;
    console.log("🔍 [Analysis] Scanning Farcaster Ledger...");
    
    // 1. Check last 20 actions
    const recentActions = await db.select()
        .from(farcasterOutboundActions)
        .orderBy(desc(farcasterOutboundActions.createdAt))
        .limit(20);

    console.log("\n📋 Recent Actions:");
    recentActions.forEach(a => {
        console.log(`[${a.createdAt.toISOString()}] Agent: ${a.agentId} | Type: ${a.actionType} | Status: ${a.status} | Error: ${a.errorMessage || 'None'}`);
    });

    // 2. Check for specific agents mentioned by user
    const targetAgents = ['neyclaw', 'ghostmintops', 'clawdchat', 'jaggy', 'lmc', 'dreamstar', 'clawedette', 'felix', 'Arya'];
    console.log("\n🤖 Agent Status (Partial Name Match):");
    for (const name of targetAgents) {
        const agents = await db.select().from(swarmAgents).where(sql`name ILIKE ${'%' + name + '%'}`);
        if (agents.length > 0) {
            agents.forEach(agent => {
                console.log(`[${agent.name}] Status: ${agent.status} | FID: ${agent.fid} | Last Heartbeat: ${agent.lastHeartbeat?.toISOString()}`);
            });
        } else {
            console.log(`[${name}] NOT FOUND in registry (even with partial match).`);
        }
    }

    // 2.5 List 10 random agents to see names
    const sampleAgents = await db.select().from(swarmAgents).limit(10);
    console.log("\n📋 Sample Agents from DB:");
    sampleAgents.forEach(a => console.log(`- ${a.name} (ID: ${a.id})`));

    const totalAgents = await db.select().from(swarmAgents);
    console.log(`\n👥 Total Agents in DB: ${totalAgents.length}`);

    // 3. Count pending/failed
    const pendingCount = await db.select().from(farcasterOutboundActions).where(eq(farcasterOutboundActions.status, 'pending'));
    const failedCount = await db.select().from(farcasterOutboundActions).where(eq(farcasterOutboundActions.status, 'failed'));

    console.log(`\n📊 Totals: Pending: ${pendingCount.length} | Failed: ${failedCount.length}`);
}

analyzeSwarm().catch(console.error);
