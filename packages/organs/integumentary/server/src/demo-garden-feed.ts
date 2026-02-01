#!/usr/bin/env tsx
/**
 * Demo: Garden Feed JSON Output
 * 
 * Creates some test data and outputs the garden feed as clean JSON
 * Ready for frontend/viewer consumption
 */

import { storage } from './storage.js';

async function createSampleData(): Promise<void> {
  console.log("Creating sample data for garden feed demo...");

  try {
    // Create test dreams
    const dream1 = await storage.createDream({
      wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
      title: "Neural Music Synthesizer",
      description: "AI-powered music creation platform",
      tags: ["ai", "music", "synthesis"],
      urgency: 9,
      origin: "hackathon"
    });

    const dream2 = await storage.createDream({
      wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 
      title: "Quantum Data Storage",
      description: "Revolutionary quantum computing storage solution",
      tags: ["quantum", "storage", "computing"],
      urgency: 8,
      origin: "research"
    });

    // Set scores and approve dreams
    await storage.updateDreamScore(dream1.id, 85, { originality: 90, traction: 80, collaboration: 85, updates: 85 });
    await storage.updateDreamScore(dream2.id, 72, { originality: 75, traction: 70, collaboration: 70, updates: 73 });
    
    await storage.updateDreamStatus(dream1.id, "approved", "demo");
    await storage.updateDreamStatus(dream2.id, "approved", "demo");

    // Create cocoons
    const cocoon1 = await storage.createCocoon({
      dreamId: dream1.id,
      title: "AI Music Cocoon",
      description: "Evolved from Neural Music Synthesizer",
      creatorWallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
    });

    const cocoon2 = await storage.createCocoon({
      dreamId: dream2.id,
      title: "Quantum Storage Pod",
      description: "Evolved from Quantum Data Storage",
      creatorWallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    });

    // Set cocoon stages and scores
    await storage.updateCocoon(cocoon1.id, { stage: "metamorphosis" });
    await storage.updateCocoon(cocoon2.id, { stage: "active" });

    // Add contributors to cocoons
    await storage.addContributor(cocoon1.id, "0x8ba1f109551bD432803012645Hac136c9.5928e", "Artist");
    await storage.addContributor(cocoon1.id, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", "Coder");
    await storage.addContributor(cocoon2.id, "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", "Builder");

    console.log("Sample data created successfully!");

  } catch (error) {
    console.log("Note: Sample data creation skipped (may already exist or DB unavailable)");
  }
}

async function outputGardenFeedJSON(): Promise<void> {
  try {
    // Get the garden feed
    const gardenFeed = await storage.getSimpleGardenFeed();
    
    // Output as clean JSON for frontend consumption
    const output = {
      gardenFeed,
      metadata: {
        totalItems: gardenFeed.length,
        timestamp: new Date().toISOString(),
        dreamCount: gardenFeed.filter(item => !item.stage).length,
        cocoonCount: gardenFeed.filter(item => item.stage).length
      }
    };

    console.log("\n🌸 GARDEN FEED JSON OUTPUT:");
    console.log("===============================");
    console.log(JSON.stringify(output, null, 2));
    console.log("===============================");

    // Also output just the feed array for direct use
    console.log("\n📋 DIRECT FEED ARRAY (for frontend):");
    console.log("=====================================");
    console.log(JSON.stringify(gardenFeed, null, 2));

    return;

  } catch (error) {
    console.error("Error generating garden feed:", error);
    
    // Output empty structure for demo
    const emptyOutput = {
      gardenFeed: [],
      metadata: {
        totalItems: 0,
        timestamp: new Date().toISOString(),
        dreamCount: 0,
        cocoonCount: 0,
        error: "Database unavailable - showing empty structure"
      }
    };

    console.log("\n🌸 GARDEN FEED JSON OUTPUT (Empty Demo):");
    console.log("=========================================");
    console.log(JSON.stringify(emptyOutput, null, 2));
  }
}

async function main(): Promise<void> {
  console.log(`
🌸 Garden Feed JSON Demo
========================
Creating sample data and outputting JSON for frontend consumption

Fields included: id, name, stage, score, tags, contributors
  `);

  // Create sample data (will skip if DB unavailable)
  await createSampleData();

  // Output the garden feed as JSON
  await outputGardenFeedJSON();

  console.log(`\n💡 API Endpoint: GET /api/garden/feed`);
  console.log(`💡 Console Script: tsx server/garden-feed-json.ts`);
  console.log(`💡 Integration: Import { storage } and call storage.getSimpleGardenFeed()`);

  process.exit(0);
}

// Export for modular use
export { outputGardenFeedJSON, createSampleData };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}