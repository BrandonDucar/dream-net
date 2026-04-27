import { ssiPassport } from './core/SSIPassportService.js';
import { vectorMeshConduit } from '../../nerve/src/spine/memory/VectorMeshConduit.js';
import { wolfPack } from '../../agents/src/specialized/WolfPackFundingAgent.js';

async function runPilot() {
    console.log('🌌 [Phase XXVIII] Initiating Vector Sovereignty & Identity Pilot...');

    // 1. Quantum Identity Test
    console.log('\n🔐 [Identity] Testing Quantum-Secure VC Issuance...');
    const did = 'did:dreamnet:agent:wolfpack-alpha';
    const vc = await ssiPassport.issueCredential(did, { role: 'GRANT_HUNTER', clearance: 'L5' });
    console.log(`   > VC Issued: ${vc.id}`);
    console.log(`   > Proof Type: ${vc.proof.type}`);
    console.log(`   > Signature: ${vc.proof.document.slice(0, 32)}...`);
    
    const isValid = await ssiPassport.verifyCredential(vc);
    console.log(`   > Verification Result: ${isValid ? '✅ VALID (Post-Quantum)' : '❌ INVALID'}`);

    // 2. Vector Mesh Production Test
    console.log('\n🕸️ [Memory] Testing Qdrant Production Conduit...');
    const vectorId = `mem-${Date.now()}`;
    await vectorMeshConduit.shard({
        id: vectorId,
        values: Array(1536).fill(0).map(() => Math.random()),
        metadata: {
            agentId: 'wolfpack-alpha',
            timestamp: Date.now(),
            tags: ['PHASE_XXVIII', 'IDENTITY_LINKED']
        }
    });

    // 3. Wolf Pack Status
    console.log('\n🐺 [WolfPack] Funding Status Report:');
    const status = wolfPack.getStatusReport();
    status.forEach(t => {
        console.log(`   > ${t.name}: ${t.status} [${t.vector}]`);
    });

    console.log('\n✅ [Phase XXVIII] Pilot Complete. Systems Normalized.');
}

runPilot().catch(console.error);
