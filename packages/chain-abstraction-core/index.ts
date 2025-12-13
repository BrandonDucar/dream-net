/**
 * Chain Abstraction Core
 * 
 * Superchain/CCT compatibility for cross-chain operations
 * 
 * Features:
 * - CCT standard (zero-slippage transfers)
 * - Chainlink CCIP integration
 * - Superchain abstraction (treat chains as fungible)
 * - Unified API across chains
 */

export { cctRegistry, transferCCT, getCCTBalance } from './cct';
export { selectOptimalChain, getAllChainScores } from './superchain';
export type {
  CCTToken,
  CCTTransfer,
  ChainScore,
  CCIPMessage,
  ChainAbstractionStatus,
} from './types';

import { cctRegistry, transferCCT } from './cct';
import { selectOptimalChain, getAllChainScores } from './superchain';

export const ChainAbstractionCore = {
  /**
   * Transfer CCT token across chains
   */
  async transferCCT(transfer: import('./types').CCTTransfer) {
    return transferCCT(transfer);
  },

  /**
   * Get CCT balance across chains
   */
  async getCCTBalance(symbol: string, address: string) {
    const { getCCTBalance } = await import('./cct');
    return getCCTBalance(symbol, address);
  },

  /**
   * Select optimal chain
   */
  selectOptimalChain(preferredChains?: import('./types').ChainId[]) {
    return selectOptimalChain(preferredChains);
  },

  /**
   * Get all chain scores
   */
  getAllChainScores() {
    return getAllChainScores();
  },

  /**
   * Register CCT token
   */
  registerToken(token: import('./types').CCTToken) {
    cctRegistry.registerToken(token);
  },

  /**
   * Get status
   */
  status(): import('./types').ChainAbstractionStatus {
    const tokens = cctRegistry.listTokens();
    const chainScores = getAllChainScores();
    
    return {
      supportedChains: chainScores.map(c => c.chain),
      cctTokens: tokens.map(t => t.symbol),
      totalTransfers: 0, // TODO: track transfers
      activeTransfers: 0, // TODO: track active transfers
      averageTransferTime: 0, // TODO: track average time
    };
  },
};

export default ChainAbstractionCore;

