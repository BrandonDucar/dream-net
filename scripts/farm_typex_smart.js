import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ADB_PATH = 'c:\\Users\\brand\\OneDrive\\Documents\\GitHub\\dream-net\\tools\\platform-tools\\adb.exe';

// -- CONFIG --
// Galaxy A03 (720x1600)
const KEY_SPACE_X = 360;  // Center Width
const KEY_SPACE_Y = 1475; // Lower (Between 'V' and Nav Bar)
const JITTER = 15;        // Randomness

// -- STRATEGY --
const TARGET_CLICKS = 110; // 100 for box + 10 margin
const BURST_SIZE = 10;     // Taps before resting
const BURST_REST = 2000;   // 2 seconds rest (Safety Valve)
const TAP_DELAY = 150;     // Slow human speed (ms)

async function tap(x, y) {
    const rx = Math.floor(x + (Math.random() * JITTER - JITTER / 2));
    const ry = Math.floor(y + (Math.random() * JITTER - JITTER / 2));
    try {
        await execAsync(`"${ADB_PATH}" shell input tap ${rx} ${ry}`);
    } catch (e) {
        console.error("ADB Error:", e.message);
    }
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function main() {
    console.log("🦅 SMART FARMER: INITIALIZED");
    console.log(`🎯 Target: [${KEY_SPACE_X}, ${KEY_SPACE_Y}] on Galaxy A03`);
    console.log(`📦 Goal: ${TARGET_CLICKS} Taps (approx 1 Box)`);
    console.log("------------------------------------------");

    for (let i = 1; i <= TARGET_CLICKS; i++) {
        await tap(KEY_SPACE_X, KEY_SPACE_Y);
        process.stdout.write('.');

        // Micro-sleep between taps (Input Buffer protection)
        await sleep(TAP_DELAY);

        // Burst Control
        if (i % BURST_SIZE === 0) {
            console.log(` [${i}/${TARGET_CLICKS}] Resting...`);
            await sleep(BURST_REST);
        }
    }

    // Telemetry Hijack
    if (global.fetch) {
        console.log("📡 Sending Telemetry to Sovereign Brain...");
        try {
            await fetch('http://localhost:3000/api/ops/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'typex_box_mined',
                    value: 1,
                    tags: { source: 'typex_smart_farm', device: 'galaxy_a03' }
                })
            });
            console.log("✅ Telemetry Sent.");
        } catch (e) {
            console.warn("⚠️ Telemetry Failed (Server Offline?):", e.message);
        }
    } else {
        // Fallback for older node versions if needed
        console.warn("⚠️ No fetch() available for telemetry. Upgrade Node.");
    }

    console.log("\n✅ WORK COMPLETE. Check for Box.");
}

main();
