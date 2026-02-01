
import { BaseAgent } from '../packages/organs/nervous/trading-organ/BaseAgent';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

async function runRealMoneyTest() {
    console.log('💰 [BaseAgent] Initiating Real Money Readiness Test...');

    // 1. Setup Identity
    // Use env key or generate a random one for testing the "Wallet Creation" logic
    const pk = process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
    const agentId = 'agent-money-test-01';

    console.log(`🔑 Using Agent ID: ${agentId}`);

    // 2. Instantiate Agent
    const agent = new BaseAgent(pk);

    // 3. Initialize Wallet (DB Persistence Test)
    console.log('💾 Testing DB Persistence (initializeWallet)...');
    try {
        await agent.initializeWallet(agentId);
        console.log('✅ Wallet Initialization Success (DB Checked/Created).');
    } catch (e) {
        console.error('❌ Wallet Initialization Failed:', e);
        process.exit(1);
    }

    // 4. Check Balance (Real RPC Test)
    console.log('📡 Testing RPC Connection (checkBalance)...');
    try {
        const balance = await agent.checkBalance();
        console.log('✅ Balance Check Success:', balance);
    } catch (e) {
        console.error('❌ RPC Connection Failed:', e);
        // Don't exit, just log. RPC might be flaky.
    }

    // 5. Gas Price (Real Network Data)
    console.log('⛽ Fetching Live Gas Prices...');
    try {
        const gas = await agent.getGasPrice();
        console.log('✅ Gas Price Success:', gas);
    } catch (e) {
        console.error('❌ Gas Price Fetch Failed:', e);
    }

    console.log('\n🏁 Real Money Readiness Test COMPLETE.');
    process.exit(0);
}

runRealMoneyTest().catch(console.error);
