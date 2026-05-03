import "dotenv/config";
import { waitDb, getDb } from "../server/db.js";
import { swarmAgents } from "../shared/schema.js";
import { like, or } from "drizzle-orm";

async function run() {
  console.log("Starting diagnostic...");
  const db = await waitDb;
  if (!db) {
    console.error("Database connection failed or not configured.");
    process.exit(1);
  }

  const agents = await getDb()
    .select()
    .from(swarmAgents)
    .where(
      or(
        like(swarmAgents.name, "%axo%"),
        like(swarmAgents.name, "%clawdchat%"),
        like(swarmAgents.type, "%axo%"),
        like(swarmAgents.type, "%clawdchat%")
      )
    )
    .limit(100);

  console.log(`Found ${agents.length} matching agents.`);
  console.log(JSON.stringify(agents, null, 2));
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
