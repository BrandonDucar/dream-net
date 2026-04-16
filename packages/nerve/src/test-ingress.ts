import { createHmac } from 'node:crypto';
import { ingressBridge } from './spine/external/SovereignIngressBridge.ts';
import { ingressGuard } from '../../server/src/core/HmacIngressGuard.ts';

async function runIngressTest() {
    console.log('🧪 [Test] Starting Sovereign Ingress Bridge Test...');

    const secret = 'phase_26_secret';
    const id = `cmd-${Date.now()}`;
    const timestamp = Date.now();
    const payload = { action: 'TEST_COMMAND', output: 'Verifying Bridge Integrity' };

    // 1. Generate Valid Signature
    console.log(`🧪 [Test] Signing command with secret: ${secret} ...`);
    const dataToSign = JSON.stringify({ id, payload, timestamp });

    // Node.js crypto equivalent of the browser Web Crypto logic
    const signature = createHmac('sha256', secret)
        .update(dataToSign)
        .digest('hex');

    // 2. Process via Bridge
    console.log(`🧪 [Test] Sending signed command to IngressBridge...`);
    const result = await ingressBridge.processCommand({
        id,
        payload,
        timestamp,
        signature
    });

    if (result) {
        console.log('✅ [Test] PASS: Valid signature accepted.');
    } else {
        console.error('❌ [Test] FAIL: Valid signature rejected.');
    }

    // 3. Test Invalid Signature
    console.log(`🧪 [Test] Testing Invalid Signature rejection...`);
    const fakeSignature = 'beefcafe1234567890abcdef';
    const failResult = await ingressBridge.processCommand({
        id: `cmd-fake-${Date.now()}`,
        payload,
        timestamp: Date.now(),
        signature: fakeSignature
    });

    if (!failResult) {
        console.log('✅ [Test] PASS: Invalid signature rejected.');
    } else {
        console.error('❌ [Test] FAIL: Invalid signature accepted (SECURITY RISK).');
    }
}

runIngressTest().catch(console.error);
