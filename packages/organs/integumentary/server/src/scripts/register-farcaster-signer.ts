
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
    console.error("❌ NEYNAR_API_KEY not found in .env");
    process.exit(1);
}

async function createSigner() {
    console.log("🟣 Generating Farcaster Signer for DreamNet Agent...");

    try {
        // 1. Create Signer
        const response = await fetch('https://api.neynar.com/v2/farcaster/signer', {
            method: 'POST',
            headers: {
                'api_key': NEYNAR_API_KEY!,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        const { signer_uuid, public_key, status, link } = data;

        console.log("\n============================================");
        console.log("🔐 NEW SIGNER GENERATED");
        console.log("============================================");
        console.log(`UUID: ${signer_uuid}`);
        console.log(`Status: ${status}`);
        console.log("--------------------------------------------");
        console.log("👉 ACTION REQUIRED:");
        console.log("Click the link below on a device with Warpcast installed,");
        console.log("OR scan the QR code (if displayed in a browser) to approve.");
        console.log("\n🔗 APPROVAL LINK: " + link);
        console.log("\n--------------------------------------------");
        console.log("⏳ Waiting for approval via Warpcast...");

        // 2. Poll for Approval
        await pollForApproval(signer_uuid);

    } catch (e: any) {
        console.error("❌ Failed to create signer:", e.message);
    }
}

async function pollForApproval(signerUuid: string) {
    while (true) {
        await new Promise(r => setTimeout(r, 2000)); // Sleep 2s

        try {
            const response = await fetch(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signerUuid}`, {
                method: 'GET',
                headers: {
                    'api_key': NEYNAR_API_KEY!
                }
            });

            const data = await response.json();
            const status = data.status;

            if (status === 'approved') {
                console.log("\n✅ SIGNER APPROVED!");
                console.log("============================================");
                console.log("📝 Add this to your packages/server/.env file:");
                console.log(`NEYNAR_SIGNER_UUID=${signerUuid}`);
                console.log("============================================");
                process.exit(0);
            } else {
                process.stdout.write("."); // heartbeat
            }
        } catch (e) {
            // Ignore transient polling errors
        }
    }
}

createSigner();
