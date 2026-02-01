/**
 * Domain Issuance API
 * 
 * Endpoints for issuing and managing .dream and .sheep domains
 */

import { Router } from 'express';
import {
  issueDreamDomain,
  issueSheepDomain,
  getDomain,
  getDomainsForPassport,
  getDomainsForWallet,
  linkExternalDomain,
  resolveDomain,
  listAllDomains,
} from "@dreamnet/domain-issuance-core";

const router = Router();

// POST /api/domains/issue/dream - Issue a .dream domain
router.post('/issue/dream', async (req, res) => {
  try {
    const { passportId, walletAddress, requestedName, tier } = req.body;

    if (!passportId || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['passportId', 'walletAddress'],
      });
    }

    const domain = issueDreamDomain({
      passportId,
      walletAddress,
      requestedName,
      tier,
    });

    res.json({
      success: true,
      domain,
      message: `Domain ${domain.domain} issued successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to issue domain',
      message: error.message,
    });
  }
});

// POST /api/domains/issue/sheep - Issue a .sheep domain
router.post('/issue/sheep', async (req, res) => {
  try {
    const { passportId, walletAddress, requestedName, tier } = req.body;

    if (!passportId || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['passportId', 'walletAddress'],
      });
    }

    const domain = issueSheepDomain({
      passportId,
      walletAddress,
      requestedName,
      tier,
    });

    res.json({
      success: true,
      domain,
      message: `Domain ${domain.domain} issued successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to issue domain',
      message: error.message,
    });
  }
});

// GET /api/domains/resolve/:domain - Resolve domain to passport/wallet
router.get('/resolve/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const resolved = resolveDomain(domain);

    if (!resolved) {
      return res.status(404).json({
        error: 'Domain not found',
        domain,
      });
    }

    res.json({
      success: true,
      domain,
      ...resolved,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to resolve domain',
      message: error.message,
    });
  }
});

// GET /api/domains/passport/:passportId - Get all domains for a passport
router.get('/passport/:passportId', async (req, res) => {
  try {
    const { passportId } = req.params;
    const domains = getDomainsForPassport(passportId);

    res.json({
      success: true,
      passportId,
      domains,
      count: domains.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get domains',
      message: error.message,
    });
  }
});

// GET /api/domains/wallet/:walletAddress - Get all domains for a wallet
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const domains = getDomainsForWallet(walletAddress);

    res.json({
      success: true,
      walletAddress,
      domains,
      count: domains.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get domains',
      message: error.message,
    });
  }
});

// POST /api/domains/link - Link external domain to .dream domain
router.post('/link', async (req, res) => {
  try {
    const { dreamDomain, externalDomain } = req.body;

    if (!dreamDomain || !externalDomain) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['dreamDomain', 'externalDomain'],
      });
    }

    linkExternalDomain(dreamDomain, externalDomain);

    res.json({
      success: true,
      message: `Linked ${externalDomain} → ${dreamDomain}`,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to link domain',
      message: error.message,
    });
  }
});

// GET /api/domains/list - List all issued domains (admin)
router.get('/list', async (req, res) => {
  try {
    const domains = listAllDomains();

    res.json({
      success: true,
      domains,
      count: domains.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to list domains',
      message: error.message,
    });
  }
});

export default router;

