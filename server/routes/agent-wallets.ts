/**
 * Agent Wallet Management API Routes
 */

import { Router } from 'express';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';
import { JsonRpcProvider } from 'ethers';

const router = Router();

// Get or create wallet for an agent
router.post('/:agentId/wallet', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { chain = 'ethereum', label } = req.body;
    
    const walletManager = getAgentWalletManager();
    const wallet = await walletManager.getOrCreateWallet(agentId, chain, label);
    
    // Don't expose private key in response (in production, encrypt/store securely)
    res.json({
      agentId: wallet.agentId,
      address: wallet.address,
      chain: wallet.chain,
      createdAt: wallet.createdAt,
      label: wallet.label,
    });
  } catch (error: any) {
    console.error('Agent wallet creation error:', error);
    res.status(500).json({ error: error.message || 'Wallet creation failed' });
  }
});

// Get wallet balance
router.get('/:agentId/wallet/:chain/balance', async (req, res) => {
  try {
    const { agentId, chain } = req.params;
    const rpcUrl = req.query.rpcUrl as string;
    
    if (!rpcUrl) {
      return res.status(400).json({ error: 'RPC URL required' });
    }
    
    const provider = new JsonRpcProvider(rpcUrl);
    const walletManager = getAgentWalletManager();
    const balance = await walletManager.getBalance(agentId, chain, provider);
    
    res.json({ agentId, chain, balance });
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: error.message || 'Balance fetch failed' });
  }
});

// List all wallets for an agent
router.get('/:agentId/wallets', (req, res) => {
  try {
    const { agentId } = req.params;
    const walletManager = getAgentWalletManager();
    const wallets = walletManager.getAgentWallets(agentId);
    
    // Sanitize private keys
    const sanitized = wallets.map(w => ({
      agentId: w.agentId,
      address: w.address,
      chain: w.chain,
      createdAt: w.createdAt,
      label: w.label,
      balance: w.balance,
    }));
    
    res.json({ agentId, wallets: sanitized });
  } catch (error: any) {
    console.error('Wallet list error:', error);
    res.status(500).json({ error: error.message || 'Wallet list failed' });
  }
});

// List all agent wallets (admin)
router.get('/all', (req, res) => {
  try {
    const walletManager = getAgentWalletManager();
    const wallets = walletManager.getAllWallets();
    
    // Sanitize private keys
    const sanitized = wallets.map(w => ({
      agentId: w.agentId,
      address: w.address,
      chain: w.chain,
      createdAt: w.createdAt,
      label: w.label,
    }));
    
    res.json({ wallets: sanitized });
  } catch (error: any) {
    console.error('All wallets list error:', error);
    res.status(500).json({ error: error.message || 'Wallet list failed' });
  }
});

export { router as createAgentWalletRouter };

