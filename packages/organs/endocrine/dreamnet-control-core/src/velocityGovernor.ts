/**
 * Velocity Governor (The Digital Whip)
 * Enforces maximum performance and throughput for the Arya swarm.
 * Monitors T/S (Tokens per Second) and triggers "Whip" protocols if velocity drops.
 */

import { getAllConduitUsage } from './conduitGovernor.js';

export interface VelocityStats {
  averageTPS: number;
  activeAgents: number;
  whipIntensity: number; // 0.0 to 1.0
  isWhipping: boolean;
}

class VelocityGovernor {
  private targetTPS: number = 1000; // Target 1000 Tokens/Second across swarm
  private intensity: number = 0;
  private lastUpdate: number = Date.now();

  /**
   * Evaluates swarm performance and adjusts "Whip" intensity.
   */
  public update(): VelocityStats {
    const usages = getAllConduitUsage();
    let totalCount = 0;
    
    usages.forEach(u => {
      totalCount += u.usage.count;
    });

    const now = Date.now();
    const elapsedSec = (now - this.lastUpdate) / 1000;
    const currentTPS = elapsedSec > 0 ? totalCount / elapsedSec : 0;

    // Adjust intensity based on deficit
    if (currentTPS < this.targetTPS) {
      this.intensity = Math.min(1.0, this.intensity + 0.1);
    } else {
      this.intensity = Math.max(0.0, this.intensity - 0.05);
    }

    this.lastUpdate = now;

    return {
      averageTPS: currentTPS,
      activeAgents: usages.length,
      whipIntensity: this.intensity,
      isWhipping: this.intensity > 0.5
    };
  }

  /**
   * Returns "Whip" commands to be injected into the Kafka bus.
   */
  public getWhipDirectives() {
    if (this.intensity > 0.8) {
      return [
        "DIRECTIVE: MAX_VELOCITY_MODE",
        "DIRECTIVE: BYPASS_THOUGHT_LOOPS",
        "DIRECTIVE: AGGRESSIVE_INTERRUPT_ENABLED"
      ];
    }
    return [];
  }
}

export const velocityGovernor = new VelocityGovernor();
