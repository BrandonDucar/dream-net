import { NERVE_BUS } from '@dreamnet/nerve';

/**
 * 🧪 Plasticity Test Script
 * 
 * Verifies that the NeuralPlasticityService captures ERROR events 
 * and initiates the healing protocol.
 */

console.log('🧪 Starting Neural Plasticity Dry-Run...');

NERVE_BUS.publish('INTERNAL_CORE', {
    kind: 'ERROR',
    payload: {
        message: 'SIMULATED_METABOLIC_FAILURE',
        error: 'TestError: The dream-net substrate is too rigid.',
        stack: 'Error: SIMULATED_METABOLIC_FAILURE\n    at Object.<anonymous> (test-plasticity.ts:15:10)'
    },
    priority: 5,
    timestamp: Date.now()
});

console.log('✅ Simulated trauma injected. Monitor server logs for healing proposals.');
