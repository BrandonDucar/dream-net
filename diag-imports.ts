const modules = [
    "./packages/nerve/src/spine/workers/BountyMechSuit.js",
    "./packages/nerve/src/spine/services/SessionKeyManager.js",
    "./packages/nerve/src/bus.js"
];

async function check() {
    for (const mod of modules) {
        try {
            console.log(`🔍 Checking ${mod}...`);
            await import(mod);
            console.log(`✅ ${mod} Loaded.`);
        } catch (e) {
            console.error(`❌ ${mod} Failed:`, e.message);
            if (e.code === 'ERR_MODULE_NOT_FOUND') {
                console.error(`Missing part: ${e.url || 'unknown'}`);
            }
        }
    }
}

check();
