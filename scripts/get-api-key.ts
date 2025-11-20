/**
 * Get Your DreamNet API Key
 * Run this script to retrieve or create your API key
 */

import { APIKeeperCore } from "../packages/api-keeper-core";

async function getApiKey() {
  console.log("\n🔑 Getting Your DreamNet API Key...\n");

  // Method 1: Check if you have a wallet JWT token
  const walletToken = process.env.WALLET_JWT_TOKEN || process.env.AUTH_TOKEN;
  
  if (walletToken) {
    console.log("📋 Method 1: Using Wallet JWT Token\n");
    console.log("Call this endpoint:");
    console.log(`  GET https://dreamnet.ink/api/keys/default`);
    console.log(`  Headers: Authorization: Bearer ${walletToken.substring(0, 20)}...`);
    console.log("\nOr use curl:");
    console.log(`curl -H "Authorization: Bearer ${walletToken}" \\`);
    console.log(`  https://dreamnet.ink/api/keys/default`);
    console.log("\n");
  } else {
    console.log("⚠️  No wallet JWT token found in environment\n");
  }

  // Method 2: Create a new API key (requires wallet auth)
  console.log("📋 Method 2: Create New API Key (Requires Wallet Auth)\n");
  console.log("1. Connect your wallet at https://dreamnet.ink");
  console.log("2. Check the auth response - if you're new, you'll get an API key");
  console.log("3. Or call:");
  console.log(`   POST https://dreamnet.ink/api/keys/create`);
  console.log(`   Headers: Authorization: Bearer YOUR_WALLET_JWT_TOKEN`);
  console.log(`   Body: { "name": "ChatGPT Connector", "description": "For ChatGPT Agent Mode" }`);
  console.log("\n");

  // Method 3: Check auth response
  console.log("📋 Method 3: Check Auth Response\n");
  console.log("When you connect your wallet via SIWE:");
  console.log("  POST https://dreamnet.ink/api/auth/verify");
  console.log("  Body: { message: "...", signature: "..." }");
  console.log("\nIf you're a new user, the response includes:");
  console.log("  {");
  console.log("    apiKey: 'dn_live_...',");
  console.log("    apiKeyWarning: '⚠️ Save this API key now!'");
  console.log("  }");
  console.log("\n");

  console.log("💡 Quick Setup for ChatGPT Connectors:\n");
  console.log("1. Get your API key (use one of the methods above)");
  console.log("2. In ChatGPT Connectors:");
  console.log("   - Name: DreamNet API");
  console.log("   - Base URL: https://dreamnet.ink");
  console.log("   - Auth Type: Bearer Token");
  console.log("   - Token: dn_live_YOUR_KEY_HERE");
  console.log("\n3. ChatGPT will auto-discover endpoints via:");
  console.log("   - GET /api/chatgpt-agent/context");
  console.log("   - POST /api/chatgpt-agent/chat");
  console.log("\n✅ That's it! No manual action setup needed!\n");
}

getApiKey().catch(console.error);











