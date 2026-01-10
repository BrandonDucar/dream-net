import { OrcaPackContext, OrcaPackStatus } from '../types.js';
import { OrcaStore } from '../store/orcaStore.js';
import { ensureSeedThemes, generateNewOrcaIdeas, generateOrcaPlansFromIdeas } from '../logic/orcaSignalCore.js';
import { simulateOrcaPosting } from '../logic/orcaPosterCore.js';
import { runOrcaAnalysis } from '../logic/orcaAnalystCore.js';

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


