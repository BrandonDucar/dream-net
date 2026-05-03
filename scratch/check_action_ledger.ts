
import "dotenv/config";
import { getDb, waitDb } from "../server/db.js";
import { farcasterOutboundActions } from "../shared/schema.js";
import { sql } from "drizzle-orm";

async function run() {
  const db = await waitDb;
  const results = await getDb().execute(sql`
    SELECT status, COUNT(*) as count 
    FROM farcaster_outbound_actions 
    GROUP BY status
  `);
  console.log("Action Ledger Status:");
  console.table(results.rows);
  process.exit(0);
}

run().catch(console.error);
