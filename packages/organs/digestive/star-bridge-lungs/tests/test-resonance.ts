
// import { vectorStore } from '@dreamnet/memory-dna/store/VectorStore';
// import { ResonanceOptimizer } from '../engine/resonance.js';

// async function testResonance() {
//     console.log("🗣️ Initializing Resonance Test (Voice Optimization)...");

//     // 1. Plant Memories (Social Chatter)
//     // We make 'Base' loud and positive.
//     console.log("🌱 Planting viral memories for BASE chain...");
//     // await vectorStore.addMemory("Everyone is bridging to Base right now!", { type: "social_trend", chain: "base" });
//     // await vectorStore.addMemory("Base volume is bullish and exploding.", { type: "market_sentiment", chain: "base" });
//     // await vectorStore.addMemory("Just saw a huge lift on Base assets.", { type: "social_trend", chain: "base" });

//     // 2. Measure Resonance
//     console.log("📐 Measuring Resonance Scores...");

//     // // Check BASE (Should be high)
//     // const baseResonance = await ResonanceOptimizer.getResonance("base");
//     // console.log(`🔊 Base Resonance: ${baseResonance.resonanceScore.toFixed(3)} (Volume: ${baseResonance.socialVolume}, Sentiment: ${baseResonance.sentiment})`);

//     // // Check SOLANA (Should be neutral/low as we added no memories)
//     // const solanaResonance = await ResonanceOptimizer.getResonance("solana");
//     // console.log(`🔇 Solana Resonance: ${solanaResonance.resonanceScore.toFixed(3)}`);

//     // // 3. Verify Logic
//     // if (baseResonance.resonanceScore > solanaResonance.resonanceScore) {
//     //     console.log("✅ VOICE OPTIMIZED: Bridge is amplifying the louder, positive signal.");
//     // } else {
//     //     console.error("❌ VOICE FAILED: Resonance logic not reacting to memory.");
//     //     process.exit(1);
//     // }
// }

// testResonance().catch(err => {
//     console.error(err);
//     process.exit(1);
// });
