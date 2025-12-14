/**
 * Drone Dome Integration with Nervous System
 * 
 * Enhances Drone Dome Scanner with message bus integration
 * Publishes intel.snapshot messages and subscribes to telemetry messages
 */

import { nervousMessageBus } from './messageBus';
import { sharedMemory } from './sharedMemory';
import type { NervousMessage } from './types';

/**
 * Run Drone Dome analysis with message bus integration
 * 
 * Note: This wraps the existing runDroneDomeAnalysis function
 * The actual implementation is in server/services/DroneDomeScanner.ts
 */
export async function runDroneDomeWithMessageBus(): Promise<void> {
  // Import dynamically to avoid circular dependencies
  const { runDroneDomeAnalysis } = await import('../../server/services/DroneDomeScanner.js');
  
  try {
    // Run existing Drone Dome analysis
    const report = await runDroneDomeAnalysis();
    
    // Publish intel.snapshot message
    nervousMessageBus.publish({
      id: `intel-${Date.now()}`,
      ts: Date.now(),
      role: 'sensor',
      topic: 'intel.snapshot',
      payload: {
        overallHealth: report.overall_health,
        riskZones: report.risk_zones,
        priorityZones: report.priority_zones,
        maps: report.maps,
      },
    });
    
    // Store snapshot in shared memory
    await sharedMemory.doc.upsert('drone-dome:latest', {
      ...report,
      timestamp: Date.now(),
    });
    
    // Cache snapshot summary in KV with TTL
    await sharedMemory.kv.put('drone-dome:summary', {
      overallHealth: report.overall_health,
      riskZoneCount: report.risk_zones.length,
      priorityZoneCount: report.priority_zones.length,
    }, 300); // 5min TTL
    
  } catch (error: any) {
    console.error('[DroneDome] Analysis failed:', error);
    
    // Publish error alert
    nervousMessageBus.publish({
      id: `drone-dome-error-${Date.now()}`,
      ts: Date.now(),
      role: 'system',
      topic: 'alert',
      payload: {
        source: 'drone-dome',
        error: error.message,
        timestamp: Date.now(),
      },
    });
  }
}

/**
 * Set up Drone Dome telemetry subscription
 * This should be called once during initialization
 */
export function setupDroneDomeTelemetry(): void {
  nervousMessageBus.subscribe('telemetry', async (msg: NervousMessage) => {
    const { source, metrics } = msg.payload as { source: string; metrics: any };
    
    try {
      // Cache telemetry in shared memory KV with TTL
      await sharedMemory.kv.put(`telemetry:${source}`, metrics, 300); // 5min TTL
      
      // Store latest telemetry in doc store
      await sharedMemory.doc.upsert(`telemetry:${source}:latest`, {
        source,
        metrics,
        timestamp: Date.now(),
      });
      
      // Aggregate telemetry for Drone Dome analysis
      const aggregated = await sharedMemory.doc.read('drone-dome:telemetry-aggregate');
      const updated = {
        ...aggregated,
        [source]: metrics,
        lastUpdated: Date.now(),
      };
      await sharedMemory.doc.upsert('drone-dome:telemetry-aggregate', updated);
      
    } catch (error: any) {
      console.error(`[DroneDome] Telemetry processing failed for ${source}:`, error);
    }
  });
}

