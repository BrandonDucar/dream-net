
import { eventGraphQL } from '../packages/nerve/src/spine/streaming/EventGraphQLService.ts';

async function main() {
    console.log("🌀 Testing Reverse Siphon (Quantum Recall)...");

    // Simulate some events being woven first (if needed, but ChronoLoom is a singleton)
    // We'll just run the query and see the "Siphon" in action
    
    const query = "Orbital Sling Kinetic Launch";
    console.log(`🔍 Query: ${query}`);
    
    const results = await eventGraphQL.query('reverseSiphon', { query, limit: 3 });
    
    console.log("📄 Siphon Results:");
    if (Array.isArray(results)) {
        results.forEach((res, i) => {
            console.log(`[${i+1}] Type: ${res.recallType} | Valence: ${res.valence.toFixed(2)} | Score: ${res.score?.toFixed(2)}`);
            console.log(`    ID: ${res.id}`);
            console.log(`    Metadata: ${JSON.stringify(res.metadata)}`);
        });
    } else {
        console.log("❌ No results or error returned:", results);
    }
}

main().catch(console.error);
