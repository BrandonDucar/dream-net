/**
 * DreamNet Speaks Back
 * Let DreamNet provide recommendations and communicate with you
 */

import { config } from 'dotenv';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

const BASE_URL = process.env.DREAMNET_API_URL || 'https://dreamnet.ink';
const API_KEY = process.env.DREAMNET_API_KEY;

async function dreamnetSpeak(message: string) {
  if (!API_KEY) {
    console.error('❌ DREAMNET_API_KEY not set');
    console.log('💡 Get your API key from: https://dreamnet.ink/api/keys/default');
    process.exit(1);
  }

  try {
    // Use DreamNet's natural language interface
    const response = await fetch(`${BASE_URL}/api/chatgpt-agent/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DreamNet API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`Failed to communicate with DreamNet: ${error.message}`);
  }
}

async function getDreamNetRecommendations() {
  console.log('🤖 DreamNet is thinking...\n');

  try {
    // Ask DreamNet for recommendations
    const response = await dreamnetSpeak(
      'What recommendations do you have for improving DreamNet? What integrations or features would be most valuable?'
    );

    console.log('💬 DreamNet says:\n');
    console.log(`   ${response.message || 'No message'}\n`);

    if (response.actions && response.actions.length > 0) {
      console.log('📋 Suggested Actions:');
      response.actions.forEach((action: any, i: number) => {
        console.log(`   ${i + 1}. ${action.method} ${action.endpoint}`);
        if (action.description) {
          console.log(`      ${action.description}`);
        }
      });
      console.log('');
    }

    if (response.suggestions && response.suggestions.length > 0) {
      console.log('💡 Recommendations:');
      response.suggestions.forEach((suggestion: string, i: number) => {
        console.log(`   ${i + 1}. ${suggestion}`);
      });
      console.log('');
    }

    return response;
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Get system status first
async function getSystemStatus() {
  if (!API_KEY) return null;

  try {
    const response = await fetch(`${BASE_URL}/api/heartbeat`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Ignore errors
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const message = args.join(' ') || 'Hello DreamNet! What recommendations do you have?';

  console.log('🌐 Connecting to DreamNet...\n');

  // Get system status
  const status = await getSystemStatus();
  if (status) {
    console.log('✅ DreamNet is online\n');
  }

  // Let DreamNet speak
  await getDreamNetRecommendations();

  // If user provided a message, use it
  if (args.length > 0) {
    console.log(`\n💬 Your message: "${message}"\n`);
    const response = await dreamnetSpeak(message);
    console.log('💬 DreamNet responds:\n');
    console.log(`   ${JSON.stringify(response, null, 2)}\n`);
  }
}

main();

