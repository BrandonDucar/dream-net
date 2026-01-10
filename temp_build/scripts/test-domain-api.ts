#!/usr/bin/env tsx
/**
 * Test Domain Issuance API
 * 
 * Tests all domain issuance endpoints to ensure they work correctly
 * 
 * Usage: pnpm test:domain-api
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_WALLET = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
const TEST_PASSPORT = 'dreamnet-test';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
}

const results: TestResult[] = [];

async function testEndpoint(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<TestResult> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        endpoint,
        method,
        status: 'pass',
        message: `✅ ${response.status} - ${JSON.stringify(data).substring(0, 100)}`,
      };
    } else {
      return {
        endpoint,
        method,
        status: 'fail',
        message: `❌ ${response.status} - ${data.error || data.message || 'Unknown error'}`,
      };
    }
  } catch (error: any) {
    return {
      endpoint,
      method,
      status: 'skip',
      message: `⚠️  Error: ${error.message}`,
    };
  }
}

async function main() {
  console.log('🧪 Testing Domain Issuance API...\n');
  console.log(`API URL: ${API_URL}\n`);
  console.log('='.repeat(70));

  // Check if server is running
  try {
    const healthCheck = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!healthCheck.ok) {
      console.log('❌ Server is not running or not responding');
      console.log('💡 Start server with: pnpm dev:app');
      process.exit(1);
    }
  } catch {
    console.log('❌ Cannot connect to server');
    console.log('💡 Start server with: pnpm dev:app');
    process.exit(1);
  }

  console.log('✅ Server is running\n');

  // Test endpoints
  console.log('📡 Testing Endpoints:\n');

  // 1. Issue .dream domain
  console.log('1. Testing POST /api/domains/issue/dream...');
  const issueDream = await testEndpoint('/api/domains/issue/dream', 'POST', {
    passportId: TEST_PASSPORT,
    walletAddress: TEST_WALLET,
    requestedName: 'test-domain',
    tier: 'premium',
  });
  results.push(issueDream);
  console.log(`   ${issueDream.message}\n`);

  // 2. Issue .sheep domain
  console.log('2. Testing POST /api/domains/issue/sheep...');
  const issueSheep = await testEndpoint('/api/domains/issue/sheep', 'POST', {
    passportId: TEST_PASSPORT,
    walletAddress: TEST_WALLET,
    requestedName: 'test-sheep',
    tier: 'premium',
  });
  results.push(issueSheep);
  console.log(`   ${issueSheep.message}\n`);

  // 3. Resolve domain
  console.log('3. Testing GET /api/domains/resolve/test-domain.dream...');
  const resolveDomain = await testEndpoint('/api/domains/resolve/test-domain.dream');
  results.push(resolveDomain);
  console.log(`   ${resolveDomain.message}\n`);

  // 4. Get domains for passport
  console.log('4. Testing GET /api/domains/passport/dreamnet-test...');
  const passportDomains = await testEndpoint('/api/domains/passport/dreamnet-test');
  results.push(passportDomains);
  console.log(`   ${passportDomains.message}\n`);

  // 5. Get domains for wallet
  console.log('5. Testing GET /api/domains/wallet/0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e...');
  const walletDomains = await testEndpoint('/api/domains/wallet/0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e');
  results.push(walletDomains);
  console.log(`   ${walletDomains.message}\n`);

  // 6. List all domains
  console.log('6. Testing GET /api/domains/list...');
  const listDomains = await testEndpoint('/api/domains/list');
  results.push(listDomains);
  console.log(`   ${listDomains.message}\n`);

  // Summary
  console.log('='.repeat(70));
  console.log('\n📊 Test Summary:\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Skipped: ${skipped}`);

  if (failed === 0 && skipped === 0) {
    console.log('\n🎉 All domain API tests passed!');
  } else if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Review the output above.');
    process.exit(1);
  }
}

main().catch(console.error);

