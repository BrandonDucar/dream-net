#!/usr/bin/env tsx
/**
 * Garden Feed JSON Output
 * 
 * Outputs all dreams and cocoons as JSON to console for frontend/viewer consumption
 * Fields: id, name, stage, score, tags, contributors
 */

import { storage } from './storage.js';

async function outputGardenFeedJSON(): Promise<void> {
  try {
    const gardenFeed = await storage.getSimpleGardenFeed();
    
    // Output clean JSON to console
    console.log(JSON.stringify(gardenFeed, null, 2));
    
  } catch (error) {
    console.error("Error fetching garden feed:", error);
    process.exit(1);
  }
}

// Main function
async function main(): Promise<void> {
  await outputGardenFeedJSON();
  process.exit(0);
}

// Export for modular use
export { outputGardenFeedJSON };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}