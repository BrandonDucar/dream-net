/**
 * Resilience Guardrails
 * 
 * Automatic triggers based on Resilience Index:
 * - Autoscale (resilience < 50)
 * - Rate-limit (resilience < 30)
 * - Brownout (resilience < 20)
 */

import { DreamNetControlCore } from '@dreamnet/dreamnet-control-core';
import { DreamNetAutoscaleCore } from '@dreamnet/dreamnet-autoscale-core';
import { nervousMessageBus } from '@dreamnet/nervous-system-core/messageBus';

/**
 * Trigger guardrails based on resilience index
 */
export async function triggerGuardrails(resilienceIndex: number, serviceId: string): Promise<void> {
  const now = Date.now();
  
  if (resilienceIndex < 50) {
    // Autoscale trigger - scale up by 1.5x
    try {
      // Find scaling rule for this service
      // Note: This is a placeholder - actual implementation would use DreamNetAutoscaleCore API
      console.log(`[Resilience] Autoscaling ${serviceId} - resilience index: ${resilienceIndex}`);
      
      // Publish autoscale alert
      nervousMessageBus.publish({
        id: `guardrail-autoscale-${now}`,
        ts: now,
        role: 'system',
        topic: 'alert',
        payload: {
          type: 'autoscale',
          serviceId,
          resilienceIndex,
          action: 'scale_up',
          factor: 1.5,
        },
      });
    } catch (error: any) {
      console.error(`[Resilience] Autoscale failed for ${serviceId}:`, error);
    }
  }
  
  if (resilienceIndex < 30) {
    // Rate-limit trigger - reduce to 100 requests/min
    try {
      // Set rate limit using DreamNetControlCore
      // Note: This requires clusterId mapping - placeholder for now
      console.log(`[Resilience] Rate-limiting ${serviceId} - resilience index: ${resilienceIndex}`);
      
      // Publish rate-limit alert
      nervousMessageBus.publish({
        id: `guardrail-rate-limit-${now}`,
        ts: now,
        role: 'system',
        topic: 'alert',
        payload: {
          type: 'rate_limit',
          serviceId,
          resilienceIndex,
          maxRequestsPerMinute: 100,
        },
      });
    } catch (error: any) {
      console.error(`[Resilience] Rate-limit failed for ${serviceId}:`, error);
    }
  }
  
  if (resilienceIndex < 20) {
    // Brownout trigger - enable global kill-switch
    try {
      await DreamNetControlCore.enableGlobalKillSwitch(
        `Brownout mode - resilience critical (${resilienceIndex}) for ${serviceId}`
      );
      
      console.log(`[Resilience] Brownout activated - resilience index: ${resilienceIndex}`);
      
      // Publish brownout alert
      nervousMessageBus.publish({
        id: `guardrail-brownout-${now}`,
        ts: now,
        role: 'system',
        topic: 'alert',
        priority: 1, // High priority
        payload: {
          type: 'brownout',
          serviceId,
          resilienceIndex,
          message: 'Global kill-switch enabled due to critical resilience',
        },
      });
    } catch (error: any) {
      console.error(`[Resilience] Brownout failed for ${serviceId}:`, error);
    }
  }
}

