/**
 * Whale Pack Control Loop
 * Monitors metrics and triggers actions automatically
 */

import { getAllMetrics } from './metrics';
import { processWhaleAction } from './actions';
import { MiniAppMetric } from './types';

let controlLoopRunning = false;
let controlLoopInterval: NodeJS.Timeout | null = null;

/**
 * Run one iteration of the control loop
 */
export async function runControlLoop(): Promise<void> {
  if (controlLoopRunning) {
    console.log('[WhalePack] Control loop already running, skipping...');
    return;
  }

  controlLoopRunning = true;
  console.log('[WhalePack] Starting control loop iteration...');

  try {
    const metrics = await getAllMetrics();
    
    // Check each app's metrics and trigger actions
    for (const metric of metrics) {
      await checkAndTriggerActions(metric);
    }

    console.log('[WhalePack] Control loop iteration complete');
  } catch (err) {
    console.error('[WhalePack] Control loop error:', err);
  } finally {
    controlLoopRunning = false;
  }
}

/**
 * Check metrics for an app and trigger actions if needed
 */
async function checkAndTriggerActions(metric: MiniAppMetric): Promise<void> {
  switch (metric.id) {
    case 'governance':
      await checkGovernanceActions(metric);
      break;
    case 'onboarding':
      await checkOnboardingActions(metric);
      break;
    case 'prediction':
      await checkPredictionActions(metric);
      break;
    default:
      // No auto-actions for other apps yet
      break;
  }
}

/**
 * Check governance metrics and trigger actions
 */
async function checkGovernanceActions(metric: MiniAppMetric): Promise<void> {
  const activeProposals = metric.stats.activeProposals || 0;
  const totalProposals = metric.stats.totalProposals || 0;
  
  // If there are 0 active proposals but many passports (indicating active community)
  // Highlight the create proposal feature
  if (activeProposals === 0 && totalProposals === 0) {
    // Check if we have passport holders (would need to query passport metrics)
    // For now, trigger if no proposals exist
    console.log('[WhalePack] Governance: No active proposals, highlighting create proposal');
    await processWhaleAction('governance', 'highlightCreateProposal', {
      duration: 3600000, // 1 hour
      reason: 'no_active_proposals',
    });
  }
}

/**
 * Check onboarding metrics and trigger actions
 */
async function checkOnboardingActions(metric: MiniAppMetric): Promise<void> {
  const completionRate = metric.stats.completionRate || 0;
  const totalStarted = metric.stats.totalStarted || 0;
  
  // If completion rate is low (< 20%) and we have users starting
  if (completionRate < 0.2 && totalStarted > 0) {
    console.log('[WhalePack] Onboarding: Low completion rate, increasing priority');
    await processWhaleAction('onboarding', 'increasePriority', {
      priority: 2,
      duration: 7200000, // 2 hours
      reason: 'low_completion_rate',
    });
  }
}

/**
 * Check prediction market metrics and trigger actions
 */
async function checkPredictionActions(metric: MiniAppMetric): Promise<void> {
  const activeMarkets = metric.stats.activeMarkets || 0;
  
  // If there are 0 open markets, highlight create market
  if (activeMarkets === 0) {
    console.log('[WhalePack] Prediction: No active markets, highlighting create market');
    await processWhaleAction('prediction', 'highlightCreateMarket', {
      duration: 3600000, // 1 hour
      reason: 'no_active_markets',
    });
  }
}

/**
 * Start the control loop (runs every 5 minutes)
 */
export function startControlLoop(intervalMs: number = 5 * 60 * 1000): void {
  if (controlLoopInterval) {
    console.log('[WhalePack] Control loop already started');
    return;
  }

  console.log(`[WhalePack] Starting control loop (interval: ${intervalMs}ms)`);
  
  // Run immediately
  runControlLoop();
  
  // Then run on interval
  controlLoopInterval = setInterval(() => {
    runControlLoop();
  }, intervalMs);
}

/**
 * Stop the control loop
 */
export function stopControlLoop(): void {
  if (controlLoopInterval) {
    clearInterval(controlLoopInterval);
    controlLoopInterval = null;
    console.log('[WhalePack] Control loop stopped');
  }
}

