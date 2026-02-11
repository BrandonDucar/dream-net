import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.gcp' });

import { dutchBook } from './src/services/DutchBookService.js';

async function hunt() {
    console.log('--- 🇳🇱 Avenue 8: The Dutch Offensive 🇳🇱 ---');
    console.log('[Command] Mode: DUAL_CHAIN_SCAN');
    console.log('[Status] Waiting for Capital/Gas on Polygon & Base...');

    // Infinite Loop (Simulated for this script, just running once for demo)
    // In production, this would be a cron job or permanent process

    const result = await dutchBook.scanForArbitrage();

    if (result.opportunity) {
        console.log('!!! OPPORTUNITY DETECTED !!!');
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log('[Report] Market Efficient. No risk-free spreads > 0.5% found.');
    }
}

hunt().catch(console.error);
