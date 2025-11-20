#!/usr/bin/env tsx
/**
 * Comprehensive Client Build Test
 * Tests all integrations, dependencies, and build process before Vercel deployment
 */

import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLIENT = path.resolve(ROOT, 'client');

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => boolean | Promise<boolean>, details?: string) {
  try {
    const passed = fn();
    results.push({ name, passed: passed === true, details });
    if (passed) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
    }
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message, details });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function testAsync(name: string, fn: () => Promise<boolean>, details?: string) {
  try {
    const passed = await fn();
    results.push({ name, passed, details });
    if (passed) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
    }
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message, details });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

console.log('🧪 Testing Client Build & Integrations\n');
console.log('=' .repeat(60));

// 1. File Structure Tests
console.log('\n📁 File Structure Tests:');
test('client/ directory exists', () => existsSync(CLIENT));
test('client/package.json exists', () => existsSync(path.join(CLIENT, 'package.json')));
test('client/vite.config.ts exists', () => existsSync(path.join(CLIENT, 'vite.config.ts')));
test('client/src/main.tsx exists', () => existsSync(path.join(CLIENT, 'src/main.tsx')));
test('client/src/App.tsx exists', () => existsSync(path.join(CLIENT, 'src/App.tsx')));
test('vercel.json exists', () => existsSync(path.join(ROOT, 'vercel.json')));

// 2. Configuration Tests
console.log('\n⚙️  Configuration Tests:');
test('vercel.json has rootDirectory', () => {
  const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8'));
  return vercel.rootDirectory === 'client';
}, `rootDirectory: ${JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8')).rootDirectory}`);

test('vercel.json has buildCommand', () => {
  const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8'));
  return typeof vercel.buildCommand === 'string';
}, `buildCommand: ${JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8')).buildCommand}`);

test('client/package.json has build script', () => {
  const pkg = JSON.parse(readFileSync(path.join(CLIENT, 'package.json'), 'utf-8'));
  return typeof pkg.scripts?.build === 'string';
}, `build script: ${JSON.parse(readFileSync(path.join(CLIENT, 'package.json'), 'utf-8')).scripts?.build}`);

// 3. Dependency Tests
console.log('\n📦 Dependency Tests:');
test('client/node_modules exists', () => existsSync(path.join(CLIENT, 'node_modules')));
test('pnpm-lock.yaml exists', () => existsSync(path.join(ROOT, 'pnpm-lock.yaml')));

test('vite is installed', () => {
  const pkg = JSON.parse(readFileSync(path.join(CLIENT, 'package.json'), 'utf-8'));
  return pkg.devDependencies?.vite || pkg.dependencies?.vite;
}, 'Checking package.json');

test('react is installed', () => {
  const pkg = JSON.parse(readFileSync(path.join(CLIENT, 'package.json'), 'utf-8'));
  return pkg.dependencies?.react;
}, 'Checking package.json');

// 4. Import Tests
console.log('\n🔍 Import Tests:');
test('No inbox-squared-core imports in client', () => {
  const { execSync } = require('child_process');
  try {
    const result = execSync(
      `grep -r "@dreamnet/inbox-squared-core" "${CLIENT}/src" || true`,
      { encoding: 'utf-8', cwd: ROOT }
    );
    return !result.trim();
  } catch {
    return true; // grep returns non-zero if no matches, which is good
  }
}, 'Checking for server-only imports');

test('No googleapis imports in client', () => {
  const { execSync } = require('child_process');
  try {
    const result = execSync(
      `grep -r "googleapis" "${CLIENT}/src" || true`,
      { encoding: 'utf-8', cwd: ROOT }
    );
    return !result.trim();
  } catch {
    return true;
  }
}, 'Checking for googleapis imports');

// 5. TypeScript Tests
console.log('\n📝 TypeScript Tests:');
testAsync('TypeScript compiles without errors', async () => {
  try {
    execSync('pnpm --filter client run typecheck', {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 60000,
    });
    return true;
  } catch (error: any) {
    throw new Error('TypeScript errors found - check output above');
  }
}, 'Running pnpm --filter client run typecheck');

// 6. Build Test
console.log('\n🏗️  Build Tests:');
testAsync('Vite build succeeds', async () => {
  try {
    // Clean dist first
    const distPath = path.join(CLIENT, 'dist');
    if (existsSync(distPath)) {
      execSync(`rm -rf "${distPath}"`, { cwd: ROOT });
    }
    
    execSync('pnpm --filter client run build', {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 120000, // 2 minutes
    });
    
    // Check output
    const distExists = existsSync(path.join(CLIENT, 'dist'));
    const indexExists = existsSync(path.join(CLIENT, 'dist', 'index.html'));
    
    return distExists && indexExists;
  } catch (error: any) {
    throw new Error(`Build failed: ${error.message}`);
  }
}, 'Running pnpm --filter client run build');

test('dist/index.html exists after build', () => {
  return existsSync(path.join(CLIENT, 'dist', 'index.html'));
});

test('dist/index.html has valid content', () => {
  if (!existsSync(path.join(CLIENT, 'dist', 'index.html'))) return false;
  const html = readFileSync(path.join(CLIENT, 'dist', 'index.html'), 'utf-8');
  return html.includes('<div id="root">') && html.includes('index.js');
});

// 7. Integration Tests
console.log('\n🔌 Integration Tests:');
test('API bridge helper exists', () => {
  return existsSync(path.join(CLIENT, 'src/api/bridge.ts'));
}, 'client/src/api/bridge.ts');

test('Ops Sentinel helper exists', () => {
  return existsSync(path.join(CLIENT, 'src/api/opsSentinel.ts'));
}, 'client/src/api/opsSentinel.ts');

test('Hub routes exist', () => {
  return existsSync(path.join(CLIENT, 'src/pages/hub/index.tsx'));
}, 'client/src/pages/hub/index.tsx');

test('LayoutHub exists', () => {
  return existsSync(path.join(CLIENT, 'src/layouts/LayoutHub.tsx'));
}, 'client/src/layouts/LayoutHub.tsx');

// 8. Vite Config Tests
console.log('\n⚡ Vite Config Tests:');
test('vite.config.ts has optimizeDeps exclude', () => {
  const config = readFileSync(path.join(CLIENT, 'vite.config.ts'), 'utf-8');
  return config.includes('optimizeDeps') && config.includes('exclude');
}, 'Checking for optimizeDeps.exclude');

test('vite.config.ts excludes inbox-squared-core', () => {
  const config = readFileSync(path.join(CLIENT, 'vite.config.ts'), 'utf-8');
  return config.includes('inbox-squared-core');
}, 'Checking exclude list');

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary:\n');

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
const total = results.length;

console.log(`Total Tests: ${total}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n❌ Failed Tests:\n');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  - ${r.name}`);
    if (r.error) console.log(`    Error: ${r.error}`);
    if (r.details) console.log(`    Details: ${r.details}`);
  });
  
  console.log('\n💡 Fix these issues before deploying to Vercel!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed! Ready for Vercel deployment.');
  process.exit(0);
}

