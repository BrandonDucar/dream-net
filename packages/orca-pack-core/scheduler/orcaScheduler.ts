import { OrcaPackContext, OrcaPackStatus } from "../types";
import { OrcaStore } from "../store/orcaStore";
import { ensureSeedThemes, generateNewOrcaIdeas, generateOrcaPlansFromIdeas } from "../logic/orcaSignalCore";
import { executeOrcaPosting, simulateOrcaPosting } from "../logic/orcaPosterCore";
import { runOrcaAnalysis } from "../logic/orcaAnalystCore";

export async function runOrcaPackCycle(ctx: OrcaPackContext): Promise<OrcaPackStatus> {
  const now = Date.now();

  ensureSeedThemes();
  generateNewOrcaIdeas(ctx, 5);
  generateOrcaPlansFromIdeas(ctx, ["x", "farcaster"]);

  // Use real posting if API keys are configured, otherwise simulate
  await executeOrcaPosting(ctx);
  runOrcaAnalysis(ctx);

  OrcaStore.setLastRunAt(now);

  return OrcaStore.status();
}


