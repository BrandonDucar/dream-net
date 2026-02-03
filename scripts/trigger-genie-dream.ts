import { genieGraft } from '../packages/organs/nervous/nerve/src/spine/simulation/GenieSimulationGraft.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
    console.log('🧪 TRIGGERING GENIE SYSTEM DREAM...');

    const state = {
        id: 'LIQUIDITY_DROP_SCENARIO',
        description: 'A scenario where token liquidity drops by 40% due to a black swan event.',
        parameters: { liquidityDrop: 0.4, eventType: 'BLACK_SWAN' },
        complexity: 'HIGH' as const
    };

    const sketch = await genieGraft.dream(state);
    console.log('\n🎨 WORLD SKETCH GENERATED:');
    console.log(sketch);

    console.log('\n⚡ NEXT STEP: Sim-Pilot Action Evaluation');
    const result = await genieGraft.evaluateAction(sketch, 'DEPLOY_RESERVE_STABILIZER');
    console.log('🤖 ACTION EVALUATION:');
    console.log(result);

    console.log('\n✅ DREAM CYCLE COMPLETE. Check Agent Tok feed for the broadcast.');
}

main().catch(console.error);
