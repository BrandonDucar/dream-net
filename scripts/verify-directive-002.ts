import { BaseAgent } from '../packages/organs/nervous/trading-organ/BaseAgent.js';
import { eventGraphQL } from '../packages/organs/nervous/nerve/src/spine/streaming/EventGraphQLService.js';

async function testSecuredMemory() {
    console.log('🧪 Starting Secured Memory Verification (Directive 002)...');

    // 1. Initialize Agent
    const agent = new BaseAgent('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    const agentId = 'agent:test-001';

    console.log(`🧪 Testing with Agent: ${agentId} (${agent.getAddress()})`);

    // 2. Prepare Challenge
    const challenge = JSON.stringify({
        timestamp: Date.now(),
        action: 'MEMORY_RECALL',
        agentId
    });

    // 3. Sign Challenge
    console.log('🧪 Signing challenge...');
    const signature = await agent.signChallenge(challenge);
    console.log(`🧪 Signature generated: ${signature.substring(0, 20)}...`);

    // 4. Execute Query (Sovereign Ingress)
    try {
        console.log('🧪 Executing secured reverseSiphon query...');
        const results = await eventGraphQL.query('query { reverseSiphon }', {
            agentId,
            challenge,
            signature,
            query: 'foundry deployment',
            limit: 3
        });

        console.log('🧪 Query Results:', JSON.stringify(results, null, 2));
        console.log('✅ SECURED MEMORY VERIFIED (Directive 002 SUCCESS).');
    } catch (error: any) {
        console.error('❌ SECURED MEMORY FAILED:', error.message);
    }
}

testSecuredMemory();
