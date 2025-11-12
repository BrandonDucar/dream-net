import type { Express } from 'express';

interface PremiumAccessTier {
  name: string;
  price: number;
  features: string[];
  dataAccess: string[];
  limits: {
    trendsPerDay: number;
    signalsPerDay: number;
    reportsPerMonth: number;
  };
}

const PREMIUM_TIERS: Record<string, PremiumAccessTier> = {
  basic: {
    name: 'Basic Intelligence',
    price: 4.99,
    features: ['Real-time prices', 'Basic trends', 'Daily signals'],
    dataAccess: ['bronze', 'public'],
    limits: {
      trendsPerDay: 10,
      signalsPerDay: 5,
      reportsPerMonth: 2
    }
  },
  silver: {
    name: 'Silver Intelligence',
    price: 9.99,
    features: ['Advanced trends', 'Competitor analysis', 'Weekly reports'],
    dataAccess: ['bronze', 'silver', 'public'],
    limits: {
      trendsPerDay: 25,
      signalsPerDay: 15,
      reportsPerMonth: 8
    }
  },
  gold: {
    name: 'Gold Intelligence',
    price: 24.99,
    features: ['Premium signals', 'Business insights', 'Custom analysis'],
    dataAccess: ['bronze', 'silver', 'gold', 'public'],
    limits: {
      trendsPerDay: 50,
      signalsPerDay: 30,
      reportsPerMonth: 20
    }
  },
  platinum: {
    name: 'Platinum Intelligence',
    price: 49.99,
    features: ['Real-time alerts', 'API access', 'Priority support', 'Custom reports'],
    dataAccess: ['bronze', 'silver', 'gold', 'platinum', 'public'],
    limits: {
      trendsPerDay: -1, // unlimited
      signalsPerDay: -1,
      reportsPerMonth: -1
    }
  },
  enterprise: {
    name: 'Enterprise Intelligence',
    price: 197.00,
    features: ['White-label access', 'Custom integrations', 'Dedicated support'],
    dataAccess: ['bronze', 'silver', 'gold', 'platinum', 'premium', 'public'],
    limits: {
      trendsPerDay: -1,
      signalsPerDay: -1,
      reportsPerMonth: -1
    }
  }
};

export function registerPremiumMetalsRoutes(app: Express): void {
  
  // Get available premium tiers
  app.get('/api/premium-metals/tiers', async (req, res) => {
    try {
      res.json({
        success: true,
        tiers: Object.entries(PREMIUM_TIERS).map(([key, tier]) => ({
          id: key,
          ...tier
        }))
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Check user's access level
  app.get('/api/premium-metals/access', async (req, res) => {
    try {
      const userId = req.user?.id || req.ip || 'anonymous';
      
      // For demo purposes, return basic access
      // In production, this would check user's subscription
      const userTier = 'basic';
      const accessLevel = PREMIUM_TIERS[userTier];
      
      res.json({
        success: true,
        access: {
          tier: userTier,
          ...accessLevel,
          usage: {
            trendsToday: 3,
            signalsToday: 1,
            reportsThisMonth: 0
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get premium market data based on user's tier
  app.get('/api/premium-metals/data', async (req, res) => {
    try {
      const userId = req.user?.id || req.ip || 'anonymous';
      const userTier = 'basic'; // Would come from user's subscription
      const tierAccess = PREMIUM_TIERS[userTier];
      
      const { dreamVault } = await import('../services/dreamVault');
      
      // Get premium data from vault based on access level
      const items = await dreamVault.getItemsByOwner('metals_mint_system');
      
      const accessibleItems = items.filter(item => 
        item.metadata?.premiumTier && 
        tierAccess.dataAccess.includes(item.metadata.premiumTier)
      );

      // Apply usage limits
      const limitedItems = tierAccess.limits.trendsPerDay === -1 ? 
        accessibleItems : 
        accessibleItems.slice(0, tierAccess.limits.trendsPerDay);

      res.json({
        success: true,
        data: limitedItems.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          premium_tier: item.metadata?.premiumTier,
          monetization_value: item.metadata?.monetizationValue,
          business_value: item.metadata?.businessValue,
          preview: item.content.substring(0, 200) + '...',
          unlock_price: item.metadata?.monetizationValue || 4.99,
          tags: item.tags
        })),
        access: {
          tier: userTier,
          remaining: {
            trends: tierAccess.limits.trendsPerDay === -1 ? 'unlimited' : 
              Math.max(0, tierAccess.limits.trendsPerDay - 3),
            signals: tierAccess.limits.signalsPerDay === -1 ? 'unlimited' :
              Math.max(0, tierAccess.limits.signalsPerDay - 1)
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Unlock specific premium content
  app.post('/api/premium-metals/unlock/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const userId = req.user?.id || req.ip || 'anonymous';
      
      const { dreamVault } = await import('../services/dreamVault');
      const item = await dreamVault.getItem(itemId, 'metals_mint_system');
      
      if (!item) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      // In production, this would process payment
      const unlockPrice = item.metadata?.monetizationValue || 4.99;
      
      // For demo, simulate successful unlock
      const unlockSuccess = true;
      
      if (unlockSuccess) {
        // Log revenue tracking
        await dreamVault.storeItem({
          title: `Revenue: Premium Unlock - ${item.title}`,
          content: JSON.stringify({
            itemId,
            userId,
            amount: unlockPrice,
            timestamp: new Date().toISOString(),
            tier: item.metadata?.premiumTier,
            businessValue: item.metadata?.businessValue
          }),
          type: 'document',
          category: 'revenue_tracking',
          tags: ['revenue', 'premium_unlock', 'precious_metals'],
          accessLevel: 'restricted' as const,
          metadata: {
            revenueAmount: unlockPrice,
            revenueType: 'premium_unlock',
            sourceItem: itemId
          }
        }, 'revenue_system');

        res.json({
          success: true,
          unlocked: true,
          content: item.content,
          metadata: item.metadata,
          revenue_generated: unlockPrice
        });
      } else {
        res.status(402).json({ 
          success: false, 
          error: 'Payment required',
          unlock_price: unlockPrice 
        });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get revenue analytics
  app.get('/api/premium-metals/revenue', async (req, res) => {
    try {
      const { dreamVault } = await import('../services/dreamVault');
      const items = await dreamVault.getItemsByCategory('revenue_tracking');
      
      const revenueData = items
        .filter(item => item.metadata?.revenueType === 'premium_unlock')
        .map(item => JSON.parse(item.content));

      const totalRevenue = revenueData.reduce((sum, data) => sum + data.amount, 0);
      const dailyRevenue = revenueData
        .filter(data => new Date(data.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000))
        .reduce((sum, data) => sum + data.amount, 0);

      const tierBreakdown = revenueData.reduce((acc, data) => {
        acc[data.tier] = (acc[data.tier] || 0) + data.amount;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        success: true,
        revenue: {
          total: totalRevenue,
          daily: dailyRevenue,
          monthly: revenueData
            .filter(data => new Date(data.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, data) => sum + data.amount, 0),
          by_tier: tierBreakdown,
          transaction_count: revenueData.length,
          average_transaction: totalRevenue / (revenueData.length || 1),
          projected_monthly: dailyRevenue * 30
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get premium content statistics
  app.get('/api/premium-metals/stats', async (req, res) => {
    try {
      const { dreamVault } = await import('../services/dreamVault');
      const items = await dreamVault.getItemsByCategory('precious_metals_intelligence');
      
      const tierCounts = items.reduce((acc, item) => {
        const tier = item.metadata?.premiumTier || 'unknown';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const businessValueCounts = items.reduce((acc, item) => {
        const value = item.metadata?.businessValue || 'unknown';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalMonetizationValue = items.reduce((sum, item) => 
        sum + (item.metadata?.monetizationValue || 0), 0
      );

      res.json({
        success: true,
        stats: {
          total_items: items.length,
          tier_distribution: tierCounts,
          business_value_distribution: businessValueCounts,
          total_monetization_value: totalMonetizationValue,
          average_item_value: totalMonetizationValue / (items.length || 1),
          content_created_today: items.filter(item => 
            new Date(item.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}