#!/usr/bin/env tsx
/**
 * Development Test Dream Generator
 * 
 * Generates random dreams for testing with:
 * - Unique names and descriptions
 * - Random tags from predefined lists
 * - Fake wallet creators
 * - Optional placeholder content
 * - Auto-evolution to cocoons after 2 seconds
 */

import { storage } from './storage.js';
import { notificationEngine } from './notification-engine.js';
import { calculateAIScore } from './ai-scoring.js';
import { calculateDreamScore } from './dream-scoring.js';

// Extended dream name components for unique generation
const ADJECTIVES = [
  "Ethereal", "Quantum", "Neural", "Digital", "Crystalline", "Holographic",
  "Plasma", "Prismatic", "Temporal", "Infinite", "Celestial", "Chromatic",
  "Magnetic", "Kinetic", "Synthetic", "Orbital", "Lucid", "Phantom"
];

const NOUNS = [
  "Symphony", "Cascade", "Framework", "Protocol", "Vision", "Reality",
  "Dreamscape", "Matrix", "Nexus", "Resonance", "Frequency", "Dimension",
  "Algorithm", "Interface", "Architecture", "Ecosystem", "Network", "Portal"
];

const DESCRIPTIVE_WORDS = [
  "revolutionary", "innovative", "groundbreaking", "transformative", "cutting-edge",
  "immersive", "adaptive", "intelligent", "sustainable", "collaborative",
  "decentralized", "automated", "intuitive", "scalable", "dynamic"
];

const DOMAINS = [
  ["ai", "machine-learning", "neural-networks"],
  ["blockchain", "defi", "crypto", "web3"],
  ["vr", "ar", "metaverse", "gaming"],
  ["biotech", "health", "medical"],
  ["climate", "sustainability", "green-tech"],
  ["space", "astronomy", "exploration"],
  ["music", "art", "creative"],
  ["social", "community", "collaboration"],
  ["education", "learning", "knowledge"],
  ["robotics", "automation", "iot"],
  ["finance", "fintech", "payments"],
  ["energy", "renewable", "clean-tech"]
];

const ORIGINS = [
  "hackathon", "research", "startup", "personal_project", "community",
  "university", "innovation_lab", "accelerator", "open_source", "collaboration"
];

const TEST_WALLETS = [
  "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 
  "0x8ba1f109551bD432803012645Hac136c9.5928e",
  "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
  "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "0x9f8f72aA9304c8B593d555F12eF6589CC3A579A2",
  "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateUniqueName(): string {
  const adj = getRandomElement(ADJECTIVES);
  const noun = getRandomElement(NOUNS);
  const number = Math.floor(Math.random() * 999) + 1;
  return `${adj} ${noun} ${number}`;
}

function generateDescription(): string {
  const descriptive = getRandomElement(DESCRIPTIVE_WORDS);
  const domain = getRandomElement(DOMAINS)[0];
  const purpose = getRandomElement([
    "push the boundaries of",
    "revolutionize how we think about",
    "create new possibilities in",
    "bridge the gap between",
    "democratize access to",
    "optimize the future of"
  ]);
  
  return `A ${descriptive} project that aims to ${purpose} ${domain}. This initiative combines innovative technology with creative vision to deliver unprecedented user experiences and drive meaningful impact in the digital landscape.`;
}

function generateRandomMetrics() {
  return {
    views: Math.floor(Math.random() * 2000) + 50,
    likes: Math.floor(Math.random() * 200) + 10,
    comments: Math.floor(Math.random() * 100) + 5,
    editCount: Math.floor(Math.random() * 15) + 1,
    uniquenessScore: Math.floor(Math.random() * 100) + 20
  };
}

async function generateTestDream(): Promise<string> {
  const title = generateUniqueName();
  const description = generateDescription();
  const tags = getRandomElement(DOMAINS);
  const wallet = getRandomElement(TEST_WALLETS);
  const urgency = Math.floor(Math.random() * 10) + 1;
  const origin = getRandomElement(ORIGINS);

  console.log(`🎲 Generating test dream: "${title}"`);
  console.log(`   Creator: ${wallet.slice(0, 8)}...`);
  console.log(`   Tags: [${tags.join(', ')}]`);
  console.log(`   Origin: ${origin}`);

  // Create the dream
  const dream = await storage.createDream({
    wallet,
    title,
    description,
    tags,
    urgency,
    origin
  });

  // Calculate AI score
  const { aiScore, aiTags } = calculateAIScore(dream);
  await storage.updateDreamAIScore(dream.id, aiScore, aiTags);
  
  console.log(`   AI Score: ${aiScore}`);

  // Add random metrics
  const metrics = generateRandomMetrics();
  const updatedDream = await storage.updateDreamMetrics(dream.id, metrics);

  // Calculate dream score
  const { dreamScore, scoreBreakdown } = calculateDreamScore(updatedDream);
  await storage.updateDreamScore(dream.id, dreamScore, scoreBreakdown);

  console.log(`   Dream Score: ${dreamScore}`);
  console.log(`   Breakdown: O:${scoreBreakdown.originality} T:${scoreBreakdown.traction} C:${scoreBreakdown.collaboration} U:${scoreBreakdown.updates}`);

  // Auto-approve for testing
  await storage.updateDreamStatus(dream.id, "approved", "dev-generator");
  await notificationEngine.notifyDreamApproved(updatedDream);

  console.log(`   ✅ Dream approved and ready for evolution`);

  return dream.id;
}

async function evolveDreamToCocoon(dreamId: string): Promise<string> {
  const dream = await storage.getDream(dreamId);
  if (!dream) {
    throw new Error(`Dream ${dreamId} not found`);
  }

  console.log(`🦋 Auto-evolving "${dream.title}" to cocoon...`);

  // Create cocoon
  const cocoon = await storage.createCocoon({
    dreamId: dream.id,
    title: dream.title,
    description: dream.description,
    creatorWallet: dream.wallet,
    evolutionNotes: [`Auto-evolved by dev generator on ${new Date().toISOString()}`]
  });

  // Transfer score and set initial stage
  await storage.updateCocoon(cocoon.id, {
    stage: "seedling" as any
  });

  // Update dream status
  await storage.updateDreamStatus(dreamId, "evolved", "dev-generator");

  // Log the evolution
  await storage.logCocoonStageChange(
    cocoon.id, 
    null, 
    "seedling", 
    "dev-generator", 
    false, 
    "Auto-evolved from dream via dev generator"
  );

  // Send notifications
  await notificationEngine.notifyCocoonCreated(cocoon, dream);

  console.log(`   🎯 Cocoon created: ${cocoon.id}`);
  console.log(`   📝 Evolution logged successfully`);

  return cocoon.id;
}

async function generateBatch(count: number): Promise<void> {
  console.log(`\n🚀 Generating batch of ${count} test dreams...`);
  
  const results = [];

  for (let i = 1; i <= count; i++) {
    console.log(`\n--- Dream ${i}/${count} ---`);
    
    try {
      // Generate dream
      const dreamId = await generateTestDream();
      
      // Wait 2 seconds before evolution
      console.log(`   ⏳ Waiting 2 seconds for auto-evolution...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Evolve to cocoon
      const cocoonId = await evolveDreamToCocoon(dreamId);
      
      results.push({
        dreamId,
        cocoonId,
        success: true
      });

    } catch (error) {
      console.error(`   ❌ Failed to generate dream ${i}:`, error);
      results.push({
        dreamId: null,
        cocoonId: null,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;

  console.log(`\n📊 Batch Generation Summary:`);
  console.log(`   ✅ Successful: ${successful}/${count}`);
  console.log(`   ❌ Failed: ${failed}/${count}`);

  if (successful > 0) {
    console.log(`\n🌟 Generated Dreams:`);
    results.filter(r => r.success).forEach((result, index) => {
      console.log(`   ${index + 1}. Dream: ${result.dreamId} → Cocoon: ${result.cocoonId}`);
    });
  }

  if (failed > 0) {
    console.log(`\n🚨 Failed Dreams:`);
    results.filter(r => !r.success).forEach((result, index) => {
      console.log(`   ${index + 1}. Error: ${result.error}`);
    });
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const count = args.length > 0 ? parseInt(args[0], 10) : 5;

  if (isNaN(count) || count < 1 || count > 100) {
    console.error("Usage: tsx dev-test-generator.ts [count]");
    console.error("Count must be between 1 and 100");
    process.exit(1);
  }

  console.log(`
🧪 Dream Network Test Generator
==============================
Generating ${count} random dreams with auto-evolution
Each dream gets unique content and evolves to cocoon after 2 seconds
  `);

  try {
    await generateBatch(count);
    
    // Show final stats
    const metrics = await storage.getDashboardMetrics();
    console.log(`\n📈 Current Database Stats:`);
    console.log(`   Total Dreams: ${metrics.totalDreams}`);
    console.log(`   Active Cocoons: ${metrics.activeCocoons}`);
    console.log(`   Dream Cores: ${metrics.dreamCores}`);
    console.log(`   Wallets: ${metrics.totalWallets}`);

  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }

  console.log(`\n🎉 Test generation completed!`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateTestDream, evolveDreamToCocoon, generateBatch };