
try {
    console.log('1. Importing DreamEventBus...');
    const bus = await import('../../nerve/src/spine/dreamnet-event-bus/DreamEventBus.js');
    console.log('   > Success:', !!bus.dreamEventBus);
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('2. Importing VectorMeshConduit...');
    const vm = await import('../../nerve/src/spine/memory/VectorMeshConduit.js');
    console.log('   > Success:', !!vm.vectorMeshConduit);
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('3. Importing PulsarBridge...');
    const pb = await import('../../nerve/src/spine/bridges/PulsarBridge.js');
    console.log('   > Success:', !!pb.pulsarBridge);
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('4. Importing ChronoLoom...');
    const cl = await import('../../nerve/src/spine/memory/ChronoLoom.js');
    console.log('   > Success:', !!cl.chronoLoom);
} catch (e: any) { console.error('   > Failed:', e.message); }
