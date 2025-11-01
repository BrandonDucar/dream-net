import express from 'express';
import { extractUser, requireAuth, AuthenticatedRequest } from '../middleware/role-gates.js';
import { getUsage } from '../services/usage.js';
import { getEntitlements, getTotalCredits } from '../services/entitlements.js';

const router = express.Router();

// Apply user extraction middleware
router.use(extractUser);

// Get user's current usage and entitlements
router.get('/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get usage info
    const usage = await getUsage(userId);
    
    // Get entitlement details
    const entitlement = await getEntitlements(userId);
    const totalCredits = await getTotalCredits(userId);

    res.json({
      user: {
        id: userId,
        role: req.user!.role,
        plan: entitlement?.plan || 'basic',
      },
      usage: {
        periodStart: usage.periodStart,
        periodEnd: usage.periodEnd,
        generations: usage.generations,
        lastUsedAt: usage.lastUsedAt,
      },
      credits: {
        remaining: totalCredits,
        plan: entitlement?.plan || 'basic',
        status: entitlement?.status || 'inactive',
        lastUpdated: entitlement?.updatedAt,
      }
    });
  } catch (error: any) {
    console.error('[Usage API] Error getting usage status:', error);
    res.status(500).json({ 
      error: 'Failed to get usage status',
      code: 'USAGE_FETCH_ERROR'
    });
  }
});

export default router;