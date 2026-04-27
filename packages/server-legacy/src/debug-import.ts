
try {
    console.log('1. Importing node:crypto...');
    const crypto = await import('node:crypto');
    console.log('   > Success.');
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('2. Importing DilithiumCrypto...');
    // Traverse: server/src -> packages/nerve/src/spine/security/DilithiumCrypto.js
    const d = await import('../../nerve/src/spine/security/DilithiumCrypto.js');
    console.log('   > Success:', !!d.dilithium);
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('3. Importing DreamSeedCrypt...');
    const ds = await import('../../nerve/src/spine/DreamSeedCrypt.js');
    console.log('   > Success:', !!ds.dreamSeedCrypt);
} catch (e: any) { console.error('   > Failed:', e.message); }

try {
    console.log('4. Importing RectennaMonitor...');
    // Traverse: server/src -> packages/nerve/src/spine/energy/RectennaMonitor.js
    const rm = await import('../../nerve/src/spine/energy/RectennaMonitor.js');
    console.log('   > Success:', !!rm.rectennaMonitor);
} catch (e: any) { console.error('   > Failed:', e.message); }
