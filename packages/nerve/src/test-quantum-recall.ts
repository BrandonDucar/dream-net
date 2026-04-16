import { chronoLoom } from './spine/memory/ChronoLoom.ts';

async function testQuantumRecall() {
    console.log('🔮 Testing Quantum Recall (Reverse Siphon)...\n');

    // Simulate some events being woven into the timeline
    console.log('📡 Simulating event ingestion...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test LIZARD tier (recent buffer search)
    console.log('\n--- TEST 1: LIZARD Tier (Recent Buffer) ---');
    const lizardResult = await chronoLoom.reverseSiphon('Solar', { 
        tier: 'LIZARD', 
        limit: 5 
    });
    console.log(`✅ Found ${lizardResult.events.length} events in LIZARD tier`);
    console.log(`   Confidence: ${(lizardResult.confidence * 100).toFixed(0)}%`);
    console.log(`   Tier: ${lizardResult.tier}`);

    // Test MAMMAL tier (semantic search)
    console.log('\n--- TEST 2: MAMMAL Tier (Semantic Search) ---');
    const mammalResult = await chronoLoom.reverseSiphon('energy prediction', { 
        tier: 'MAMMAL', 
        limit: 5 
    });
    console.log(`✅ Found ${mammalResult.events.length} events in MAMMAL tier`);
    console.log(`   Confidence: ${(mammalResult.confidence * 100).toFixed(0)}%`);
    console.log(`   Tier: ${mammalResult.tier}`);

    // Test ALL tiers (cascading search)
    console.log('\n--- TEST 3: ALL Tiers (Cascading Search) ---');
    const allResult = await chronoLoom.reverseSiphon('orbital launch', { 
        tier: 'ALL', 
        limit: 10 
    });
    console.log(`✅ Found ${allResult.events.length} events`);
    console.log(`   Confidence: ${(allResult.confidence * 100).toFixed(0)}%`);
    console.log(`   Tier Used: ${allResult.tier}`);
    
    if (allResult.reconstructedState) {
        console.log('\n🧬 Reconstructed State:');
        console.log(`   Dominant Event Type: ${allResult.reconstructedState.dominantEventType}`);
        console.log(`   Primary Source: ${allResult.reconstructedState.primarySource}`);
        console.log(`   Event Count: ${allResult.reconstructedState.eventCount}`);
        console.log(`   State Confidence: ${allResult.reconstructedState.confidence}`);
    }

    console.log('\n✅ Quantum Recall Test Complete.');
    process.exit(0);
}

testQuantumRecall();
