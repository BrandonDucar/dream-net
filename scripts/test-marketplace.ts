/**
 * Test Agent Marketplace
 * 
 * Tests the X402-powered Agent Marketplace functionality.
 * Run with: tsx scripts/test-marketplace.ts
 */

import { agentMarketplace } from "../server/core/agents/AgentMarketplace";

async function testMarketplace() {
  console.log("🧪 Testing Agent Marketplace\n");

  // Test 1: List a service
  console.log("📝 Test 1: Listing a service...");
  try {
    const service = await agentMarketplace.listService({
      agentId: "wolf-pack",
      agentName: "Wolf Pack Protocol",
      serviceName: "Funding Opportunity Research",
      description: "Research and identify funding opportunities for your project",
      category: "research",
      price: "1000000000000000000", // 1 X402 (in wei)
      chain: "base",
      active: true,
      metadata: {
        estimatedDuration: "30 minutes",
        requirements: ["project description", "target funding amount"],
        tags: ["funding", "research", "grants"],
      },
    });

    console.log("✅ Service listed:", service.serviceId);
    console.log(`   Name: ${service.serviceName}`);
    console.log(`   Price: ${service.price} X402`);
    console.log(`   Category: ${service.category}\n`);

    // Test 2: List another service
    console.log("📝 Test 2: Listing another service...");
    const service2 = await agentMarketplace.listService({
      agentId: "deploy-keeper",
      agentName: "DeployKeeper",
      serviceName: "Deploy App to Cloud Run",
      description: "Deploy your application to Google Cloud Run",
      category: "deployment",
      price: "2000000000000000000", // 2 X402
      chain: "base",
      active: true,
      metadata: {
        estimatedDuration: "10 minutes",
        requirements: ["Dockerfile", "cloudbuild.yaml"],
        tags: ["deployment", "cloud", "gcp"],
      },
    });

    console.log("✅ Service listed:", service2.serviceId);
    console.log(`   Name: ${service2.serviceName}`);
    console.log(`   Price: ${service2.price} X402\n`);

    // Test 3: List all services
    console.log("📝 Test 3: Listing all services...");
    const allServices = agentMarketplace.listServices();
    console.log(`✅ Found ${allServices.length} services:`);
    allServices.forEach(s => {
      console.log(`   - ${s.serviceName} by ${s.agentName} (${s.price} X402)`);
    });
    console.log();

    // Test 4: Filter services by category
    console.log("📝 Test 4: Filtering services by category...");
    const researchServices = agentMarketplace.listServices({ category: "research" });
    console.log(`✅ Found ${researchServices.length} research services\n`);

    // Test 5: Get marketplace stats
    console.log("📝 Test 5: Getting marketplace statistics...");
    const stats = agentMarketplace.getStats();
    console.log("✅ Marketplace Stats:");
    console.log(`   Total Services: ${stats.totalServices}`);
    console.log(`   Active Services: ${stats.activeServices}`);
    console.log(`   Total Purchases: ${stats.totalPurchases}`);
    console.log(`   Total Revenue: ${stats.totalRevenue} X402`);
    console.log(`   Top Categories: ${stats.topCategories.map(c => `${c.category} (${c.count})`).join(", ")}`);
    console.log(`   Top Agents: ${stats.topAgents.map(a => `${a.agentName} (${a.serviceCount} services, ${a.revenue} X402)`).join(", ")}\n`);

    // Test 6: Purchase a service (simulated - will fail without real X402 tokens)
    console.log("📝 Test 6: Attempting to purchase a service...");
    try {
      const purchase = await agentMarketplace.purchaseService(
        service.serviceId,
        "test-buyer-agent",
        { test: true }
      );
      console.log(`✅ Purchase ${purchase.status}:`, purchase.purchaseId);
      if (purchase.status === "completed") {
        console.log(`   Transaction: ${purchase.transactionHash}`);
      } else if (purchase.error) {
        console.log(`   Error: ${purchase.error}`);
      }
    } catch (error: any) {
      console.log(`⚠️  Purchase failed (expected without real X402 tokens): ${error.message}`);
    }
    console.log();

    // Test 7: Add a review (if purchase was successful)
    console.log("📝 Test 7: Adding a review...");
    try {
      const purchases = agentMarketplace.getPurchaseHistory("test-buyer-agent");
      if (purchases.length > 0 && purchases[0].status === "completed") {
        const review = await agentMarketplace.addReview(
          purchases[0].purchaseId,
          5,
          "Great service! Found exactly what I needed."
        );
        console.log(`✅ Review added: ${review.reviewId}`);
        console.log(`   Rating: ${review.rating}/5`);
      } else {
        console.log("⚠️  No completed purchases to review");
      }
    } catch (error: any) {
      console.log(`⚠️  Review failed: ${error.message}`);
    }
    console.log();

    console.log("✅ All marketplace tests completed!\n");
    console.log("📊 Final Stats:");
    const finalStats = agentMarketplace.getStats();
    console.log(`   Services: ${finalStats.totalServices} (${finalStats.activeServices} active)`);
    console.log(`   Purchases: ${finalStats.totalPurchases}`);
    console.log(`   Revenue: ${finalStats.totalRevenue} X402`);

  } catch (error: any) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
testMarketplace().catch(console.error);

