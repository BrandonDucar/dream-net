import { OrcaPackContext, OrcaPackStatus } from "../types";
import { OrcaStore } from "../store/orcaStore";
import { ensureSeedThemes, generateNewOrcaIdeas, generateOrcaPlansFromIdeas } from "../logic/orcaSignalCore";
import { simulateOrcaPosting } from "../logic/orcaPosterCore";
import { runOrcaAnalysis } from "../logic/orcaAnalystCore";

export async function runOrcaPackCycle(ctx: OrcaPackContext): Promise<OrcaPackStatus> {
  const now = Date.now();

  ensureSeedThemes();
  generateNewOrcaIdeas(ctx, 5);
  generateOrcaPlansFromIdeas(ctx, ["x", "farcaster"]);

  await simulateOrcaPosting(ctx);
  runOrcaAnalysis(ctx);

  OrcaStore.setLastRunAt(now);

  return OrcaStore.status();
}


