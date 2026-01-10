import "dotenv/config";
import { OrcaPackCore } from "@dreamnet/orca-pack-core";
import { getOrcaDashboardView } from "../packages/orca-pack-core/adapters/orcaStatusAdapter";

async function main() {
  console.log("===============================================");
  console.log(" Orca Pack - Single Cycle");
  console.log("===============================================");
  console.log("");

  const status = await OrcaPackCore.run({});

  console.log("✅ Cycle Complete");
  console.log("Themes:", status.themeCount);
  console.log("Ideas:", status.ideaCount);
  console.log("Plans:", status.planCount);
  console.log("Posted:", status.postedCount);
  console.log("Insights:", status.insightCount);
  console.log("");

  const view = getOrcaDashboardView();
  console.log("📊 Dashboard Preview:");
  console.log("  Themes:", view.themes.map(t => t.name).join(", "));
  console.log("  Ideas:", view.ideas.slice(0,3).map(i => `${i.kind}:${i.title ?? "(no title)"}`).join(" | "));
  console.log("  Plans:", view.plans.slice(0,3).map(p => `${p.channel}:${p.status}`).join(" | "));
  console.log("");
}

main().catch((err) => {
  console.error("❌ Orca Pack run error:", err);
  process.exit(1);
});


