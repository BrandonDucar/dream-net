import 'dotenv/config';
import { getDb, waitDb } from '../server/db.js';
import { sql } from 'drizzle-orm';

async function applyFix() {
    console.log(`🛠️ [Hotfix] Waiting for connection...`);
    await waitDb;
    const db = getDb();

    console.log(`🛠️ [Hotfix] Adding missing columns to 'swarm_agents'...`);
    try {
        await db.execute(sql`ALTER TABLE swarm_agents ADD COLUMN IF NOT EXISTS fid integer;`);
        await db.execute(sql`ALTER TABLE swarm_agents ADD COLUMN IF NOT EXISTS signer_uuid text;`);
        await db.execute(sql`ALTER TABLE swarm_agents ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 50;`);
        await db.execute(sql`ALTER TABLE swarm_agents ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;`);
        console.log(`✅ [Hotfix] swarm_agents columns updated.`);
    } catch (e) {
        console.error(`⚠️ [Hotfix] swarm_agents update error (might already exist):`, e);
    }

    console.log(`🛠️ [Hotfix] Creating Farcaster tables...`);
    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS farcaster_outbound_actions (
                id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_id varchar NOT NULL,
                action_type text NOT NULL,
                target_id text,
                content text,
                idempotency_key text NOT NULL UNIQUE,
                status text DEFAULT 'pending',
                tx_hash text,
                error_message text,
                scheduled_at timestamp,
                executed_at timestamp,
                created_at timestamp DEFAULT now() NOT NULL
            );
        `);
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS farcaster_channels (
                id text PRIMARY KEY,
                name text NOT NULL,
                description text,
                pfp_url text,
                parent_url text,
                follower_count integer DEFAULT 0,
                is_moderated boolean DEFAULT false,
                last_indexed_at timestamp
            );
        `);
        console.log(`✅ [Hotfix] Farcaster tables created.`);
    } catch (e) {
        console.error(`❌ [Hotfix] Table creation failed:`, e);
    }

    process.exit(0);
}

applyFix().catch(err => {
    console.error(`❌ [Hotfix] Failed:`, err);
    process.exit(1);
});
