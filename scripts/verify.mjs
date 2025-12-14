#!/usr/bin/env node
/**
 * DreamNet Verification Script
 * 
 * One-command verifier that checks DreamNet health endpoints
 * and reports status in a table format.
 */

// Load environment variables
const BASE_URL = process.env.DREAMNET_BASE_URL || 'https://dreamnet.ink';
const API_KEY = process.env.DREAMNET_API_KEY || '';

// Endpoints to check
const ENDPOINTS = [
  '/health',
  '/api/shield/status',
  '/api/heartbeat',
  '/api/system/health'
];

// Results storage
const results = [];

/**
 * Check a single endpoint
 */
async function checkEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const headers = {};
    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    let bodyText = '';
    try {
      const text = await response.text();
      bodyText = text.substring(0, 120);
    } catch (e) {
      bodyText = `[Could not read response body: ${e.message}]`;
    }
    
    const status = response.ok ? 'OK' : 'FAIL';
    const code = response.status;
    
    return {
      endpoint,
      status,
      code,
      time: `${responseTime}ms`,
      response: bodyText || `[Empty response]`
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Timeout (5s)';
    }
    
    return {
      endpoint,
      status: 'FAIL',
      code: 'ERR',
      time: `${responseTime}ms`,
      response: `[Error: ${errorMessage}]`
    };
  }
}

/**
 * Main verification function
 */
async function verify() {
  console.log('🔍 DreamNet Verification\n');
  console.log(`Base URL: ${BASE_URL}`);
  if (API_KEY) {
    console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);
  } else {
    console.log('API Key: [Not provided - using public endpoints]');
  }
  console.log('');
  
  // Check all endpoints
  for (const endpoint of ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
  }
  
  // Display results table
  console.table(results);
  
  // Summary
  const allOk = results.every(r => r.status === 'OK');
  const failedCount = results.filter(r => r.status === 'FAIL').length;
  
  console.log('');
  if (allOk) {
    console.log('✅ All checks passed');
    return 0;
  } else {
    console.log(`❌ ${failedCount} check(s) failed`);
    return 1;
  }
}

// Run verification
verify()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(2);
  });

