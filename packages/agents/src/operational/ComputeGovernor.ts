import { NERVE_BUS } from '../../../nerve/src/bus.js';
import { DREAMKEEPER_CORE } from '../../../lib/dreamkeeperCore.js';

/**
 * 🏛️ Compute Governor
 * Purpose: Monitors swarm activity and prevents "CPU Meltdown" by enforcing throughput limits.
 */
export class ComputeGovernor {
  private eventCounts: Map<string, number> = new Map();
  private throttleThreshold = 500; // Events per second per channel (Default)
  private surgeThreshold = 2500; // High-intensity surge limit
  private tacticalReserves: Map<string, 'QUIET' | 'SURGE' | 'NORMAL'> = new Map();
  private interval: NodeJS.Timeout;

  constructor() {
    this.startMonitoring();
    this.subscribeToBus();
  }

  private subscribeToBus() {
    // Listen to ALL events to monitor load
    NERVE_BUS.subscribe('*', (event) => {
      const channelId = event.channelId;
      this.eventCounts.set(channelId, (this.eventCounts.get(channelId) || 0) + 1);
    });
  }

  private startMonitoring() {
    this.interval = setInterval(() => {
      for (const [channelId, count] of this.eventCounts.entries()) {
        const mode = this.tacticalReserves.get(channelId) || 'NORMAL';
        const currentLimit = mode === 'SURGE' ? this.surgeThreshold : 
                            mode === 'QUIET' ? 100 : this.throttleThreshold;

        if (count > currentLimit) {
          this.enforceThrottle(channelId, count, currentLimit);
        }
      }
      // Reset counts for the next second
      this.eventCounts.clear();
    }, 1000);
  }

  /**
   * ⚔️ "Attack like fire and be still as a mountain."
   * Allows the swarm to surge in specific channels when an opportunity is detected.
   */
  public setTacticalMode(channelId: string, mode: 'QUIET' | 'SURGE' | 'NORMAL') {
    console.log(`⚔️ [Governor] Shifting ${channelId} to ${mode} mode.`);
    this.tacticalReserves.set(channelId, mode);
  }

  private enforceThrottle(channelId: string, count: number, limit: number) {
    const throttleEvent = {
      id: `throttle-${Date.now()}`,
      channelId: 'system-governance',
      kind: 'compute:throttle',
      priority: 0, // Critical
      payload: { 
        targetChannel: channelId, 
        currentThroughput: count, 
        limit: limit,
        action: 'SLEEP_500MS'
      },
      context: { origin: 'ComputeGovernor', timestamp: Date.now() }
    };

    NERVE_BUS.publish(throttleEvent);
    DREAMKEEPER_CORE.logs.push(`⚠️ [Governor] Throttling channel ${channelId} due to high load (${count} eps)`);
  }

  public stop() {
    clearInterval(this.interval);
  }
}
