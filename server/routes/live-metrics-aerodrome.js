/**
 * Live Metrics Router - Aerodrome Finance Integration
 * 
 * Provides real-time monitoring data for Aerodrome Finance integration
 * Compatible with Next.js console proxy pattern
 */

const express = require('express');
const router = express.Router();

// Simulated integration status for development
const getAerodromeStatus = () => ({
  timestamp: new Date().toISOString(),
  overall_status: 'partial',
  individual_status: {
    github_api: true,
    quicknode_api: false, // Requires API key
    superswaps_api: true,
    base_network: true,
    aerodrome_contracts: true
  },
  required_env_vars: {
    QUICKNODE_AERODROME_API: false
  },
  github_repos: {
    contracts: {
      name: 'aerodrome-finance/contracts',
      stars: 70,
      forks: 48,
      language: 'Solidity',
      last_updated: '2024-06-05T00:00:00Z'
    },
    docs: {
      name: 'aerodrome-finance/docs',
      stars: 15,
      forks: 8,
      language: 'MDX',
      last_updated: '2024-07-31T00:00:00Z'
    }
  },
  base_network: {
    chain_id: 8453,
    block_height: 12500000,
    gas_price: '0.001 gwei'
  }
});

// Mock pool data for development
const getMockPools = () => ([
  {
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    token0: 'AERO',
    token1: 'USDC',
    stable: false,
    tvl: 12500000,
    volume24h: 2800000,
    fees24h: 14000,
    apr: 18.5
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    token0: 'ETH',
    token1: 'USDC',
    stable: false,
    tvl: 8900000,
    volume24h: 1900000,
    fees24h: 9500,
    apr: 12.3
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    token0: 'USDC',
    token1: 'DAI',
    stable: true,
    tvl: 5200000,
    volume24h: 850000,
    fees24h: 2125,
    apr: 4.8
  }
]);

// Business user specialized data
const getBusinessUserData = (userType) => {
  const pools = getMockPools();
  const baseData = {
    timestamp: new Date().toISOString(),
    pools_available: pools.length,
    total_tvl: pools.reduce((sum, pool) => sum + pool.tvl, 0),
    avg_apr: pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length
  };

  switch (userType) {
    case 'eric':
      return {
        ...baseData,
        user: 'Eric (Metals Mint President)',
        focus: 'Trading systems and metals intelligence',
        relevant_pools: pools.filter(pool => pool.apr > 15),
        top_volume_pools: pools.sort((a, b) => b.volume24h - a.volume24h).slice(0, 2),
        business_priority: 'High-volume trading pairs for metals business'
      };
    
    case 'dan':
      return {
        ...baseData,
        user: 'Dan (Crypto Trader)',
        focus: 'Crypto trading and meme coin creation',
        high_yield_pools: pools.filter(pool => pool.apr > 10),
        volatile_pairs: pools.filter(pool => !pool.stable),
        aero_price: '$1.32',
        business_priority: 'High-APR opportunities and volatile trading pairs'
      };
    
    case 'sutton':
      return {
        ...baseData,
        user: 'Sutton (Security Professional)',
        focus: 'IT security and secure deployment solutions',
        security_metrics: {
          contract_verification: 'Verified on BaseScan',
          audit_status: 'Multiple audits completed',
          github_security_score: 95
        },
        stable_pools: pools.filter(pool => pool.stable),
        business_priority: 'Secure, audited protocols with low risk'
      };
    
    case 'brandon':
      return {
        ...baseData,
        user: 'Brandon (System Administrator)',
        focus: 'Backend tools and network monitoring',
        system_metrics: {
          api_uptime: '99.95%',
          response_time: '120ms',
          error_rate: '0.02%',
          github_repos_monitored: 2
        },
        all_pools: pools,
        business_priority: 'System reliability and comprehensive monitoring'
      };
    
    default:
      return { error: 'Invalid user type' };
  }
};

// Live metrics endpoints for Aerodrome integration

// Integration status
router.get('/aerodrome/status', (req, res) => {
  res.json({
    ok: true,
    service: 'aerodrome-integration',
    data: getAerodromeStatus(),
    ts: new Date().toISOString()
  });
});

// GitHub repositories
router.get('/aerodrome/github/repos', (req, res) => {
  const status = getAerodromeStatus();
  res.json({
    ok: true,
    service: 'aerodrome-github',
    data: {
      repositories: Object.values(status.github_repos),
      total_stars: 85,
      total_forks: 56,
      languages: ['Solidity', 'MDX'],
      integration_health: status.individual_status.github_api
    },
    ts: new Date().toISOString()
  });
});

// Pool analytics
router.get('/aerodrome/pools', (req, res) => {
  const pools = getMockPools();
  res.json({
    ok: true,
    service: 'aerodrome-pools',
    data: {
      pools: pools,
      count: pools.length,
      total_tvl: pools.reduce((sum, pool) => sum + pool.tvl, 0),
      total_volume_24h: pools.reduce((sum, pool) => sum + pool.volume24h, 0),
      avg_apr: pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length
    },
    ts: new Date().toISOString()
  });
});

// Business user endpoints
router.get('/aerodrome/business/eric', (req, res) => {
  res.json({
    ok: true,
    service: 'aerodrome-business-eric',
    data: getBusinessUserData('eric'),
    ts: new Date().toISOString()
  });
});

router.get('/aerodrome/business/dan', (req, res) => {
  res.json({
    ok: true,
    service: 'aerodrome-business-dan',
    data: getBusinessUserData('dan'),
    ts: new Date().toISOString()
  });
});

router.get('/aerodrome/business/sutton', (req, res) => {
  res.json({
    ok: true,
    service: 'aerodrome-business-sutton',
    data: getBusinessUserData('sutton'),
    ts: new Date().toISOString()
  });
});

router.get('/aerodrome/business/brandon', (req, res) => {
  res.json({
    ok: true,
    service: 'aerodrome-business-brandon',
    data: getBusinessUserData('brandon'),
    ts: new Date().toISOString()
  });
});

// Dashboard overview
router.get('/aerodrome/dashboard', (req, res) => {
  const status = getAerodromeStatus();
  const pools = getMockPools();
  
  res.json({
    ok: true,
    service: 'aerodrome-dashboard',
    data: {
      integration_status: status,
      github: status.github_repos,
      defi: {
        pools: pools.slice(0, 5),
        total_pools: pools.length,
        total_tvl: pools.reduce((sum, pool) => sum + pool.tvl, 0),
        avg_apr: pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length
      },
      business_users: [
        { name: 'Eric', role: 'Metals Mint President', focus: 'Trading systems' },
        { name: 'Dan', role: 'Crypto Trader', focus: 'Meme coins & trading' },
        { name: 'Sutton', role: 'Security Professional', focus: 'IT security' },
        { name: 'Brandon', role: 'System Administrator', focus: 'Backend monitoring' }
      ],
      last_updated: new Date().toISOString()
    },
    ts: new Date().toISOString()
  });
});

module.exports = router;