#!/usr/bin/env tsx
"use strict";
/**
 * Dream Network Comprehensive Test Runner
 *
 * Demonstrates all implemented features:
 * - Dream scoring and progression gates
 * - Cocoon lifecycle management with logging
 * - Tags system and filtering
 * - Garden API output
 * - Notification engine
 * - Admin force stage changes
 * - Archive scheduling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDemoTest = runDemoTest;
const storage_1 = require("./server/storage");
const orchestration_script_1 = require("./server/orchestration-script");
const dev_test_generator_1 = require("./server/dev-test-generator");
const archive_scheduler_1 = require("./server/archive-scheduler");
async function runDemoTest() {
    console.log(`
🌟 Dream Network Comprehensive Demo
==================================
Testing all implemented features:

1. 🎲 Random test dream generation
2. 🔄 Master orchestration script  
3. 🗂️  Archive system
4. 🌸 Garden API output
5. 📊 Final metrics
  `);
    try {
        // 1. Generate some random test dreams
        console.log(`\n📍 Phase 1: Generating random test dreams...`);
        await (0, dev_test_generator_1.generateBatch)(3);
        // 2. Run master orchestration for full lifecycle testing
        console.log(`\n📍 Phase 2: Running master orchestration script...`);
        await (0, orchestration_script_1.runOrchestration)();
        // 3. Test archive system (won't find old items since everything is new)
        console.log(`\n📍 Phase 3: Testing archive system...`);
        const archiveResult = await (0, archive_scheduler_1.triggerArchiveNow)();
        console.log(`Archive results: ${archiveResult.archivedDreams} dreams, ${archiveResult.archivedCocoons} cocoons`);
        // 4. Display garden API output
        console.log(`\n📍 Phase 4: Garden API Output...`);
        const gardenData = await storage_1.storage.getGardenFeed({
            sortBy: 'lastUpdated',
            order: 'desc',
            limit: 10,
            offset: 0
        });
        console.log(`\n🌸 Public Garden Feed (Latest 10 items):`);
        gardenData.forEach((item, index) => {
            const emoji = item.type === 'dream' ? '💭' : '🦋';
            const status = item.type === 'dream' ? `Status: ${item.status}` : `Stage: ${item.stage}`;
            console.log(`${index + 1}. ${emoji} ${item.title} (Score: ${item.score})`);
            console.log(`   ${status} | Tags: [${item.tags.join(', ')}]`);
            console.log(`   Creator: ${item.creatorWallet.slice(0, 8)}... | Contributors: ${item.contributors.length}`);
        });
        // 5. Final metrics
        console.log(`\n📍 Phase 5: Final System Metrics...`);
        const metrics = await storage_1.storage.getDashboardMetrics();
        console.log(`
📊 System Overview:
- Total Dreams: ${metrics.totalDreams}
- Active Cocoons: ${metrics.activeCocoons}  
- Dream Cores: ${metrics.dreamCores}
- Wallets: ${metrics.totalWallets}
    `);
        // 6. Test notifications (if any exist)
        const recentNotifications = await storage_1.storage.getNotifications("0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e", 10);
        console.log(`\n📬 Recent Notifications: ${recentNotifications.length}`);
        if (recentNotifications.length > 0) {
            recentNotifications.slice(0, 3).forEach((notif, index) => {
                console.log(`${index + 1}. ${notif.title} (${notif.type})`);
            });
        }
        console.log(`\n🎉 Comprehensive demo completed successfully!`);
        console.log(`\n💡 You can now:`);
        console.log(`   - Check the /api/garden endpoint for public data`);
        console.log(`   - View notifications for any wallet`);
        console.log(`   - Test the admin endpoints with proper wallet headers`);
        console.log(`   - Run individual scripts for focused testing`);
    }
    catch (error) {
        console.error(`❌ Demo failed:`, error);
        throw error;
    }
}
async function main() {
    console.log(`Starting comprehensive Dream Network test...`);
    try {
        await runDemoTest();
        process.exit(0);
    }
    catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
