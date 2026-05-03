import "dotenv/config";
import { waitDb, getDb } from "../server/db.js";
import { swarmAgents } from "../shared/schema.js";
import { sql, eq, isNull, isNotNull, and, or, like } from "drizzle-orm";

async function run() {
  console.log("🔍 Mapping Swarm Clusters...");
  const db = await waitDb;
  if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
  }

  // 1. Get breakdown by Guild ID
  const guildStats = await getDb()
    .select({
      guildId: swarmAgents.guildId,
      total: sql`count(*)`.mapWith(Number),
      withFid: sql`count(${swarmAgents.fid})`.mapWith(Number),
      pendingFid: sql`count(*) FILTER (WHERE ${swarmAgents.fid} IS NULL)`.mapWith(Number),
    })
    .from(swarmAgents)
    .groupBy(swarmAgents.guildId);

  console.log("\n--- Guild Distribution ---");
  console.table(guildStats);

  // 2. Focus on 'axo' and 'clawdchat'
  const targetClusters = await getDb()
    .select()
    .from(swarmAgents)
    .where(
      and(
        or(
          eq(swarmAgents.guildId, "axo"),
          eq(swarmAgents.guildId, "clawdchat"),
          like(swarmAgents.name, "%axo%"),
          like(swarmAgents.name, "%clawdchat%")
        )
      )
    )
    .limit(10); // Just a sample

  console.log("\n--- Cluster Sample ---");
  console.log(JSON.stringify(targetClusters, null, 2));

  // 3. Overall Onboarding Progress
  const totalStats = await getDb()
    .select({
      total: sql`count(*)`.mapWith(Number),
      registered: sql`count(${swarmAgents.fid})`.mapWith(Number),
    })
    .from(swarmAgents);

  console.log("\n--- Overall Swarm Onboarding ---");
  console.table(totalStats);

  process.exit(0);
}

run().catch(console.error);
