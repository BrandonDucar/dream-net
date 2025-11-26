/**
 * Setup Media Sources
 * 
 * Configures access to all your media sources:
 * - Dropbox
 * - OneDrive
 * - iCloud Photos
 * - Local directories
 * - Social media (Instagram, Farcaster)
 * - Twilio MMS
 * 
 * Run with: tsx scripts/setup-media-sources.ts
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

interface MediaSourceConfig {
  name: string;
  type: string;
  envKeys: string[];
  setupUrl: string;
  instructions: string[];
}

const MEDIA_SOURCES: MediaSourceConfig[] = [
  {
    name: "Dropbox",
    type: "dropbox",
    envKeys: ["DROPBOX_ACCESS_TOKEN", "DROPBOX_MEDIA_PATH"],
    setupUrl: "https://www.dropbox.com/developers/apps",
    instructions: [
      "1. Go to https://www.dropbox.com/developers/apps",
      "2. Create new app → 'Scoped access' → 'Full Dropbox'",
      "3. Generate access token",
      "4. Copy token and add to .env as DROPBOX_ACCESS_TOKEN",
      "5. Optional: Set DROPBOX_MEDIA_PATH to specific folder (e.g., '/Photos')"
    ],
  },
  {
    name: "OneDrive",
    type: "onedrive",
    envKeys: ["ONEDRIVE_ACCESS_TOKEN", "ONEDRIVE_MEDIA_PATH"],
    setupUrl: "https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade",
    instructions: [
      "1. Go to https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade",
      "2. Register new application",
      "3. Add API permissions: Files.Read, Files.ReadWrite",
      "4. Generate access token (OAuth2 flow)",
      "5. Add ONEDRIVE_ACCESS_TOKEN to .env",
      "6. Optional: Set ONEDRIVE_MEDIA_PATH to specific folder"
    ],
  },
  {
    name: "iCloud Photos",
    type: "icloud",
    envKeys: ["ICLOUD_PHOTOS_EXPORT_PATH"],
    setupUrl: "https://www.icloud.com/photos",
    instructions: [
      "Option 1 (Recommended - Export from Photos.app):",
      "  1. Open Photos.app on Mac",
      "  2. Select photos you want to use",
      "  3. File → Export → Export Photos",
      "  4. Choose location (e.g., ~/Pictures/DreamNet)",
      "  5. Set ICLOUD_PHOTOS_EXPORT_PATH to that location",
      "",
      "Option 2 (Sync via iCloud Drive):",
      "  1. Enable iCloud Photos in System Settings",
      "  2. Photos sync to ~/Pictures/Photos Library.photoslibrary",
      "  3. Export from there or use local path"
    ],
  },
  {
    name: "Local Media",
    type: "local",
    envKeys: ["MEDIA_ROOT", "LOCAL_MEDIA_PATH"],
    setupUrl: "N/A",
    instructions: [
      "1. Set MEDIA_ROOT to your main media directory",
      "   Example: MEDIA_ROOT=~/Pictures",
      "2. Or set LOCAL_MEDIA_PATH for additional directories",
      "   Example: LOCAL_MEDIA_PATH=~/Downloads,~/Desktop"
    ],
  },
  {
    name: "Instagram",
    type: "instagram",
    envKeys: ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_BUSINESS_ACCOUNT_ID"],
    setupUrl: "https://developers.facebook.com/apps/",
    instructions: [
      "1. Use same setup as Instagram posting (see SOCIAL_MEDIA_SETUP_GUIDE.md)",
      "2. Instagram Graph API allows fetching your own media",
      "3. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to .env"
    ],
  },
  {
    name: "Farcaster",
    type: "farcaster",
    envKeys: ["FARCASTER_MNEMONIC", "FARCASTER_FID"],
    setupUrl: "https://warpcast.com/",
    instructions: [
      "1. Use same setup as Farcaster posting",
      "2. Farcaster media is stored on IPFS/decentralized storage",
      "3. Can fetch your own casts with media",
      "4. Add FARCASTER_MNEMONIC and FARCASTER_FID to .env"
    ],
  },
  {
    name: "Twilio MMS",
    type: "twilio",
    envKeys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
    setupUrl: "https://console.twilio.com/",
    instructions: [
      "1. You already have Twilio set up!",
      "2. Twilio can receive MMS with media attachments",
      "3. Media is stored in Twilio's media storage",
      "4. Can fetch media via Twilio API",
      "5. Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER are in .env"
    ],
  },
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

async function main() {
  console.log("📸 DreamNet Media Sources Setup\n");
  console.log("=".repeat(60) + "\n");

  const envVars = checkEnvFile();
  const existingKeys = new Set<string>();

  for (const [key, value] of envVars.entries()) {
    if (value && value.length > 5 && !value.includes("ENTER_")) {
      existingKeys.add(key);
    }
  }

  console.log("📊 Current Status:\n");

  for (const source of MEDIA_SOURCES) {
    const hasAllKeys = source.envKeys.every(key => existingKeys.has(key));
    const hasSomeKeys = source.envKeys.some(key => existingKeys.has(key));
    
    let status = "❌ Not configured";
    if (hasAllKeys) {
      status = "✅ Fully configured";
    } else if (hasSomeKeys) {
      status = "⚠️  Partially configured";
    }

    console.log(`${status} - ${source.name}`);
    if (hasSomeKeys) {
      const missing = source.envKeys.filter(k => !existingKeys.has(k));
      console.log(`   Missing: ${missing.join(", ")}`);
    }
    console.log();
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📋 Setup Instructions:\n");

  for (const source of MEDIA_SOURCES) {
    const hasAllKeys = source.envKeys.every(key => existingKeys.has(key));
    
    if (!hasAllKeys) {
      console.log(`\n${"─".repeat(60)}`);
      console.log(`\n🎯 ${source.name}`);
      console.log(`\n🔗 Setup URL: ${source.setupUrl}\n`);
      
      for (const instruction of source.instructions) {
        console.log(`   ${instruction}`);
      }

      console.log(`\n📝 Add these to .env:`);
      for (const key of source.envKeys) {
        if (!existingKeys.has(key)) {
          console.log(`   ${key}=`);
        }
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log("\n💡 Quick Start:\n");
  console.log("1. Start with local media (MEDIA_ROOT=~/Pictures)");
  console.log("2. Then add Dropbox or OneDrive (cloud storage)");
  console.log("3. Export iCloud Photos to local folder");
  console.log("4. Twilio is already set up - can receive MMS media!");
  console.log("\n✅ Once configured, run: tsx scripts/scan-all-media.ts\n");
}

main().catch(console.error);

