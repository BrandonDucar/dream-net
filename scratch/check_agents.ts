import "dotenv/config";
import { waitDb, getDb } from '../server/db.js';
import { swarmAgents } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function main() {
    await waitDb;
    const db = getDb();
    const agents = await db.select().from(swarmAgents).limit(5);
    console.log(JSON.stringify(agents, null, 2));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
