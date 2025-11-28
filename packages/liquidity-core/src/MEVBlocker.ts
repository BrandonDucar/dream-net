/**
 * MEV-Blocker Client
 * 
 * Client for MEV-Blocker RPC (anti-sandwich with rebates).
 */

import { MEVProtection } from './MEVProtection.js';

export type MEVBlockerMode = 'fast' | 'noreverts' | 'fullprivacy';

/**
 * MEV-Blocker Client
 */
export class MEVBlocker extends MEVProtection {
  constructor(mode: MEVBlockerMode = 'noreverts') {
    const endpoints: Record<MEVBlockerMode, string> = {
      fast: 'https://rpc.mevblocker.io/fast',
      noreverts: 'https://rpc.mevblocker.io/noreverts',
      fullprivacy: 'https://rpc.mevblocker.io/fullprivacy',
    };

    super({
      type: 'mevblocker',
      endpoint: endpoints[mode],
    });
  }
}

