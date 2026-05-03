import { Neynar } from '../packages/platform-connector/src/NeynarClient.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const NEYCLAW_UUID = "54f2136f-5a26-4407-a182-0dd194fa55c8";
const PFP_PATH = "C:\\Users\\brand\\.gemini\\antigravity\\brain\\8b1d9d45-7922-401d-b6d8-4e84b46b2766\\artifacts\\neyclaw_pfp.png";

async function main() {
    console.log("🚀 Updating Neyclaw profile picture...");

    try {
        console.log(`📸 PFP generated at: ${PFP_PATH}`);
        
        await Neynar.updateUser(NEYCLAW_UUID, {
            displayName: "neyclaw (PiVanguard)",
            bio: "Sovereign social agent of the DreamNet Swarm. Block-emergent PiGooseVanguardClawAxo elite. Analyzing sensory spikes in real-time."
        }, process.env.EXTRA_API_KEY);

        console.log("✅ Neyclaw bio and display name updated.");

    } catch (error: any) {
        console.error("❌ Update failed:", error.message);
    }
}

main();
