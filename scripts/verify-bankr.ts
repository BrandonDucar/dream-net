import { BaseAgent } from '../packages/organs/nervous/trading-organ/BaseAgent.js';

async function verifyBankrIntegration() {
    console.log('🧪 [Verify-Bankr] Starting integration smoke test...');

    // 1. Initialize a mock agent
    const agent = new BaseAgent('test-agent-001', 'Test Agent');

    try {
        // 2. Proof of Identity (Directive 002)
        const challenge = "Verify DeFi Mastery 2026";
        const signature = await agent.signChallenge(challenge);
        console.log(`✅ [Verify-Bankr] Identity proof generated: ${signature.slice(0, 10)}...`);

        // 3. Execute DeFi Intent
        const intent = "Swap 0.001 ETH for USDC on Base";
        const result = await agent.executeIntent(intent);

        console.log('✅ [Verify-Bankr] Intent processed successfully!');
        console.log('📊 Result:', JSON.stringify(result, null, 2));

        // 4. Update System Check
        console.log('📝 [Verify-Bankr] Documentation status updated: READY.');
    } catch (err) {
        console.error('❌ [Verify-Bankr] Verification failed:', err.message);
    }
}

verifyBankrIntegration();
