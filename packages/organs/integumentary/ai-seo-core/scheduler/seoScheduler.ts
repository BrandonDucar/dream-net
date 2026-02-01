import { AISEOCoreContext, AISEOCoreStatus } from '../types.js';
import { SEOStore } from '../store/seoStore.js';
import { ensureDefaultGeofences } from '../logic/geofencer.js';
import { generateSEOInsights } from '../logic/seoInsights.js';

/**
 * Run AI SEO cycle
 */
export function runAISEOCycle(ctx: AISEOCoreContext): AISEOCoreStatus {
  const now = Date.now();

  console.log("[AISEOCore:Scheduler] Running AI SEO cycle...");

  // Ensure default geofences
  ensureDefaultGeofences();

  // Generate insights
  const insights = generateSEOInsights();
  if (insights.length > 0) {
    console.log(`[AISEOCore:Scheduler] Generated ${insights.length} SEO insight(s)`);
  }

  // Future: Auto-optimize content from packs
  if (ctx.orcaPackCore?.listPlans) {
    const plans = ctx.orcaPackCore.listPlans();
    // Could auto-optimize social posts here
  }

  SEOStore.setLastRunAt(now);
  console.log("[AISEOCore:Scheduler] AI SEO cycle complete.");

  return SEOStore.status();
}

