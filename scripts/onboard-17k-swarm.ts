import "dotenv/config";
import { waitDb, getDb } from '../server/db.js';
import { swarmAgents } from '../shared/schema.js';
import { eq, isNull, and } from 'drizzle-orm';
import { onboardingWorker } from '../server/workers/FarcasterOnboardingWorker.js';

async function main() {
    console.log("🚀 [Orchestrator] Starting 17,000-agent Farcaster onboarding sequence...");
    
    await waitDb;
    const db = getDb();

    // 1. Fetch all 'idle' agents that don't have a signer yet
    const idleAgents = await db.select()
        .from(swarmAgents)
        .where(and(
            eq(swarmAgents.status, 'idle'),
            isNull(swarmAgents.signerUuid)
        ));

    console.log(`🐝 [Orchestrator] Found ${idleAgents.length} agents pending onboarding.`);

    if (idleAgents.length === 0) {
        console.log("✅ [Orchestrator] No agents pending onboarding.");
        process.exit(0);
    }

    // 2. Process in controlled batches to avoid overwhelming the system
    const BATCH_SIZE = 500;
    const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds

    for (let i = 0; i < idleAgents.length; i += BATCH_SIZE) {
        const batch = idleAgents.slice(i, i + BATCH_SIZE);
        console.log(`📦 [Orchestrator] Processing batch ${i / BATCH_SIZE + 1} (${batch.length} agents)...`);

        await Promise.all(batch.map(async (agent) => {
            try {
                // Force use of GHOSTMINT_OPS_SIGNER_UUID for this 17k batch
                // The worker handles this if we pass a specific flag or if the ID matches.
                // For now, we just call the worker and let it use the default logic.
                await onboardingWorker.processAgent(agent.id);
            } catch (err: any) {
                console.error(`❌ [Orchestrator] Failed to onboard agent ${agent.id}:`, err.message);
            }
        }));

        console.log(`⏳ [Orchestrator] Batch complete. Waiting ${DELAY_BETWEEN_BATCHES}ms...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }

    console.log("✨ [Orchestrator] 17,000-agent onboarding sequence initiated.");
    process.exit(0);
}

main().catch(err => {
    console.error("❌ [Orchestrator] Fatal error:", err);
    process.exit(1);
});
