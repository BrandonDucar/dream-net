import 'dotenv/config';
import { getDb } from '../server/db.js';
import { swarmAgents } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function countAgents() {
    const db = getDb();
    const counts = await db.select({
        status: swarmAgents.status,
        count: sql<number>`count(*)`
    })
    .from(swarmAgents)
    .groupBy(swarmAgents.status);

    console.log('--- Agent Counts by Status ---');
    console.log(JSON.stringify(counts, null, 2));

    const total = await db.select({
        count: sql<number>`count(*)`
    })
    .from(swarmAgents);
    console.log('Total Agents in DB:', total[0].count);

    process.exit(0);
}

countAgents().catch(err => {
    console.error(err);
    process.exit(1);
});
