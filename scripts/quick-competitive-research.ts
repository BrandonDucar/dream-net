/**
 * Quick Competitive Research - Simplified version
 * Researches companies and generates analysis without browser automation
 */

import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";
import { seedCompanies, COMPANIES } from "./seed-competitive-companies";

async function runQuickResearch() {
  console.log("🚀 Starting Quick Competitive Research...\n");
  console.log(`📊 Analyzing ${COMPANIES.length} companies across ${new Set(COMPANIES.map(c => c.vertical)).size} verticals\n`);

  // Seed companies
  const core = new CompetitiveIntelligenceCore();
  
  // Add companies directly to avoid double-seeding
  for (const company of COMPANIES) {
    core.addCompany(company);
  }
  
  console.log(`✅ Loaded ${core.getAllCompanies().length} companies\n`);

  const results: any[] = [];
  const companiesByVertical = new Map<string, typeof COMPANIES>();
  
  for (const company of COMPANIES) {
    if (!companiesByVertical.has(company.vertical)) {
      companiesByVertical.set(company.vertical, []);
    }
    companiesByVertical.get(company.vertical)!.push(company);
  }

  // Analyze companies directly (without web scraping for now)
  console.log(`\n📊 Analyzing companies...\n`);

  for (const [vertical, companies] of companiesByVertical.entries()) {
    console.log(`\n📊 ${vertical} (${companies.length} companies)...`);

    for (const company of companies) {
      try {
        console.log(`  🔎 Analyzing ${company.name}...`);
        
        // Analyze company with timeout
        const analysisPromise = core.analyzeCompany(company.id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis timeout')), 10000)
        );
        
        const analysis = await Promise.race([analysisPromise, timeoutPromise]) as any;
        
        if (analysis) {
          results.push({
            companyId: company.id,
            companyName: company.name,
            vertical: company.vertical,
            website: company.website,
            analysis,
            timestamp: Date.now(),
          });
          console.log(`  ✅ ${company.name} - ${analysis.opportunities?.length || 0} opportunities, ${analysis.missingFeatures?.length || 0} missing features`);
        } else {
          console.log(`  ⚠️ ${company.name} - Analysis returned null`);
        }
      } catch (error: any) {
        console.error(`  ❌ Error analyzing ${company.name}:`, error.message);
      }
    }
  }

  // Find opportunities by vertical
  console.log(`\n🔍 Finding opportunities by vertical...`);
  const opportunitiesByVertical = new Map<string, any[]>();
  
  for (const vertical of companiesByVertical.keys()) {
    try {
      const opportunities = await core.findOpportunities(vertical);
      opportunitiesByVertical.set(vertical, opportunities);
      console.log(`  ✅ ${vertical}: ${opportunities.length} opportunities`);
    } catch (error: any) {
      console.error(`  ❌ ${vertical}:`, error.message);
    }
  }

  // Generate roadmaps
  console.log(`\n🗺️ Generating innovation roadmaps...`);
  const roadmaps: Record<string, any> = {};
  
  for (const vertical of companiesByVertical.keys()) {
    try {
      const roadmap = await core.generateRoadmap(vertical);
      roadmaps[vertical] = roadmap;
      console.log(`  ✅ ${vertical}: Roadmap with ${roadmap.prioritizedFeatures.length} features`);
    } catch (error: any) {
      console.error(`  ❌ ${vertical}:`, error.message);
    }
  }

  // Save results
  const fs = await import("fs");
  fs.writeFileSync(
    "competitive-analysis-quick.json",
    JSON.stringify({
      analyses: results,
      opportunities: Object.fromEntries(opportunitiesByVertical),
      roadmaps,
      timestamp: Date.now(),
      summary: {
        companiesAnalyzed: results.length,
        verticals: companiesByVertical.size,
        totalOpportunities: Array.from(opportunitiesByVertical.values()).flat().length,
        roadmapsGenerated: Object.keys(roadmaps).length,
      },
    }, null, 2)
  );

  console.log(`\n🎉 Analysis complete!`);
  console.log(`\n📋 Summary:`);
  console.log(`   Companies analyzed: ${results.length}`);
  console.log(`   Verticals: ${companiesByVertical.size}`);
  console.log(`   Total opportunities: ${Array.from(opportunitiesByVertical.values()).flat().length}`);
  console.log(`   Roadmaps: ${Object.keys(roadmaps).length}`);
  console.log(`\n💾 Results saved to: competitive-analysis-quick.json`);

  return {
    analyses: results,
    opportunities: Object.fromEntries(opportunitiesByVertical),
    roadmaps,
  };
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || import.meta.url.includes("quick-competitive-research")) {
  runQuickResearch()
    .then(() => {
      console.log("\n✅ Quick research complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Research failed:", error);
      process.exit(1);
    });
}

export { runQuickResearch };

