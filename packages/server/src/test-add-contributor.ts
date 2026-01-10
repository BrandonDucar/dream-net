#!/usr/bin/env tsx
/**
 * Test addContributor function
 * 
 * Tests the addContributor(cocoonId, wallet, role) function with validation
 */

import { storage } from './storage.js';

async function testAddContributor(): Promise<void> {
  console.log("🧪 Testing addContributor function");
  console.log("================================");

  try {
    // First, let's create a test cocoon (if database is available)
    let testCocoonId = "test-cocoon-001";
    
    try {
      const testCocoon = await storage.createCocoon({
        dreamId: "test-dream-001",
        title: "Test Music Cocoon",
        description: "A test cocoon for contributor testing",
        creatorWallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
      });
      testCocoonId = testCocoon.id;
      console.log(`✅ Created test cocoon: ${testCocoonId}`);
    } catch (error) {
      console.log("ℹ️  Using mock cocoon ID for testing");
    }

    // Test 1: Valid role addition
    console.log("\n1. Testing valid role addition:");
    const result1 = await storage.addContributor(
      testCocoonId, 
      "0x8ba1f109551bD432803012645Hac136c9.5928e", 
      "Artist"
    );
    console.log(`Result: ${result1}`);

    // Test 2: Valid role addition - different contributor
    console.log("\n2. Testing another valid contributor:");
    const result2 = await storage.addContributor(
      testCocoonId, 
      "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", 
      "Coder"
    );
    console.log(`Result: ${result2}`);

    // Test 3: Duplicate contributor
    console.log("\n3. Testing duplicate contributor (should fail):");
    const result3 = await storage.addContributor(
      testCocoonId, 
      "0x8ba1f109551bD432803012645Hac136c9.5928e", 
      "Builder"
    );
    console.log(`Result: ${result3}`);

    // Test 4: Invalid role
    console.log("\n4. Testing invalid role (should fail):");
    const result4 = await storage.addContributor(
      testCocoonId, 
      "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", 
      "InvalidRole"
    );
    console.log(`Result: ${result4}`);

    // Test 5: Test all valid roles
    console.log("\n5. Testing all valid roles:");
    const validRoles = ['Builder', 'Artist', 'Coder', 'Visionary', 'Promoter'];
    const testWallets = [
      "0xaAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      "0xbFb6916095ca1df60bB79Ce92cE3Ea74c37c5d359", 
      "0xcCb6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      "0xdDb6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
      "0xeEb6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
    ];

    for (let i = 0; i < validRoles.length; i++) {
      const result = await storage.addContributor(testCocoonId, testWallets[i], validRoles[i]);
      console.log(`  ${validRoles[i]}: ${result}`);
    }

  } catch (error) {
    console.log("❌ Test error:", error);
  }

  console.log("\n✅ addContributor function testing completed");
}

async function main(): Promise<void> {
  await testAddContributor();
  process.exit(0);
}

// Export for modular use
export { testAddContributor };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}