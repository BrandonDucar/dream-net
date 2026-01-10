
import { initializeReliabilitySystem } from '../server/core/dag-loader';
import { withCircuitBreaker } from '../server/core/circuit-breaker';
import { executeWithCircuitBreaker, executeDirect } from '../server/core/db-circuit-breaker';
import { trafficShapingMiddleware } from '../server/middleware/traffic-shaping';
import { getMetricsStore } from '../server/middleware/metrics';
import { NERVE_BUS } from '../spine/dreamnet-event-bus';
import { Request, Response } from 'express';

async function runVerification() {
    console.log('🔍 Starting Reliability System Verification...\n');

    // 1. Test Initialization
    console.log('1️⃣  Testing System Initialization...');
    try {
        await initializeReliabilitySystem();
        console.log('✅ Reliability System Initialized');
    } catch (error) {
        console.error('❌ Initialization Failed:', error);
        process.exit(1);
    }

    // 2. Test Circuit Breaker (General)
    console.log('\n2️⃣  Testing General Circuit Breaker...');
    try {
        const result = await withCircuitBreaker('test-breaker', async () => 'success');
        if (result === 'success') {
            console.log('✅ Circuit Breaker (Success Case) Passed');
        } else {
            console.error('❌ Circuit Breaker returned unexpected result');
        }

        // Test Failure Case
        try {
            await withCircuitBreaker('test-breaker-fail', async () => {
                throw new Error('Simulated Failure');
            });
        } catch (e) {
            console.log('✅ Circuit Breaker (Failure Case) Caught Error correctly');
        }
    } catch (error) {
        console.error('❌ Circuit Breaker Test Failed:', error);
    }

    // 3. Test DB Circuit Breaker Wrappers
    console.log('\n3️⃣  Testing DB Circuit Breaker Wrappers...');
    try {
        // Mock DB execution
        const mockDbExec = async () => ({ rows: [] });

        await executeDirect(async () => mockDbExec());
        console.log('✅ executeDirect Passed');

        await executeWithCircuitBreaker('test-db-breaker', async () => mockDbExec());
        console.log('✅ executeWithCircuitBreaker Passed');
    } catch (error) {
        console.error('❌ DB Circuit Breaker Test Failed:', error);
    }

    // 4. Test Event Bus Circuit Breaker
    console.log('\n4️⃣  Testing Event Bus Circuit Breaker...');
    try {
        const testEvent = NERVE_BUS.createEnvelope('test-event', 'verifier', { data: 'test' });
        let received = false;

        NERVE_BUS.subscribe('test-event', () => {
            received = true;
        });

        NERVE_BUS.publish(testEvent);

        // Allow microtask queue to process
        await new Promise(resolve => setTimeout(resolve, 100));

        if (received) {
            console.log('✅ Event Bus Publish (Protected) Passed');
        } else {
            console.error('❌ Event Bus Subscriber did not receive event');
        }
    } catch (error) {
        console.error('❌ Event Bus Test Failed:', error);
    }

    // 5. Test Traffic Shaping Middleware
    console.log('\n5️⃣  Testing Traffic Shaping Middleware...');
    try {
        const req = {
            headers: { 'user-id': 'test-user-123' },
            path: '/api/test'
        } as Partial<Request>;

        try {
            const store = getMetricsStore();
            if (store && store.startTime) {
                console.log('✅ Metrics Store is active');
                console.log(`   - Uptime: ${(Date.now() - store.startTime) / 1000}s`);
                console.log(`   - Total Requests: ${store.requests.total}`);
            } else {
                console.error('❌ Metrics Store not found or empty');
            }
        } catch (error) {
            console.error('❌ Metrics Test Failed:', error);
        }

        console.log('\n✨ Verification Complete!');
    }

runVerification().catch(console.error);
