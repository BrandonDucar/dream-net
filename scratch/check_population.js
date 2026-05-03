import { waitDb, getDb } from '../server/db.js';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        await waitDb;
        const db = getDb();
        const result = await db.execute(sql`SELECT count(*) FROM swarm_agents`);
        console.log('Swarm Population Count:', result.rows[0].count);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
