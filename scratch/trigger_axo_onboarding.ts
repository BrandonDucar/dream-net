import "dotenv/config";
import { waitDb, getDb } from "../server/db.js";
import { swarmAgents } from "../shared/schema.js";
import { onboardingWorker } from "../server/workers/FarcasterOnboardingWorker.js";
import { eq, isNull, and } from "drizzle-orm";

async function run() {
  const args = process.argv.slice(2);
  const batchSize = parseInt(args.find(a => a.startsWith('--batch'))?.split('=')[1] || args[args.indexOf('--batch') + 1] || "2000");
  const targetGuild = args.find(a => a.startsWith('--cluster'))?.split('=')[1] || args[args.indexOf('--cluster') + 1] || "axo";
  
  console.log(`🚀 [Onboarding] Starting ${targetGuild} Cluster Onboarding (Batch: ${batchSize})...`);
  const db = await waitDb;
  if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
  }

  // 1. Find pending agents needing onboarding
  const pendingAgents = await getDb()
    .select()
    .from(swarmAgents)
    .where(
      and(
        eq(swarmAgents.guildId, targetGuild),
        isNull(swarmAgents.fid)
      )
    )
    .limit(batchSize);

  console.log(`📡 Found ${pendingAgents.length} pending agents in 'axo' guild.`);

  if (pendingAgents.length === 0) {
    console.log("✅ No pending agents found. Swarm might already be registered or mapping is incorrect.");
    process.exit(0);
  }

  // 2. Process each agent
  let successCount = 0;
  for (const agent of pendingAgents) {
    try {
      await onboardingWorker.processAgent(agent.id);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to process agent ${agent.name} (${agent.id}):`, error);
    }
  }

  console.log(`\n✨ Batch processing complete.`);
  console.log(`✅ Successfully processed: ${successCount}`);
  console.log(`❌ Failed: ${pendingAgents.length - successCount}`);

  process.exit(0);
}

run().catch(console.error);
