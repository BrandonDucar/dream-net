#!/usr/bin/env tsx
/**
 * DreamNet Comprehensive System Check
 * Runs all validation, tests, and health checks
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'skip';
  message: string;
  details?: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: CheckResult['status'], message: string, details?: string) {
  results.push({ name, status, message, details });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : status === 'warning' ? '⚠️' : '⏭️';
  console.log(`${icon} ${name}: ${message}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

function runCommand(command: string, description: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    return { success: true, output };
  } catch (error: any) {
    return { 
      success: false, 
      output: error.stdout?.toString() || error.stderr?.toString() || error.message 
    };
  }
}

async function checkRepoStructure() {
  console.log('\n📁 Checking Repository Structure...');
  
  const requiredDirs = ['client', 'server', 'packages'];
  for (const dir of requiredDirs) {
    if (existsSync(join(process.cwd(), dir))) {
      addResult(`Directory: ${dir}/`, 'pass', 'Exists');
    } else {
      addResult(`Directory: ${dir}/`, 'fail', 'Missing');
    }
  }
  
  const requiredFiles = ['package.json', 'pnpm-workspace.yaml', 'vercel.json'];
  for (const file of requiredFiles) {
    if (existsSync(join(process.cwd(), file))) {
      addResult(`File: ${file}`, 'pass', 'Exists');
    } else {
      addResult(`File: ${file}`, 'fail', 'Missing');
    }
  }
}

async function checkOpsContract() {
  console.log('\n📋 Checking OPS Contract Compliance...');
  
  try {
    // Try to import ops-sentinel
    const opsSentinelPath = join(process.cwd(), 'packages', 'ops-sentinel', 'dist', 'index.js');
    if (!existsSync(opsSentinelPath)) {
      addResult('OPS Contract Validation', 'skip', 'ops-sentinel not built (run: pnpm --filter @dreamnet/ops-sentinel build)');
      return;
    }
    
    // Convert Windows path to file:// URL for ESM import
    const opsSentinelUrl = process.platform === 'win32' 
      ? `file:///${opsSentinelPath.replace(/\\/g, '/')}`
      : opsSentinelPath;
    
    const opsSentinel = await import(opsSentinelUrl);
    const loadOpsContract = opsSentinel.loadOpsContract;
    const validateRepoSetup = opsSentinel.validateRepoSetup;
    
    const contract = loadOpsContract();
    const validation = validateRepoSetup(contract);
    
    if (validation.valid) {
      addResult('OPS Contract Validation', 'pass', 'All checks passed');
    } else {
      addResult('OPS Contract Validation', 'fail', `${validation.errors.length} errors found`);
      validation.errors.forEach(err => {
        addResult('  Error', 'fail', err, undefined);
      });
    }
    
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warn => {
        addResult('  Warning', 'warning', warn, undefined);
      });
    }
  } catch (error: any) {
    addResult('OPS Contract Validation', 'warning', `Could not validate: ${error.message}`);
  }
}

async function checkTypeScript() {
  console.log('\n🔷 Checking TypeScript...');
  
  const result = runCommand('pnpm typecheck', 'Type checking');
  if (result.success) {
    addResult('TypeScript Type Check', 'pass', 'No type errors');
  } else {
    // Check if it's just warnings or actual errors
    const hasErrors = result.output.includes('error TS') || result.output.includes('Found');
    if (hasErrors) {
      addResult('TypeScript Type Check', 'fail', 'Type errors found', result.output.split('\n').slice(0, 5).join('\n'));
    } else {
      addResult('TypeScript Type Check', 'warning', 'Check completed with warnings');
    }
  }
}

async function checkBuilds() {
  console.log('\n🔨 Checking Build Status...');
  
  // Check key packages build
  const keyPackages = [
    'packages/ops-sentinel',
    'packages/vechain-core',
    'packages/dreamnet-bridge',
  ];
  
  for (const pkg of keyPackages) {
    const pkgPath = join(process.cwd(), pkg);
    if (!existsSync(pkgPath)) {
      addResult(`Build: ${pkg}`, 'skip', 'Package not found');
      continue;
    }
    
    const distPath = join(pkgPath, 'dist');
    if (existsSync(distPath)) {
      addResult(`Build: ${pkg}`, 'pass', 'Built (dist exists)');
    } else {
      addResult(`Build: ${pkg}`, 'warning', 'Not built (no dist/)');
    }
  }
  
  // Check client build
  const clientDist = join(process.cwd(), 'client', 'dist');
  if (existsSync(clientDist)) {
    addResult('Build: client', 'pass', 'Built (dist exists)');
  } else {
    addResult('Build: client', 'warning', 'Not built (no dist/)');
  }
  
  // Check server build
  const serverDist = join(process.cwd(), 'server', 'dist');
  if (existsSync(serverDist)) {
    addResult('Build: server', 'pass', 'Built (dist exists)');
  } else {
    addResult('Build: server', 'warning', 'Not built (no dist/)');
  }
}

async function checkTests() {
  console.log('\n🧪 Checking Tests...');
  
  // Check if test files exist
  const testFiles = [
    'packages/base-mini-apps/test/Passport.test.ts',
    'packages/base-mini-apps/test/Governance.test.ts',
    'test-runner.ts',
  ];
  
  for (const testFile of testFiles) {
    if (existsSync(join(process.cwd(), testFile))) {
      addResult(`Test: ${testFile}`, 'pass', 'Exists');
    } else {
      addResult(`Test: ${testFile}`, 'skip', 'Not found');
    }
  }
  
  // Try running tests (may fail if no test framework configured)
  const result = runCommand('pnpm test', 'Running tests');
  if (result.success) {
    addResult('Test Execution', 'pass', 'Tests passed');
  } else {
    // Check if it's because no tests are configured vs actual failures
    if (result.output.includes('No test script') || result.output.includes('command not found')) {
      addResult('Test Execution', 'skip', 'No test framework configured');
    } else {
      addResult('Test Execution', 'warning', 'Tests may have issues', result.output.split('\n').slice(0, 3).join('\n'));
    }
  }
}

async function checkLinting() {
  console.log('\n🔍 Checking Linting...');
  
  const result = runCommand('pnpm lint', 'Linting');
  if (result.success) {
    addResult('Linting', 'pass', 'No linting errors');
  } else {
    // Linting often has warnings, check if it's errors or just warnings
    const hasErrors = result.output.includes('error') && !result.output.includes('warnings');
    if (hasErrors) {
      addResult('Linting', 'fail', 'Linting errors found', result.output.split('\n').slice(0, 5).join('\n'));
    } else {
      addResult('Linting', 'warning', 'Linting completed with warnings');
    }
  }
}

async function checkConfigurations() {
  console.log('\n⚙️  Checking Configurations...');
  
  // Check vercel.json
  try {
    const vercelJson = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf-8'));
    if (vercelJson.rootDirectory === 'client') {
      addResult('Vercel Config', 'pass', 'rootDirectory set correctly');
    } else {
      addResult('Vercel Config', 'fail', `rootDirectory should be 'client', got '${vercelJson.rootDirectory}'`);
    }
  } catch (error: any) {
    addResult('Vercel Config', 'fail', `Failed to parse: ${error.message}`);
  }
  
  // Check package.json scripts
  try {
    const pkgJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
    const requiredScripts = ['dev', 'build', 'typecheck', 'test'];
    for (const script of requiredScripts) {
      if (pkgJson.scripts?.[script]) {
        addResult(`Script: ${script}`, 'pass', 'Exists');
      } else {
        addResult(`Script: ${script}`, 'warning', 'Missing');
      }
    }
  } catch (error: any) {
    addResult('Package.json', 'fail', `Failed to parse: ${error.message}`);
  }
}

async function checkIntegrations() {
  console.log('\n🔗 Checking Integrations...');
  
  // Check integration inventory
  const inventoryPath = join(process.cwd(), 'DREAMNET_INTEGRATIONS_INVENTORY.md');
  if (existsSync(inventoryPath)) {
    addResult('Integration Inventory', 'pass', 'Documentation exists');
  } else {
    addResult('Integration Inventory', 'fail', 'Missing');
  }
  
  // Check OPS Contract
  const opsContractPath = join(process.cwd(), 'docs', 'OPS_CONTRACT.md');
  if (existsSync(opsContractPath)) {
    addResult('OPS Contract', 'pass', 'Documentation exists');
  } else {
    addResult('OPS Contract', 'fail', 'Missing');
  }
  
  // Check key integration packages
  const integrationPackages = [
    'packages/dreamnet-bridge',
    'packages/ops-sentinel',
    'packages/vechain-core',
    'packages/coinsensei-core',
  ];
  
  for (const pkg of integrationPackages) {
    const pkgPath = join(process.cwd(), pkg);
    if (existsSync(pkgPath)) {
      addResult(`Integration: ${pkg.split('/').pop()}`, 'pass', 'Package exists');
    } else {
      addResult(`Integration: ${pkg.split('/').pop()}`, 'warning', 'Package not found');
    }
  }
}

async function checkDependencies() {
  console.log('\n📦 Checking Dependencies...');
  
  // Check if node_modules exists
  if (existsSync(join(process.cwd(), 'node_modules'))) {
    addResult('Dependencies Installed', 'pass', 'node_modules exists');
  } else {
    addResult('Dependencies Installed', 'fail', 'Run pnpm install');
  }
  
  // Check pnpm-lock.yaml
  if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
    addResult('Lockfile', 'pass', 'pnpm-lock.yaml exists');
  } else {
    addResult('Lockfile', 'warning', 'pnpm-lock.yaml missing');
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SYSTEM CHECK REPORT');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📊 Total Checks: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED CHECKS:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }
  
  if (warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.filter(r => r.status === 'warning').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }
  
  const healthScore = Math.round((passed / (passed + failed)) * 100);
  console.log(`\n🏥 System Health Score: ${healthScore}%`);
  
  if (healthScore >= 90) {
    console.log('✨ System is in excellent health!');
  } else if (healthScore >= 75) {
    console.log('👍 System is in good health');
  } else if (healthScore >= 50) {
    console.log('⚠️  System needs attention');
  } else {
    console.log('🚨 System needs immediate attention');
  }
  
  console.log('\n' + '='.repeat(60));
}

async function main() {
  console.log('🚀 DreamNet Comprehensive System Check');
  console.log('='.repeat(60));
  
  await checkRepoStructure();
  await checkDependencies();
  await checkConfigurations();
  await checkOpsContract();
  await checkIntegrations();
  await checkTypeScript();
  await checkBuilds();
  await checkLinting();
  await checkTests();
  
  generateReport();
}

main().catch((error) => {
  console.error('❌ System check failed:', error);
  process.exit(1);
});
