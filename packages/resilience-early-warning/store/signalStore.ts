/**
 * Resilience Signal Store
 * Stores resilience signals and baselines
 */

import type { ResilienceSignal, ResilienceAlert, ResilienceEarlyWarningStatus } from '../types';

class ResilienceSignalStore {
  private signals: ResilienceSignal[] = [];
  private baselines: Map<string, { variance: number; ac1: number }> = new Map();
  private alerts: Map<string, ResilienceAlert> = new Map();
  private maxSignals = 10000; // Keep last 10k signals
  private consecutiveWindowThreshold = 3; // K consecutive windows
  
  /**
   * Add a resilience signal
   */
  addSignal(signal: ResilienceSignal): void {
    this.signals.push(signal);
    
    // Keep only recent signals
    if (this.signals.length > this.maxSignals) {
      this.signals = this.signals.slice(-this.maxSignals);
    }
    
    // Update baseline (rolling average)
    const existing = this.baselines.get(signal.serviceId);
    if (existing) {
      // Exponential moving average
      const alpha = 0.1; // Smoothing factor
      this.baselines.set(signal.serviceId, {
        variance: existing.variance * (1 - alpha) + signal.variance * alpha,
        ac1: existing.ac1 * (1 - alpha) + signal.ac1 * alpha,
      });
    } else {
      // First baseline
      this.baselines.set(signal.serviceId, {
        variance: signal.variance,
        ac1: signal.ac1,
      });
    }
    
    // Check for alerts
    this.checkAlerts(signal);
  }
  
  /**
   * Get baseline for a service
   */
  getBaseline(serviceId: string): { variance: number; ac1: number } {
    return this.baselines.get(serviceId) ?? { variance: 0, ac1: 0 };
  }
  
  /**
   * Get latest resilience index for a service
   */
  getLatestIndex(serviceId: string): number | null {
    const latest = this.signals
      .filter(s => s.serviceId === serviceId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    return latest?.resilienceIndex ?? null;
  }
  
  /**
   * Get signals for a service
   */
  getSignals(serviceId: string, limit?: number): ResilienceSignal[] {
    const filtered = this.signals
      .filter(s => s.serviceId === serviceId)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return limit ? filtered.slice(0, limit) : filtered;
  }
  
  /**
   * Check for alerts based on resilience index
   */
  private checkAlerts(signal: ResilienceSignal): void {
    const alertId = `alert-${signal.serviceId}`;
    const existing = this.alerts.get(alertId);
    
    if (signal.resilienceIndex < 30) {
      // Critical resilience
      const consecutiveWindows = existing?.consecutiveWindows ?? 0;
      
      if (consecutiveWindows >= this.consecutiveWindowThreshold) {
        // Alert threshold reached
        const alert: ResilienceAlert = {
          id: alertId,
          serviceId: signal.serviceId,
          resilienceIndex: signal.resilienceIndex,
          severity: signal.resilienceIndex < 20 ? 'critical' : 'warning',
          message: `Resilience index ${signal.resilienceIndex} below threshold for ${consecutiveWindows} consecutive windows`,
          timestamp: signal.timestamp,
          consecutiveWindows,
        };
        
        this.alerts.set(alertId, alert);
      } else {
        // Increment consecutive windows
        if (existing) {
          existing.consecutiveWindows++;
        } else {
          this.alerts.set(alertId, {
            id: alertId,
            serviceId: signal.serviceId,
            resilienceIndex: signal.resilienceIndex,
            severity: 'warning',
            message: `Resilience index ${signal.resilienceIndex} below threshold`,
            timestamp: signal.timestamp,
            consecutiveWindows: 1,
          });
        }
      }
    } else {
      // Resilience recovered
      if (existing) {
        this.alerts.delete(alertId);
      }
    }
  }
  
  /**
   * Get active alerts
   */
  getActiveAlerts(): ResilienceAlert[] {
    return Array.from(this.alerts.values());
  }
  
  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    return this.alerts.delete(alertId);
  }
  
  /**
   * Get status
   */
  status(): ResilienceEarlyWarningStatus {
    const serviceIds = new Set(this.signals.map(s => s.serviceId));
    const resilienceIndices: Record<string, number> = {};
    
    for (const serviceId of serviceIds) {
      const index = this.getLatestIndex(serviceId);
      if (index !== null) {
        resilienceIndices[serviceId] = index;
      }
    }
    
    return {
      monitoredServices: serviceIds.size,
      activeAlerts: this.alerts.size,
      lastComputedAt: this.signals.length > 0 ? this.signals[this.signals.length - 1].timestamp : null,
      resilienceIndices,
    };
  }
  
  /**
   * Clear all data
   */
  clear(): void {
    this.signals = [];
    this.baselines.clear();
    this.alerts.clear();
  }
}

export const ResilienceSignalStore = new ResilienceSignalStore();

