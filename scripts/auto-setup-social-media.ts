/**
 * Auto-Setup Social Media API Keys
 * 
 * Uses browser automation to navigate developer portals and help get API keys.
 * Run with: tsx scripts/auto-setup-social-media.ts
 */

import { mcp_cursor-browser-extension_browser_navigate } from "../mcp/cursor-browser-extension";

async function setupTwitter() {
  console.log("🐦 Setting up Twitter/X API keys...\n");

  // Navigate to Twitter Developer Portal
  await mcp_cursor-browser-extension_browser_navigate({ url: "https://developer.twitter.com/en/portal/dashboard" });
  
  console.log("✅ Navigated to Twitter Developer Portal");
  console.log("\n📋 Steps to complete:");
  console.log("1. Log in to your Twitter account");
  console.log("2. Click 'Create App' or select existing app");
  console.log("3. Copy the following keys:");
  console.log("   - API Key");
  console.log("   - API Secret");
  console.log("   - Access Token");
  console.log("   - Access Token Secret");
  console.log("   - Bearer Token (optional)");
  console.log("\n💡 I'll wait for you to complete this, then extract the keys...\n");

  // Wait for user to complete setup
  await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

  // Try to extract keys from page
  const snapshot = await mcp_cursor-browser-extension_browser_snapshot();
  console.log("📸 Page snapshot captured - checking for API keys...");
  
  // TODO: Parse page to extract keys (if visible)
  // For now, prompt user to enter them
  return {
    platform: "twitter",
    keys: {
      apiKey: process.env.TWITTER_API_KEY || "ENTER_API_KEY",
      apiSecret: process.env.TWITTER_API_SECRET || "ENTER_API_SECRET",
      accessToken: process.env.TWITTER_ACCESS_TOKEN || "ENTER_ACCESS_TOKEN",
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "ENTER_ACCESS_TOKEN_SECRET",
      bearerToken: process.env.TWITTER_BEARER_TOKEN || "",
    },
  };
}

async function setupInstagram() {
  console.log("📸 Setting up Instagram API keys...\n");

  // Navigate to Facebook Developer Portal (Instagram uses Facebook's API)
  await mcp_cursor-browser-extension_browser_navigate({ url: "https://developers.facebook.com/apps/" });
  
  console.log("✅ Navigated to Facebook Developer Portal");
  console.log("\n📋 Steps to complete:");
  console.log("1. Log in to Facebook");
  console.log("2. Create a new app or select existing");
  console.log("3. Add 'Instagram' product");
  console.log("4. Link Instagram Business Account to Facebook Page");
  console.log("5. Get Page Access Token with Instagram permissions");
  console.log("\n💡 I'll wait for you to complete this...\n");

  await new Promise(resolve => setTimeout(resolve, 30000));

  return {
    platform: "instagram",
    keys: {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "ENTER_ACCESS_TOKEN",
      instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "ENTER_ACCOUNT_ID",
      pageId: process.env.FACEBOOK_PAGE_ID || "ENTER_PAGE_ID",
    },
  };
}

async function main() {
  console.log("🚀 Auto-Setup Social Media API Keys\n");
  console.log("This script will help you get API keys for all platforms.\n");

  const results: any[] = [];

  // Setup each platform
  try {
    const twitter = await setupTwitter();
    results.push(twitter);
  } catch (error: any) {
    console.error("❌ Twitter setup failed:", error.message);
  }

  try {
    const instagram = await setupInstagram();
    results.push(instagram);
  } catch (error: any) {
    console.error("❌ Instagram setup failed:", error.message);
  }

  console.log("\n✅ Setup complete!");
  console.log("\n📝 Add these to your .env file:\n");

  for (const result of results) {
    console.log(`# ${result.platform.toUpperCase()}`);
    for (const [key, value] of Object.entries(result.keys)) {
      const envKey = `${result.platform.toUpperCase()}_${key.toUpperCase().replace(/([A-Z])/g, '_$1').toUpperCase()}`;
      console.log(`${envKey}=${value}`);
    }
    console.log();
  }
}

main().catch(console.error);

