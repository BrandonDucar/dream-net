/**
 * Basic DreamNet API Call Example
 * 
 * Demonstrates how to interact with DreamNet's API
 */

// Example: Check system health
async function checkDreamNetHealth() {
  const response = await fetch('https://dreamnet.ink/health');
  const data = await response.json();
  
  console.log('DreamNet Health:', data);
  // {
  //   ok: true,
  //   service: 'dreamnet-api',
  //   timestamp: '2025-01-01T00:00:00.000Z',
  //   uptime: 3600,
  //   database: 'healthy',
  //   metrics: { ... }
  // }
}

// Example: Get golden signals (metrics)
async function getGoldenSignals() {
  const response = await fetch('https://dreamnet.ink/api/metrics/golden-signals');
  const data = await response.json();
  
  console.log('Golden Signals:', data);
  // {
  //   ok: true,
  //   traffic: { requestsPerSecond: 10.5, ... },
  //   errors: { errorRate: 0.01, ... },
  //   latency: { p50: 50, p95: 200, p99: 500 },
  //   saturation: { cpu: 0.5, memory: { ... } }
  // }
}

// Example: Authenticated API call with API key
async function getAgentStatus(apiKey: string) {
  const response = await fetch('https://dreamnet.ink/api/agents', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      // OR
      // 'X-API-Key': apiKey
    }
  });
  
  const data = await response.json();
  console.log('Agent Status:', data);
}

// Example: Wallet authentication (SIWE)
async function authenticateWithWallet(walletAddress: string, signature: string) {
  // Step 1: Get nonce
  const nonceResponse = await fetch('https://dreamnet.ink/api/auth/nonce');
  const { nonce } = await nonceResponse.json();
  
  // Step 2: Sign message with wallet (done client-side)
  // const message = `Sign in to DreamNet\n\nNonce: ${nonce}`;
  // const signature = await wallet.signMessage(message);
  
  // Step 3: Verify and get JWT token
  const verifyResponse = await fetch('https://dreamnet.ink/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: walletAddress,
      signature: signature,
      nonce: nonce
    })
  });
  
  const { token } = await verifyResponse.json();
  return token; // Use this token for authenticated requests
}

// Example: Create a dream
async function createDream(apiKey: string, dreamData: { title: string; description: string }) {
  const response = await fetch('https://dreamnet.ink/api/dreams', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dreamData)
  });
  
  const dream = await response.json();
  console.log('Created Dream:', dream);
  return dream;
}

// Example: Query Wolf Pack (funding system)
async function getWolfPackLeads(apiKey: string) {
  const response = await fetch('https://dreamnet.ink/api/wolf-pack/leads', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  const leads = await response.json();
  console.log('Hot Leads:', leads);
  return leads;
}

export {
  checkDreamNetHealth,
  getGoldenSignals,
  getAgentStatus,
  authenticateWithWallet,
  createDream,
  getWolfPackLeads
};

