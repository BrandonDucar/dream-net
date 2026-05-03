import "dotenv/config";
import { waitDb, getDb } from "../server/db.js";
import { sql } from "drizzle-orm";

async function run() {
  const db = await waitDb;
  const results = await getDb().execute(sql`SELECT COUNT(*) as count FROM swarm_agents WHERE fid IS NOT NULL`);
  console.log(`Current Active Swarm Count: ${results.rows[0].count}`);
  process.exit(0);
}

run().catch(console.error);
