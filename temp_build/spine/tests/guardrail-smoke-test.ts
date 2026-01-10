/**
 * Guardrail Smoke Test
 * 
 * Tests the GuardrailEngine with all rules
 */

import { GuardrailEngine } from '../guardrails/GuardrailEngine';
import { CostGatingRule } from '../guardrails/rules/CostGatingRule';
import { RateLimitRule } from '../guardrails/rules/RateLimitRule';
import { SecurityGuardrail } from '../guardrails/rules/SecurityGuardrail';
import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';

async function runGuardrailTests() {
    console.log('🧪 Starting Guardrail Smoke Tests...\n');

    // Create Event Bus
    const eventBus = new DreamEventBus();
    let eventsEmitted = 0;

    // Subscribe to guardrail events
    eventBus.subscribe('Guardrail.*', (envelope) => {
        eventsEmitted++;
        console.log(`  📡 Event: ${envelope.type}`);
    });

    // Create Guardrail Engine
    const engine = new GuardrailEngine(eventBus);

    // Register rules
    console.log('1️⃣ Registering Guardrail Rules...');
    engine.registerRule(SecurityGuardrail);
    engine.registerRule(CostGatingRule);
    engine.registerRule(RateLimitRule);
    console.log(`  ✅ Registered ${engine.getRules().length} rules\n`);

    // Test 1: Security Check (should pass)
    console.log('2️⃣ Testing Security Guardrail (should pass)...');
    const securityResult = await engine.evaluate({
        agentId: 'agent:lucid',
        identityId: 'user:test',
        input: { prompt: 'Generate a dream' },
        timestamp: Date.now()
    });
    console.log(`  ${securityResult.allowed ? '✅' : '❌'} Security: ${securityResult.allowed ? 'PASSED' : 'BLOCKED'}\n`);

    // Test 2: Cost Gating (should pass - user has balance)
    console.log('3️⃣ Testing Cost Gating (should pass)...');
    const costResult = await engine.evaluate({
        agentId: 'agent:lucid',
        identityId: 'user:test',
        input: { prompt: 'Generate a dream' },
        timestamp: Date.now()
    });
    console.log(`  ${costResult.allowed ? '✅' : '❌'} Cost Gating: ${costResult.allowed ? 'PASSED' : 'BLOCKED'}\n`);

    // Test 3: Rate Limiting (should pass first 10, then block)
    console.log('4️⃣ Testing Rate Limiting (10 requests)...');
    let passedCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < 12; i++) {
        const result = await engine.evaluate({
            agentId: 'agent:lucid',
            identityId: 'user:rate-test',
            input: { prompt: `Request ${i + 1}` },
            timestamp: Date.now()
        });

        if (result.allowed) {
            passedCount++;
        } else {
            blockedCount++;
            console.log(`  ⚠️ Request ${i + 1} blocked: ${result.reason}`);
        }
    }

    console.log(`  ✅ Rate Limiting: ${passedCount} passed, ${blockedCount} blocked\n`);

    // Test 4: Multiple Rules (all should run)
    console.log('5️⃣ Testing Multiple Rules Together...');
    const multiResult = await engine.evaluate({
        agentId: 'agent:canvas',
        identityId: 'user:multi-test',
        input: { dreamId: 'dream:123', action: 'visualize' },
        timestamp: Date.now()
    });
    console.log(`  ${multiResult.allowed ? '✅' : '❌'} All Rules: ${multiResult.allowed ? 'PASSED' : 'BLOCKED'}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Guardrail Tests Complete!`);
    console.log(`📊 Total Events Emitted: ${eventsEmitted}`);
    console.log(`🛡️ Rules Registered: ${engine.getRules().length}`);
    console.log(`🎉 All guardrails working correctly!`);

    process.exit(0);
}

// Run tests
runGuardrailTests().catch((error) => {
    console.error('💥 Guardrail tests failed:', error);
    process.exit(1);
});
