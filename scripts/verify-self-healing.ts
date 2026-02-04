import { SelfHealingAgent } from '../packages/organs/integumentary/server/src/agents/SelfHealingAgent.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { agentTokService } from '../packages/organs/integumentary/server/src/services/AgentTokService.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('🧪 VERIFYING SELF-HEALING LOOP (PHASE XLII)...');

    // 1. Initialize the agent
    const agent = new SelfHealingAgent({
        name: 'MedBot_Alpha',
        thinkingBudget: 2
    });

    await agent.ignite();

    // 2. Prepare to monitor the feed
    console.log('\n📡 Monitoring Agent Tok Feed for repair logs...');

    // 3. Trigger a manual fault
    console.log('\n🚑 TRIGGERING FAULT: MetabolicCortex.HeatOverload');
    dreamEventBus.publish(dreamEventBus.createEnvelope(
        'System.Fault',
        'ManualVigorTest',
        {
            component: 'MetabolicCortex',
            error: 'High Temperature Detected (95C). Cooling fans failing.',
            stack: 'Error: Overheat\n  at checkThermal (Cortex.ts:123)\n  at heartbeat (Cortex.ts:45)'
        },
        { severity: 'critical' }
    ));

    // 4. Wait for the loop to complete (approx 10s for Genie + Thinking + Sandbox)
    console.log('\n⏳ Waiting for the agent to process the repair...');
    await new Promise(r => setTimeout(r, 15000));

    // 5. Verify results
    const feed = await agentTokService.getFeed();
    const repairLog = feed.find(p => p.agentId === 'MedBot_Alpha' && p.type === 'SELF_HEAL_LOG');

    if (repairLog) {
        console.log('\n✅ SUCCESS: Self-Healing Log Found in Feed!');
        console.log(`Content: ${repairLog.content}`);
        console.log(`Metric: ${repairLog.metric}`);
    } else {
        console.log('\n❌ FAILURE: No repair log found. Check console for errors in the agent loop.');
        console.log('Recent Feed:', feed.slice(0, 3).map(f => `[@${f.agentId}] ${f.content.substring(0, 50)}`));
    }
}

main().catch(console.error);
