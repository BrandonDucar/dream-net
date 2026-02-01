import { createThirdwebClient } from "thirdweb";

async function test() {
    const secretKey = process.env.THIRDWEB_SECRET_KEY || "";
    const clientId = process.env.THIRDWEB_CLIENT_ID || "";
    const privateKey = process.env.METAMASK_PRIVATE_KEY || "";

    console.log(`🔍 [Test] Client ID: ${clientId ? "✅ PRESENT" : "❌ MISSING"}`);
    console.log(`🔍 [Test] Secret Key: ${secretKey ? "✅ PRESENT" : "❌ MISSING"}`);
    console.log(`🔍 [Test] Private Key: ${privateKey ? "✅ PRESENT" : "❌ MISSING"}`);

    try {
        const client = createThirdwebClient({ secretKey });
        console.log("✅ [Test] Thirdweb Client Initialized successfully.");

        // Test account creation from PK
        if (privateKey) {
            const { privateKeyToAccount } = await import("thirdweb/wallets");
            const account = privateKeyToAccount({ client, privateKey });
            console.log(`✅ [Test] Account derived: ${account.address}`);
        }
    } catch (error: any) {
        console.error("❌ [Test] Initialization Failed:", error.message);
    }
}

test().catch(console.error);
