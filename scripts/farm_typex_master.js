import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ADB_PATH = 'c:\\Users\\brand\\OneDrive\\Documents\\GitHub\\dream-net\\tools\\platform-tools\\adb.exe';

// -- CONFIG --
// Default Spacebar location (Bottom Center)
// User might need to calibrate this.
// Galaxy A03 is 720x1600
const KEY_SPACE_X = 360;  // Center X
const KEY_SPACE_Y = 1250; // Bottom 1/4 (Spacebar Area)
const JITTER = 20; // Pixel jitter

async function tap(x, y) {
    const rx = x + (Math.random() * JITTER - JITTER / 2);
    const ry = y + (Math.random() * JITTER - JITTER / 2);
    // Send "input tap" which mimics a finger
    await execAsync(`"${ADB_PATH}" shell input tap ${rx} ${ry}`);
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function main() {
    console.log("🦅 TY-PEX MASTER: SPACEBAR HAMMER ENGINE");
    console.log("------------------------------------------");
    console.log("Targeting Spacebar at approx [540, 2100]");

    let count = 0;
    while (true) {
        await tap(KEY_SPACE_X, KEY_SPACE_Y);
        count++;

        if (count % 10 === 0) process.stdout.write('.');
        if (count % 100 === 0) console.log(` [${count} Taps] 📦 Box Theory Unlocked?`);

        // Random human delay
        const delay = 50 + Math.random() * 150;
        await sleep(delay);
    }
}

main();
