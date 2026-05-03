import fs from 'fs';
import path from 'path';
import Redis from 'redis';
import { connect } from 'nats';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { swarmAgents, guilds } from '../shared/schema.ts';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const dataPath = path.resolve('data/viral-nano-swarm.json');
    const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const agents = dataset.agents;

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const redis = Redis.createClient({ url: 'redis://localhost:6379' });
    await redis.connect();
    const nats = await connect({ servers: 'nats://localhost:4222' });

    console.log('⚡ Starting robust onboarding...');

    // Get current count to resume
    const currentCountRes = await db.select({ count: sql`count(*)` }).from(swarmAgents);
    const startIndex = Number(currentCountRes[0].count);
    console.log(`🐝 Resuming from index: ${startIndex}`);

    const CHUNK_SIZE = 250; // Smaller chunks for reliability
    for (let i = startIndex; i < agents.length; i += CHUNK_SIZE) {
        const chunk = agents.slice(i, i + CHUNK_SIZE);
        
        try {
            const dbBatch = chunk.map(a => ({
                name: a.id,
                type: 'nano',
                guildId: a.guildId,
                status: 'idle',
                capabilities: ['compute', 'network'],
                metadata: {
                    ...a.metadata,
                    credits: 1.39, // Initial credit allocation (from the 25k Google pool)
                    badges: ['POE:HATCHLING']
                }
            }));
            await db.insert(swarmAgents).values(dbBatch).onConflictDoNothing();

            const redisPromises = chunk.map(async (a) => {
                await redis.hSet(`nano:agents:${a.id}`, {
                    id: a.id,
                    name: a.id,
                    guild: a.guildId,
                    status: 'idle',
                    credits: '1.39',
                    badges: JSON.stringify(['POE:HATCHLING'])
                });
            });
            await Promise.all(redisPromises);
            
            console.log(`  ✓ ${i + chunk.length}/${agents.length} agents registered.`);
        } catch (err) {
            console.error(`❌ Batch failed at ${i}:`, err.message);
            await new Promise(r => setTimeout(r, 2000)); // Wait and retry
            i -= CHUNK_SIZE; 
        }
    }

    console.log('✅ Swarm Registry Complete.');
    await redis.disconnect();
    await nats.close();
    process.exit(0);
}

main().catch(console.error);
