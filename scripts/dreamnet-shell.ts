#!/usr/bin/env tsx
/**
 * DreamNet Shell - Natural Language Terminal Interface
 * 
 * Repurposes your terminal to understand natural language
 * Just type what you want - DreamNet figures it out
 * 
 * Usage: pnpm dreamnet:shell
 *        Or set as your default shell in Cursor
 */

import { createInterface } from 'readline';
import { execSync, spawn } from 'child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '💬 DreamNet > '
});

interface Command {
  intent: string[];
  action: (args?: string) => void | Promise<void>;
  description: string;
}

const commands: Command[] = [
  {
    intent: ['deploy', 'deploy to cloud run', 'go live', 'make it live', 'deploy now', 'ship it'],
    action: async () => {
      console.log('🚀 Deploying DreamNet to Cloud Run...\n');
      spawn('pnpm', ['deploy:now'], { stdio: 'inherit', shell: true });
    }
  },
  {
    intent: ['status', 'build status', 'what\'s happening', 'check build', 'build check', 'how\'s it going'],
    action: async () => {
      console.log('🔍 Checking build status...\n');
      execSync('pnpm check:build', { stdio: 'inherit' });
    }
  },
  {
    intent: ['verticals', 'show verticals', 'list verticals', 'what verticals', 'all verticals', 'show me everything'],
    action: async () => {
      console.log('🌐 DreamNet Verticals:\n');
      const verticals = [
        '🛡️  Military & Defense',
        '📺 OTT Streaming',
        '💎 Precious Metals',
        '🚀 Crypto Social',
        '🔬 Science & Research',
        '✈️  Travel',
        '🤖 Agent Foundry',
        '🌐 DreamNet Systems',
        '🏛️  DreamState Government',
        '👥 Pods & Packs',
        '⭐ DreamStar'
      ];
      verticals.forEach(v => console.log(`   ${v}`));
      console.log('\n💡 Access them at: dreamnet.ink/hub\n');
    }
  },
  {
    intent: ['domains', 'issue domains', 'create domains', 'get domains', 'make domains'],
    action: async () => {
      console.log('🎫 Issuing domains for all verticals...\n');
      execSync('pnpm issue:all-verticals', { stdio: 'inherit' });
    }
  },
  {
    intent: ['fix', 'fix build', 'fix dependencies', 'fix everything', 'repair'],
    action: async () => {
      console.log('🔧 Fixing build dependencies...\n');
      execSync('pnpm fix:build-deps', { stdio: 'inherit' });
    }
  },
  {
    intent: ['help', 'what can you do', 'commands', 'what commands', '?'],
    action: async () => {
      console.log('\n💬 DreamNet Natural Language Commands:\n');
      console.log('   "deploy" or "go live" - Deploy to Cloud Run');
      console.log('   "status" or "check build" - Check build status');
      console.log('   "verticals" or "show everything" - List all verticals');
      console.log('   "domains" - Issue domains for verticals');
      console.log('   "fix" - Fix build issues');
      console.log('   "help" - Show this help');
      console.log('\n💡 Just type what you want - DreamNet understands!\n');
    }
  },
  {
    intent: ['clear', 'cls'],
    action: async () => {
      console.clear();
    }
  },
  {
    intent: ['exit', 'quit', 'bye'],
    action: async () => {
      console.log('\n👋 See you later!\n');
      process.exit(0);
    }
  }
];

function findCommand(input: string): Command | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Check for exact matches first
  for (const cmd of commands) {
    if (cmd.intent.some(intent => lowerInput === intent || lowerInput.startsWith(intent))) {
      return cmd;
    }
  }
  
  // Check for partial matches
  for (const cmd of commands) {
    if (cmd.intent.some(intent => lowerInput.includes(intent))) {
      return cmd;
    }
  }
  
  return null;
}

function handleInput(input: string) {
  const trimmed = input.trim();
  
  if (!trimmed) {
    rl.prompt();
    return;
  }

  const command = findCommand(trimmed);

  if (command) {
    console.log(`\n🎯 DreamNet understood: "${trimmed}"\n`);
    Promise.resolve(command.action()).then(() => {
      console.log('');
      rl.prompt();
    }).catch((error) => {
      console.error(`\n❌ Error: ${error.message}\n`);
      rl.prompt();
    });
  } else {
    // Try to execute as regular command
    console.log(`\n💭 DreamNet didn't understand that. Trying as regular command...\n`);
    try {
      execSync(trimmed, { stdio: 'inherit' });
      console.log('');
    } catch (error: any) {
      console.log(`\n❌ Command failed. Try: "help" to see what DreamNet can do\n`);
    }
    rl.prompt();
  }
}

console.log('\n' + '='.repeat(70));
console.log('💬 DreamNet Natural Language Shell');
console.log('='.repeat(70));
console.log('\n💡 Just type what you want - no commands to memorize!');
console.log('   Try: "deploy", "status", "verticals", "help"\n');
console.log('💡 Or type regular terminal commands - DreamNet will try them too\n');

rl.prompt();

rl.on('line', (input) => {
  handleInput(input);
});

rl.on('close', () => {
  console.log('\n👋 DreamNet shell closed. See you later!\n');
  process.exit(0);
});

