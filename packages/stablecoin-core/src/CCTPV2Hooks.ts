/**
 * CCTP V2 Hooks - Event hooks for CCTP V2 transfers
 * 
 * Provides hooks for monitoring transfer lifecycle events.
 */

import type { CCTPV2TransferResult } from './CCTPV2Client.js';

export type CCTPV2EventType = 'transfer_initiated' | 'attestation_received' | 'transfer_completed' | 'transfer_failed';

export interface CCTPV2Event {
  type: CCTPV2EventType;
  transfer: CCTPV2TransferResult;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type CCTPV2EventHandler = (event: CCTPV2Event) => void | Promise<void>;

/**
 * CCTP V2 Hooks - Event hooks for CCTP V2
 */
export class CCTPV2Hooks {
  private handlers: Map<CCTPV2EventType, CCTPV2EventHandler[]> = new Map();

  /**
   * Register event handler
   */
  on(eventType: CCTPV2EventType, handler: CCTPV2EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  /**
   * Remove event handler
   */
  off(eventType: CCTPV2EventType, handler: CCTPV2EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.handlers.set(eventType, handlers);
    }
  }

  /**
   * Emit event
   */
  async emit(event: CCTPV2Event): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(h => h(event)));
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}

