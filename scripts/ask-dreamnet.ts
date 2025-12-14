/**
 * Ask DreamNet How It's Doing
 * Actually talk to DreamNet and see what it thinks
 */

import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

const BASE_URL = process.env.DREAMNET_API_URL || 'https://dreamnet.ink';

async function checkDreamNetHealth() {
  console.log('🏥 Checking DreamNet\'s health...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/heartbeat`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('💬 DreamNet says:\n');
      console.log(`   Status: ${data.status || 'unknown'}\n`);
      
      if (data.timestamp) {
        console.log(`   Last heartbeat: ${new Date(data.timestamp).toLocaleString()}\n`);
      }
      
      if (data.version) {
        console.log(`   Version: ${data.version}\n`);
      }
      
      if (data.systems) {
        console.log('   Systems Status:');
        Object.entries(data.systems).forEach(([name, status]: [string, any]) => {
          const icon = status === 'healthy' || status === 'active' ? '✅' : status === 'warning' ? '⚠️' : '❌';
          console.log(`   ${icon} ${name}: ${status}`);
        });
        console.log('');
      }
      
      if (data.cores) {
        console.log('   Core Systems:');
        Object.entries(data.cores).forEach(([name, info]: [string, any]) => {
          const status = info?.status || info?.healthy ? '✅' : '⚠️';
          console.log(`   ${status} ${name}`);
        });
        console.log('');
      }
      
      return data;
    } else {
      console.log(`   ⚠️  DreamNet responded with status: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not reach DreamNet: ${error.message}`);
    console.log('   (DreamNet might be running locally or not deployed yet)');
    return null;
  }
}

async function askDreamNetDirectly() {
  const apiKey = process.env.DREAMNET_API_KEY;
  
  if (!apiKey) {
    console.log('💡 No API key set - using public endpoints only\n');
    return;
  }

  console.log('💬 Having a conversation with DreamNet...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/chatgpt-agent/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'How are you doing? How do you think everything is going? What\'s your assessment of the current state?',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      console.log('🤖 DreamNet\'s Response:\n');
      
      if (data.message) {
        console.log(`   "${data.message}"\n`);
      }
      
      if (data.understood !== undefined) {
        console.log(`   Understood: ${data.understood ? '✅' : '❌'}\n`);
      }
      
      if (data.suggestions && data.suggestions.length > 0) {
        console.log('   💡 Suggestions:');
        data.suggestions.forEach((s: string, i: number) => {
          console.log(`      ${i + 1}. ${s}`);
        });
        console.log('');
      }
      
      if (data.actions && data.actions.length > 0) {
        console.log('   🎯 Recommended Actions:');
        data.actions.forEach((a: any, i: number) => {
          console.log(`      ${i + 1}. ${a.method} ${a.endpoint}`);
          if (a.description) {
            console.log(`         ${a.description}`);
          }
        });
        console.log('');
      }
      
      if (data.data) {
        console.log('   📊 Data:');
        console.log(`      ${JSON.stringify(data.data, null, 2).split('\n').join('\n      ')}`);
        console.log('');
      }
    } else {
      const error = await response.text();
      console.log(`   ⚠️  DreamNet chat error: ${response.status} ${error}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not chat with DreamNet: ${error.message}`);
  }
}

async function main() {
  console.log('🤖 Checking in with DreamNet...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Check health first
  const health = await checkDreamNetHealth();
  
  // Try to have a conversation
  await askDreamNetDirectly();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (health) {
    console.log('✅ DreamNet is responsive and online!\n');
  } else {
    console.log('⚠️  DreamNet might be running locally or not deployed yet\n');
  }
}

main();

