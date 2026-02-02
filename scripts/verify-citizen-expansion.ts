import { passportService } from '../packages/organs/integumentary/server/src/services/PassportService.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function testCitizenExpansion() {
    console.log('🛂 [CitizenTest] Initializing Bulk Sovereign Passport Minting...');

    // Mock 127 citizens
    const citizens = Array.from({ length: 127 }, (_, i) => `citizen_${i + 1}`);

    // Subscribe to bulk results
    dreamEventBus.subscribe('Identity.BulkMintComplete', (envelope: any) => {
        const { results } = envelope.payload;
        console.log(`\n✨ [SUCCESS] ${results.length} Passports minted.`);
        console.log(`📝 Sample TBA [0]: ${results[0].agentId} -> ${results[0].tba}`);
    });

    // Execute bulk mint
    await passportService.mintBulkPassports(citizens);

    console.log('\n✅ [CitizenTest] Sovereign Expansion Complete. Swarm identity substrate hardened.');
}

testCitizenExpansion();
