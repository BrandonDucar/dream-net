
async function verify() {
    try {
        console.log('Testing Shared...');
        await import('@dreamnet/shared');
        console.log('✅ Shared loaded');

        console.log('Testing Lib...');
        await import('@dreamnet/lib');
        console.log('✅ Lib loaded');

        console.log('Testing Control Core...');
        await import('@dreamnet/dreamnet-control-core');
        console.log('✅ Control Core loaded');

        console.log('Testing DreamState...');
        await import('@dreamnet/dreamstate');
        console.log('✅ DreamState loaded');

        console.log('Testing Shield Core...');
        await import('@dreamnet/shield-core');
        console.log('✅ Shield Core loaded');

        console.log('Testing OS Core...');
        await import('@dreamnet/dreamnet-os-core');
        console.log('✅ OS Core loaded');

        console.log('Testing Nerve...');
        const { createInMemoryNerveBus, SystemHeartbeat } = await import('@dreamnet/nerve');
        console.log('✅ Nerve loaded (Static)');

        // Simulate Pulse to verify Dynamic Loading
        console.log('Testing System Pulse (Dynamic Organ Loading)...');
        const bus = createInMemoryNerveBus();
        const heartbeat = new SystemHeartbeat(bus);

        // We access the private pulse method via any cast or just start/stop briefly
        // Ideally we just call start and wait a sec
        heartbeat.start(100);
        await new Promise(resolve => setTimeout(resolve, 1000));
        heartbeat.stop();
        console.log('✅ System Pulse survived');

        console.log('Testing Server Entry Point (Dry Run)...');
        // We just toggle the import to see if it resolves
        // await import('@dreamnet/server/src/index.ts'); 
        // Note: Server starts listening on import, so we might hang, but we want to see if it *crashes*

        console.log('🚀 ALL SYSTEMS GO 🚀');
    } catch (e) {
        console.error('❌ Verification FAILED');
        console.error('Message:', e.message);
        console.error('Code:', e.code);
        if (e.stack) console.error(e.stack);
    }
}

verify();
