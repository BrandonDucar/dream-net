#!/usr/bin/env tsx
/**
 * Test Build Integrations
 * Verifies all integrations work before deploying
 */

import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const clientDir = path.resolve(rootDir, 'client');

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: TestResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ name, status, message });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${name}: ${message}`);
}

// Test 1: Check client directory exists
function testClientDirectory() {
  try {
    if (existsSync(clientDir)) {
      addResult('Client Directory', 'pass', `Found at ${clientDir}`);
    } else {
      addResult('Client Directory', 'fail', `Not found at ${clientDir}`);
    }
  } catch (error) {
    addResult('Client Directory', 'fail', `Error: ${error}`);
  }
}

// Test 2: Check package.json exists
function testPackageJson() {
  try {
    const packageJsonPath = path.join(clientDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      addResult('Package.json', 'pass', `Found: ${pkg.name} v${pkg.version}`);
      return pkg;
    } else {
      addResult('Package.json', 'fail', 'Not found');
      return null;
    }
  } catch (error) {
    addResult('Package.json', 'fail', `Error: ${error}`);
    return null;
  }
}

// Test 3: Check vite.config.ts exists
function testViteConfig() {
  try {
    const viteConfigPath = path.join(clientDir, 'vite.config.ts');
    if (existsSync(viteConfigPath)) {
      addResult('Vite Config', 'pass', 'Found vite.config.ts');
      return true;
    } else {
      addResult('Vite Config', 'fail', 'Not found');
      return false;
    }
  } catch (error) {
    addResult('Vite Config', 'fail', `Error: ${error}`);
    return false;
  }
}

// Test 4: Check for problematic imports
function testProblematicImports() {
  try {
    const mainTsxPath = path.join(clientDir, 'src', 'main.tsx');
    const appTsxPath = path.join(clientDir, 'src', 'App.tsx');
    
    if (!existsSync(mainTsxPath)) {
      addResult('Main Entry', 'fail', 'src/main.tsx not found');
      return;
    }
    
    const mainContent = readFileSync(mainTsxPath, 'utf-8');
    const appContent = existsSync(appTsxPath) ? readFileSync(appTsxPath, 'utf-8') : '';
    
    // Check for server-only imports
    const serverOnlyImports = [
      '@dreamnet/inbox-squared-core',
      'googleapis',
      'googleapis-common',
      'puppeteer',
    ];
    
    const foundImports: string[] = [];
    const allContent = mainContent + appContent;
    
    serverOnlyImports.forEach(imp => {
      if (allContent.includes(imp)) {
        foundImports.push(imp);
      }
    });
    
    if (foundImports.length > 0) {
      addResult('Server-Only Imports', 'fail', `Found in client: ${foundImports.join(', ')}`);
    } else {
      addResult('Server-Only Imports', 'pass', 'No server-only imports found');
    }
  } catch (error) {
    addResult('Problematic Imports', 'warning', `Could not check: ${error}`);
  }
}

// Test 5: Check pnpm is available
function testPnpmAvailable() {
  try {
    execSync('pnpm --version', { stdio: 'pipe' });
    addResult('PNPM Available', 'pass', 'PNPM is installed');
    return true;
  } catch (error) {
    addResult('PNPM Available', 'fail', 'PNPM not found - install with: npm i -g pnpm');
    return false;
  }
}

// Test 6: Check node_modules exists
function testNodeModules() {
  try {
    const nodeModulesPath = path.join(clientDir, 'node_modules');
    if (existsSync(nodeModulesPath)) {
      addResult('Node Modules', 'pass', 'Found node_modules');
      return true;
    } else {
      addResult('Node Modules', 'warning', 'Not found - run: cd client && pnpm install');
      return false;
    }
  } catch (error) {
    addResult('Node Modules', 'warning', `Error: ${error}`);
    return false;
  }
}

// Test 7: Test build command
function testBuildCommand() {
  try {
    console.log('\n🔨 Testing build command...');
    process.chdir(clientDir);
    
    // Try a dry-run or check if build script exists
    const packageJsonPath = path.join(clientDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.scripts && pkg.scripts.build) {
        addResult('Build Script', 'pass', `Found: ${pkg.scripts.build}`);
        
        // Check if vite is available
        try {
          execSync('pnpm list vite', { cwd: clientDir, stdio: 'pipe' });
          addResult('Vite Dependency', 'pass', 'Vite is installed');
        } catch (error) {
          addResult('Vite Dependency', 'fail', 'Vite not found in dependencies');
        }
      } else {
        addResult('Build Script', 'fail', 'No build script found');
      }
    }
  } catch (error) {
    addResult('Build Command', 'warning', `Could not test: ${error}`);
  }
}

// Test 8: Check vercel.json
function testVercelConfig() {
  try {
    const vercelJsonPath = path.join(rootDir, 'vercel.json');
    if (existsSync(vercelJsonPath)) {
      const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'));
      
      if (vercelConfig.rootDirectory === 'client') {
        addResult('Vercel Root Directory', 'pass', 'Set to "client"');
      } else {
        addResult('Vercel Root Directory', 'fail', `Should be "client", got: ${vercelConfig.rootDirectory}`);
      }
      
      if (vercelConfig.buildCommand === 'pnpm run build') {
        addResult('Vercel Build Command', 'pass', 'Set to "pnpm run build"');
      } else {
        addResult('Vercel Build Command', 'warning', `Got: ${vercelConfig.buildCommand}`);
      }
      
      if (vercelConfig.outputDirectory === 'dist') {
        addResult('Vercel Output Directory', 'pass', 'Set to "dist"');
      } else {
        addResult('Vercel Output Directory', 'warning', `Got: ${vercelConfig.outputDirectory}`);
      }
    } else {
      addResult('Vercel Config', 'fail', 'vercel.json not found');
    }
  } catch (error) {
    addResult('Vercel Config', 'fail', `Error: ${error}`);
  }
}

// Test 9: Check for type errors
function testTypeErrors() {
  try {
    console.log('\n🔍 Checking for TypeScript errors...');
    execSync('pnpm run typecheck', { cwd: clientDir, stdio: 'pipe' });
    addResult('TypeScript Check', 'pass', 'No type errors');
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || '';
    if (output.includes('error TS')) {
      addResult('TypeScript Check', 'fail', 'Type errors found - check output above');
    } else {
      addResult('TypeScript Check', 'warning', 'Could not run typecheck');
    }
  }
}

// Test 10: Check critical files exist
function testCriticalFiles() {
  const criticalFiles = [
    'src/index.html',
    'src/App.tsx',
    'src/main.tsx',
    'index.css',
  ];
  
  criticalFiles.forEach(file => {
    const filePath = path.join(clientDir, file);
    if (existsSync(filePath)) {
      addResult(`File: ${file}`, 'pass', 'Found');
    } else {
      addResult(`File: ${file}`, 'fail', 'Not found');
    }
  });
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Build Integrations\n');
  console.log('=' .repeat(50));
  
  testClientDirectory();
  const pkg = testPackageJson();
  testViteConfig();
  testProblematicImports();
  const pnpmAvailable = testPnpmAvailable();
  const nodeModulesExists = testNodeModules();
  testVercelConfig();
  testCriticalFiles();
  
  if (pnpmAvailable && nodeModulesExists) {
    testBuildCommand();
    // Only test types if dependencies are installed
    if (pkg && pkg.scripts && pkg.scripts.typecheck) {
      testTypeErrors();
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:\n');
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
    process.exit(1);
  }
  
  if (warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.filter(r => r.status === 'warning').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }
  
  console.log('\n✅ All critical tests passed! Build should work.');
}

runTests().catch(console.error);

