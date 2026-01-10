import { dutchBook } from './src/services/DutchBookService.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.gcp' });

const LOG_FILE = 'overnight_strikes.log';

function log(msg: string) {
    const time = new Date().toLocaleString();
    const entry = `[${time}] ${msg}\n`;
    process.stdout.write(entry);
    fs.appendFileSync(LOG_FILE, entry);
}

async function startSleeperMode() {
    log('--- ⚔️ DREAMNET: SOVEREIGN SLEEPER MODE ACTIVATED ⚔️ ---');
    log('[Status] Scanning Solana, Polygon, and Base every 5 minutes.');
    log('[Policy] Full Strike Authorization: spreads > 1.0%.');
    log('[Target] Initializing Financial Team scan loops...');

    while (true) {
        try {
            log('Searching for risk-free spreads...');
            const result = await dutchBook.scanForArbitrage();

            if (result.opportunity) {
                log(`!!! OPPORTUNITY DETECTED: ${result.chain || 'UNKNOWN'} !!!`);
                log(`[Details] ${JSON.stringify(result)}`);

                // In a real scenario, this would call executeArbitrage
                // For the first overnight, we will log the 'Strike Intent' if real capital is at stake.
                log(`[Action] Striking the front...`);
                // await dutchBook.executeArbitrage(...);
            } else {
                log('Market efficient. No spreads found.');
            }

        } catch (e: any) {
            log(`⚠️ Error in scan loop: ${e.message}`);
        }

        // Wait 5 minutes
        log('Mission continues. Sleeping for 300s...');
        await new Promise(resolve => setTimeout(resolve, 300000));
    }
}

startSleeperMode().catch(e => {
    log(`[Fatal] Sleeper Mode crashed: ${e.message}`);
});
