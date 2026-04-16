#!/usr/bin/env tsx
/**
 * Demo: Simple Notifications System
 * 
 * Demonstrates the in-memory notifications array with:
 * - Stage change notifications
 * - NFT minting notifications  
 * - Contributor addition notifications
 * - Console log delivery simulation
 */

import { storage } from "./storage";
import { simpleNotifications } from "./simple-notifications";

const TEST_WALLET = "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e";

async function demoNotifications(): Promise<void> {
  console.log(`
🔔 Simple Notifications System Demo
==================================
Testing in-memory notifications with console delivery simulation

Demo Wallet: ${TEST_WALLET}
  `);

  try {
    // 1. Create a test dream and evolve it to cocoon
    console.log(`\n📍 Step 1: Creating test dream and cocoon...`);
    
    const dream = await storage.createDream({
      wallet: TEST_WALLET,
      title: "Notification Test Dream",
      description: "A dream to test the notification system",
      tags: ["test", "notifications"],
      urgency: 8,
      origin: "test"
    });

    console.log(`   ✅ Created dream: ${dream.title}`);

    // Set a high score to enable progression
    await storage.updateDreamScore(dream.id, 75, {
      originality: 80,
      traction: 70,
      collaboration: 75,
      updates: 75
    });

    // Evolve to cocoon
    const cocoon = await storage.createCocoon({
      dreamId: dream.id,
      title: dream.title,
      description: dream.description,
      creatorWallet: TEST_WALLET
    });

    console.log(`   ✅ Created cocoon: ${cocoon.title}`);

    // 2. Test stage progression notifications
    console.log(`\n📍 Step 2: Testing stage change notifications...`);
    
    const stages = ["incubating", "active", "metamorphosis", "emergence", "complete"];
    let currentStage = "seedling";

    for (const newStage of stages) {
      console.log(`\n   🔄 Progressing from ${currentStage} to ${newStage}...`);
      
      await storage.updateCocoon(cocoon.id, { stage: newStage as any });
      await storage.logCocoonStageChange(cocoon.id, currentStage, newStage, "demo");
      
      currentStage = newStage;
      
      // Short delay to see console output clearly
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Test contributor notifications
    console.log(`\n📍 Step 3: Testing contributor addition notifications...`);

    const testContributors = [
      { wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", role: "Builder" },
      { wallet: "0x8ba1f109551bD432803012645Hac136c9.5928e", role: "Artist" },
      { wallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", role: "Coder" }
    ];

    for (const contributor of testContributors) {
      console.log(`\n   👥 Adding ${contributor.role}: ${contributor.wallet.slice(0, 8)}...`);
      await storage.addContributor(cocoon.id, contributor.wallet, contributor.role);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Test NFT minting notification (cocoon should already be complete with score 75)
    console.log(`\n📍 Step 4: Testing NFT minting (need score 80+)...`);
    
    // Update cocoon to have score 85 to trigger minting
    await storage.updateCocoon(cocoon.id, {});
    const updatedCocoon = await storage.getCocoon(cocoon.id);
    
    if (updatedCocoon) {
      // Manually set score for demo
      const highScoreCocoon = { ...updatedCocoon, dreamScore: 85 };
      console.log(`\n   🎯 Testing mint with score ${highScoreCocoon.dreamScore}...`);
      await storage.checkAndMintNFT(highScoreCocoon);
    }

    // 5. Display all notifications for the test wallet
    console.log(`\n📍 Step 5: Checking notifications for ${TEST_WALLET.slice(0, 8)}...`);
    
    const notifications = simpleNotifications.getNotifications(TEST_WALLET, 20);
    const unreadCount = simpleNotifications.getUnreadCount(TEST_WALLET);
    
    console.log(`\n📬 Notification Summary:`);
    console.log(`   Total notifications: ${notifications.length}`);
    console.log(`   Unread notifications: ${unreadCount}`);
    
    console.log(`\n📋 Recent Notifications:`);
    notifications.slice(0, 5).forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.type}] ${notif.message}`);
      console.log(`   Time: ${notif.timestamp.toISOString()}`);
      console.log(`   Read: ${notif.read ? '✅' : '❌'}`);
      console.log(`   ID: ${notif.id}\n`);
    });

    // 6. Test marking notifications as read
    console.log(`📍 Step 6: Testing mark as read functionality...`);
    
    if (notifications.length > 0) {
      const firstNotif = notifications[0];
      console.log(`\n   📖 Marking notification ${firstNotif.id} as read...`);
      simpleNotifications.markAsRead(firstNotif.id);
      
      console.log(`\n   📚 Marking all remaining notifications as read...`);
      simpleNotifications.markAllAsRead(TEST_WALLET);
    }

    // 7. Display final notification status
    console.log(`\n📍 Final Status:`);
    const finalUnreadCount = simpleNotifications.getUnreadCount(TEST_WALLET);
    console.log(`   Unread notifications: ${finalUnreadCount}`);

    console.log(`\n🎉 Notifications demo completed successfully!`);
    console.log(`\n💡 API Endpoints available:`);
    console.log(`   GET /api/simple-notifications (with x-wallet-address header)`);
    console.log(`   PATCH /api/simple-notifications/:id/read`);
    console.log(`   PATCH /api/simple-notifications/mark-all-read`);

  } catch (error) {
    console.error(`❌ Demo failed:`, error);
    throw error;
  }
}

async function main(): Promise<void> {
  console.log(`Starting notifications system demo...`);
  
  try {
    await demoNotifications();
    process.exit(0);
  } catch (error) {
    console.error("Demo failed:", error);
    process.exit(1);
  }
}

// Export for modular use
export { demoNotifications };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}