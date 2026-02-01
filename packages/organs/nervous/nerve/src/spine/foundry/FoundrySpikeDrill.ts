
import { Boris } from '../mercenary/BorisService.js';
import { DurableService } from '../durable/DurableAgentService.js';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * FoundrySpikeDrill
 * Managed by Boris Grishenko. Deploying the Ohara substrate with durability.
 */
export async function runFoundrySpike() {
    console.log("🛠️  FOUNDRY SPIKE DRILL: STARTING...");

    // 1. Ingest Ohara App List
    const oharaDir = path.resolve(process.cwd(), 'dist/public/miniapps/ohara');
    const files = await fs.readdir(oharaDir);
    const htmlApps = files.filter(f => f.endsWith('.html'));

    console.log(`📦 Found ${htmlApps.length} Ohara Mini-Apps staged.`);

    // 2. Boris "Spikes" the first 10 apps
    const targets = htmlApps.slice(0, 10);

    for (const app of targets) {
        const intentId = await DurableService.recordIntent('Boris', 'SPIKE_DEPLOY', { app });
        console.log(`📡 Intent Recorded: ${intentId}`);

        await Boris.sendSpike(`foundry://deploy/${app}`);

        // Simulating the "blessing" of the app into the DreamNet registry
        await fs.appendFile(
            path.resolve(process.cwd(), 'docs/foundry_registry.log'),
            `[${new Date().toISOString()}] BORIS_SPIKE: ${app} DEPLOYED & SIGNED\n`
        );

        await DurableService.commitIntent(intentId);
    }

    console.log("🏁 FOUNDRY SPIKE DRILL: COMPLETED. I AM INVINCIBLE!");
}
