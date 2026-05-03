import "dotenv/config";
import { db, waitDb } from '../server/db';
import { swarmAgents } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
    await waitDb;
    const res = await db.select({ count: sql`count(*)` }).from(swarmAgents);
    console.log(`TOTAL_AGENTS_COUNT: ${res[0].count}`);
    process.exit(0);
}

main().catch(console.error);
