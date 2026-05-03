import 'dotenv/config';
import { getDb, waitDb } from '../server/db.js';
import { sql } from 'drizzle-orm';

async function checkDb() {
    console.log(`🔍 [CheckDB] Waiting for connection...`);
    await waitDb;
    const db = getDb();

    console.log(`🔍 [CheckDB] Querying columns for 'swarm_agents'...`);
    const res = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'swarm_agents'
    `);
    
    console.log(`📊 [CheckDB] Columns found:`);
    console.table(res.rows);

    process.exit(0);
}

checkDb().catch(err => {
    console.error(`❌ [CheckDB] Failed:`, err);
    process.exit(1);
});
