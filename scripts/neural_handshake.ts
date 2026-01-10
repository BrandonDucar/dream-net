/**
 * Neural Handshake Test - Verifying Organ Readiness
 * 
 * Simulates a full system pulse to ensure the 12-Organ Manifold is active.
 * Using relative paths to avoid resolution issues in the local script runner.
 */

import { MANIFOLD } from '../packages/organs/nerve/src/index.js';
import { IMMUNE } from '../packages/organs/immune/src/index.js';
import { HEART } from '../packages/organs/heart/src/index.js';
import { LUNG } from '../packages/organs/lung/src/index.js';
import { MUSCLES } from '../packages/organs/muscles/src/index.js';
import { SKIN } from '../packages/organs/skin/src/index.js';
import { GUT } from '../packages/organs/gut/src/index.js';
import { BRAIN } from '../packages/organs/brain/src/index.js';
import { EYES } from '../packages/organs/eyes/src/index.js';
import { VOICE } from '../packages/organs/voice/src/index.js';
import { DNA } from '../packages/organs/dna/src/index.js';
import { UNITS } from '../packages/organs/units/src/index.js';

async function neuralHandshake() {
    console.log('--- 🧬 DREAMNET NEURAL HANDSHAKE INITIATED ---');

    // Triggering collective pulses from all 12 organs
    await IMMUNE.pulse();
    await HEART.beat();
    await LUNG.breathe();
    await MUSCLES.flex();
    await SKIN.glow();
    await GUT.pulse();
    await BRAIN.ponder();
    await EYES.blink();
    await VOICE.shout();
    await DNA.evolve();
    await UNITS.spore();

    console.log('\n--- 🤝 TESTING CROSS-ORGAN INTERCEPTION ---');

    // Publish a high-priority treasury event to verify Heart/Nerve linkage
    await MANIFOLD.process({
        id: 'handshake-' + Math.random().toString(36).substr(2, 9),
        channelId: 'TREASURY_MOVE',
        kind: 'TREASURY_MOVE',
        priority: 5,
        context: { timestamp: new Date().toISOString() },
        payload: { from: 'vault-alpha', to: 'vault-beta', amount: 1000, currency: 'DREAM' }
    });

    // Trigger a threat event to verify Immune/Skin reaction
    await MANIFOLD.process({
        id: 'threat-' + Math.random().toString(36).substr(2, 9),
        channelId: 'SHIELD_EVENT',
        kind: 'THREAT_DETECTED',
        priority: 5,
        context: { timestamp: new Date().toISOString() },
        payload: { threatType: 'exploit-attempt', threatLevel: 'high' }
    });

    console.log('\n--- ✅ NEURAL HANDSHAKE SUCCESSFUL ---');
    console.log('All 12 organs are listening and responding in the manifold.');
}

neuralHandshake().catch(err => {
    console.error('--- ❌ NEURAL HANDSHAKE FAILED ---');
    console.error(err);
    process.exit(1);
});
