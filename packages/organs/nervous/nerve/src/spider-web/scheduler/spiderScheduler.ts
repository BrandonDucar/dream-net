import { SpiderWebContext, SpiderWebStatus } from '../types.js';
import { SpiderStore } from '../store/spiderStore.js';
import { runHeadSpider } from '../logic/headSpider.js';
import { runFunnelWebSpider, ensureDefaultSensors } from '../logic/funnelWebSpider.js';
import { runOrbWeaver } from '../logic/orbWeaver.js';
import { runSilkBinder } from '../logic/silkBinder.js';
import { ensureDefaultTemplates } from '../logic/threadTemplates.js';
import { learnThreadPatterns, learnFlyPatterns } from '../logic/patternLearner.js';

export async function runSpiderWebCycle(ctx: SpiderWebContext): Promise<SpiderWebStatus> {
  const now = Date.now();

  console.log("[SpiderWeb:Scheduler] Running Spider Web cycle...");

  // 1. Ensure default sensors and templates exist
  ensureDefaultSensors();
  ensureDefaultTemplates();

  // 2. Head Spider: read packs & create threads
  const headThreads = runHeadSpider(ctx);
  if (headThreads.length > 0) {
    console.log(`[SpiderWeb:Scheduler] Head Spider created ${headThreads.length} thread(s)`);
  }

  // 3. Funnel Web Spider: catch flies from sensors
  const funnelThreads = await runFunnelWebSpider(ctx);
  if (funnelThreads.length > 0) {
    console.log(`[SpiderWeb:Scheduler] Funnel Web Spider caught ${funnelThreads.length} fly/fly and created thread(s)`);
  }

  // 4. Silk Binder Spider: legal/compliance insights
  const silkInsights = runSilkBinder(ctx);
  if (silkInsights.length > 0) {
    console.log(`[SpiderWeb:Scheduler] Silk Binder generated ${silkInsights.length} insight(s)`);
  }

  // 5. Orb Weaver: route and execute threads
  await runOrbWeaver(ctx);

  // 6. Pattern Learning: learn from completed threads and flies
  const threadPatterns = learnThreadPatterns();
  const flyPatterns = learnFlyPatterns();
  if (threadPatterns.length > 0 || flyPatterns.length > 0) {
    console.log(`[SpiderWeb:Scheduler] Learned ${threadPatterns.length} thread pattern(s) and ${flyPatterns.length} fly pattern(s)`);
  }

  SpiderStore.setLastRunAt(now);
  console.log("[SpiderWeb:Scheduler] Spider Web cycle complete.");

  return SpiderStore.status();
}
