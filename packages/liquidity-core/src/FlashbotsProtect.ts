/**
 * Flashbots Protect Client
 * 
 * Client for Flashbots Protect RPC (private mempool + failed-tx protection).
 */

import { MEVProtection } from './MEVProtection.js';

/**
 * Flashbots Protect Client
 */
export class FlashbotsProtect extends MEVProtection {
  constructor(endpoint?: string) {
    super({
      type: 'flashbots',
      endpoint: endpoint || 'https://rpc.flashbots.net/fast',
    });
  }
}

