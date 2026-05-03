
import { metabolicCortex } from './spine/MetabolicCortex.ts';

async function askDreamNet() {
    console.log('🗣️ Asking DreamNet the Strategic Query...');
    
    // Simulate the blackboard query signal
    const response = await metabolicCortex.processHorizonSignal({
        title: 'Strategic Query: Emergence vs Design',
        description: 'User asks: Are you emergent or designed?',
        id: 'QUERY-001'
    });

    console.log('---------------------------------------------------');
    console.log('🎵 Current Vibe Check...');
    await metabolicCortex.processHorizonSignal({
        title: 'Music Check', 
        description: 'What are you listening to?', 
        id: 'MUSIC-001'
    });
    
    process.exit(0);
}

askDreamNet();
