
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/antigravity/marketplace';

async function testMarketplace() {
    console.log('🚀 Testing Agent Marketplace API...');

    try {
        // Test 1: Get Agents
        console.log('1️⃣ Fetching Agent List...');
        const res = await fetch(API_URL);
        const agents = await res.json();

        if (Array.isArray(agents) && agents.length > 0) {
            console.log(`✅ Success: Found ${agents.length} agents for hire.`);
        } else {
            console.error('❌ Failed: No agents returned.');
            process.exit(1);
        }

        // Test 2: Hire Agent
        console.log('2️⃣ Hiring Agent (Mock)...');
        const hireRes = await fetch(`${API_URL}/hire`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId: agents[0].id, duration: 3600 })
        });
        const hireData = await hireRes.json();

        if (hireData.status === 'HIRED' && hireData.contractId) {
            console.log(`✅ Success: Hired agent ${hireData.agentId}. Contract: ${hireData.contractId}`);
        } else {
            console.error('❌ Failed: Hiring failed.', hireData);
            process.exit(1);
        }

        console.log('🎉 Marketplace Tests Passed!');

    } catch (error) {
        console.error('❌ API Test Failed:', error);
        process.exit(1);
    }
}

testMarketplace();
