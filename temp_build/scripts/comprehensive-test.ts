#!/usr/bin/env tsx
/**
 * DreamNet Comprehensive Test Suite
 * Runs all available tests and validations
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  output: string;
  duration?: number;
}

const results: TestResult[] = [];

function runTest(name: string, command: string): TestResult {
  const start = Date.now();
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    return {
      name,
      status: 'pass',
      output: output.toString(),
      duration: Date.now() - start,
    };
  } catch (error: any) {
    return {
      name,
      status: 'fail',
      output: error.stdout?.toString() || error.stderr?.toString() || error.message,
      duration: Date.now() - start,
    };
  }
}

async function main() {
  console.log('🧪 DreamNet Comprehensive Test Suite');
  console.log('='.repeat(60));
  
  // Test 1: Repository structure
  console.log('\n1️⃣  Testing Repository Structure...');
  const required = ['client', 'server', 'packages', 'package.json', 'pnpm-workspace.yaml'];
  for (const item of required) {
    const exists = existsSync(join(process.cwd(), item));
    results.push({
      name: `Repo: ${item}`,
      status: exists ? 'pass' : 'fail',
      output: exists ? 'Exists' : 'Missing',
    });
    console.log(`${exists ? '✅' : '❌'} ${item}`);
  }
  
  // Test 2: Dependencies
  console.log('\n2️⃣  Testing Dependencies...');
  const depsTest = runTest('Dependencies', 'pnpm install --frozen-lockfile --dry-run');
  results.push(depsTest);
  console.log(`${depsTest.status === 'pass' ? '✅' : '❌'} Dependencies check`);
  
  // Test 3: Linting
  console.log('\n3️⃣  Testing Linting...');
  const lintTest = runTest('Linting', 'pnpm lint');
  results.push(lintTest);
  console.log(`${lintTest.status === 'pass' ? '✅' : '⚠️'} Linting`);
  
  // Test 4: Build key packages
  console.log('\n4️⃣  Testing Builds...');
  const buildTest = runTest('Build', 'pnpm --filter @dreamnet/ops-sentinel build');
  results.push(buildTest);
  console.log(`${buildTest.status === 'pass' ? '✅' : '❌'} ops-sentinel build`);
  
  // Test 5: Check configurations
  console.log('\n5️⃣  Testing Configurations...');
  try {
    const vercelJson = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf-8'));
    const configValid = vercelJson.rootDirectory === 'client';
    results.push({
      name: 'Vercel Config',
      status: configValid ? 'pass' : 'fail',
      output: configValid ? 'Valid' : 'Invalid rootDirectory',
    });
    console.log(`${configValid ? '✅' : '❌'} Vercel config`);
  } catch (error: any) {
    results.push({
      name: 'Vercel Config',
      status: 'fail',
      output: error.message,
    });
    console.log('❌ Vercel config');
  }
  
  // Test 6: Integration files
  console.log('\n6️⃣  Testing Integration Files...');
  const integrationFiles = [
    'DREAMNET_INTEGRATIONS_INVENTORY.md',
    'docs/OPS_CONTRACT.md',
    'docs/OPS_README.md',
  ];
  for (const file of integrationFiles) {
    const exists = existsSync(join(process.cwd(), file));
    results.push({
      name: `Integration: ${file}`,
      status: exists ? 'pass' : 'fail',
      output: exists ? 'Exists' : 'Missing',
    });
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  }
  
  // Test 7: Key packages exist
  console.log('\n7️⃣  Testing Key Packages...');
  const keyPackages = [
    'packages/ops-sentinel',
    'packages/vechain-core',
    'packages/dreamnet-bridge',
    'packages/coinsensei-core',
  ];
  for (const pkg of keyPackages) {
    const exists = existsSync(join(process.cwd(), pkg));
    results.push({
      name: `Package: ${pkg}`,
      status: exists ? 'pass' : 'fail',
      output: exists ? 'Exists' : 'Missing',
    });
    console.log(`${exists ? '✅' : '❌'} ${pkg}`);
  }
  
  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.name}`);
      if (r.output && r.output.length < 200) {
        console.log(`     ${r.output.split('\n')[0]}`);
      }
    });
  }
  
  const successRate = Math.round((passed / (passed + failed)) * 100);
  console.log(`\n🏆 Success Rate: ${successRate}%`);
  
  if (successRate >= 90) {
    console.log('✨ System is in excellent condition!');
  } else if (successRate >= 75) {
    console.log('👍 System is in good condition');
  } else {
    console.log('⚠️  System needs attention');
  }
  
  console.log('\n' + '='.repeat(60));
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});

