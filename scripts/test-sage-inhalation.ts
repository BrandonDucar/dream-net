/**
 * Test Script for SageCortex (Avenue 99)
 */
import { sageCortex } from '../packages/organs/nervous/nerve/src/spine/intelligence/SageCortex.js';

async function main() {
    console.log("🚀 TESTING SAGE CORTEX (AVENUE 99)...");

    const sages = ['vitalik', 'balaji', 'levin', 'shannon'];

    for (const sageId of sages) {
        console.log(`\n🧘 Inhaling Essence: ${sageId.toUpperCase()}`);
        const profile = await sageCortex.inhale(sageId);
        if (profile) {
            console.log(`   Field: ${profile.field}`);
            console.log(`   Essence: ${profile.essence}`);
            profile.directives.forEach((d, i) => console.log(`   Directive ${i + 1}: ${d}`));
        }
    }

    console.log("\n✅ STRATEGIC INHALATION COMPLETE.");
}

main().catch(console.error);
