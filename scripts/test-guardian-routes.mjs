#!/usr/bin/env node
/**
 * Test Guardian Routes
 * Verifies that Guardian routes handle uninitialized state correctly
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Guardian Routes\n');

try {
  const guardianRoutesPath = join(__dirname, '../server/routes/guardian.ts');
  if (!existsSync(guardianRoutesPath)) {
    console.error('❌ Guardian routes file not found');
    process.exit(1);
  }

  const routesContent = readFileSync(guardianRoutesPath, 'utf8');

  const routes = [
    { name: '/status', pattern: /router\.get\("\/status"[^]*?if \(!status\)/s },
    { name: '/shields/status', pattern: /router\.get\("\/shields\/status"[^]*?if \(!status\)/s },
    { name: '/dome/status', pattern: /router\.get\("\/dome\/status"[^]*?if \(!status\)/s },
    { name: '/drones', pattern: /router\.get\("\/drones"[^]*?if \(!status\)/s },
    { name: '/fleet/status', pattern: /router\.get\("\/fleet\/status"[^]*?if \(!status\)/s },
  ];

  console.log('🛣️  Checking Guardian Routes:');
  let allRoutesOk = true;

  for (const route of routes) {
    if (route.pattern.test(routesContent)) {
      console.log(`   ✅ ${route.name} - Has null check`);
    } else {
      console.log(`   ❌ ${route.name} - Missing null check`);
      allRoutesOk = false;
    }
  }

  // Check for 503 status code (Service Unavailable)
  if (routesContent.includes('res.status(503)')) {
    console.log('   ✅ Routes return 503 when uninitialized');
  } else {
    console.warn('   ⚠️  Routes may not return 503 status');
  }

  // Check GuardianFramework.getStatus() returns null
  const guardianFrameworkPath = join(__dirname, '../packages/guardian-framework-core/GuardianFramework.ts');
  if (existsSync(guardianFrameworkPath)) {
    const frameworkContent = readFileSync(guardianFrameworkPath, 'utf8');
    if (frameworkContent.includes('getStatus(): GuardianStatus | null')) {
      console.log('   ✅ getStatus() can return null');
    } else {
      console.warn('   ⚠️  getStatus() may not return null');
    }

    if (frameworkContent.includes('if (!this.initialized)') && 
        frameworkContent.includes('return null')) {
      console.log('   ✅ getStatus() checks initialization');
    }
  }

  if (allRoutesOk) {
    console.log('\n✅ All Guardian routes handle uninitialized state correctly!\n');
  } else {
    console.error('\n❌ Some routes need null checks\n');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

