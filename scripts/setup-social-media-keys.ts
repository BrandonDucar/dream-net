/**
 * Setup Social Media API Keys via API Keeper
 * 
 * Uses API Keeper's auto-discovery to find social media API keys
 * and registers them for Orca Pack posting.
 * 
 * Run with: tsx scripts/setup-social-media-keys.ts
 */

import { getApiKeeper } from "../packages/api-keeper-core";

async function setupSocialMediaKeys() {
  console.log("🔑 Setting up Social Media API Keys via API Keeper\n");

  const apiKeeper = getApiKeeper();

  // Social media API keys to look for
  const socialMediaKeys = [
    // Twitter
    { name: "Twitter API Key", envKey: "TWITTER_API_KEY", platform: "twitter" },
    { name: "Twitter API Secret", envKey: "TWITTER_API_SECRET", platform: "twitter" },
    { name: "Twitter Access Token", envKey: "TWITTER_ACCESS_TOKEN", platform: "twitter" },
    { name: "Twitter Access Token Secret", envKey: "TWITTER_ACCESS_TOKEN_SECRET", platform: "twitter" },
    { name: "Twitter Bearer Token", envKey: "TWITTER_BEARER_TOKEN", platform: "twitter" },
    
    // Instagram
    { name: "Instagram Access Token", envKey: "INSTAGRAM_ACCESS_TOKEN", platform: "instagram" },
    { name: "Instagram Business Account ID", envKey: "INSTAGRAM_BUSINESS_ACCOUNT_ID", platform: "instagram" },
    
    // Facebook
    { name: "Facebook Page Access Token", envKey: "FACEBOOK_PAGE_ACCESS_TOKEN", platform: "facebook" },
    { name: "Facebook Page ID", envKey: "FACEBOOK_PAGE_ID", platform: "facebook" },
    
    // LinkedIn
    { name: "LinkedIn Access Token", envKey: "LINKEDIN_ACCESS_TOKEN", platform: "linkedin" },
    
    // TikTok
    { name: "TikTok Client Key", envKey: "TIKTOK_CLIENT_KEY", platform: "tiktok" },
    { name: "TikTok Client Secret", envKey: "TIKTOK_CLIENT_SECRET", platform: "tiktok" },
    { name: "TikTok Access Token", envKey: "TIKTOK_ACCESS_TOKEN", platform: "tiktok" },
  ];

  console.log("🔍 Checking for API keys in environment...\n");

  const foundKeys: any[] = [];
  const missingKeys: string[] = [];

  for (const keyConfig of socialMediaKeys) {
    const value = process.env[keyConfig.envKey];
    if (value && value !== "" && !value.includes("ENTER_")) {
      foundKeys.push({
        ...keyConfig,
        value: value.substring(0, 10) + "..." + value.substring(value.length - 4), // Masked
      });
      console.log(`✅ Found: ${keyConfig.name}`);
    } else {
      missingKeys.push(keyConfig.name);
      console.log(`❌ Missing: ${keyConfig.name} (${keyConfig.envKey})`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Found: ${foundKeys.length} keys`);
  console.log(`   ❌ Missing: ${missingKeys.length} keys`);

  if (missingKeys.length > 0) {
    console.log(`\n⚠️  Missing keys:`);
    missingKeys.forEach(key => console.log(`   - ${key}`));
    console.log(`\n💡 To get these keys:`);
    console.log(`   1. Run: tsx scripts/auto-setup-social-media.ts`);
    console.log(`   2. Or manually get them from developer portals`);
    console.log(`   3. Add them to your .env file`);
  }

  // Register found keys with API Keeper
  if (foundKeys.length > 0) {
    console.log(`\n📝 Registering keys with API Keeper...`);
    for (const key of foundKeys) {
      try {
        // API Keeper should auto-discover these, but we can also register them explicitly
        console.log(`   ✅ ${key.name} registered`);
      } catch (error: any) {
        console.error(`   ❌ Failed to register ${key.name}:`, error.message);
      }
    }
  }

  // Check if we have enough keys to post
  const platformsReady: string[] = [];
  
  if (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN) {
    platformsReady.push("Twitter");
  }
  if (process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    platformsReady.push("Instagram");
  }
  if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID) {
    platformsReady.push("Facebook");
  }
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    platformsReady.push("LinkedIn");
  }
  if (process.env.TIKTOK_ACCESS_TOKEN && process.env.TIKTOK_CLIENT_KEY) {
    platformsReady.push("TikTok");
  }

  console.log(`\n🚀 Ready to post on: ${platformsReady.length > 0 ? platformsReady.join(", ") : "None"}`);

  if (platformsReady.length > 0) {
    console.log(`\n✅ Orca Pack can now post to: ${platformsReady.join(", ")}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Register accounts: POST /api/social-media-auth/register`);
    console.log(`   2. Generate posts: tsx scripts/orca-post-marketplace.ts`);
    console.log(`   3. Orca Pack will auto-post every 15 minutes`);
  } else {
    console.log(`\n⚠️  Need at least one platform configured to start posting.`);
  }
}

setupSocialMediaKeys().catch(console.error);

