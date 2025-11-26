/**
 * Scan All Media
 * 
 * Scans all configured media sources and aggregates them
 * 
 * Run with: tsx scripts/scan-all-media.ts
 */

import { MediaAggregator } from "../packages/social-media-poster/src/media-aggregator";

async function main() {
  console.log("📸 Scanning All Media Sources...\n");

  const aggregator = new MediaAggregator();
  
  // Auto-configure from environment variables
  aggregator.autoConfigure();

  console.log("🔍 Aggregating media from all sources...\n");

  const allMedia = await aggregator.aggregateMedia(100); // Limit to 100 for preview

  console.log(`✅ Found ${allMedia.length} media files\n`);

  // Group by source
  const bySource = new Map<string, AggregatedMedia[]>();
  for (const media of allMedia) {
    const sourceType = media.source.split(":")[0];
    if (!bySource.has(sourceType)) {
      bySource.set(sourceType, []);
    }
    bySource.get(sourceType)!.push(media);
  }

  console.log("📊 Breakdown by source:\n");
  for (const [source, files] of bySource.entries()) {
    console.log(`   ${source}: ${files.length} files`);
  }

  console.log("\n📝 Sample files:\n");
  for (const media of allMedia.slice(0, 10)) {
    console.log(`   ${media.name} (${(media.size / 1024 / 1024).toFixed(2)} MB) - ${media.source}`);
  }

  if (allMedia.length > 10) {
    console.log(`\n   ... and ${allMedia.length - 10} more files`);
  }

  console.log("\n✅ Media scan complete!");
  console.log("\n💡 Use this media in Orca Pack posts:");
  console.log("   - Images: For Instagram, Twitter, Facebook posts");
  console.log("   - Videos: For YouTube, TikTok, Instagram Reels");
  console.log("   - All media: Available via MediaAggregator API\n");
}

main().catch(console.error);

