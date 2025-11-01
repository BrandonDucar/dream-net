/**
 * Live Metrics Router - Velo by Wix Integration
 * 
 * Provides real-time monitoring data for Velo by Wix integration
 * Compatible with Next.js console proxy pattern
 */

const express = require('express');
const router = express.Router();

// Simulated integration status for development
const getVeloStatus = () => ({
  timestamp: new Date().toISOString(),
  overall_status: 'partial',
  individual_status: {
    wix_api: false, // Requires API key
    github_api: true,
    velo_platform: true,
    rest_endpoints: true,
    cli_tools: true
  },
  required_env_vars: {
    WIX_API_KEY: false,
    GITHUB_TOKEN: true,
    WIX_SITE_ID: false
  },
  capabilities: {
    site_management: false,
    data_collections: false,
    github_integration: true,
    http_functions: true,
    external_apis: true,
    secrets_management: false
  },
  development_tools: {
    cli_status: 'available',
    git_integration: true,
    local_development: true,
    ide_support: 'VS Code'
  }
});

// Mock site and collections data
const getSiteInfo = () => ({
  siteId: 'demo-site-12345',
  siteName: 'Business Dashboard',
  status: 'published',
  domain: 'business-dashboard.wixsite.com',
  veloEnabled: true,
  lastModified: new Date().toISOString(),
  gitIntegration: {
    connected: true,
    repository: 'business-team/velo-dashboard',
    branch: 'main'
  }
});

const getCollections = () => ([
  {
    id: 'Products',
    displayName: 'Products',
    fields: [
      { key: 'name', type: 'text', displayName: 'Product Name' },
      { key: 'price', type: 'number', displayName: 'Price' },
      { key: 'description', type: 'richText', displayName: 'Description' }
    ],
    permissions: ['read', 'write'],
    recordCount: 156
  },
  {
    id: 'Orders',
    displayName: 'Orders',
    fields: [
      { key: 'orderId', type: 'text', displayName: 'Order ID' },
      { key: 'total', type: 'number', displayName: 'Total Amount' }
    ],
    permissions: ['read'],
    recordCount: 89
  },
  {
    id: 'UserProfiles',
    displayName: 'User Profiles',
    fields: [
      { key: 'userId', type: 'text', displayName: 'User ID' },
      { key: 'email', type: 'text', displayName: 'Email' }
    ],
    permissions: ['read', 'write'],
    recordCount: 234
  }
]);

// Business user specialized data
const getBusinessUserData = (userType) => {
  const baseData = {
    timestamp: new Date().toISOString(),
    platform: 'Velo by Wix',
    api_documentation: 'https://dev.wix.com/docs/velo',
    collections_available: getCollections().length,
    total_records: getCollections().reduce((sum, col) => sum + col.recordCount, 0)
  };

  switch (userType) {
    case 'eric':
      return {
        ...baseData,
        user: 'Eric (Metals Mint President)',
        role: 'Business Owner & Trading Systems',
        focus: 'E-commerce and metals trading integration',
        relevant_apis: [
          'Wix Stores API',
          'Payment Gateways',
          'Inventory Management',
          'External Trading APIs'
        ],
        recommended_collections: [
          'Products (Metals Inventory)',
          'Orders (Trading Transactions)',
          'Customers (B2B Clients)'
        ],
        http_functions: [
          'get_metalsPricing',
          'post_bulkOrder',
          'get_inventoryStatus'
        ],
        integration_priority: 'High-volume trading and inventory management'
      };
    
    case 'dan':
      return {
        ...baseData,
        user: 'Dan (Crypto Trader)',
        role: 'Crypto Trading & Meme Coin Creation',
        focus: 'Crypto tools and trading platforms',
        relevant_apis: [
          'External Crypto APIs',
          'Webhook Integrations',
          'Real-time Data Feeds',
          'Custom HTTP Functions'
        ],
        recommended_collections: [
          'TradingPairs (Crypto Markets)',
          'Alerts (Price Notifications)',
          'Portfolio (Holdings Tracking)'
        ],
        http_functions: [
          'get_cryptoPrices',
          'post_priceAlert',
          'get_portfolioValue'
        ],
        integration_priority: 'Real-time crypto data and automated trading'
      };
    
    case 'sutton':
      return {
        ...baseData,
        user: 'Sutton (Security Professional)',
        role: 'IT Security & Deployment Solutions',
        focus: 'Security, authentication, and secure deployments',
        relevant_apis: [
          'Wix Members API',
          'Secrets Management',
          'External Database Connections',
          'Secure HTTP Functions'
        ],
        recommended_collections: [
          'SecurityLogs (Audit Trail)',
          'UserPermissions (Access Control)',
          'Projects (Client Sites)'
        ],
        http_functions: [
          'get_securityAudit',
          'post_accessControl',
          'get_deploymentStatus'
        ],
        integration_priority: 'Secure authentication and deployment monitoring'
      };
    
    case 'brandon':
      return {
        ...baseData,
        user: 'Brandon (System Administrator)',
        role: 'Backend Systems & Network Monitoring',
        focus: 'Infrastructure monitoring and system administration',
        relevant_apis: [
          'Site Monitoring APIs',
          'Analytics Integration',
          'External Database APIs',
          'System Health Checks'
        ],
        recommended_collections: [
          'SystemMetrics (Performance Data)',
          'ErrorLogs (System Issues)',
          'ApiUsage (Integration Monitoring)'
        ],
        http_functions: [
          'get_systemHealth',
          'get_apiMetrics',
          'post_performanceReport'
        ],
        integration_priority: 'Comprehensive system monitoring and analytics'
      };
    
    default:
      return { error: 'Invalid user type' };
  }
};

// Live metrics endpoints for Velo integration

// Integration status
router.get('/velo/status', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-integration',
    data: getVeloStatus(),
    ts: new Date().toISOString()
  });
});

// GitHub repositories
router.get('/velo/github/repos', (req, res) => {
  const repos = {
    repositories: [
      {
        name: 'my-velo-site',
        description: 'Velo-powered e-commerce site with custom APIs',
        language: 'JavaScript',
        stars: 12,
        forks: 3,
        last_updated: '2024-08-20T00:00:00Z',
        velo_features: ['HTTP Functions', 'Data API', 'External DB']
      },
      {
        name: 'velo-api-integrations',
        description: 'Custom Velo integrations and utilities',
        language: 'JavaScript',
        stars: 8,
        forks: 2,
        last_updated: '2024-08-15T00:00:00Z',
        velo_features: ['Third-party APIs', 'Webhooks', 'Secrets Management']
      }
    ],
    total_repos: 2,
    total_stars: 20,
    total_forks: 5,
    cli_status: 'installed'
  };

  res.json({
    ok: true,
    service: 'velo-github',
    data: repos,
    ts: new Date().toISOString()
  });
});

// Site information
router.get('/velo/site', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-site',
    data: getSiteInfo(),
    ts: new Date().toISOString()
  });
});

// Data collections
router.get('/velo/collections', (req, res) => {
  const collections = getCollections();
  res.json({
    ok: true,
    service: 'velo-collections',
    data: {
      collections: collections,
      count: collections.length,
      total_records: collections.reduce((sum, col) => sum + col.recordCount, 0)
    },
    ts: new Date().toISOString()
  });
});

// Development tools status
router.get('/velo/devtools', (req, res) => {
  const devTools = {
    cli_installed: true,
    git_integration: {
      available: true,
      connected: true,
      repository_count: 2
    },
    local_development: {
      supported: true,
      ide_integration: 'VS Code',
      sync_status: 'active'
    },
    deployment: {
      method: 'one_click',
      staging_available: true,
      rollback_supported: true
    },
    testing: {
      preview_mode: true,
      function_testing: true,
      real_time_sync: true
    }
  };

  res.json({
    ok: true,
    service: 'velo-devtools',
    data: devTools,
    ts: new Date().toISOString()
  });
});

// Business user endpoints
router.get('/velo/business/eric', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-business-eric',
    data: getBusinessUserData('eric'),
    ts: new Date().toISOString()
  });
});

router.get('/velo/business/dan', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-business-dan',
    data: getBusinessUserData('dan'),
    ts: new Date().toISOString()
  });
});

router.get('/velo/business/sutton', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-business-sutton',
    data: getBusinessUserData('sutton'),
    ts: new Date().toISOString()
  });
});

router.get('/velo/business/brandon', (req, res) => {
  res.json({
    ok: true,
    service: 'velo-business-brandon',
    data: getBusinessUserData('brandon'),
    ts: new Date().toISOString()
  });
});

// Dashboard overview
router.get('/velo/dashboard', (req, res) => {
  const status = getVeloStatus();
  const site = getSiteInfo();
  const collections = getCollections();
  
  res.json({
    ok: true,
    service: 'velo-dashboard',
    data: {
      integration_status: status,
      site_info: site,
      data_collections: {
        collections: collections.slice(0, 3),
        total_collections: collections.length,
        total_records: collections.reduce((sum, col) => sum + col.recordCount, 0)
      },
      github: {
        total_repos: 2,
        total_stars: 20,
        integration_active: true
      },
      business_users: [
        { name: 'Eric', role: 'Metals Mint President', focus: 'E-commerce & Trading' },
        { name: 'Dan', role: 'Crypto Trader', focus: 'Crypto Tools & Platforms' },
        { name: 'Sutton', role: 'Security Professional', focus: 'Security & Deployments' },
        { name: 'Brandon', role: 'System Administrator', focus: 'Infrastructure Monitoring' }
      ],
      api_capabilities: {
        rest_endpoints: true,
        http_functions: true,
        webhooks: true,
        external_databases: true,
        third_party_apis: true,
        secrets_management: status.individual_status.wix_api
      },
      last_updated: new Date().toISOString()
    },
    ts: new Date().toISOString()
  });
});

module.exports = router;