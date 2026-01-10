#!/usr/bin/env tsx
/**
 * Check Vercel Build using Vercel CLI
 * Works if you're logged in via: vercel login
 */

import { execSync } from 'child_process';

function runVercelCommand(cmd: string): string {
  try {
    return execSync(`vercel ${cmd}`, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (error: any) {
    return error.stdout || error.message || error.toString();
  }
}

console.log('🔍 Checking Vercel Build Status via CLI...\n');

// Check who's logged in
console.log('👤 Logged in as:');
const whoami = runVercelCommand('whoami');
console.log(whoami.trim());
console.log('');

// List projects
console.log('📦 Projects:');
const projects = runVercelCommand('projects ls');
console.log(projects);
console.log('');

// Get latest deployment (if we can determine project)
console.log('📋 Latest Deployments:');
const deployments = runVercelCommand('ls');
console.log(deployments);

console.log('\n💡 For detailed logs, run:');
console.log('   vercel logs [deployment-url]');
console.log('\n💡 Or check dashboard:');
console.log('   https://vercel.com/dashboard');

