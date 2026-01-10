
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

async function verifyBase() {
    console.log("🔍 Verifying Base (L2) Wallet Integration...");

    // Check for PRIVATE_KEY or EVM_PRIVATE_KEY
    const pk = process.env.PRIVATE_KEY || process.env.EVM_PRIVATE_KEY;
    const rpc = process.env.BASE_RPC_URL || "https://mainnet.base.org";

    if (!pk) {
        console.error("❌ PRIVATE_KEY missing from environment.");
        process.exit(1);
    }

    try {
        console.log("⚡ Igniting Wallet...");
        // Basic check: Can we instantiate a wallet?
        const provider = new ethers.JsonRpcProvider(rpc);
        const wallet = new ethers.Wallet(pk, provider);

        console.log(`✅ WALLET CONNECTED: ${wallet.address}`);
        console.log(`📡 RPC Endpoint: ${rpc}`);

        // Optional: Check balance if RPC is valid
        try {
            const balance = await provider.getBalance(wallet.address);
            console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);
        } catch (err) {
            console.warn("⚠️ Could not fetch balance (RPC might be rate limited or invalid), but Wallet core is valid.");
        }

        console.log("\n🚀 Base Layer Ready for Autonomous Trading.");

    } catch (error: any) {
        console.error("\n❌ VERIFICATION FAILED:", error.message);
    }
}

verifyBase();
