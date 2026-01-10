#!/usr/bin/env tsx
/**
 * Verify All DreamNet Connections
 * 
 * Checks:
 * - Server startup
 * - Middleware configuration
 * - Frontend-backend connectivity
 * - API endpoints
 * - Database connections
 * 
 * Usage: pnpm verify:connections
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const API_URL = process.env.API_URL || 'http://localhost:3000';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ name, status, message });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${name}: ${message}`);
}

async function checkServerRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function checkEndpoint(endpoint: string, method: string = 'GET'): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      signal: AbortSignal.timeout(5000),
    });
    return response.status !== 404;
  } catch {
    return false;
  }
}

console.log('🔌 Verifying DreamNet Connections...\n');
console.log('='.repeat(70));

// 1. Check Server Files
console.log('\n📁 Server Files:');
const serverFiles = [
  'server/index.ts',
  'server/routes.ts',
  'server/config/env.ts',
  'server/middleware/traceId.ts',
  'server/middleware/idempotency.ts',
  'server/middleware/tierResolver.ts',
  'server/middleware/autoSEO.ts',
];

serverFiles.forEach(file => {
  if (existsSync(join(process.cwd(), file))) {
    addResult(`File: ${file}`, 'pass', 'Exists');
  } else {
    addResult(`File: ${file}`, 'warning', 'Not found (may be optional)');
  }
});

// 2. Check Middleware Configuration
console.log('\n🛡️ Middleware Configuration:');
const middlewareChecks = [
  { name: 'CORS', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('cors') || indexContent.includes('CORS');
  }},
  { name: 'Rate Limiting', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('rateLimit') || indexContent.includes('RATE_LIMIT');
  }},
  { name: 'Trace ID', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('traceIdMiddleware');
  }},
  { name: 'Idempotency', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('idempotencyMiddleware');
  }},
  { name: 'Tier Resolver', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('tierResolverMiddleware');
  }},
  { name: 'Control Core', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('controlCoreMiddleware');
  }},
  { name: 'Auto SEO', check: () => {
    const indexContent = readFileSync('server/index.ts', 'utf-8');
    return indexContent.includes('autoSEORequestMiddleware');
  }},
];

middlewareChecks.forEach(({ name, check }) => {
  try {
    if (check()) {
      addResult(`Middleware: ${name}`, 'pass', 'Configured');
    } else {
      addResult(`Middleware: ${name}`, 'warning', 'Not found in server/index.ts');
    }
  } catch (error: any) {
    addResult(`Middleware: ${name}`, 'fail', `Error: ${error.message}`);
  }
});

// 3. Check Frontend Configuration
console.log('\n🎨 Frontend Configuration:');
const frontendFiles = [
  'client/src/main.tsx',
  'client/src/App.tsx',
  'client/src/lib/queryClient.ts',
  'client/index.html',
  'vite.config.ts',
];

frontendFiles.forEach(file => {
  if (existsSync(join(process.cwd(), file))) {
    addResult(`Frontend: ${file}`, 'pass', 'Exists');
  } else {
    addResult(`Frontend: ${file}`, 'fail', 'Missing');
  }
});

// Check API client configuration
try {
  const queryClientContent = readFileSync('client/src/lib/queryClient.ts', 'utf-8');
  if (queryClientContent.includes('fetch') && queryClientContent.includes('/api')) {
    addResult('Frontend: API Client', 'pass', 'Configured for /api endpoints');
  } else {
    addResult('Frontend: API Client', 'warning', 'API client may not be configured');
  }
} catch {
  addResult('Frontend: API Client', 'fail', 'Cannot read queryClient.ts');
}

// 4. Check Server Running
console.log('\n🚀 Server Status:');
const serverRunning = await checkServerRunning();
if (serverRunning) {
  addResult('Server', 'pass', `Running at ${API_URL}`);
} else {
  addResult('Server', 'fail', `Not running at ${API_URL}. Start with: pnpm dev:app`);
}

// 5. Check API Endpoints (if server is running)
if (serverRunning) {
  console.log('\n🔗 API Endpoints:');
  const endpoints = [
    '/health',
    '/health/live',
    '/health/ready',
    '/api/health',
    '/api/auth/nonce',
    '/api/dreams',
    '/api/wallet-scan',
  ];
  
  for (const endpoint of endpoints) {
    const available = await checkEndpoint(endpoint);
    if (available) {
      addResult(`Endpoint: ${endpoint}`, 'pass', 'Available');
    } else {
      addResult(`Endpoint: ${endpoint}`, 'warning', 'Not found or not responding');
    }
  }
}

// 6. Check Routes Registration
console.log('\n🛣️ Routes Registration:');
try {
  const routesContent = readFileSync('server/routes.ts', 'utf-8');
  const routeCount = (routesContent.match(/app\.use\(/g) || []).length;
  addResult('Routes', 'pass', `${routeCount} route registrations found`);
} catch {
  addResult('Routes', 'warning', 'Cannot read routes.ts');
}

// 7. Check Database Connection (if server is running)
if (serverRunning) {
  console.log('\n💾 Database Connection:');
  try {
    const healthResponse = await fetch(`${API_URL}/health/ready`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      if (healthData.checks?.database === true) {
        addResult('Database', 'pass', 'Connected');
      } else if (healthData.checks?.database === 'not-configured') {
        addResult('Database', 'warning', 'Not configured (server can run without DB)');
      } else {
        addResult('Database', 'fail', 'Not connected');
      }
    }
  } catch {
    addResult('Database', 'warning', 'Cannot check database status');
  }
}

// 8. Check Frontend-Backend Integration
console.log('\n🔗 Frontend-Backend Integration:');
try {
  const appContent = readFileSync('client/src/App.tsx', 'utf-8');
  const queryClientContent = readFileSync('client/src/lib/queryClient.ts', 'utf-8');
  
  if (appContent.includes('QueryClientProvider') && queryClientContent.includes('apiRequest')) {
    addResult('Integration', 'pass', 'Frontend configured to use API client');
  } else {
    addResult('Integration', 'warning', 'Frontend may not be fully integrated');
  }
} catch {
  addResult('Integration', 'warning', 'Cannot verify integration');
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 Connection Verification Summary:\n');

const passed = results.filter(r => r.status === 'pass').length;
const warnings = results.filter(r => r.status === 'warning').length;
const failed = results.filter(r => r.status === 'fail').length;

console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0 && serverRunning) {
  console.log('\n🎉 All critical connections verified! DreamNet is ready to go.');
  console.log('\n💡 Next steps:');
  console.log('   - Frontend: http://localhost:3000');
  console.log('   - API: http://localhost:3000/api');
  console.log('   - Health: http://localhost:3000/health');
} else if (!serverRunning) {
  console.log('\n⚠️  Server is not running. Start it with:');
  console.log('   pnpm dev:app');
  console.log('\nThen run this verification again.');
} else {
  console.log('\n⚠️  Some checks failed. Review the output above.');
  process.exit(1);
}

