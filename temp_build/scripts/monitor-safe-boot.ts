#!/usr/bin/env tsx
/**
 * Monitor Safe Boot Sequence
 * 
 * Watches the server logs for safe boot progress and reports status
 */

import { spawn } from 'child_process';
import { getEnvConfig } from '../server/config/env';

const PORT = getEnvConfig().PORT || 3000;

console.log('🔍 Monitoring Safe Boot Sequence...\n');
console.log('📊 Checking server health endpoints...\n');

// Check health endpoint
async function checkHealth() {
  try {
    const response = await fetch(`http://localhost:${PORT}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

// Check live endpoint
async function checkLive() {
  try {
    const response = await fetch(`http://localhost:${PORT}/health/live`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Check ready endpoint
async function checkReady() {
  try {
    const response = await fetch(`http://localhost:${PORT}/health/ready`);
    return await response.ok;
  } catch (error) {
    return false;
  }
}

// Monitor loop
async function monitor() {
  console.log('⏳ Waiting for server to start...\n');
  
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
    
    const health = await checkHealth();
    const live = await checkLive();
    const ready = await checkReady();
    
    if (health) {
      console.log('\n✅ Server is responding!\n');
      console.log('📋 Health Status:');
      console.log(`   Health: ${health.ok ? '✅' : '❌'}`);
      console.log(`   Live: ${live ? '✅' : '❌'}`);
      console.log(`   Ready: ${ready ? '✅' : '❌'}`);
      console.log(`   Timestamp: ${health.timestamp || 'N/A'}`);
      
      if (ready) {
        console.log('\n🎉 Safe Boot Complete - Server is READY!\n');
        process.exit(0);
      }
    }
    } else {
      process.stdout.write(`\r⏳ Attempt ${attempts}/${maxAttempts}...`);
    }
  }
  
  console.log('\n\n⚠️  Server did not respond in time');
  console.log('💡 Check server logs for safe boot sequence output');
  process.exit(1);
}

monitor();

