/**
 * CoinSensei API Routes
 * 
 * SECURITY: READ_ONLY = true
 * - ONLY accepts public wallet addresses (read-only portfolio)
 * - NEVER accepts private keys, seeds, mnemonics, or 2FA codes
 * - Returns analytics only (P&L, allocation, suggestions)
 * - NEVER offers send, trade, swap, or bridge actions
 * - Educational analytics only (no financial/tax/legal advice)
 */

import { Router } from 'express';
import { CoinSensei } from '@dreamnet/coinsensei-core';
import type { CoinSenseiInput } from '@dreamnet/coinsensei-core';

const router = Router();

router.post('/analyze', async (req, res) => {
  try {
    const input: CoinSenseiInput = req.body;
    
    // SECURITY: Validate input - reject any private keys or sensitive data
    if (input.wallets) {
      for (const wallet of input.wallets) {
        // Validate wallet addresses are public addresses only
        if ((wallet as any).privateKey || (wallet as any).seed || (wallet as any).mnemonic) {
          return res.status(400).json({ 
            error: 'SECURITY: Private keys, seeds, or mnemonics are not accepted. Only public addresses allowed.' 
          });
        }
        // Validate address format (basic check)
        if (!wallet.address || wallet.address.length < 20) {
          return res.status(400).json({ 
            error: 'Invalid wallet address format' 
          });
        }
      }
    }
    
    // SECURITY: Ensure read-only mode
    const config = {
      ...input.config,
      read_only: true, // Force read-only mode
    };
    
    const sensei = new CoinSensei(config);
    const result = await sensei.analyze(input);
    
    // SECURITY: Result contains analytics only - no transaction capabilities
    res.json(result);
  } catch (error: any) {
    console.error('[CoinSensei] Analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoinSensei 2.0' });
});

export { router as createCoinSenseiRouter };

