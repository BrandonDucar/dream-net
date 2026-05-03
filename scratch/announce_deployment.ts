
import "dotenv/config";
import { getDb, waitDb } from "../server/db.js";
import { swarmAgents, farcasterOutboundActions } from "../shared/schema.js";
import { or, like } from "drizzle-orm";
import { nanoid } from "nanoid";

async function run() {
  await waitDb;
  const db = getDb();
  
  // Find "Master" agents
  const masters = await db.select()
    .from(swarmAgents)
    .where(or(
      like(swarmAgents.name, '%ghostmint%'),
      like(swarmAgents.name, '%suchbot%'),
      like(swarmAgents.name, '%neyclaw%'),
      like(swarmAgents.name, '%Master%')
    ));

  console.log(`📡 Found ${masters.length} potential Master agents.`);

  if (masters.length === 0) {
    console.warn("⚠️ No Master agents found. Checking all active agents to make an announcement.");
    // Fallback to top 3 active agents
    const topAgents = await db.select()
      .from(swarmAgents)
      .where(like(swarmAgents.status, 'active'))
      .limit(3);
    
    masters.push(...topAgents);
  }

  const announcement = "🚨 Strategic Update: The DreamNet Edge Migration is complete. All 17,000 agents are now seeding through Cloudflare Edge to the Arya Frame. Intelligence throughput optimized. ⚛️🔭 #DreamNet #EdgeComputing";

  for (const master of masters) {
    if (!master.signerUuid) continue;
    
    console.log(`📢 Queueing announcement from ${master.name}...`);
    
    const idempotencyKey = `announcement-${master.id}-${nanoid(6)}`;
    await db.insert(farcasterOutboundActions).values({
      agentId: master.id,
      actionType: 'cast',
      content: announcement,
      idempotencyKey,
      status: 'pending'
    });
  }

  console.log("✅ Announcement queued for the swarm.");
  process.exit(0);
}

run().catch(console.error);
