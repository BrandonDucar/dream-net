#!/usr/bin/env tsx
/**
 * DreamNet Natural Language CLI
 * 
 * Talk to DreamNet like you're texting - no terminal commands needed
 * 
 * Usage: pnpm dreamnet "deploy to cloud run"
 *        pnpm dreamnet "what's the build status?"
 *        pnpm dreamnet "show me all verticals"
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

interface Command {
  intent: string[];
  action: () => void | Promise<void>;
  description: string;
}

const commands: Command[] = [
  {
    intent: ['deploy', 'deploy to cloud run', 'go live', 'make it live', 'deploy now'],
    action: async () => {
      console.log('🚀 Deploying DreamNet to Cloud Run...\n');
      execSync('pnpm deploy:now', { stdio: 'inherit' });
    },
    description: 'Deploy DreamNet to Cloud Run'
  },
  {
    intent: ['status', 'build status', 'what\'s happening', 'check build', 'build check'],
    action: async () => {
      console.log('🔍 Checking build status...\n');
      execSync('pnpm check:build', { stdio: 'inherit' });
    },
    description: 'Check build and deployment status'
  },
  {
    intent: ['verticals', 'show verticals', 'list verticals', 'what verticals', 'all verticals'],
    action: async () => {
      console.log('🌐 DreamNet Verticals:\n');
      const verticals = [
        'Military & Defense',
        'OTT Streaming',
        'Precious Metals',
        'Crypto Social',
        'Science & Research',
        'Travel',
        'Agent Foundry',
        'DreamNet Systems',
        'DreamState Government',
        'Pods & Packs',
        'DreamStar'
      ];
      verticals.forEach((v, i) => console.log(`   ${i + 1}. ${v}`));
      console.log('\n💡 Access them at: dreamnet.ink/hub');
    },
    description: 'List all DreamNet verticals'
  },
  {
    intent: ['domains', 'issue domains', 'create domains', 'get domains'],
    action: async () => {
      console.log('🎫 Issuing domains for all verticals...\n');
      execSync('pnpm issue:all-verticals', { stdio: 'inherit' });
    },
    description: 'Issue .dream domains for all verticals'
  },
  {
    intent: ['fix', 'fix build', 'fix dependencies', 'fix everything'],
    action: async () => {
      console.log('🔧 Fixing build dependencies...\n');
      execSync('pnpm fix:build-deps', { stdio: 'inherit' });
    },
    description: 'Fix build dependency issues'
  },
  {
    intent: ['help', 'what can you do', 'commands', 'what commands'],
    action: async () => {
      console.log('💬 DreamNet Natural Language Commands:\n');
      commands.forEach(cmd => {
        console.log(`   "${cmd.intent[0]}" - ${cmd.description}`);
      });
      console.log('\n💡 Just talk to DreamNet naturally - no commands to memorize!');
    },
    description: 'Show available commands'
  }
];

async function main() {
  const input = process.argv.slice(2).join(' ').toLowerCase().trim();

  if (!input) {
    console.log('💬 DreamNet CLI - Talk to DreamNet naturally\n');
    console.log('Examples:');
    console.log('   pnpm dreamnet "deploy to cloud run"');
    console.log('   pnpm dreamnet "what\'s the build status?"');
    console.log('   pnpm dreamnet "show me all verticals"');
    console.log('\n💡 Just say what you want - DreamNet understands!\n');
    return;
  }

  // Find matching command
  const command = commands.find(cmd => 
    cmd.intent.some(intent => input.includes(intent))
  );

  if (command) {
    console.log(`\n💬 You said: "${input}"`);
    console.log(`🎯 DreamNet understood: ${command.description}\n`);
    await command.action();
  } else {
    console.log(`\n💬 You said: "${input}"`);
    console.log('🤔 DreamNet didn\'t understand that command.');
    console.log('\n💡 Try:');
    console.log('   - "deploy to cloud run"');
    console.log('   - "check build status"');
    console.log('   - "show verticals"');
    console.log('   - "issue domains"');
    console.log('   - "help"');
  }
}

main().catch(console.error);

