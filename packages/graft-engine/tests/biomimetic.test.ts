
import { strict as assert } from 'node:assert';
import { fuseAgents } from '../logic/fusion.js';
import { spawnChildAgent } from '../logic/foundry.js';
import { ingestChemical } from '../logic/chemistry.js';
// Use relative path to spore-engine for test simplicity or mock it if cross-package is hard without build
// Adjusting path to point to the actual file location relative to this test file.
// graft-engine/tests -> ../../spore-engine/logic/cellular
import { performNeuralHandshake } from '@dreamnet/spore-engine/logic/cellular';

// MOCK MEMORY RECORDS
const mockAgentA = {
    id: 'uuid-1',
    entityType: 'agent',
    entityId: 'Wolf',
    traits: [{ key: 'velocity', value: 0.5, lastUpdated: '' }, { key: 'security', value: 0.1, lastUpdated: '' }],
    tags: [],
    history: [],
    coordinates: { q: 0, r: 0, s: 0 }, // Center
    createdAt: '',
    updatedAt: ''
};

const mockAgentB = {
    id: 'uuid-2',
    entityType: 'agent',
    entityId: 'Sentinel',
    traits: [{ key: 'velocity', value: 0.2, lastUpdated: '' }, { key: 'security', value: 0.9, lastUpdated: '' }],
    tags: [],
    history: [],
    coordinates: { q: 1, r: -1, s: 0 }, // Neighbor
    createdAt: '',
    updatedAt: ''
};

async function runTests() {
    console.log('🧪 Starting Biomimetic Core Tests...');

    // 1. FUSION TEST
    console.log('Testing Fusion Core...');
    const hybrid = await fuseAgents(mockAgentA as any, mockAgentB as any);
    assert.ok(hybrid.id.startsWith('hybrid-'), 'Hybrid ID should start with hybrid-');

    const velocity = hybrid.traits.find(t => t.key === 'velocity')?.value;
    const security = hybrid.traits.find(t => t.key === 'security')?.value;

    // Should take MAX (0.5 from A, 0.9 from B)
    assert.equal(velocity, 0.5, 'Hybrid should inherit max velocity');
    assert.equal(security, 0.9, 'Hybrid should inherit max security');
    console.log('✅ Fusion Logic Verified');

    // 2. FOUNDRY TEST (Autopoiesis)
    console.log('Testing Agent Foundry...');
    const childId = await spawnChildAgent('Wolf');
    assert.ok(childId.startsWith('Wolf-child-'), 'Child ID should be derived from parent');
    console.log('✅ Foundry Logic Verified');

    // 3. CHEMISTRY TEST (Metabolism)
    console.log('Testing Metabolic System...');
    const caffeinatedWolf = await ingestChemical({ ...mockAgentA } as any, 'caffeine');
    const newVelocity = caffeinatedWolf.traits.find(t => t.key === 'velocity')?.value;
    // Base 0.5 + 0.2 = 0.7
    assert.equal(newVelocity, 0.7, 'Caffeine should boost velocity');
    console.log('✅ Metabolic Logic Verified');

    // 4. CELLULAR TEST (Neural Handshake)
    console.log('Testing Cellular Mesh...');
    // A and B are neighbors (0,0,0 and 1,-1,0 distance is 1)
    const shake = await performNeuralHandshake(mockAgentA as any, mockAgentB as any);
    assert.ok(shake.success, 'Handshake should succeed for neighbors');
    console.log('✅ Neural Handshake Verified');

    console.log('🎉 ALL BIOMIMETIC TESTS PASSED');
}

runTests().catch(err => {
    console.error('❌ Test Failed:', err);
    process.exit(1);
});
