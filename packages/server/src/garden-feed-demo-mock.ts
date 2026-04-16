#!/usr/bin/env tsx
/**
 * Garden Feed JSON Demo - Mock Data Version
 * 
 * Shows the exact JSON structure the getGardenFeed() function returns
 * Ready for frontend/viewer consumption
 */

// Mock data structure matching our schema types
const mockGardenFeed = [
  {
    id: "drm-neural-music-001",
    name: "Neural Music Synthesizer",
    stage: undefined, // Dreams don't have stages
    score: 85,
    tags: ["ai", "music", "synthesis", "hackathon"],
    contributors: []
  },
  {
    id: "drm-quantum-data-002", 
    name: "Quantum Data Storage",
    stage: undefined,
    score: 72,
    tags: ["quantum", "storage", "computing", "research"],
    contributors: []
  },
  {
    id: "coc-ai-music-pod-001",
    name: "AI Music Cocoon",
    stage: "metamorphosis",
    score: 88,
    tags: ["ai", "music", "evolution"],
    contributors: [
      {
        wallet: "0x8ba1f109551bD432803012645Hac136c9.5928e",
        role: "Artist",
        addedAt: new Date("2025-01-03T10:30:00Z")
      },
      {
        wallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        role: "Coder",
        addedAt: new Date("2025-01-03T11:15:00Z")
      }
    ]
  },
  {
    id: "coc-quantum-pod-002",
    name: "Quantum Storage Pod",
    stage: "active",
    score: 76,
    tags: ["quantum", "storage", "pod"],
    contributors: [
      {
        wallet: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
        role: "Builder",
        addedAt: new Date("2025-01-03T09:45:00Z")
      }
    ]
  },
  {
    id: "coc-dream-weaver-003",
    name: "Dream Weaver Network",
    stage: "emergence",
    score: 92,
    tags: ["dreams", "network", "weaving", "collaboration"],
    contributors: [
      {
        wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
        role: "Visionary",
        addedAt: new Date("2025-01-02T16:20:00Z")
      },
      {
        wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        role: "Promoter", 
        addedAt: new Date("2025-01-03T08:30:00Z")
      }
    ]
  }
];

function outputGardenFeedJSON(): void {
  // Output the exact structure that getSimpleGardenFeed() returns
  const output = {
    gardenFeed: mockGardenFeed,
    metadata: {
      totalItems: mockGardenFeed.length,
      timestamp: new Date().toISOString(),
      dreamCount: mockGardenFeed.filter(item => !item.stage).length,
      cocoonCount: mockGardenFeed.filter(item => item.stage).length
    }
  };

  console.log("\n🌸 GARDEN FEED JSON OUTPUT:");
  console.log("===============================");
  console.log(JSON.stringify(output, null, 2));
  console.log("===============================");

  // Also output just the feed array for direct frontend use
  console.log("\n📋 DIRECT FEED ARRAY (for frontend integration):");
  console.log("================================================");
  console.log(JSON.stringify(mockGardenFeed, null, 2));

  console.log("\n🔍 STRUCTURE BREAKDOWN:");
  console.log("======================");
  console.log("• Dreams: No 'stage' field (undefined)");
  console.log("• Cocoons: Include 'stage' field with values like 'active', 'metamorphosis', 'emergence'");
  console.log("• All items: id, name, score, tags[], contributors[]");
  console.log("• Contributors: wallet, role, addedAt timestamp");
  console.log("• Sorted by score (highest first)");
}

function main(): void {
  console.log(`
🌸 Garden Feed JSON Demo (Mock Data)
====================================
Showing exact JSON structure for frontend consumption

Fields: id, name, stage, score, tags, contributors
  `);

  outputGardenFeedJSON();

  console.log(`\n💡 Integration Options:`);
  console.log(`💡 API Endpoint: GET /api/garden/feed`);
  console.log(`💡 Console Script: tsx server/garden-feed-json.ts`);
  console.log(`💡 Function Call: storage.getSimpleGardenFeed()`);
  console.log(`💡 Mock Demo: tsx server/garden-feed-demo-mock.ts`);
}

// Run the demo
main();