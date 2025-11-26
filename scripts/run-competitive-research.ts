/**
 * Run Comprehensive Competitive Research
 * Uses Competitive Intelligence Core to research all companies
 */

import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";
import { seedCompanies, COMPANIES } from "./seed-competitive-companies";

async function runComprehensiveResearch() {
  console.log("🚀 Starting Comprehensive Competitive Research...\n");
  console.log(`📊 Researching ${COMPANIES.length} companies across ${new Set(COMPANIES.map(c => c.vertical)).size} verticals\n`);

  // Seed companies first
  const core = new CompetitiveIntelligenceCore();
  await seedCompanies();
  
  console.log(`✅ Seeded ${core.getAllCompanies().length} companies\n`);

  const results: any[] = [];

  // Research companies by vertical (to group results)
  const companiesByVertical = new Map<string, typeof COMPANIES>();
  for (const company of COMPANIES) {
    if (!companiesByVertical.has(company.vertical)) {
      companiesByVertical.set(company.vertical, []);
    }
    companiesByVertical.get(company.vertical)!.push(company);
  }

  // Research each vertical
  for (const [vertical, companies] of companiesByVertical.entries()) {
    console.log(`\n📊 Researching ${vertical} vertical (${companies.length} companies)...`);

    for (const company of companies) {
      try {
        console.log(`  🔎 Researching ${company.name}...`);
        
        // Research company using Competitive Intelligence Core
        const researchData = await core.researchCompany(company.id);
        
        results.push({
          companyId: company.id,
          companyName: company.name,
          vertical: company.vertical,
          website: company.website,
          research: researchData,
          timestamp: Date.now(),
        });

        console.log(`  ✅ ${company.name} research complete`);
      } catch (error: any) {
        console.error(`  ❌ Error researching ${company.name}:`, error.message);
        results.push({
          companyId: company.id,
          companyName: company.name,
          vertical: company.vertical,
          website: company.website,
          error: error.message,
          timestamp: Date.now(),
        });
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save results
  const fs = await import("fs");
  fs.writeFileSync(
    "competitive-research-results.json",
    JSON.stringify(results, null, 2)
  );

  console.log(`\n✅ Research complete!`);
  console.log(`   Companies researched: ${results.length}`);
  console.log(`   Results saved to: competitive-research-results.json`);

  // Now analyze results
  console.log(`\n📊 Analyzing findings...`);
  
  const analyses: any[] = [];
  for (const result of results) {
    if (!result.error) {
      try {
        const analysis = await core.analyzeCompany(result.companyId);
        if (analysis) {
          analyses.push(analysis);
          console.log(`  ✅ Analyzed ${result.companyName}`);
        }
      } catch (error) {
        console.error(`  ❌ Error analyzing ${result.companyName}:`, error);
      }
    }
  }

  // Find opportunities by vertical
  console.log(`\n🔍 Finding opportunities...`);
  const opportunitiesByVertical = new Map<string, any[]>();
  
  for (const vertical of companiesByVertical.keys()) {
    try {
      const opportunities = await core.findOpportunities(vertical);
      opportunitiesByVertical.set(vertical, opportunities);
      console.log(`  ✅ ${vertical}: ${opportunities.length} opportunities found`);
    } catch (error) {
      console.error(`  ❌ Error finding opportunities for ${vertical}:`, error);
    }
  }

  // Generate roadmaps
  console.log(`\n🗺️ Generating innovation roadmaps...`);
  const roadmaps: Record<string, any> = {};
  
  for (const vertical of companiesByVertical.keys()) {
    try {
      const roadmap = await core.generateRoadmap(vertical);
      roadmaps[vertical] = roadmap;
      console.log(`  ✅ ${vertical}: Roadmap generated`);
    } catch (error) {
      console.error(`  ❌ Error generating roadmap for ${vertical}:`, error);
    }
  }

  // Save final analysis
  fs.writeFileSync(
    "competitive-analysis-complete.json",
    JSON.stringify({
      research: results,
      analyses,
      opportunities: Object.fromEntries(opportunitiesByVertical),
      roadmaps,
      timestamp: Date.now(),
    }, null, 2)
  );

  console.log(`\n🎉 Complete analysis saved to: competitive-analysis-complete.json`);
  console.log(`\n📋 Summary:`);
  console.log(`   Companies researched: ${results.length}`);
  console.log(`   Companies analyzed: ${analyses.length}`);
  console.log(`   Verticals analyzed: ${companiesByVertical.size}`);
  console.log(`   Total opportunities: ${Array.from(opportunitiesByVertical.values()).flat().length}`);
  console.log(`   Roadmaps generated: ${Object.keys(roadmaps).length}`);

  return {
    research: results,
    analyses,
    opportunities: Object.fromEntries(opportunitiesByVertical),
    roadmaps,
  };
}

// Run if executed directly  
if (import.meta.url.endsWith(process.argv[1]) || import.meta.url.includes("run-competitive-research")) {
  runComprehensiveResearch()
    .then(() => {
      console.log("\n✅ Research complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Research failed:", error);
      process.exit(1);
    });
}

export { runComprehensiveResearch };
