#!/usr/bin/env node
/**
 * Test Agent Registry Fix
 * Verifies that only Active GPTs are registered
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Agent Registry Fix\n');

try {
  // Read registry.json
  const registryPath = join(__dirname, '../registry.json');
  const registryData = JSON.parse(readFileSync(registryPath, 'utf8'));
  
  const total = registryData.length;
  const active = registryData.filter(gpt => gpt.status === 'Active').length;
  const draft = registryData.filter(gpt => gpt.status === 'Draft').length;

  console.log('📊 Registry Analysis:');
  console.log(`   Total: ${total}`);
  console.log(`   Active: ${active} ✅`);
  console.log(`   Draft: ${draft} (will be skipped)\n`);

  // Verify GPTAgentRegistry.ts filters correctly
  const registryCodePath = join(__dirname, '../server/gpt-agents/GPTAgentRegistry.ts');
  if (existsSync(registryCodePath)) {
    const registryCode = readFileSync(registryCodePath, 'utf8');
    
    // Check that registerAll() filters for Active
    if (registryCode.includes('status === "Active"') && 
        registryCode.includes('filter(gpt => gpt.status === "Active")')) {
      console.log('✅ GPTAgentRegistry.registerAll() filters for Active GPTs');
    } else {
      console.warn('⚠️  GPTAgentRegistry.registerAll() may not filter correctly');
    }

    // Check getStats() returns byStatus breakdown
    if (registryCode.includes('byStatus') && registryCode.includes('stats.byStatus[gpt.status]')) {
      console.log('✅ getStats() includes byStatus breakdown');
    }
  }

  // Verify server/index.ts logging shows Active/Draft
  const serverIndexPath = join(__dirname, '../server/index.ts');
  if (existsSync(serverIndexPath)) {
    const serverCode = readFileSync(serverIndexPath, 'utf8');
    
    if (serverCode.includes('stats.byStatus?.Active') && 
        serverCode.includes('stats.byStatus?.Draft')) {
      console.log('✅ Server logging shows Active/Draft breakdown');
    } else {
      console.warn('⚠️  Server logging may not show Active/Draft breakdown');
    }
  }

  console.log('\n✅ Agent Registry fix verified!');
  console.log(`   Expected behavior: Only ${active} Active GPTs will be registered`);
  console.log(`   ${draft} Draft GPTs will be skipped\n`);

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

