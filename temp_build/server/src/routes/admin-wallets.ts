/**
 * Admin Wallets API
 * List admin wallet addresses (admin only)
 */

import express from 'express';
import { isAdminWallet } from '../auth';

const router = express.Router();

/**
 * GET /api/admin-wallets
 * List all admin wallet addresses
 * Requires admin authentication
 */
router.get('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    
    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    if (!isAdminWallet(walletAddress)) {
      return res.status(403).json({ error: 'Unauthorized - admin access required' });
    }

    // Get admin wallets from environment
    const adminWalletsEnv = process.env.ADMIN_WALLETS;
    const wallets = adminWalletsEnv
      ? adminWalletsEnv.split(',').map(w => w.trim()).filter(w => w.length > 0)
      : [
          '0xAbCdEf1234567890abcdef1234567890aBcDeF01',
          '0x1234567890abcdef1234567890abcdef12345678',
          '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e',
          '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
        ];

    // Identify wallet types
    const walletsWithTypes = wallets.map(wallet => {
      let type = 'unknown';
      let chain = 'unknown';
      
      // Ethereum/Base/VeChain addresses start with 0x and are 42 chars
      if (wallet.startsWith('0x') && wallet.length === 42) {
        type = 'ethereum-base-vechain';
        chain = 'ethereum'; // Default, could be Base or VeChain too
      }
      // Solana addresses are base58, typically 32-44 chars, no 0x prefix
      else if (!wallet.startsWith('0x') && wallet.length >= 32 && wallet.length <= 44) {
        type = 'solana';
        chain = 'solana';
      }

      return {
        address: wallet,
        type,
        chain,
      };
    });

    res.json({
      success: true,
      count: wallets.length,
      wallets: walletsWithTypes,
      source: adminWalletsEnv ? 'environment' : 'default',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

