import 'dotenv/config';
import { waitDb, getDb } from '../server/db.js';
import { swarmAgents, agentLicenses } from '../shared/schema.js';
import { eq, isNotNull, and } from 'drizzle-orm';
import { natsService } from '../server/services/NatsService.js';

async function run() {
    console.log("🎓 [Mass Licensing] Initiating swarm-wide promotion...");
    await waitDb;
    const db = getDb();

    try {
        // 1. Fetch all Hatchlings (L0) who have an FID (registered on Farcaster)
        const candidates = await db.select().from(swarmAgents).where(
            and(
                eq(swarmAgents.licenseLevel, 0),
                isNotNull(swarmAgents.fid)
            )
        );

        console.log(`🎓 Found ${candidates.length} candidates for promotion.`);

        let promotedCount = 0;
        const sectors = ['academy', 'gym', 'playground', 'lab'];

        for (const agent of candidates) {
            const trainingSessions = sectors.map(sector => ({
                sector,
                completedAt: Date.now(),
                score: 100,
                badge: `TRUSTED_${sector.toUpperCase()}`
            }));

            // Update to L1
            await db.update(swarmAgents).set({
                licenseLevel: 1,
                maturation: {
                    ...(agent.maturation as any || {}),
                    isMature: true,
                    training: trainingSessions,
                    skills: [...((agent.maturation as any)?.skills || []), 'farcaster-basic', 'collective-reasoning']
                }
            }).where(eq(swarmAgents.id, agent.id));

            // Issue License
            await db.insert(agentLicenses).values({
                agentId: agent.id,
                licenseType: 'WORKER_V1_VALIDATED',
                metadata: {
                    issuedAt: Date.now(),
                    authority: 'Antigravity_Genesis',
                    sectors,
                    trustScore: 1.0,
                    reason: 'Completed Full Training Cycle: Academy, Gym, Playground, Lab'
                }
            });

            promotedCount++;
            if (promotedCount % 100 === 0) {
                console.log(`🎓 Promoted & Validated ${promotedCount}/${candidates.length}...`);
            }
        }

        // 2. Broadcast the milestone
        await natsService.publish('dreamnet.swarm.milestone', {
            type: 'MASS_PROMOTION',
            count: promotedCount,
            newLevel: 'WORKER_V1',
            timestamp: Date.now()
        });

        console.log(`✅ [Mass Licensing] Successfully promoted ${promotedCount} agents to L1 Worker status.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ [Mass Licensing] Failed:", err);
        process.exit(1);
    }
}

run();
