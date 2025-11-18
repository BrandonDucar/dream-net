/**
 * Test Vercel Agent
 * Analyze and clean up Vercel projects
 */

import { DreamNetVercelAgent } from "@dreamnet/dreamnet-vercel-agent";

async function testVercelAgent() {
  console.log("🧪 Testing Vercel Agent...\n");

  // 1. Initialize Agent
  console.log("1️⃣ Initializing Vercel Agent...");
  const initialized = await DreamNetVercelAgent.init();
  if (!initialized) {
    console.error("❌ Vercel Agent not initialized. Check VERCEL_TOKEN env var.");
    process.exit(1);
  }
  console.log("✅ Vercel Agent initialized\n");

  // 2. Check status
  console.log("2️⃣ Checking status...");
  const status = await DreamNetVercelAgent.status();
  console.log("Status:", status);
  console.log("");

  // 3. List all projects
  console.log("3️⃣ Listing all projects...");
  const projects = await DreamNetVercelAgent.listProjects();
  console.log(`Found ${projects.length} projects:`);
  projects.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (ID: ${p.id})`);
    console.log(`     Updated: ${new Date(p.updatedAt).toLocaleString()}`);
    if (p.latestDeployment) {
      console.log(`     Latest: ${p.latestDeployment.url}`);
    }
  });
  console.log("");

  // 4. Find dreamnet.ink project
  console.log("4️⃣ Looking for dreamnet.ink project...");
  const dreamnetProject = await DreamNetVercelAgent.getProject("dream-net");
  if (dreamnetProject) {
    console.log(`✅ Found project: ${dreamnetProject.name}`);
    console.log(`   ID: ${dreamnetProject.id}`);
  } else {
    console.log("⚠️  No project named 'dream-net' found");
    console.log("   Try searching for variations:");
    projects.forEach(p => {
      if (p.name.toLowerCase().includes("dream") || p.name.toLowerCase().includes("net")) {
        console.log(`   - ${p.name}`);
      }
    });
  }
  console.log("");

  // 5. Analyze cleanup opportunities (dry-run)
  console.log("5️⃣ Analyzing cleanup opportunities (dry-run)...");
  const actions = await DreamNetVercelAgent.analyzeCleanup("dreamnet.ink");
  console.log(`Found ${actions.length} cleanup actions:`);
  
  const byType = actions.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("  Breakdown:", byType);
  console.log("");
  
  if (actions.length > 0) {
    console.log("Sample actions:");
    actions.slice(0, 5).forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.type}: ${a.reason}`);
    });
    if (actions.length > 5) {
      console.log(`  ... and ${actions.length - 5} more`);
    }
  }
  console.log("");

  // 6. Show what would be executed (dry-run)
  if (actions.length > 0) {
    console.log("6️⃣ Dry-run execution preview:");
    console.log("   (Set dryRun=false to actually execute)");
    const result = await DreamNetVercelAgent.executeCleanup(actions, true);
    console.log("Result:", result);
  } else {
    console.log("6️⃣ No cleanup actions needed!");
  }
  console.log("");

  console.log("✅ Vercel Agent test complete!");
  console.log("\n💡 To execute cleanup:");
  console.log("   POST /api/vercel/cleanup/auto with { dryRun: false }");
}

testVercelAgent().catch(console.error);

