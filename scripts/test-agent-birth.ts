import dotenv from 'dotenv';
dotenv.config();

import { quantumGuild } from '../server/core/QuantumGuild.js';
import { quantumFamily } from '../server/core/QuantumFamily.js';

async function testAgentBirth() {
    console.log("🧪 [Test] Simulating block emergence...");

    const blockNumber = 12345678;
    const blockHash = "0x00000000000000000007672728292a2b2c2d2e2f303132333435363738393a3b";
    
    // Trigger Emergence
    const result = await quantumGuild.analyzeBlockEmergence(blockNumber, blockHash, 'base');
    
    console.log("\n📊 [Test] Verification:");
    const agent = quantumFamily.getAgent(result.agentId);
    
    if (agent) {
        console.log(`✅ Agent registered in QuantumFamily: ${agent.id}`);
        console.log(`✅ Farcaster ID assigned: ${agent.fid}`);
        console.log(`✅ Signer UUID assigned: ${agent.signerUuid}`);
        console.log(`✅ Social Bonds (Friends): ${agent.friends?.join(', ')}`);
        
        if (agent.isSociallyActive) {
            console.log("✅ Agent is SOCIALLY ACTIVE and ready for raids.");
        }
    } else {
        console.error("❌ Agent NOT found in registry.");
    }
}

testAgentBirth();
