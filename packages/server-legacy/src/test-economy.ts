import { economicGovernor } from './core/EconomicGovernor.js';

async function testEconomy() {
    console.log('🧪 Starting Economic Sovereignty Test...');

    // Initial check
    console.log(`Initial Balance: ${economicGovernor.getBalance()} Joules`);

    // Wait for a few pulses
    console.log('Waiting for metabolic pulses...');
    await new Promise(resolve => setTimeout(resolve, 6000));

    console.log(`Current Balance: ${economicGovernor.getBalance().toFixed(4)} Joules`);

    // Simulate low balance
    console.log('\n📉 Simulating Joule Depletion...');
    // Manually force balance down for test
    (economicGovernor as any).jouleBalance = 5.0;

    // Process next metabolism
    (economicGovernor as any).processMetabolism();

    console.log('Test Complete.');
    process.exit(0);
}

testEconomy().catch(console.error);
