/**
 * Agent Wallet Management API Routes
 * 
 * SECURITY BOUNDARY:
 * - HARD SEPARATION from user wallets (CoinSensei)
 * - User wallets = public addresses only (read-only)
 * - Agent wallets = system wallets for infra/testing
 * 
 * WARNING: Testnet/sandbox use unless explicitly marked 'production-safe'
 * - NEVER returns private keys or mnemonics
 * - NEVER logs sensitive data
 * - NO endpoints that export private keys
 */

import { Router } from 'express';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';
import { JsonRpcProvider } from 'ethers';

// SECURITY: Initialize wallet manager with mnemonic from env only
// Mnemonic comes from AGENT_WALLET_MNEMONIC environment variable
// NEVER from user input or request body

const router = Router();

// Get or create wallet for an agent
router.post('/:agentId/wallet', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { chain = 'ethereum', label } = req.body;
    
    // SECURITY: Wallet manager initialized with mnemonic from env only
    // NEVER accepts mnemonic from request body or user input
    const walletManager = getAgentWalletManager(); // Uses AGENT_WALLET_MNEMONIC env var
    // Returns PUBLIC interface only (no private keys)
    const wallet = await walletManager.getOrCreateWallet(agentId, chain, label);
    
    // SECURITY: Only return public data - private key NEVER included
    res.json({
      agentId: wallet.agentId,
      address: wallet.address,
      chain: wallet.chain,
      createdAt: wallet.createdAt,
      label: wallet.label,
      // NOTE: privateKey NEVER included in response
    });
  } catch (error: any) {
    // SECURITY: Never log sensitive data
    console.error('[AgentWallet] Creation error (no sensitive data logged):', error.message);
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
    // SECURITY: Wallet manager initialized with mnemonic from env only
    // NEVER accepts mnemonic from request body or user input
    const walletManager = getAgentWalletManager(); // Uses AGENT_WALLET_MNEMONIC env var
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
    // SECURITY: Wallet manager initialized with mnemonic from env only
    // NEVER accepts mnemonic from request body or user input
    const walletManager = getAgentWalletManager(); // Uses AGENT_WALLET_MNEMONIC env var
    // Returns PUBLIC interface only (no private keys)
    const wallets = walletManager.getAgentWallets(agentId);
    
    // SECURITY: wallets already sanitized (no private keys)
    res.json({ agentId, wallets });
  } catch (error: any) {
    console.error('[AgentWallet] List error:', error.message);
    res.status(500).json({ error: error.message || 'Wallet list failed' });
  }
});

// List all agent wallets (admin)
router.get('/all', (req, res) => {
  try {
    // SECURITY: Wallet manager initialized with mnemonic from env only
    // NEVER accepts mnemonic from request body or user input
    const walletManager = getAgentWalletManager(); // Uses AGENT_WALLET_MNEMONIC env var
    // Returns PUBLIC interface only (no private keys)
    const wallets = walletManager.getAllWallets();
    
    // SECURITY: wallets already sanitized (no private keys)
    res.json({ wallets });
  } catch (error: any) {
    console.error('[AgentWallet] All wallets list error:', error.message);
    res.status(500).json({ error: error.message || 'Wallet list failed' });
  }
});

export { router as createAgentWalletRouter };

