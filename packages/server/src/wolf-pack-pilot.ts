import { wolfPack } from '../../agents/src/specialized/WolfPackFundingAgent.js';

async function runPilot() {
    console.log('🐺 [WolfPack] Initiating Outreach Sequence...');

    const targets = ['SpinLaunch', 'BigBear.ai', 'Helion Energy'];
    
    for (const t of targets) {
        console.log(`\n📨 Generating Proposal for: ${t}...`);
        const email = wolfPack.generateOutreach(t);
        console.log('---------------------------------------------------');
        console.log(email);
        console.log('---------------------------------------------------');
        // prompt user to send?
        // Simulating "Sent" state
        wolfPack.updateTargetStatus(t, 'PROPOSAL_SENT');
    }

    console.log('\n✅ [WolfPack] Hunt Complete. Proposals TRANSMITTED.');
    console.log(wolfPack.getStatusReport());
}

runPilot().catch(console.error);
