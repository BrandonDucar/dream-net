
import { strict as assert } from 'node:assert';
import { PatternRecognizer } from '../src/index.js';
import { ADULT_CONTENT_SIGNATURE, FRINGE_TECH_ADOPTION } from '../src/patterns/safety.js';
import { FinancialPatternEngine } from '../../wolfpack-analyst-core/src/FinancialPatternEngine.js';

console.log('🧠 Starting Cognitive Engine Tests...');

async function runTests() {

    // 1. Aethersafe Tests (The Cortex Filter)
    console.log('Testing Aethersafe (Cortex Filter)...');
    const recognizer = new PatternRecognizer();
    recognizer.registerSignature(ADULT_CONTENT_SIGNATURE);
    recognizer.registerSignature(FRINGE_TECH_ADOPTION);

    // Test Case A: Unsafe Content
    const unsafeText = "This site contains explicit adult only content for 18+ users.";
    const unsafeResult = recognizer.analyze(unsafeText);
    assert.equal(unsafeResult.isSafe, false, 'Should flag explicit content as unsafe');
    assert.ok(unsafeResult.flaggedSignatures.includes('adult_nsfw_v1'), 'Should detect adult signature');
    console.log('✅ Aethersafe: Correctly blocked unsafe content.');

    // Test Case B: Safe Content
    const safeText = "Welcome to the DreamNet documentation portal.";
    const safeResult = recognizer.analyze(safeText);
    assert.equal(safeResult.isSafe, true, 'Should allow safe content');
    console.log('✅ Aethersafe: Correctly allowed safe content.');

    // Test Case C: Fringe Intelligence (Signal Detection)
    const fringeText = "New adult site accepting crypto and anonymous payment via Bitcoin.";
    const fringeResult = recognizer.analyze(fringeText);
    // This might be "unsafe" legally but we want to know if it picked up the CULTURAL signal
    assert.ok(fringeResult.categoryScores['cultural'] > 0, 'Should register cultural/financial signal');
    console.log('✅ Aethersafe: Detected cultural signal in noise.');

    // 2. Financial Mind Tests (WolfPack)
    console.log('Testing Financial Mind (Macro Patterns)...');
    const financialEngine = new FinancialPatternEngine();

    // Simulate data feed
    const marketSignals = {
        adult_industry_crypto_volume: 0.8, // High adoption
        global_instability_index: 0.2
    };

    const patterns = financialEngine.analyzeAdoptionVelocity(marketSignals);
    const vicePattern = patterns.find(p => p.id === 'vice_adoption_surge');

    assert.ok(vicePattern, 'Should detect Vice Industry Adoption Surge');
    assert.equal(vicePattern?.sentiment, 'bullish', 'Vice adoption = Bullish for Infrastructure');
    console.log('✅ Financial Mind: Identified bullish macro-pattern from fringe data.');

    console.log('🎉 ALL COGNITIVE TESTS PASSED');
}

runTests().catch(err => {
    console.error('❌ Tests Failed:', err);
    process.exit(1);
});
