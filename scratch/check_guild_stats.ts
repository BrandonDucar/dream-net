import "dotenv/config";
import { getDb, waitDb } from "../server/db.js";
import { sql } from "drizzle-orm";

async function run() {
  const db = await waitDb;
  const results = await getDb().execute(sql`
    SELECT guild_id, COUNT(*) as count 
    FROM swarm_agents 
    WHERE fid IS NULL 
    GROUP BY guild_id
  `);
  console.log("Unregistered Agents by Guild:");
  console.table(results.rows);
  process.exit(0);
}

run().catch(console.error);
