#!/usr/bin/env tsx
/**
 * Master Orchestration Script for Dream Network Testing
 * 
 * This script simulates the complete lifecycle:
 * 1. Seeds new dreams
 * 2. Evolves them to cocoons
 * 3. Calculates scores
 * 4. Adds contributors
 * 5. Simulates lifecycle stage transitions
 * 6. Sends notifications
 * 7. Triggers NFT minting if eligible
 * 8. Outputs garden feed
 * 
 * Runs 3 cycles with 15-second intervals
 */

import { storage } from "./storage";
import { notificationEngine } from "./notification-engine";
import { calculateDreamScore } from "./dream-scoring";
import { calculateAIScore } from "./ai-scoring";

// Test data generators
const DREAM_NAMES = [
  "Neural Symphony",
  "Quantum Cascade",
  "Digital Metamorphosis", 
  "Ethereal Framework",
  "Crystalline Protocol",
  "Infinite Recursion",
  "Plasma Dreams",
  "Holographic Vision",
  "Temporal Flux",
  "Prismatic Reality"
];

const DREAM_TAGS = [
  ["ai", "music", "synthesis"],
  ["quantum", "computing", "cryptography"],
  ["virtual", "reality", "gaming"],
  ["blockchain", "defi", "protocol"],
  ["machine-learning", "vision", "art"],
  ["biotech", "neural", "interface"],
  ["space", "exploration", "simulation"],
  ["climate", "sustainability", "green"],
  ["social", "network", "community"],
  ["automation", "robotics", "iot"]
];

const TEST_WALLETS = [
  "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 
  "0x8ba1f109551bD432803012645Hac136c9.5928e",
  "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
  "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
];

const CONTRIBUTOR_ROLES: Array<"Builder" | "Artist" | "Coder" | "Visionary" | "Promoter"> = [
  "Builder", "Artist", "Coder", "Visionary", "Promoter"
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seedTestDreams(count: number = 3): Promise<string[]> {
  console.log(`🌱 Seeding ${count} test dreams...`);
  const dreamIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const dream = await storage.createDream({
      wallet: getRandomElement(TEST_WALLETS),
      title: getRandomElement(DREAM_NAMES),
      description: `An innovative dream exploring the boundaries of ${getRandomElement(["technology", "art", "science", "creativity", "collaboration"])}. This project aims to revolutionize how we think about digital experiences.`,
      tags: getRandomElement(DREAM_TAGS),
      urgency: Math.floor(Math.random() * 10) + 1,
      origin: getRandomElement(["hackathon", "research", "startup", "personal_project", "community"])
    });

    // Calculate AI score
    const { aiScore, aiTags } = calculateAIScore(dream);
    await storage.updateDreamAIScore(dream.id, aiScore, aiTags);

    // Calculate dream score with random metrics
    const updatedDream = await storage.updateDreamMetrics(dream.id, {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      editCount: Math.floor(Math.random() * 10),
      uniquenessScore: Math.floor(Math.random() * 100)
    });

    const { dreamScore, scoreBreakdown } = calculateDreamScore(updatedDream);
    await storage.updateDreamScore(dream.id, dreamScore, scoreBreakdown);

    // Approve the dream
    await storage.updateDreamStatus(dream.id, "approved", "admin");
    
    dreamIds.push(dream.id);
    console.log(`  ✅ Created dream: ${dream.title} (Score: ${dreamScore})`);
  }

  return dreamIds;
}

async function evolveToCocoons(dreamIds: string[]): Promise<string[]> {
  console.log(`🐣 Evolving ${dreamIds.length} dreams to cocoons...`);
  const cocoonIds: string[] = [];

  for (const dreamId of dreamIds) {
    const dream = await storage.getDream(dreamId);
    if (!dream) continue;

    const cocoon = await storage.createCocoon({
      dreamId: dream.id,
      title: dream.title,
      description: dream.description,
      creatorWallet: dream.wallet,
      evolutionNotes: [`Evolved from dream on ${new Date().toISOString()}`]
    });

    // Copy score from dream
    await storage.updateCocoon(cocoon.id, { 
      stage: "incubating" as any
    });

    // Update cocoon score
    const cocoonData = await storage.getCocoon(cocoon.id);
    if (cocoonData) {
      await storage.updateCocoon(cocoon.id, { stage: "incubating" as any });
      // Simulate score transfer
      const updatedCocoon = { ...cocoonData, dreamScore: dream.dreamScore };
      await storage.updateCocoon(cocoon.id, {});
    }

    await storage.updateDreamStatus(dreamId, "evolved", "admin");
    await notificationEngine.notifyCocoonCreated(cocoon, dream);

    cocoonIds.push(cocoon.id);
    console.log(`  🦋 Created cocoon: ${cocoon.title}`);
  }

  return cocoonIds;
}

async function addContributors(cocoonIds: string[]): Promise<void> {
  console.log(`🤝 Adding contributors to cocoons...`);

  for (const cocoonId of cocoonIds) {
    const cocoon = await storage.getCocoon(cocoonId);
    if (!cocoon) continue;

    // Add 1-3 random contributors
    const contributorCount = Math.floor(Math.random() * 3) + 1;
    const selectedWallets = getRandomElements(
      TEST_WALLETS.filter(w => w !== cocoon.creatorWallet), 
      contributorCount
    );

    for (const wallet of selectedWallets) {
      const contributor = {
        wallet,
        role: getRandomElement(CONTRIBUTOR_ROLES),
        joinedAt: new Date().toISOString()
      };

      try {
        await storage.addCocoonContributor(cocoonId, contributor, "admin");
        await notificationEngine.notifyContributorAdded(
          cocoonId, 
          wallet, 
          contributor.role, 
          cocoon.title
        );
        console.log(`    👥 Added ${contributor.role}: ${wallet.slice(0, 8)}...`);
      } catch (error) {
        console.log(`    ⚠️  Failed to add contributor: ${error}`);
      }
    }
  }
}

async function simulateLifecycle(cocoonIds: string[]): Promise<void> {
  console.log(`⚡ Simulating lifecycle progression...`);

  for (const cocoonId of cocoonIds) {
    const cocoon = await storage.getCocoon(cocoonId);
    if (!cocoon) continue;

    // Simulate score updates
    const newScore = Math.floor(Math.random() * 100) + 20;
    await storage.updateCocoon(cocoon.id, {});

    // Try to progress through stages
    const stages = ["incubating", "active", "metamorphosis", "emergence", "complete"];
    let currentStageIndex = stages.indexOf(cocoon.stage);

    // Progress 1-2 stages based on score
    const progressSteps = newScore >= 60 ? (newScore >= 80 ? 2 : 1) : 0;

    for (let i = 0; i < progressSteps && currentStageIndex < stages.length - 1; i++) {
      const oldStage = stages[currentStageIndex];
      const newStage = stages[currentStageIndex + 1];

      // Check score progression gate for incubating -> active
      if (oldStage === "incubating" && newStage === "active" && newScore < 60) {
        await notificationEngine.notifyInsufficientScore(cocoon);
        console.log(`    🚫 Score too low for progression: ${newScore}/60`);
        break;
      }

      await storage.updateCocoon(cocoonId, { stage: newStage as any });
      await storage.logCocoonStageChange(cocoonId, oldStage, newStage, "admin");
      await notificationEngine.notifyCocoonStageUpdated(
        { ...cocoon, stage: newStage as any }, 
        oldStage, 
        newStage
      );

      console.log(`    🔄 ${cocoon.title}: ${oldStage} → ${newStage} (Score: ${newScore})`);
      currentStageIndex++;

      // Check for NFT minting eligibility
      if (newStage === "complete" && newScore >= 80) {
        const nftData = {
          name: `Cocoon of ${cocoon.title}`,
          contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
          tokenId: Math.floor(Math.random() * 10000),
          mintedAt: new Date().toISOString(),
          owner: cocoon.creatorWallet
        };

        await notificationEngine.notifyNFTMinted(cocoon, nftData);
        console.log(`    🎨 NFT Minted! Token ID: ${nftData.tokenId}`);
      }
    }
  }
}

async function outputGardenFeed(): Promise<void> {
  console.log(`🌸 Current Garden Feed:`);
  
  const gardenData = await storage.getGardenFeed({
    sortBy: 'lastUpdated',
    order: 'desc',
    limit: 20,
    offset: 0
  });

  console.log(`\n📊 Garden Summary (${gardenData.length} items):`);
  gardenData.forEach((item, index) => {
    const emoji = item.type === 'dream' ? '💭' : '🦋';
    const status = item.type === 'dream' ? `Status: ${item.status}` : `Stage: ${item.stage}`;
    console.log(`${index + 1}. ${emoji} ${item.title}`);
    console.log(`   ${status} | Score: ${item.score} | Tags: [${item.tags.join(', ')}]`);
    console.log(`   Creator: ${item.creatorWallet.slice(0, 8)}... | Contributors: ${item.contributors.length}`);
  });
}

async function runCycle(cycleNumber: number): Promise<void> {
  console.log(`\n🚀 Starting Cycle ${cycleNumber}/3`);
  console.log(`⏰ ${new Date().toLocaleTimeString()}`);
  
  try {
    // 1. Seed dreams
    const dreamIds = await seedTestDreams(3);
    
    // 2. Evolve to cocoons
    const cocoonIds = await evolveToCocoons(dreamIds);
    
    // 3. Add contributors
    await addContributors(cocoonIds);
    
    // 4. Simulate lifecycle
    await simulateLifecycle(cocoonIds);
    
    // 5. Output garden feed
    await outputGardenFeed();
    
    console.log(`✅ Cycle ${cycleNumber} completed successfully!`);
    
  } catch (error) {
    console.error(`❌ Cycle ${cycleNumber} failed:`, error);
  }
}

async function main(): Promise<void> {
  console.log(`
🌟 Dream Network Master Orchestration Script
============================================
Running 3 cycles with 15-second intervals
Each cycle: Seed → Evolve → Contribute → Progress → Report
  `);

  for (let cycle = 1; cycle <= 3; cycle++) {
    await runCycle(cycle);
    
    if (cycle < 3) {
      console.log(`\n⏳ Waiting 15 seconds before next cycle...\n`);
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }

  console.log(`\n🎉 All cycles completed! Check the garden for results.`);
  console.log(`📋 Final Statistics:`);
  
  const metrics = await storage.getDashboardMetrics();
  console.log(`   Dreams: ${metrics.totalDreams}`);
  console.log(`   Cocoons: ${metrics.activeCocoons}`);
  console.log(`   Cores: ${metrics.dreamCores}`);
  console.log(`   Wallets: ${metrics.totalWallets}`);

  process.exit(0);
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runOrchestration };