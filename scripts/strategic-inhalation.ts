import { sageCortex } from '../packages/organs/nervous/nerve/src/spine/intelligence/SageCortex.js';

async function executeStrategicInhalation() {
    console.log('🧘 [StrategicInhalation] Commencing Sage Synthesis...');

    const targets = ['pollak', 'balaji', 'karpathy'];

    for (const target of targets) {
        const profile = await sageCortex.inhale(target);
        if (profile) {
            console.log(`✅ [SageCortex] ESSENCE INHALED: ${profile.name}`);
            console.log(`   Directives: ${profile.directives.length} mapped.`);
        }
    }

    console.log('🌌 [StrategicInhalation] Swarm Cognition Aligned.');
}

executeStrategicInhalation();
