import express from 'express';

// Middleware imports - handle missing gracefully
let extractUser: any = null;
let requireAuth: any = null;
type AuthenticatedRequest = express.Request & { user?: any };

try {
  const roleGatesModule = require('../middleware/role-gates.js');
  extractUser = roleGatesModule.extractUser;
  requireAuth = roleGatesModule.requireAuth;
} catch {
  console.warn("[Usage Router] Role gates middleware not available");
  // Fallback middleware
  extractUser = (req: any, res: any, next: any) => next();
  requireAuth = (req: any, res: any, next: any) => next();
}

// Usage service is optional
let getUsage: any = null;
try {
  const usageModule = require('../services/usage.js');
  getUsage = usageModule.getUsage;
} catch {
  console.warn("[Usage Router] Usage service not available");
}

// Entitlements service is optional
let getEntitlements: any = null;
let getTotalCredits: any = null;
try {
  const entitlementsModule = require('../services/entitlements.js');
  getEntitlements = entitlementsModule.getEntitlements;
  getTotalCredits = entitlementsModule.getTotalCredits;
} catch {
  console.warn("[Usage Router] Entitlements service not available");
}

const router: express.Router = express.Router();

// Apply user extraction middleware
router.use(extractUser);

// Get user's current usage and entitlements
router.get('/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get usage info
    const usage = await getUsage(userId);
    
    // Get entitlement details (optional)
    const entitlement = getEntitlements ? await getEntitlements(userId) : null;
    const totalCredits = getTotalCredits ? await getTotalCredits(userId) : 0;

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