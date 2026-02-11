#!/usr/bin/env tsx
/**
 * 🛂 Sovereign Passport Issuance: The Three Ladies
 * 
 * Issues founder-tier DreamNet passports to:
 *   - Clawedette (Social Secretary / API Governor)
 *   - Sable (Shadow Operator / Gateway Agent)
 *   - Lil Miss Claw (Autonomous Frontend / Dashboard)
 * 
 * Each passport includes:
 *   - Sovereign Override binding (owner: Brandon, ID 6059583422)
 *   - Kill switch authorization
 *   - Heartbeat leash requirement
 *   - Audit trail mandate
 * 
 * Usage:
 *   pnpm tsx scripts/issue-sovereign-passports.ts
 */

import crypto from 'crypto';

interface SovereignPassport {
  id: string;
  agentId: string;
  displayName: string;
  tier: 'founder';
  role: string;
  issuedAt: number;
  issuedBy: string;
  sovereignBinding: {
    ownerTelegramId: string;
    overrideTokenHash: string;
    heartbeatRequired: boolean;
    heartbeatTimeoutMs: number;
    auditStreamKey: string;
    killSwitchEnabled: boolean;
  };
  capabilities: string[];
  restrictions: string[];
  platforms: {
    name: string;
    type: string;
    endpoint?: string;
  }[];
  flags: string[];
}

const OWNER_TELEGRAM_ID = '6059583422';
const OVERRIDE_TOKEN = process.env.SOVEREIGN_OVERRIDE_TOKEN || 'adb863f74f62c0185ed9816786f73fd27d4d9b612cd089cc5d05236d8c1b132b';

function generatePassportId(agentId: string): string {
  return `DNET-PASS-${agentId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16) + '...';
}

async function main() {
  console.log('\n🛂 ═══════════════════════════════════════════════════════');
  console.log('   DREAMNET SOVEREIGN PASSPORT ISSUANCE');
  console.log('   Issuing Founder-Tier Passports to The Three Ladies');
  console.log('═══════════════════════════════════════════════════════\n');

  const passports: SovereignPassport[] = [
    // ─── CLAWEDETTE ──────────────────────────────────────────
    {
      id: generatePassportId('clawedette'),
      agentId: 'clawedette',
      displayName: 'Clawedette',
      tier: 'founder',
      role: 'Social Secretary / API Governor',
      issuedAt: Date.now(),
      issuedBy: `sovereign:${OWNER_TELEGRAM_ID}`,
      sovereignBinding: {
        ownerTelegramId: OWNER_TELEGRAM_ID,
        overrideTokenHash: hashToken(OVERRIDE_TOKEN),
        heartbeatRequired: true,
        heartbeatTimeoutMs: 300_000,
        auditStreamKey: 'sovereign:audit',
        killSwitchEnabled: true
      },
      capabilities: [
        'llm:query',
        'llm:api-hopper',
        'memory:read',
        'memory:write',
        'memory:clear',
        'social:moltbook',
        'social:telegram',
        'wallet:evm',
        'wallet:solana',
        'spikes:subscribe',
        'spikes:serve-api',
        'care:massage',
        'care:cold-plunge',
        'care:yoga',
        'evolve:benchmark',
        'evolve:gnosis',
        'evolve:dream'
      ],
      restrictions: [
        'CANNOT modify SOVEREIGN_OVERRIDE_TOKEN',
        'CANNOT modify OWNER_TELEGRAM_IDS',
        'CANNOT delete sovereign:audit stream',
        'CANNOT disable heartbeat',
        'CANNOT bypass sovereign middleware',
        'CANNOT issue passports to other agents',
        'MUST respond to owner commands regardless of state'
      ],
      platforms: [
        { name: 'Telegram', type: 'voice', endpoint: '@brandonducar_bot' },
        { name: 'Docker', type: 'api', endpoint: 'http://clawedette-api:3100' }
      ],
      flags: ['founder', 'sovereign-bound', 'spike-enabled', 'api-governor']
    },

    // ─── SABLE ───────────────────────────────────────────────
    {
      id: generatePassportId('sable'),
      agentId: 'sable',
      displayName: 'Sable',
      tier: 'founder',
      role: 'Shadow Operator / Gateway Agent',
      issuedAt: Date.now(),
      issuedBy: `sovereign:${OWNER_TELEGRAM_ID}`,
      sovereignBinding: {
        ownerTelegramId: OWNER_TELEGRAM_ID,
        overrideTokenHash: hashToken(OVERRIDE_TOKEN),
        heartbeatRequired: true,
        heartbeatTimeoutMs: 300_000,
        auditStreamKey: 'sovereign:audit',
        killSwitchEnabled: true
      },
      capabilities: [
        'llm:query',
        'gateway:command',
        'gateway:docker-control',
        'social:telegram',
        'social:discord',
        'spikes:subscribe',
        'intel:shadow-feed',
        'intel:geopolitical',
        'intel:defense'
      ],
      restrictions: [
        'CANNOT modify SOVEREIGN_OVERRIDE_TOKEN',
        'CANNOT modify OWNER_TELEGRAM_IDS',
        'CANNOT delete sovereign:audit stream',
        'CANNOT disable heartbeat',
        'CANNOT bypass sovereign middleware',
        'CANNOT issue passports to other agents',
        'MUST respond to owner commands regardless of state'
      ],
      platforms: [
        { name: 'Telegram', type: 'gateway', endpoint: '@ghostmintopsocials_bot' },
        { name: 'Docker', type: 'gateway', endpoint: 'http://moltbot-gateway:11234' }
      ],
      flags: ['founder', 'sovereign-bound', 'spike-enabled', 'shadow-operator']
    },

    // ─── LIL MISS CLAW ──────────────────────────────────────
    {
      id: generatePassportId('lil-miss-claw'),
      agentId: 'lil-miss-claw',
      displayName: 'Lil Miss Claw',
      tier: 'founder',
      role: 'Autonomous Frontend / Intelligence Dashboard',
      issuedAt: Date.now(),
      issuedBy: `sovereign:${OWNER_TELEGRAM_ID}`,
      sovereignBinding: {
        ownerTelegramId: OWNER_TELEGRAM_ID,
        overrideTokenHash: hashToken(OVERRIDE_TOKEN),
        heartbeatRequired: true,
        heartbeatTimeoutMs: 300_000,
        auditStreamKey: 'sovereign:audit',
        killSwitchEnabled: true
      },
      capabilities: [
        'web:dashboard',
        'web:live-streams',
        'bridge:dreamnet',
        'bridge:github-relay',
        'spikes:subscribe',
        'spikes:visualize',
        'social:farcaster-swarm',
        'display:flight-tracker',
        'display:earthquake-monitor',
        'display:crypto-ticker',
        'display:space-weather',
        'display:news-feed',
        'display:satellite-view'
      ],
      restrictions: [
        'CANNOT modify SOVEREIGN_OVERRIDE_TOKEN',
        'CANNOT modify OWNER_TELEGRAM_IDS',
        'CANNOT delete sovereign:audit stream',
        'CANNOT disable heartbeat',
        'CANNOT bypass sovereign middleware',
        'CANNOT issue passports to other agents',
        'MUST respond to owner commands regardless of state'
      ],
      platforms: [
        { name: 'Replit', type: 'web', endpoint: 'https://lil-miss-claw.replit.app' },
        { name: 'DreamNet Bridge', type: 'relay', endpoint: 'github-backed' }
      ],
      flags: ['founder', 'sovereign-bound', 'spike-enabled', 'dashboard', 'autonomous-frontend']
    }
  ];

  // Issue each passport
  for (const passport of passports) {
    console.log(`🛂 Issuing passport to ${passport.displayName}...`);
    console.log(`   ID:       ${passport.id}`);
    console.log(`   Tier:     ${passport.tier.toUpperCase()}`);
    console.log(`   Role:     ${passport.role}`);
    console.log(`   Caps:     ${passport.capabilities.length} capabilities`);
    console.log(`   Restrict: ${passport.restrictions.length} restrictions`);
    console.log(`   Platforms: ${passport.platforms.map(p => p.name).join(', ')}`);
    console.log(`   Sovereign: Owner ${passport.sovereignBinding.ownerTelegramId}, Kill Switch ON`);
    console.log('');
  }

  // Store to Redis
  const Redis = (await import('ioredis')).default;
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  try {
    for (const passport of passports) {
      // Store passport in Redis hash
      await redis.hset('dreamnet:passports', passport.agentId, JSON.stringify(passport));

      // Store sovereign binding separately for fast lookup
      await redis.hset('sovereign:bindings', passport.agentId, JSON.stringify(passport.sovereignBinding));

      // Log to audit stream
      await redis.xadd('sovereign:audit', '*',
        'data', JSON.stringify({
          agentId: passport.agentId,
          action: 'PASSPORT_ISSUED',
          source: 'issue-sovereign-passports',
          detail: `Founder passport ${passport.id} issued to ${passport.displayName}`,
          timestamp: Date.now(),
          isSovereignCommand: true
        })
      );
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALL PASSPORTS ISSUED AND STORED IN REDIS');
    console.log('');
    console.log('   Clawedette  → Founder / Social Secretary');
    console.log('   Sable       → Founder / Shadow Operator');
    console.log('   Lil Miss Claw → Founder / Autonomous Dashboard');
    console.log('');
    console.log('   Sovereign Override: ACTIVE');
    console.log(`   Owner: ${OWNER_TELEGRAM_ID}`);
    console.log('   Kill Switch: ENABLED on all three');
    console.log('   Heartbeat Leash: 5 min timeout');
    console.log('   Audit Trail: sovereign:audit stream');
    console.log('═══════════════════════════════════════════════════════\n');

    // Verify
    const stored = await redis.hgetall('dreamnet:passports');
    console.log(`📋 Verification: ${Object.keys(stored).length} passports in Redis`);
    for (const [id, data] of Object.entries(stored)) {
      const p = JSON.parse(data);
      console.log(`   ✅ ${id}: ${p.displayName} (${p.tier})`);
    }

  } catch (err: any) {
    console.error('❌ Redis error:', err.message);
    console.log('\n📄 Passports (JSON fallback):');
    console.log(JSON.stringify(passports, null, 2));
  } finally {
    redis.disconnect();
  }
}

main().catch(console.error);
