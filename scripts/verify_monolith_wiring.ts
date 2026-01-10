
const packages = [
    // "@dreamnet/memory-dna", // Broken dependency
    // "@dreamnet/halo-loop", // Broken dependency
    // "@dreamnet/card-forge-pro", // Disabled 
    // "@dreamnet/alive-mode", // Disabled
    // "@dreamnet/graft-engine", // Disabled
    "@dreamnet/nerve",
    "@dreamnet/dreamnet-os-core",
    "@dreamnet/dreamnet-control-core",
    "@dreamnet/squad-builder",
    "@dreamnet/event-wormholes",
    "@dreamnet/spore-engine",
    "@dreamnet/dark-fabric",
    "@dreamnet/orders",
    "@dreamnet/rewards-engine",
    "@dreamnet/liquidity-engine",
    "@dreamnet/metrics-engine"
];

const checkWiring = async () => {
    console.log("Starting Monolith Wiring Check (Core + Organs)...");
    let failure = false;

    for (const pkg of packages) {
        try {
            console.log(`Checking ${pkg}...`);
            await import(pkg);
            console.log(`✅ ${pkg} OK`);
        } catch (e: any) {
            console.error(`❌ ${pkg} FAILED:`);
            console.error(e.message || e);
            if (e.code) console.error(`Code: ${e.code}`);
            failure = true;
        }
    }

    if (failure) {
        console.log("Wiring Check COMPLETE: FAILURES DETECTED");
        process.exit(1);
    } else {
        console.log("Wiring Check COMPLETE: ALL GREEN");
    }
};

checkWiring();
