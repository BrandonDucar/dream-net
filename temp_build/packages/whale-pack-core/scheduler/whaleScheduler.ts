import { WhalePackContext, WhalePackStatus } from "../types";
import { WhaleStore } from "../store/whaleStore";
import { ensureSeedProductsAndAudiences, generateNewContentPlans } from "../logic/whaleSignalCore";
import { simulateWhalePosting } from "../logic/whalePosterCore";
import { runWhaleAnalysis } from "../logic/whaleAnalystCore";

export async function runWhalePackCycle(ctx: WhalePackContext): Promise<WhalePackStatus> {
  const now = Date.now();

  ensureSeedProductsAndAudiences();
  generateNewContentPlans(ctx, 5);
  await simulateWhalePosting(ctx);
  runWhaleAnalysis(ctx);

  WhaleStore.setLastRunAt(now);

  return WhaleStore.status();
}


