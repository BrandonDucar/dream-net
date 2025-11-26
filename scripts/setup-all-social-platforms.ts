/**
 * Setup All Social Media Platforms for DreamNet
 * 
 * Guides you through setting up:
 * - Telegram (new bot for DreamNet)
 * - Base (blockchain social)
 * - Farcaster (decentralized social)
 * - Instagram (via Facebook)
 * - Reddit
 * - TikTok
 * - LinkedIn
 * 
 * Run with: tsx scripts/setup-all-social-platforms.ts
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface PlatformConfig {
  name: string;
  envKeys: string[];
  setupUrl: string;
  instructions: string[];
  priority: "high" | "medium" | "low";
}

const PLATFORMS: PlatformConfig[] = [
  {
    name: "Telegram",
    envKeys: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],
    setupUrl: "https://t.me/BotFather",
    instructions: [
      "1. Open Telegram and search for @BotFather",
      "2. Send /newbot command",
      "3. Follow prompts to create 'DreamNet Bot'",
      "4. BotFather will give you a token (like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)",
      "5. Copy the token and add to .env as TELEGRAM_BOT_TOKEN",
      "6. To get CHAT_ID: Send a message to your bot, then visit:",
      "   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates",
      "7. Look for 'chat':{'id':123456789} - that's your TELEGRAM_CHAT_ID"
    ],
    priority: "high"
  },
  {
    name: "Base",
    envKeys: ["BASE_API_KEY", "BASE_WALLET_PRIVATE_KEY"],
    setupUrl: "https://docs.base.org/",
    instructions: [
      "1. Base uses your existing wallet (same as DreamNet)",
      "2. For Base API: Go to https://base.org/developers",
      "3. Base is a blockchain - you can post via smart contracts",
      "4. Or use Base's social features via Farcaster (see below)",
      "5. Add BASE_WALLET_PRIVATE_KEY to .env (your existing wallet key)"
    ],
    priority: "high"
  },
  {
    name: "Farcaster",
    envKeys: ["FARCASTER_MNEMONIC", "FARCASTER_FID"],
    setupUrl: "https://warpcast.com/",
    instructions: [
      "1. Go to https://warpcast.com/ and create account",
      "2. Install Warpcast app or use web",
      "3. Go to Settings → Developer → Create Signer",
      "4. Copy your mnemonic phrase (keep it secret!)",
      "5. Add FARCASTER_MNEMONIC to .env",
      "6. Get your FID (Farcaster ID) from profile",
      "7. Add FARCASTER_FID to .env"
    ],
    priority: "high"
  },
  {
    name: "Instagram",
    envKeys: ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_BUSINESS_ACCOUNT_ID", "FACEBOOK_PAGE_ID"],
    setupUrl: "https://developers.facebook.com/apps/",
    instructions: [
      "1. Go to https://developers.facebook.com/apps/",
      "2. Log in with Facebook account",
      "3. Click 'Create App' → Select 'Business' type",
      "4. Add 'Instagram' product to your app",
      "5. Link your Instagram Business Account to a Facebook Page",
      "6. Get Page Access Token with Instagram permissions",
      "7. Add INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID, FACEBOOK_PAGE_ID to .env"
    ],
    priority: "medium"
  },
  {
    name: "Reddit",
    envKeys: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USERNAME", "REDDIT_PASSWORD"],
    setupUrl: "https://www.reddit.com/prefs/apps",
    instructions: [
      "1. Go to https://www.reddit.com/prefs/apps",
      "2. Log in to Reddit",
      "3. Click 'create another app' or 'create app'",
      "4. Fill in:",
      "   - Name: DreamNet Bot",
      "   - Type: script",
      "   - Description: Social media automation for DreamNet",
      "   - About URL: https://dreamnet.ink",
      "   - Redirect URI: http://localhost:3000 (or your domain)",
      "5. Copy Client ID (under the app name)",
      "6. Copy Secret (the 'secret' field)",
      "7. Add REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD to .env"
    ],
    priority: "medium"
  },
  {
    name: "TikTok",
    envKeys: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_ACCESS_TOKEN"],
    setupUrl: "https://developers.tiktok.com/",
    instructions: [
      "1. Go to https://developers.tiktok.com/",
      "2. Log in with TikTok account",
      "3. Click 'Create App'",
      "4. Fill in app details",
      "5. Add 'Content Posting' permission",
      "6. Get Client Key and Client Secret",
      "7. Generate Access Token",
      "8. Add TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_ACCESS_TOKEN to .env"
    ],
    priority: "medium"
  },
  {
    name: "LinkedIn",
    envKeys: ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET", "LINKEDIN_ACCESS_TOKEN"],
    setupUrl: "https://www.linkedin.com/developers/apps",
    instructions: [
      "1. Go to https://www.linkedin.com/developers/apps",
      "2. Log in with LinkedIn account",
      "3. Click 'Create app'",
      "4. Fill in app details",
      "5. Request 'Marketing Developer Platform' access",
      "6. Get Client ID and Client Secret",
      "7. Generate Access Token with 'w_member_social' permission",
      "8. Add LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_ACCESS_TOKEN to .env"
    ],
    priority: "low"
  },
  {
    name: "YouTube",
    envKeys: ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"],
    setupUrl: "https://console.cloud.google.com/apis/credentials",
    instructions: [
      "1. Go to https://console.cloud.google.com/apis/credentials",
      "2. Create a new OAuth 2.0 Client ID",
      "3. Application type: Web application",
      "4. Authorized redirect URIs: http://localhost:3000/oauth/youtube/callback",
      "5. Copy Client ID and Client Secret",
      "6. Run: tsx scripts/setup-youtube-oauth.ts to get refresh token",
      "7. Add YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN to .env"
    ],
    priority: "medium"
  },
  {
    name: "GitHub",
    envKeys: ["GITHUB_TOKEN"],
    setupUrl: "https://github.com/settings/tokens",
    instructions: [
      "1. Go to https://github.com/settings/tokens",
      "2. Click 'Generate new token' → 'Generate new token (classic)'",
      "3. Name: DreamNet Bot",
      "4. Select scopes: repo, gist, discussions",
      "5. Generate token and copy it",
      "6. Add GITHUB_TOKEN to .env"
    ],
    priority: "high"
  },
  {
    name: "Notion",
    envKeys: ["NOTION_TOKEN", "NOTION_DATABASE_ID"],
    setupUrl: "https://www.notion.so/my-integrations",
    instructions: [
      "1. Go to https://www.notion.so/my-integrations",
      "2. Click 'New integration'",
      "3. Name: DreamNet Bot",
      "4. Select workspace",
      "5. Copy 'Internal Integration Token'",
      "6. Share a Notion page/database with the integration",
      "7. Copy the page/database ID from the URL",
      "8. Add NOTION_TOKEN and NOTION_DATABASE_ID to .env"
    ],
    priority: "medium"
  },
  {
    name: "Slack",
    envKeys: ["SLACK_WEBHOOK_URL", "SLACK_BOT_TOKEN"],
    setupUrl: "https://api.slack.com/apps",
    instructions: [
      "Option 1 (Webhook - Easier):",
      "  1. Go to https://api.slack.com/apps",
      "  2. Create new app → 'From scratch'",
      "  3. Go to 'Incoming Webhooks' → Activate",
      "  4. Add webhook to workspace → Copy webhook URL",
      "  5. Add SLACK_WEBHOOK_URL to .env",
      "",
      "Option 2 (Bot Token - More features):",
      "  1. Create app as above",
      "  2. Go to 'OAuth & Permissions'",
      "  3. Add scopes: chat:write, channels:write",
      "  4. Install to workspace → Copy Bot User OAuth Token",
      "  5. Add SLACK_BOT_TOKEN to .env"
    ],
    priority: "high"
  },
  {
    name: "Discord",
    envKeys: ["DISCORD_WEBHOOK_URL", "DISCORD_BOT_TOKEN"],
    setupUrl: "https://discord.com/developers/applications",
    instructions: [
      "Option 1 (Webhook - Easier):",
      "  1. Go to Discord server → Server Settings → Integrations",
      "  2. Click 'New Webhook'",
      "  3. Copy webhook URL",
      "  4. Add DISCORD_WEBHOOK_URL to .env",
      "",
      "Option 2 (Bot Token - More features):",
      "  1. Go to https://discord.com/developers/applications",
      "  2. Create new application",
      "  3. Go to 'Bot' → Add bot",
      "  4. Copy token",
      "  5. Add bot to server with permissions: Send Messages, Embed Links",
      "  6. Add DISCORD_BOT_TOKEN to .env"
    ],
    priority: "high"
  }
];

function checkEnvFile(): Map<string, string> {
  const envPath = join(process.cwd(), ".env");
  const envVars = new Map<string, string>();

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        if (key && value) {
          envVars.set(key.trim(), value);
        }
      }
    }
  }

  return envVars;
}

function generateEnvTemplate(platforms: PlatformConfig[]): string {
  let template = "# Social Media Platform API Keys\n";
  template += "# Generated by setup-all-social-platforms.ts\n\n";

  for (const platform of platforms) {
    template += `# ${platform.name}\n`;
    for (const key of platform.envKeys) {
      const existing = process.env[key];
      if (existing && !existing.includes("ENTER_")) {
        template += `${key}=${existing}\n`;
      } else {
        template += `${key}=\n`;
      }
    }
    template += "\n";
  }

  return template;
}

async function main() {
  console.log("🚀 DreamNet Social Media Platform Setup\n");
  console.log("=" .repeat(60) + "\n");

  const envVars = checkEnvFile();
  const existingKeys = new Set<string>();

  // Check what's already configured
  for (const [key, value] of envVars.entries()) {
    if (value && value.length > 5 && !value.includes("ENTER_")) {
      existingKeys.add(key);
    }
  }

  console.log("📊 Current Status:\n");

  for (const platform of PLATFORMS.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  })) {
    const hasAllKeys = platform.envKeys.every(key => existingKeys.has(key));
    const hasSomeKeys = platform.envKeys.some(key => existingKeys.has(key));
    
    let status = "❌ Not configured";
    if (hasAllKeys) {
      status = "✅ Fully configured";
    } else if (hasSomeKeys) {
      status = "⚠️  Partially configured";
    }

    console.log(`${status} - ${platform.name}`);
    if (hasSomeKeys) {
      const missing = platform.envKeys.filter(k => !existingKeys.has(k));
      console.log(`   Missing: ${missing.join(", ")}`);
    }
    console.log();
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📋 Setup Instructions:\n");

  // Show setup instructions for platforms that need it
  for (const platform of PLATFORMS) {
    const hasAllKeys = platform.envKeys.every(key => existingKeys.has(key));
    
    if (!hasAllKeys) {
      console.log(`\n${"─".repeat(60)}`);
      console.log(`\n🎯 ${platform.name} (Priority: ${platform.priority.toUpperCase()})`);
      console.log(`\n🔗 Setup URL: ${platform.setupUrl}\n`);
      
      for (const instruction of platform.instructions) {
        console.log(`   ${instruction}`);
      }

      console.log(`\n📝 Add these to .env:`);
      for (const key of platform.envKeys) {
        if (!existingKeys.has(key)) {
          console.log(`   ${key}=`);
        }
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log("\n💡 Quick Start:\n");
  console.log("1. Start with Telegram (easiest - 2 minutes)");
  console.log("2. Then Base/Farcaster (blockchain social - uses your wallet)");
  console.log("3. Then Instagram/Reddit/TikTok (traditional platforms)");
  console.log("\n✅ Once you add keys to .env, API Keeper will auto-discover them!");
  console.log("✅ Orca Pack will automatically start posting to configured platforms!\n");

  // Generate .env template
  const template = generateEnvTemplate(PLATFORMS);
  const templatePath = join(process.cwd(), ".env.social-media.template");
  writeFileSync(templatePath, template);
  console.log(`📄 Generated template: ${templatePath}`);
  console.log("   Copy missing keys from template to your .env file\n");
}

main().catch(console.error);

