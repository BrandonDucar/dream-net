import "dotenv/config";
import { WhalePackCore } from "../packages/whale-pack-core/index";
import { getWhaleDashboardView } from "../packages/whale-pack-core/adapters/whaleStatusAdapter";

async function main() {
  console.log("===============================================");
  console.log(" Whale Pack - Single Cycle");
  console.log("===============================================");
  console.log("");

  const status = await WhalePackCore.run({});

  console.log("✅ Cycle Complete");
  console.log("Products:", status.productCount);
  console.log("Audiences:", status.audienceCount);
  console.log("Plans:", status.planCount);
  console.log("Posted:", status.postedCount);
  console.log("Insights:", status.insightCount);
  console.log("");

  const view = getWhaleDashboardView();
  console.log("📊 Dashboard Preview:");
  console.log("  Products:", view.products.map(p => p.name).join(", "));
  console.log("  Audiences:", view.audiences.map(a => a.name).join(", "));
  console.log("  Plans:", view.plans.map(pl => `${pl.hookStyle}:${pl.hookLine.slice(0,40)}...`).slice(0,3).join(" | "));
  console.log("");
}

main().catch((err) => {
  console.error("❌ Whale Pack run error:", err);
  process.exit(1);
});


