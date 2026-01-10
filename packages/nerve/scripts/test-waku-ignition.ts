import { wakuSpine } from '../src/spine/WakuSpine.js';

async function testIgnition() {
    console.log("Testing Waku Spine Ignition...");
    try {
        await wakuSpine.ignite();
        console.log("✅ Waku Ignition Successful (or pending peers).");
    } catch (error) {
        console.error("❌ Waku Ignition Failed:", error);
        process.exit(1);
    }
}

testIgnition();
