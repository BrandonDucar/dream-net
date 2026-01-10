import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

// -- CONFIG --
const TARGET_WPM = 90; // Fast human
const VARIANCE = 20;   // Randomness
const BURST_MODE = false;

// -- ADB RESOLUTION --
const localAdbPath = 'c:\\Users\\brand\\OneDrive\\Documents\\GitHub\\dream-net\\tools\\platform-tools\\adb.exe';
const ADB_CMD = `"${localAdbPath}"`;
console.log(`[Config] FORCED ADB PATH: ${localAdbPath}`);
console.log(`[Config] Exists? ${existsSync(localAdbPath)}`);

// -- LINGUISTICS ENGINE --
const ADJECTIVES = ['Sovereign', 'Decentralized', 'Immutable', 'Cryptographic', 'Autonomous', 'Laminar', 'Entropic', 'Resilient', 'Mycelial', 'Agentic'];
const NOUNS = ['Infrastructure', 'Consensus', 'Cartel', 'Network', 'Protocol', 'Vector', 'Singularity', 'Treasury', 'Interface', 'Dream'];
const VERBS = ['accelerates', 'encrypts', 'marshals', 'deploys', 'harvests', 'integrates', 'optimizes', 'synthesizes', 'disrupts', 'transcends'];

function generateManifesto() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const noun2 = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun} ${verb} the ${noun2}.`;
}

// -- ADB WORKER --
async function typeText(text) {
    if (!text) return;

    // Clean text for ADB (escape spaces)
    const sanitized = text.replace(/ /g, '%s').replace(/'/g, '');

    // Simulate "Typing"
    // ADB: input keyevent ... (Simulating Physical Keyboard Press)
    // This is harder for apps to distinguish from a real bluetooth keyboard.

    const chars = sanitized.split('');
    for (const char of chars) {
        // Map common chars to Android KeyCodes (Basic implementation)
        // a-z = 29-54
        // 0-9 = 7-16
        // Space = 62
        let keyCode = 62; // Default space
        const code = char.charCodeAt(0);

        if (code >= 97 && code <= 122) keyCode = code - 68; // a=97 -> 29
        else if (code >= 48 && code <= 57) keyCode = code - 41; // 0=48 -> 7

        const cmd = `${ADB_CMD} shell input keyevent ${keyCode}`;
        try { await execAsync(cmd); } catch (e) { }
    }

    console.log(`[Worker] Typing: "${text}"`);
    // console.log(`         > ${cmd}`);

    try {
        await execAsync(cmd);
        await execAsync(`${ADB_CMD} shell input keyevent 62`); // SPACE
        await execAsync(`${ADB_CMD} shell input keyevent 66`); // ENTER (SEND)
    } catch (e) {
        if (e.message.includes('not recognized') || e.code === 127) {
            console.log("⚠️  ADB MISSING (Simulated Mode)");
        } else {
            console.log("❌ ADB ERROR:", e.message);
        }
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -- MAIN LOOP --
async function farm() {
    console.log("🏭 DIGITAL SWEATSHOP: INITIALIZED");
    console.log(`   Target: TypeX Keyboard (via Android ADB)`);
    console.log(`   Speed:  ${TARGET_WPM} WPM (+/- ${VARIANCE})`);

    let keystrokes = 0;

    while (true) {
        const sentence = generateManifesto();

        // Calculate WPM delay
        // 5 chars per word avg.
        const words = sentence.split(' ').length;
        const msPerWord = (60000 / TARGET_WPM);
        const sentenceDelay = msPerWord * words;

        // Type it
        await typeText(sentence);
        keystrokes += sentence.length;

        console.log(`   [Stats] Total Keystrokes: ${keystrokes}`);

        // Randomized Human Delay
        const variance = (Math.random() * VARIANCE * 2) - VARIANCE; // +/-
        const actualDelay = sentenceDelay * (1 + (variance / 100)); // % variance

        if (BURST_MODE) await sleep(100);
        else await sleep(actualDelay);
    }
}

farm();
