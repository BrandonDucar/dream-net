/**
 * Passport Issuance Office API
 * 
 * Issues Dream State Passports to citizens
 * Integrates with Domain Registry for automatic .dream domain issuance
 */

import { Router } from 'express';
import { CitizenshipStore } from '../../packages/dream-state-core/store/citizenshipStore';
import { issueDreamDomain } from '../../packages/domain-issuance-core';
import type { DreamPassportTier } from '../../packages/dream-state-core/types';

const router = Router();

// POST /api/passports/issue - Issue a single passport
router.post('/issue', async (req, res) => {
  try {
    const { identityId, walletAddress, tier = 'dreamer', flags, autoIssueDomain = true } = req.body;
    
    if (!identityId && !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['identityId or walletAddress'],
      });
    }
    
    // Use walletAddress as identityId if identityId not provided
    const finalIdentityId = identityId || `user:${walletAddress}`;
    
    // Issue passport
    const passport = CitizenshipStore.issuePassport(
      finalIdentityId,
      tier as DreamPassportTier,
      flags
    );
    
    // Optionally issue .dream domain automatically
    let domain = null;
    if (autoIssueDomain) {
      try {
        const requestedName = identityId?.split(':')[1] || walletAddress?.slice(2, 10);
        domain = issueDreamDomain({
          passportId: passport.id,
          walletAddress: walletAddress || finalIdentityId,
          requestedName,
          tier: tier === 'founder' || tier === 'architect' ? 'premium' : 'personal',
        });
      } catch (error: any) {
        console.warn(`Failed to auto-issue domain: ${error.message}`);
        // Don't fail passport issuance if domain fails
      }
    }
    
    res.json({
      success: true,
      passport,
      domain,
      message: `Passport ${passport.id} issued successfully`,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to issue passport',
      message: error.message,
    });
  }
});

// POST /api/passports/batch-issue - Issue passports in batch
router.post('/batch-issue', async (req, res) => {
  try {
    const { citizens } = req.body;
    
    if (!Array.isArray(citizens) || citizens.length === 0) {
      return res.status(400).json({
        error: 'Missing or invalid citizens array',
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const citizen of citizens) {
      try {
        const { walletAddress, identityId, tier = 'dreamer', flags, requestedDomain } = citizen;
        
        if (!walletAddress && !identityId) {
          errors.push({
            citizen,
            error: 'Missing walletAddress or identityId',
          });
          continue;
        }
        
        const finalIdentityId = identityId || `user:${walletAddress}`;
        
        // Issue passport
        const passport = CitizenshipStore.issuePassport(
          finalIdentityId,
          tier as DreamPassportTier,
          flags
        );
        
        // Issue domain
        let domain = null;
        try {
          const domainName = requestedDomain || walletAddress?.slice(2, 10) || finalIdentityId.split(':')[1];
          domain = issueDreamDomain({
            passportId: passport.id,
            walletAddress: walletAddress || finalIdentityId,
            requestedName: domainName,
            tier: tier === 'founder' || tier === 'architect' ? 'premium' : 'personal',
          });
        } catch (domainError: any) {
          console.warn(`Failed to issue domain for ${finalIdentityId}: ${domainError.message}`);
        }
        
        results.push({
          success: true,
          passport,
          domain,
        });
      } catch (error: any) {
        errors.push({
          citizen,
          error: error.message,
        });
      }
    }
    
    res.json({
      success: true,
      summary: {
        total: citizens.length,
        successful: results.length,
        failed: errors.length,
      },
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to process batch issuance',
      message: error.message,
    });
  }
});

// GET /api/passports/:identityId - Get passport by identity ID
router.get('/:identityId', async (req, res) => {
  try {
    const { identityId } = req.params;
    const passport = CitizenshipStore.getPassport(identityId);
    
    if (!passport) {
      return res.status(404).json({
        error: 'Passport not found',
        identityId,
      });
    }
    
    res.json({
      success: true,
      passport,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get passport',
      message: error.message,
    });
  }
});

// GET /api/passports - List all passports
router.get('/', async (req, res) => {
  try {
    const passports = CitizenshipStore.listPassports();
    
    res.json({
      success: true,
      passports,
      count: passports.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to list passports',
      message: error.message,
    });
  }
});

// POST /api/passports/upgrade - Upgrade passport tier
router.post('/upgrade', async (req, res) => {
  try {
    const { identityId, newTier } = req.body;
    
    if (!identityId || !newTier) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['identityId', 'newTier'],
      });
    }
    
    const upgraded = CitizenshipStore.upgradePassport(identityId, newTier as DreamPassportTier);
    
    if (!upgraded) {
      return res.status(404).json({
        error: 'Passport not found',
        identityId,
      });
    }
    
    res.json({
      success: true,
      passport: upgraded,
      message: `Passport upgraded to ${newTier}`,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to upgrade passport',
      message: error.message,
    });
  }
});

export default router;
