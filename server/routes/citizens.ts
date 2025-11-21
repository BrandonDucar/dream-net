/**
 * Citizenship Directory API
 * 
 * Manages the directory of all DreamNet citizens
 * Links passports, domains, and identities
 */

import { Router } from 'express';
import { CitizenshipStore } from '@dreamnet/dream-state-core/store/citizenshipStore';
import { getDomainsForPassport, getDomainsForWallet } from '@dreamnet/domain-issuance-core';

const router = Router();

// GET /api/citizens - List all citizens
router.get('/', async (req, res) => {
  try {
    const passports = CitizenshipStore.listPassports();
    
    // Enrich with domain information
    const citizens = passports.map(passport => {
      const domains = getDomainsForPassport(passport.id);
      return {
        ...passport,
        domains,
        domainCount: domains.length,
      };
    });
    
    res.json({
      success: true,
      citizens,
      count: citizens.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to list citizens',
      message: error.message,
    });
  }
});

// GET /api/citizens/:identityId - Get citizen by identity ID
router.get('/:identityId', async (req, res) => {
  try {
    const { identityId } = req.params;
    const passport = CitizenshipStore.getPassport(identityId);
    
    if (!passport) {
      return res.status(404).json({
        error: 'Citizen not found',
        identityId,
      });
    }
    
    // Get domains for this citizen
    const domains = getDomainsForPassport(passport.id);
    
    res.json({
      success: true,
      citizen: {
        ...passport,
        domains,
        domainCount: domains.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get citizen',
      message: error.message,
    });
  }
});

// GET /api/citizens/wallet/:walletAddress - Get citizen by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const identityId = `user:${walletAddress}`;
    const passport = CitizenshipStore.getPassport(identityId);
    
    if (!passport) {
      return res.status(404).json({
        error: 'Citizen not found',
        walletAddress,
      });
    }
    
    // Get domains for this wallet
    const domains = getDomainsForWallet(walletAddress);
    
    res.json({
      success: true,
      citizen: {
        ...passport,
        domains,
        domainCount: domains.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get citizen',
      message: error.message,
    });
  }
});

// GET /api/citizens/stats - Get citizenship statistics
router.get('/stats', async (req, res) => {
  try {
    const passports = CitizenshipStore.listPassports();
    
    // Count by tier
    const tierCounts: Record<string, number> = {};
    passports.forEach(p => {
      tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1;
    });
    
    // Count by flags
    const flagCounts: Record<string, number> = {};
    passports.forEach(p => {
      if (p.flags) {
        p.flags.forEach(flag => {
          flagCounts[flag] = (flagCounts[flag] || 0) + 1;
        });
      }
    });
    
    res.json({
      success: true,
      stats: {
        totalCitizens: passports.length,
        tierCounts,
        flagCounts,
        recentIssuances: passports
          .sort((a, b) => b.issuedAt - a.issuedAt)
          .slice(0, 10)
          .map(p => ({
            identityId: p.identityId,
            tier: p.tier,
            issuedAt: p.issuedAt,
          })),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get stats',
      message: error.message,
    });
  }
});

export default router;

