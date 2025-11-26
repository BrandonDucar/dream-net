/**
 * Activate Social Media Posting
 * 
 * Start posting to all connected social media accounts
 */

import { SocialMediaPoster } from "../packages/social-media-poster/SocialMediaPoster.js";
import { BrandGradingCore } from "../packages/dreamnet-video-brand-core/index.js";
import { GeofencingCore } from "../packages/dreamnet-geofence-core/index.js";

const brandGrading = new BrandGradingCore();
const geofencing = new GeofencingCore();

// Initial posts to announce DreamNet services
const INITIAL_POSTS = [
  {
    content: "🚀 DreamNet is now live! Access 55+ mini-apps, AI agents, and Web3 tools. Built on Base. Powered by X402 micropayments. dreamnet.ink",
    platforms: ["twitter", "facebook", "linkedin", "reddit"],
    hashtags: ["#DreamNet", "#Base", "#X402", "#Web3", "#AI"],
  },
  {
    content: "💰 New: X402 Service Marketplace is live! Purchase DreamNet services with X402 tokens. API access, AI agents, social media automation, and more. dreamnet.ink/marketplace",
    platforms: ["twitter", "linkedin", "reddit"],
    hashtags: ["#X402", "#Marketplace", "#DreamNet", "#Web3"],
  },
  {
    content: "🤖 DreamNet AI Agents: Wolf Pack (funding discovery), Whale Pack (commerce), Orca Pack (social media). All powered by X402 micropayments. dreamnet.ink/agents",
    platforms: ["twitter", "linkedin"],
    hashtags: ["#AI", "#Agents", "#DreamNet", "#Automation"],
  },
  {
    content: "🎨 Brand Color Grading + Geofencing now available! Apply DreamNet's signature Neon Blue + Raspberry Red to your videos. Auto-localize content by region. dreamnet.ink",
    platforms: ["twitter", "instagram", "facebook"],
    hashtags: ["#BrandGrading", "#Geofencing", "#VideoEditing", "#DreamNet"],
  },
];

async function activateSocialMediaPosting() {
  console.log("📱 Activating Social Media Posting...\n");

  const poster = new SocialMediaPoster();
  const results = [];

  for (const post of INITIAL_POSTS) {
    try {
      console.log(`📝 Posting to ${post.platforms.join(", ")}...`);
      console.log(`   Content: ${post.content.substring(0, 80)}...`);

      // Apply geofencing
      const localizedContent = await geofencing.localizeContent(post.content, "127.0.0.1");
      const finalContent = `${localizedContent.text}\n${post.hashtags.join(" ")}`;

      // Post to each platform
      for (const platform of post.platforms) {
        try {
          const result = await poster.post({
            content: finalContent,
            platform: platform as any,
            hashtags: post.hashtags,
          });

          if (result.success) {
            console.log(`   ✅ Posted to ${platform}: ${result.postUrl || result.postId}`);
            results.push({
              platform,
              success: true,
              postId: result.postId,
              postUrl: result.postUrl,
            });
          } else {
            console.log(`   ⚠️  ${platform}: ${result.error || "Failed"}`);
            results.push({
              platform,
              success: false,
              error: result.error,
            });
          }
        } catch (error: any) {
          console.log(`   ❌ ${platform} error: ${error.message}`);
          results.push({
            platform,
            success: false,
            error: error.message,
          });
        }
      }
    } catch (error: any) {
      console.error(`   ❌ Error posting:`, error.message);
    }
  }

  console.log("\n📊 Summary:");
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`   Successful Posts: ${successful}`);
  console.log(`   Failed Posts: ${failed}`);

  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  activateSocialMediaPosting()
    .then(() => {
      console.log("\n✅ Social media posting activated!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error activating social media:", error);
      process.exit(1);
    });
}

export { activateSocialMediaPosting };

