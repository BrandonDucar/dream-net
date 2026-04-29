import 'dotenv/config';
import express from 'express';
import Redis from 'ioredis';
import { initDatabase, storeSignal, createSnapshot, getSignalVelocity, getTopAuthors, getTopicTrends } from './database';
import { detectCyclicalPatterns, findGoldNuggets, generateUserTasks, trackUserEngagement, getUserEngagementStats } from './analytics';
import { startShitSifter, addShitSifterEndpoints } from './shit-sifter';
import { ingestUniversalData, createUniversalIngestionBridge, initializeUniversalSchema } from './universal-data-hub';
import { bridges, databaseHelpers, routeToDatabase, batchIngest, initializeDatabaseBridges } from './database-bridges';
import { spawn } from 'child_process';
import { promisify } from 'util';

const app = express();

// CORS — allow mini app frontends to call this API
app.use((_req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  if (_req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

const PORT = Number(process.env.PORT || 3203);
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_BASE = 'https://api.neynar.com/v2/farcaster';
const POLL_INTERVAL = Number(process.env.POLL_INTERVAL_MS || 900_000); // 15m default
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434';
const REPUTATION_URL = process.env.REPUTATION_URL || 'http://clawedette_api:3100';
const BUS_URL = process.env.BUS_URL || 'http://message-bus:3202';

// ─── Agent Identity: HAWK ─────────────────────────────────────────────
const AGENT_ID = 'hawk';
const AGENT_IDENTITY = {
  id: AGENT_ID,
  name: 'Hawk',
  role: 'Farcaster Intelligence Agent',
  description: 'Scans Farcaster for high-signal builder content, scores casts, generates AI summaries, and enforces trust-gated actions.',
  container: 'dreamnet_signal_screener',
  port: PORT,
  capabilities: ['cast-ingestion', 'scoring', 'ai-summarization', 'trust-gating', 'monetization', 'topic-analysis'],
  tier: 5,
  registered_at: Date.now(),
};

const redis = new Redis(REDIS_URL);

// Export redis for use in analytics module
export { redis };

// Create universal data bridge for Hawk
const universalBridge = createUniversalIngestionBridge('hawk');

// ─── Types ───────────────────────────────────────────────────────────

interface Cast {
  hash: string;
  author: {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    power_badge: boolean;
    follower_count: number;
    following_count: number;
    verified_addresses?: { eth_addresses: string[]; sol_addresses: string[] };
    verified_accounts?: { platform: string; username: string }[];
    profile?: { bio?: { text?: string }; location?: { address?: { city?: string; country?: string; state?: string } } };
    score?: number; // neynar_user_score
  };
  text: string;
  timestamp: string;
  embeds: any[];
  channel?: { id: string; name: string };
  reactions: { likes_count: number; recasts_count: number };
  replies: { count: number };
  mentioned_profiles: any[];
}

interface CastScore {
  hash: string;
  fid: number;
  score_total: number;
  velocity: number;
  quality: number;
  builder_intent: number;
  network_quality: number;
  anti_hype_penalty: number;
  freshness: number;
  topics: string[];
  entities: string[];
  summary: string;
  why_it_matters: string;
  actionables: string[];
  spam_risk: number;
  scored_at: number;
}

interface AccountScore {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  score_total: number;
  trust_tier: number; // 0-5
  topic_authority: string[];
  power_badge: boolean;
  verified_github: boolean;
  verified_x: boolean;
  verified_wallets: string[];
  consistency: number;
  updated_at: number;
}

interface ActionDecision {
  allow: boolean;
  tier_required: number;
  current_tier: number;
  reason: string;
  cooldown_ms: number;
}

// ─── Config ──────────────────────────────────────────────────────────

const CHANNELS = ['base', 'build', 'dev', 'zora', 'farcaster', 'ai'];

const TOPIC_TAXONOMY: Record<string, string[]> = {
  'base-infra': ['base', 'l2', 'rollup', 'sequencer', 'eip', 'op stack', 'superchain', 'blob'],
  'base-consumer': ['consumer', 'social app', 'nft', 'marketplace', 'wallet', 'onboarding'],
  'onchain-social': ['farcaster', 'lens', 'warpcast', 'channel', 'cast', 'frame', 'mini app', 'social graph'],
  'ai-devtools': ['ai', 'llm', 'agent', 'mcp', 'cursor', 'copilot', 'model', 'inference', 'fine-tune', 'rag', 'embedding'],
  'security': ['audit', 'vulnerability', 'exploit', 'bug bounty', 'security', 'hack', 'rug', 'scam'],
  'tooling': ['sdk', 'api', 'library', 'framework', 'cli', 'devtool', 'package', 'npm', 'wagmi', 'viem', 'ethers'],
  'growth': ['growth', 'marketing', 'community', 'adoption', 'onboard', 'retention', 'viral'],
  'grants': ['grant', 'funding', 'retroactive', 'rpgf', 'proposal', 'dao', 'treasury', 'bounty'],
};

const BUILDER_KEYWORDS = [
  'shipped', 'launched', 'deployed', 'demo', 'mainnet', 'testnet', 'audit',
  'grant', 'pr', 'commit', 'merge', 'release', 'v1', 'v2', 'beta', 'alpha',
  'open source', 'github', 'repo', 'docs', 'sdk', 'api', 'built', 'building',
  'waitlist', 'live', 'announcing', 'introducing', 'just shipped', 'new feature',
];

const SHILL_PATTERNS = [
  /🚀{3,}/g, /to the moon/gi, /100x/gi, /guaranteed/gi, /not financial advice/gi,
  /buy now/gi, /last chance/gi, /airdrop.*claim/gi, /free money/gi,
  /dm me for/gi, /link in bio/gi, /follow.*follow back/gi,
];

// ─── Action Policy (Trust-Gated) ────────────────────────────────────

const ACTION_POLICIES: Record<string, { min_tier: number; cooldown_ms: number; description: string }> = {
  'notify':              { min_tier: 0, cooldown_ms: 0,          description: 'Send internal notification' },
  'summarize':           { min_tier: 0, cooldown_ms: 0,          description: 'Generate internal summary' },
  'publish_internal':    { min_tier: 0, cooldown_ms: 0,          description: 'Publish to internal feed' },
  'draft_post':          { min_tier: 1, cooldown_ms: 60_000,     description: 'Auto-generate public post draft' },
  'draft_outreach':      { min_tier: 2, cooldown_ms: 300_000,    description: 'Draft outreach DM' },
  'auto_follow':         { min_tier: 4, cooldown_ms: 3_600_000,  description: 'Auto-follow account (RESTRICTED)' },
  'auto_like':           { min_tier: 4, cooldown_ms: 3_600_000,  description: 'Auto-like cast (RESTRICTED)' },
  'auto_dm':             { min_tier: 5, cooldown_ms: 86_400_000, description: 'Send automated DM (RESTRICTED, human review)' },
  'auto_recast':         { min_tier: 5, cooldown_ms: 86_400_000, description: 'Auto-recast (RESTRICTED, human review)' },
};

const RATE_LIMITS: Record<string, { per_hour: number; per_day: number }> = {
  'notify':           { per_hour: 100, per_day: 500 },
  'summarize':        { per_hour: 50,  per_day: 200 },
  'publish_internal': { per_hour: 30,  per_day: 100 },
  'draft_post':       { per_hour: 10,  per_day: 30 },
  'draft_outreach':   { per_hour: 5,   per_day: 15 },
  'auto_follow':      { per_hour: 2,   per_day: 10 },
  'auto_like':        { per_hour: 5,   per_day: 20 },
  'auto_dm':          { per_hour: 1,   per_day: 3 },
  'auto_recast':      { per_hour: 1,   per_day: 5 },
};

// ─── Neynar API Client ──────────────────────────────────────────────

async function neynarGet(path: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${NEYNAR_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': NEYNAR_API_KEY, 'accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Neynar ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

async function publishCast(text: string, parentHash?: string): Promise<any> {
  try {
    const res = await fetch(`${NEYNAR_BASE}/cast`, {
      method: 'POST',
      headers: {
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        parent_author_fid: parentHash ? undefined : undefined, // Simplify for now
        signer_uuid: process.env.NEYNAR_SIGNER_UUID,
      }),
    });
    if (!res.ok) throw new Error(`Neynar publish failed: ${res.status}`);
    return res.json();
  } catch (e: any) {
    console.error(`⚠️ [Screener] Failed to publish cast: ${e.message}`);
    return null;
  }
}

async function fetchTrendingCasts(limit = 25): Promise<Cast[]> {
  try {
    const data = await neynarGet('/feed', {
      feed_type: 'filter',
      filter_type: 'global_trending',
      limit: String(limit),
    });
    return data.casts || [];
  } catch (e: any) {
    console.error(`⚠️ [Screener] Trending fetch failed: ${e.message}`);
    return [];
  }
}

async function fetchChannelCasts(channel: string, limit = 25): Promise<Cast[]> {
  try {
    const data = await neynarGet('/feed/channels', {
      channel_ids: channel,
      limit: String(limit),
    });
    return data.casts || [];
  } catch (e: any) {
    console.error(`⚠️ [Screener] Channel ${channel} fetch failed: ${e.message}`);
    return [];
  }
}

async function searchCasts(query: string, limit = 25): Promise<Cast[]> {
  try {
    const data = await neynarGet('/cast/search', { q: query, limit: String(limit) });
    return data.result?.casts || [];
  } catch (e: any) {
    console.error(`⚠️ [Screener] Search "${query}" failed: ${e.message}`);
    return [];
  }
}

async function fetchUsersBulk(fids: number[]): Promise<any[]> {
  if (fids.length === 0) return [];
  try {
    const data = await neynarGet('/user/bulk', { fids: fids.join(',') });
    return data.users || [];
  } catch (e: any) {
    console.error(`⚠️ [Screener] Bulk user fetch failed: ${e.message}`);
    return [];
  }
}

// ─── Scoring Engine ──────────────────────────────────────────────────

function computeVelocity(cast: Cast): number {
  const ageMs = Date.now() - new Date(cast.timestamp).getTime();
  const ageHours = Math.max(ageMs / 3_600_000, 0.1);
  const engagement = cast.reactions.likes_count + cast.reactions.recasts_count * 2 + cast.replies.count * 3;
  const velocity = engagement / ageHours;
  return Math.min(velocity * 5, 100);
}

function computeBuilderIntent(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of BUILDER_KEYWORDS) {
    if (lower.includes(kw)) score += 8;
  }
  // Bonus for links (repos, docs, demos)
  if (/github\.com/i.test(text)) score += 15;
  if (/\.dev|\.app|\.xyz|\.io/i.test(text)) score += 5;
  if (/docs\.|documentation/i.test(text)) score += 10;
  // Bonus for screenshots/images
  return Math.min(score, 100);
}

function computeAntiHypePenalty(text: string): number {
  let penalty = 0;
  for (const pattern of SHILL_PATTERNS) {
    if (pattern.test(text)) penalty += 15;
    pattern.lastIndex = 0; // reset regex state
  }
  // Excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / Math.max(text.length, 1);
  if (capsRatio > 0.5 && text.length > 20) penalty += 20;
  // Very short low-effort
  if (text.length < 30) penalty += 10;
  return Math.min(penalty, 100);
}

function computeNetworkQuality(cast: Cast): number {
  let score = 0;
  if (cast.author.power_badge) score += 30;
  if ((cast.author.score || 0) > 0.7) score += 25;
  if (cast.author.follower_count > 1000) score += 15;
  if (cast.author.verified_accounts?.some(a => a.platform === 'x')) score += 10;
  if ((cast.author.verified_addresses?.eth_addresses?.length || 0) > 0) score += 10;
  // GitHub verification
  const bio = cast.author.profile?.bio?.text || '';
  if (/github/i.test(bio)) score += 10;
  return Math.min(score, 100);
}

function computeFreshness(cast: Cast): number {
  const ageHours = (Date.now() - new Date(cast.timestamp).getTime()) / 3_600_000;
  if (ageHours < 1) return 100;
  if (ageHours < 6) return 80;
  if (ageHours < 24) return 60;
  if (ageHours < 72) return 30;
  return 10;
}

function extractTopics(text: string): string[] {
  const lower = text.toLowerCase();
  const topics: string[] = [];
  for (const [topic, keywords] of Object.entries(TOPIC_TAXONOMY)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) { topics.push(topic); break; }
    }
  }
  return topics.length > 0 ? topics : ['general'];
}

function extractEntities(text: string): string[] {
  const entities: string[] = [];
  // Extract @mentions
  const mentions = text.match(/@[\w.-]+/g);
  if (mentions) entities.push(...mentions.slice(0, 5));
  // Extract URLs/domains
  const urls = text.match(/https?:\/\/[^\s)]+/g);
  if (urls) {
    for (const u of urls.slice(0, 3)) {
      try { entities.push(new URL(u).hostname); } catch {}
    }
  }
  // Extract $tokens
  const tokens = text.match(/\$[A-Z]{2,10}/g);
  if (tokens) entities.push(...tokens.slice(0, 3));
  return [...new Set(entities)];
}

function scoreCast(cast: Cast): CastScore {
  const velocity = computeVelocity(cast);
  const quality = computeNetworkQuality(cast);
  const builder_intent = computeBuilderIntent(cast.text);
  const anti_hype_penalty = computeAntiHypePenalty(cast.text);
  const freshness = computeFreshness(cast);
  const network_quality = quality;

  // Weighted total
  const raw = (
    velocity * 0.25 +
    quality * 0.20 +
    builder_intent * 0.25 +
    freshness * 0.10 +
    network_quality * 0.20
  ) - anti_hype_penalty * 0.5;

  const score_total = Math.max(0, Math.min(100, Math.round(raw)));
  const topics = extractTopics(cast.text);
  const entities = extractEntities(cast.text);

  return {
    hash: cast.hash,
    fid: cast.author.fid,
    score_total,
    velocity: Math.round(velocity),
    quality: Math.round(quality),
    builder_intent: Math.round(builder_intent),
    network_quality: Math.round(network_quality),
    anti_hype_penalty: Math.round(anti_hype_penalty),
    freshness: Math.round(freshness),
    topics,
    entities,
    summary: '',
    why_it_matters: '',
    actionables: [],
    spam_risk: Math.round(anti_hype_penalty),
    scored_at: Date.now(),
  };
}

// ─── Account Scoring ─────────────────────────────────────────────────

function scoreAccount(user: any): AccountScore {
  let score = 0;
  const power = user.power_badge === true;
  const neynarScore = user.experimental?.neynar_user_score || user.score || 0;
  const verifiedX = user.verified_accounts?.some((a: any) => a.platform === 'x') || false;
  const verifiedGithub = /github/i.test(user.profile?.bio?.text || '');
  const wallets = user.verified_addresses?.eth_addresses || [];

  if (power) score += 25;
  score += Math.round(neynarScore * 30);
  if (verifiedX) score += 10;
  if (verifiedGithub) score += 15;
  if (wallets.length > 0) score += 10;
  if (user.follower_count > 5000) score += 10;

  score = Math.min(100, score);

  // Map to trust tier (0-5)
  let trust_tier = 0;
  if (score >= 80) trust_tier = 5;
  else if (score >= 65) trust_tier = 4;
  else if (score >= 50) trust_tier = 3;
  else if (score >= 35) trust_tier = 2;
  else if (score >= 20) trust_tier = 1;

  return {
    fid: user.fid,
    username: user.username || '',
    display_name: user.display_name || '',
    pfp_url: user.pfp_url || '',
    score_total: score,
    trust_tier,
    topic_authority: [],
    power_badge: power,
    verified_github: verifiedGithub,
    verified_x: verifiedX,
    verified_wallets: wallets,
    consistency: 0,
    updated_at: Date.now(),
  };
}

// ─── AI Summarization (Ollama) ───────────────────────────────────────

async function aiSummarize(cast: Cast, castScore: CastScore): Promise<{ summary: string; why_it_matters: string; actionables: string[] }> {
  const prompt = `You are a Farcaster builder signal analyst. Analyze this cast and respond with ONLY valid JSON.

Cast by @${cast.author.username} (${cast.author.display_name}):
"${cast.text}"

Channel: ${cast.channel?.name || 'none'}
Engagement: ${cast.reactions.likes_count} likes, ${cast.reactions.recasts_count} recasts, ${cast.replies.count} replies
Topics detected: ${castScore.topics.join(', ')}
Signal score: ${castScore.score_total}/100

Respond with this exact JSON format:
{"summary":"1-2 sentence summary","why_it_matters":"1-2 sentence context + implications","actionables":["action1","action2"]}`;

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3.2', prompt, stream: false, format: 'json' }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.response);
    return {
      summary: parsed.summary || '',
      why_it_matters: parsed.why_it_matters || '',
      actionables: parsed.actionables || [],
    };
  } catch (e: any) {
    // Fallback: rule-based summary
    const topics = castScore.topics.join(', ');
    return {
      summary: `@${cast.author.username} posted about ${topics} with a signal score of ${castScore.score_total}/100.`,
      why_it_matters: castScore.builder_intent > 50
        ? 'High builder intent detected — this appears to be a genuine build signal.'
        : 'Moderate signal — worth monitoring for follow-up activity.',
      actionables: cast.author.power_badge ? ['Follow this builder', 'Watch this topic'] : ['Monitor for follow-up'],
    };
  }
}

// ─── evaluate_action() — Trust-Gated Actions ────────────────────────

async function evaluateAction(
  subject: { type: 'fid' | 'wallet' | 'domain'; id: string },
  action: string,
  context: { channel?: string; topic?: string; signal_score?: number } = {}
): Promise<ActionDecision> {
  const policy = ACTION_POLICIES[action];
  if (!policy) {
    return { allow: false, tier_required: -1, current_tier: 0, reason: `Unknown action: ${action}`, cooldown_ms: 0 };
  }

  // Get subject trust tier
  let current_tier = 0;
  if (subject.type === 'fid') {
    const stored = await redis.get(`screener:account:${subject.id}`);
    if (stored) {
      const account: AccountScore = JSON.parse(stored);
      current_tier = account.trust_tier;
    }
  }

  // Check tier requirement
  if (current_tier < policy.min_tier) {
    return {
      allow: false,
      tier_required: policy.min_tier,
      current_tier,
      reason: `Trust tier ${current_tier} < required ${policy.min_tier} for "${action}" (${policy.description})`,
      cooldown_ms: 0,
    };
  }

  // Check rate limits
  const limits = RATE_LIMITS[action];
  if (limits) {
    const hourKey = `screener:rate:${action}:hour:${Math.floor(Date.now() / 3_600_000)}`;
    const dayKey = `screener:rate:${action}:day:${new Date().toISOString().slice(0, 10)}`;
    const [hourCount, dayCount] = await Promise.all([
      redis.get(hourKey).then(v => Number(v || 0)),
      redis.get(dayKey).then(v => Number(v || 0)),
    ]);
    if (hourCount >= limits.per_hour) {
      return {
        allow: false, tier_required: policy.min_tier, current_tier,
        reason: `Hourly rate limit reached (${hourCount}/${limits.per_hour}) for "${action}"`,
        cooldown_ms: 3_600_000 - (Date.now() % 3_600_000),
      };
    }
    if (dayCount >= limits.per_day) {
      return {
        allow: false, tier_required: policy.min_tier, current_tier,
        reason: `Daily rate limit reached (${dayCount}/${limits.per_day}) for "${action}"`,
        cooldown_ms: 86_400_000 - (Date.now() % 86_400_000),
      };
    }
  }

  // Check cooldown
  if (policy.cooldown_ms > 0) {
    const lastKey = `screener:cooldown:${action}:${subject.id}`;
    const lastTs = Number(await redis.get(lastKey) || 0);
    const elapsed = Date.now() - lastTs;
    if (elapsed < policy.cooldown_ms) {
      return {
        allow: false, tier_required: policy.min_tier, current_tier,
        reason: `Cooldown active: ${Math.ceil((policy.cooldown_ms - elapsed) / 1000)}s remaining for "${action}" on ${subject.id}`,
        cooldown_ms: policy.cooldown_ms - elapsed,
      };
    }
  }

  // ALLOW — record the action
  const pipeline = redis.pipeline();
  const hourKey = `screener:rate:${action}:hour:${Math.floor(Date.now() / 3_600_000)}`;
  const dayKey = `screener:rate:${action}:day:${new Date().toISOString().slice(0, 10)}`;
  pipeline.incr(hourKey);
  pipeline.expire(hourKey, 7200);
  pipeline.incr(dayKey);
  pipeline.expire(dayKey, 172800);
  if (policy.cooldown_ms > 0) {
    const lastKey = `screener:cooldown:${action}:${subject.id}`;
    pipeline.set(lastKey, String(Date.now()), 'EX', Math.ceil(policy.cooldown_ms / 1000));
  }
  await pipeline.exec();

  // Log to audit
  await redis.lpush('screener:audit', JSON.stringify({
    ts: Date.now(), subject, action, context, decision: 'allow', tier: current_tier,
  }));
  await redis.ltrim('screener:audit', 0, 9999);

  return {
    allow: true,
    tier_required: policy.min_tier,
    current_tier,
    reason: `Action "${action}" allowed for tier ${current_tier} subject ${subject.id}`,
    cooldown_ms: 0,
  };
}

// ─── Ingestion Pipeline ──────────────────────────────────────────────

const stats = {
  total_casts_ingested: 0,
  total_scored: 0,
  total_high_signal: 0,
  total_accounts: 0,
  last_poll: 0,
  polls_completed: 0,
  ai_summaries: 0,
  actions_evaluated: 0,
  actions_allowed: 0,
  actions_denied: 0,
};

async function ingestAndScore(): Promise<void> {
  console.log('📡 [Screener] Starting ingestion cycle...');
  const allCasts: Cast[] = [];

  // 1. Fetch trending
  const trending = await fetchTrendingCasts(25);
  allCasts.push(...trending);

  // 2. Fetch from each channel
  for (const ch of CHANNELS) {
    const casts = await fetchChannelCasts(ch, 15);
    allCasts.push(...casts);
    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  // 3. Deduplicate by hash
  const seen = new Set<string>();
  const unique: Cast[] = [];
  for (const c of allCasts) {
    if (!seen.has(c.hash)) {
      seen.add(c.hash);
      unique.push(c);
    }
  }

  console.log(`📡 [Screener] Fetched ${unique.length} unique casts (${allCasts.length} raw)`);
  stats.total_casts_ingested += unique.length;

  // 4. Score each cast
  const scored: CastScore[] = [];
  for (const cast of unique) {
    const castScore = scoreCast(cast);
    scored.push(castScore);

    // Store raw cast
    await redis.set(`screener:cast:${cast.hash}`, JSON.stringify(cast), 'EX', 604800); // 7 days
    // Store score
    await redis.set(`screener:score:${cast.hash}`, JSON.stringify(castScore), 'EX', 604800);
  }

  stats.total_scored += scored.length;

  // 5. Sort by score, take top signals
  scored.sort((a, b) => b.score_total - a.score_total);
  const highSignal = scored.filter(s => s.score_total >= 40);
  stats.total_high_signal += highSignal.length;

  // 6. AI summarize top 10
  const topForAI = highSignal.slice(0, 10);
  for (const castScore of topForAI) {
    const rawCast = await redis.get(`screener:cast:${castScore.hash}`);
    if (!rawCast) continue;
    const cast: Cast = JSON.parse(rawCast);
    const ai = await aiSummarize(cast, castScore);
    castScore.summary = ai.summary;
    castScore.why_it_matters = ai.why_it_matters;
    castScore.actionables = ai.actionables;
    await redis.set(`screener:score:${castScore.hash}`, JSON.stringify(castScore), 'EX', 604800);
    stats.ai_summaries++;
  }

  // 7. Score unique accounts
  const fidSet = new Set(unique.map(c => c.author.fid));
  const fids = [...fidSet];
  if (fids.length > 0) {
    // Batch in groups of 100
    for (let i = 0; i < fids.length; i += 100) {
      const batch = fids.slice(i, i + 100);
      const users = await fetchUsersBulk(batch);
      for (const user of users) {
        const account = scoreAccount(user);
        // Compute topic authority from their scored casts
        const userScores = scored.filter(s => s.fid === user.fid);
        const topicCounts: Record<string, number> = {};
        for (const s of userScores) {
          for (const t of s.topics) topicCounts[t] = (topicCounts[t] || 0) + 1;
        }
        account.topic_authority = Object.entries(topicCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([t]) => t);

        await redis.set(`screener:account:${user.fid}`, JSON.stringify(account), 'EX', 604800);
        stats.total_accounts++;
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // 8. Update leaderboards in Redis sorted sets
  for (const s of scored) {
    await redis.zadd('screener:leaderboard:casts', s.score_total, s.hash);
    for (const topic of s.topics) {
      await redis.zadd(`screener:topic:${topic}`, s.score_total, s.hash);
      await redis.expire(`screener:topic:${topic}`, 604800);
    }
  }
  await redis.expire('screener:leaderboard:casts', 604800);

  // 9. Publish high signals to Message Bus
  for (const s of highSignal.slice(0, 20)) {
    try {
      await fetch(`${BUS_URL}/api/bus/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'signal.new',
          from: 'signal-screener',
          to: '*',
          payload: { hash: s.hash, score: s.score_total, topics: s.topics, summary: s.summary },
          priority: s.score_total >= 80 ? 'high' : 'normal',
        }),
      });
    } catch {}
  }

  // 10. Store ALL signals in database for history (not just high-signal)
  for (const s of scored) {
    try {
      const rawCast = await redis.get(`screener:cast:${s.hash}`);
      if (!rawCast) continue;
      const cast: Cast = JSON.parse(rawCast);
      
      await storeSignal({
        hash: cast.hash,
        author_fid: cast.author.fid,
        author_username: cast.author.username,
        author_display_name: cast.author.display_name,
        author_pfp_url: cast.author.pfp_url,
        author_power_badge: false, // TODO: Get from user data
        text: cast.text,
        score: s.score_total,
        breakdown: {
          score_total: s.score_total,
          velocity: s.velocity,
          quality: s.quality,
          builder_intent: s.builder_intent,
          network_quality: s.network_quality,
          anti_hype_penalty: s.anti_hype_penalty,
          freshness: s.freshness,
        },
        topics: s.topics,
        summary: s.summary || '',
        why_it_matters: s.why_it_matters || '',
        actionables: s.actionables || [],
        likes: cast.reactions.likes_count,
        recasts: cast.reactions.recasts_count,
        replies: cast.replies.count,
        timestamp: new Date(cast.timestamp),
        channel: undefined, // TODO: Extract from cast data structure
      });
      
      // Also track in universal hub
      await universalBridge.trackMessage(cast, 'farcaster');
    } catch (err) {
      // Don't fail the whole process if DB storage fails
      console.warn('⚠️ [Screener] Failed to store signal in DB:', err);
    }
  }

  // 11. Create periodic snapshot for trend analysis
  try {
    const velocity = await getSignalVelocity(1); // Last hour
    const topAuthors = await getTopAuthors(7, 10);
    const topicTrends = await getTopicTrends(7);
    
    await createSnapshot({
      total_signals: highSignal.length,
      avg_score: highSignal.reduce((sum, s) => sum + s.score_total, 0) / highSignal.length,
      topic_counts: topicTrends.reduce((acc, t) => ({ ...acc, [t.topic]: parseInt(t.signal_count) }), {}),
      top_topics: topicTrends.slice(0, 10).map(t => t.topic),
      pulse_velocity: velocity,
      pulse_trend: velocity > 10 ? 'up' : velocity < 5 ? 'down' : 'stable',
      metadata: {
        total_ingested: unique.length,
        total_scored: scored.length,
        ai_summarized: topForAI.length,
        top_authors: topAuthors.slice(0, 5),
      },
    });
  } catch (err) {
    console.warn('⚠️ [Screener] Failed to create snapshot:', err);
  }

  stats.last_poll = Date.now();
  stats.polls_completed++;
  console.log(`✅ [Screener] Cycle done: ${unique.length} casts, ${highSignal.length} high-signal, ${topForAI.length} AI-summarized`);

  // 12. Social Activation: If high signal exists, publish a summary to resume presence
  if (highSignal.length > 0 && stats.polls_completed % 4 === 0) { // Every 1 hour
    const best = highSignal[0];
    const postText = `📢 DreamNet Intel: High signal detected in ${best.topics[0]}.\n\n"${best.summary}"\n\nIntelligence score: ${best.score_total}/100. Swarm active.`;
    await publishCast(postText);
    console.log('📣 [Social Activation] Published intelligence report to Farcaster.');
  }
}

// ─── REST API ────────────────────────────────────────────────────────

// Health
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'signal-screener',
    has_api_key: !!NEYNAR_API_KEY,
    ...stats,
    uptime: process.uptime(),
  });
});

// Top signals (feed)
app.get('/api/signals', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const topic = req.query.topic as string;
  const min_score = Number(req.query.min_score || 0);

  let hashes: string[];
  if (topic) {
    hashes = await redis.zrevrange(`screener:topic:${topic}`, 0, limit - 1);
  } else {
    hashes = await redis.zrevrange('screener:leaderboard:casts', 0, limit - 1);
  }

  const signals: any[] = [];
  for (const hash of hashes) {
    const [scoreRaw, castRaw] = await Promise.all([
      redis.get(`screener:score:${hash}`),
      redis.get(`screener:cast:${hash}`),
    ]);
    if (!scoreRaw || !castRaw) continue;
    const score: CastScore = JSON.parse(scoreRaw);
    if (score.score_total < min_score) continue;
    const cast: Cast = JSON.parse(castRaw);
    signals.push({
      hash: cast.hash,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
        display_name: cast.author.display_name,
        pfp_url: cast.author.pfp_url,
        power_badge: cast.author.power_badge,
      },
      text: cast.text,
      timestamp: cast.timestamp,
      channel: cast.channel?.name || null,
      engagement: {
        likes: cast.reactions.likes_count,
        recasts: cast.reactions.recasts_count,
        replies: cast.replies.count,
      },
      score: score.score_total,
      breakdown: {
        velocity: score.velocity,
        quality: score.quality,
        builder_intent: score.builder_intent,
        network_quality: score.network_quality,
        anti_hype_penalty: score.anti_hype_penalty,
        freshness: score.freshness,
      },
      topics: score.topics,
      entities: score.entities,
      summary: score.summary,
      why_it_matters: score.why_it_matters,
      actionables: score.actionables,
      spam_risk: score.spam_risk,
    });
  }

  res.json({ signals, count: signals.length, topic: topic || 'all' });
});

// Topics list with signal counts
app.get('/api/topics', async (_req, res) => {
  const topics: any[] = [];
  for (const topic of Object.keys(TOPIC_TAXONOMY)) {
    const count = await redis.zcard(`screener:topic:${topic}`);
    const top = await redis.zrevrange(`screener:topic:${topic}`, 0, 0, 'WITHSCORES');
    topics.push({
      topic,
      keywords: TOPIC_TAXONOMY[topic],
      signal_count: count,
      top_score: top.length >= 2 ? Number(top[1]) : 0,
    });
  }
  topics.sort((a, b) => b.signal_count - a.signal_count);
  res.json({ topics });
});

// Builder profile
app.get('/api/builders/:fid', async (req, res) => {
  const fid = req.params.fid;
  const stored = await redis.get(`screener:account:${fid}`);
  if (!stored) return res.status(404).json({ error: 'Builder not found' });

  const account: AccountScore = JSON.parse(stored);

  // Get their top casts
  const allHashes = await redis.zrevrange('screener:leaderboard:casts', 0, 499);
  const builderCasts: any[] = [];
  for (const hash of allHashes) {
    const scoreRaw = await redis.get(`screener:score:${hash}`);
    if (!scoreRaw) continue;
    const score: CastScore = JSON.parse(scoreRaw);
    if (score.fid === Number(fid)) {
      builderCasts.push({ hash, score: score.score_total, topics: score.topics, summary: score.summary });
      if (builderCasts.length >= 10) break;
    }
  }

  res.json({ account, top_signals: builderCasts });
});

// Builder leaderboard
app.get('/api/builders', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 25), 100);
  // Scan all account keys
  const keys = await redis.keys('screener:account:*');
  const accounts: AccountScore[] = [];
  for (const key of keys) {
    const raw = await redis.get(key);
    if (raw) accounts.push(JSON.parse(raw));
  }
  accounts.sort((a, b) => b.score_total - a.score_total);
  res.json({ builders: accounts.slice(0, limit), total: accounts.length });
});

// Trending: "What changed today?"
app.get('/api/trending', async (_req, res) => {
  const topHashes = await redis.zrevrange('screener:leaderboard:casts', 0, 9, 'WITHSCORES');
  const topSignals: any[] = [];
  for (let i = 0; i < topHashes.length; i += 2) {
    const hash = topHashes[i];
    const score = Number(topHashes[i + 1]);
    const scoreRaw = await redis.get(`screener:score:${hash}`);
    const castRaw = await redis.get(`screener:cast:${hash}`);
    if (!scoreRaw || !castRaw) continue;
    const s: CastScore = JSON.parse(scoreRaw);
    const c: Cast = JSON.parse(castRaw);
    topSignals.push({
      hash, score,
      author: c.author.username,
      text: c.text.slice(0, 200),
      topics: s.topics,
      summary: s.summary,
    });
  }

  // Rising topics
  const topicStats: any[] = [];
  for (const topic of Object.keys(TOPIC_TAXONOMY)) {
    const count = await redis.zcard(`screener:topic:${topic}`);
    topicStats.push({ topic, count });
  }
  topicStats.sort((a, b) => b.count - a.count);

  res.json({
    top_signals: topSignals,
    rising_topics: topicStats.slice(0, 5),
    total_signals: await redis.zcard('screener:leaderboard:casts'),
    last_poll: stats.last_poll ? new Date(stats.last_poll).toISOString() : null,
  });
});

// evaluate_action endpoint
app.post('/api/evaluate', async (req, res) => {
  const { subject, action, context } = req.body;
  if (!subject || !action) return res.status(400).json({ error: 'subject and action required' });
  stats.actions_evaluated++;
  const decision = await evaluateAction(subject, action, context || {});
  if (decision.allow) stats.actions_allowed++;
  else stats.actions_denied++;
  res.json(decision);
});

// Action policies reference
app.get('/api/policies', (_req, res) => {
  const policies = Object.entries(ACTION_POLICIES).map(([action, p]) => ({
    action,
    ...p,
    rate_limits: RATE_LIMITS[action] || null,
  }));
  res.json({ policies });
});

// Watchlist management
app.post('/api/watchlist', async (req, res) => {
  const { user_id, fids, keywords, alert_threshold } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const watchlist = {
    user_id,
    fids: fids || [],
    keywords: keywords || [],
    alert_threshold: alert_threshold || 60,
    updated_at: Date.now(),
  };
  await redis.set(`screener:watchlist:${user_id}`, JSON.stringify(watchlist), 'EX', 2592000); // 30 days
  res.json({ ok: true, watchlist });
});

app.get('/api/watchlist/:user_id', async (req, res) => {
  const raw = await redis.get(`screener:watchlist:${req.params.user_id}`);
  if (!raw) return res.status(404).json({ error: 'No watchlist found' });
  res.json(JSON.parse(raw));
});

// Search signals
app.get('/api/search', async (req, res) => {
  const q = (req.query.q as string || '').toLowerCase();
  if (!q) return res.status(400).json({ error: 'q parameter required' });

  const limit = Math.min(Number(req.query.limit || 25), 100);
  const allHashes = await redis.zrevrange('screener:leaderboard:casts', 0, 499);
  const results: any[] = [];

  for (const hash of allHashes) {
    if (results.length >= limit) break;
    const castRaw = await redis.get(`screener:cast:${hash}`);
    const scoreRaw = await redis.get(`screener:score:${hash}`);
    if (!castRaw || !scoreRaw) continue;
    const cast: Cast = JSON.parse(castRaw);
    const score: CastScore = JSON.parse(scoreRaw);
    if (
      cast.text.toLowerCase().includes(q) ||
      cast.author.username.toLowerCase().includes(q) ||
      score.topics.some(t => t.includes(q)) ||
      score.entities.some(e => e.toLowerCase().includes(q))
    ) {
      results.push({
        hash, score: score.score_total,
        author: cast.author.username,
        text: cast.text.slice(0, 200),
        topics: score.topics,
        summary: score.summary,
      });
    }
  }

  res.json({ query: q, results, count: results.length });
});

// Audit log
app.get('/api/audit', async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const entries = await redis.lrange('screener:audit', 0, limit - 1);
  res.json({ entries: entries.map(e => JSON.parse(e)), count: entries.length });
});

// Stats
app.get('/api/stats', (_req, res) => {
  res.json(stats);
});

// Force poll (manual trigger)
app.post('/api/poll', async (_req, res) => {
  res.json({ ok: true, message: 'Ingestion cycle triggered' });
  ingestAndScore().catch(e => console.error('⚠️ [Screener] Manual poll error:', e.message));
});

// ─── Monetization ────────────────────────────────────────────────────

const LMC_CONTRACT = '0x53e77A6b6180b1A5bBA2F732667eA11853DCE550';
const LMC_CHAIN = 'base';

const SUBSCRIPTION_TIERS = [
  {
    id: 'free', name: 'Free', price_usd: 0, price_lmc: 0,
    features: ['Top 10 signals/day', 'Basic topic view', '1 watchlist slot', 'Public builder profiles'],
    limits: { signals_per_day: 10, watchlist_slots: 1, api_calls_per_day: 0 },
  },
  {
    id: 'builder', name: 'Builder', price_usd: 0, price_lmc: 100,
    features: ['Full signal feed', 'All topic hubs', '10 watchlist slots', 'AI summaries', 'Builder profiles', 'Export reports'],
    limits: { signals_per_day: -1, watchlist_slots: 10, api_calls_per_day: 100 },
  },
  {
    id: 'pro', name: 'Pro', price_usd: 5, price_lmc: 1000,
    features: ['Everything in Builder', 'Real-time alerts', 'Competitive intel', 'Trend graphs', 'API access (1K/day)', 'Webhooks', 'Priority notifications'],
    limits: { signals_per_day: -1, watchlist_slots: 50, api_calls_per_day: 1000 },
  },
  {
    id: 'operator', name: 'Operator', price_usd: 20, price_lmc: 5000,
    features: ['Everything in Pro', 'Bulk API (10K/day)', 'White-label embeds', 'Custom scoring weights', 'Dedicated support', 'Multi-app management'],
    limits: { signals_per_day: -1, watchlist_slots: -1, api_calls_per_day: 10000 },
  },
];

// Get subscription tiers
app.get('/api/monetization/tiers', (_req: any, res: any) => {
  res.json({
    tiers: SUBSCRIPTION_TIERS,
    lmc_token: { contract: LMC_CONTRACT, chain: LMC_CHAIN },
    note: 'Hold $LMC tokens as alternative to USD subscription',
  });
});

// Set subscription for a user (admin/payment webhook)
app.post('/api/monetization/subscribe', async (req: any, res: any) => {
  const { subject_type, subject_id, tier, expires_at } = req.body;
  if (!subject_id || !tier) return res.status(400).json({ error: 'subject_id and tier required' });
  const validTier = SUBSCRIPTION_TIERS.find(t => t.id === tier);
  if (!validTier) return res.status(400).json({ error: `Invalid tier: ${tier}` });

  const key = `talon:signal-screener:sub:${subject_type || 'fid'}:${subject_id}`;
  const sub = { tier, set_at: Date.now(), expires_at: expires_at || 0, tier_details: validTier };
  await redis.set(key, JSON.stringify(sub), 'EX', expires_at ? Math.ceil((expires_at - Date.now()) / 1000) : 2592000);
  res.json({ ok: true, subscription: sub });
});

// Get subscription for a user
app.get('/api/monetization/subscription/:subject_id', async (req: any, res: any) => {
  const key = `talon:signal-screener:sub:fid:${req.params.subject_id}`;
  const raw = await redis.get(key);
  if (!raw) return res.json({ tier: 'free', tier_details: SUBSCRIPTION_TIERS[0] });
  res.json(JSON.parse(raw));
});

// Update $LMC balance (called by external poller or bridge)
app.post('/api/monetization/lmc-balance', async (req: any, res: any) => {
  const { subject_id, balance } = req.body;
  if (!subject_id || balance === undefined) return res.status(400).json({ error: 'subject_id and balance required' });
  await redis.set(`talon:lmc:${subject_id}`, String(balance), 'EX', 3600);

  // Auto-resolve subscription tier from balance
  let resolved_tier = 'free';
  if (balance >= 5000) resolved_tier = 'operator';
  else if (balance >= 1000) resolved_tier = 'pro';
  else if (balance >= 100) resolved_tier = 'builder';

  if (resolved_tier !== 'free') {
    const tierDef = SUBSCRIPTION_TIERS.find(t => t.id === resolved_tier);
    const key = `talon:signal-screener:sub:fid:${subject_id}`;
    await redis.set(key, JSON.stringify({ tier: resolved_tier, set_at: Date.now(), source: 'lmc_token_gate', tier_details: tierDef }), 'EX', 3600);
  }

  res.json({ ok: true, subject_id, balance, resolved_tier });
});

// Talon gate endpoint — universal action gate for this mini app
app.post('/api/talon/gate', async (req: any, res: any) => {
  const { subject, action, context } = req.body;
  if (!subject || !action) return res.status(400).json({ error: 'subject and action required' });

  // Resolve identity
  const subKey = `talon:signal-screener:sub:${subject.type || 'fid'}:${subject.id}`;
  const subRaw = await redis.get(subKey);
  const subscription = subRaw ? JSON.parse(subRaw).tier : 'free';

  // Resolve trust tier from account score
  let trust_tier = 0;
  const accountRaw = await redis.get(`screener:account:${subject.id}`);
  if (accountRaw) {
    const account = JSON.parse(accountRaw);
    trust_tier = account.trust_tier || 0;
  }

  // Check action policy
  const policy = ACTION_POLICIES[action];
  if (!policy) return res.json({ allow: false, reason: `Unknown action: ${action}`, trust_tier, subscription });

  // Tier check
  if (trust_tier < policy.min_tier) {
    return res.json({ allow: false, reason: `Trust tier ${trust_tier} < required ${policy.min_tier}`, trust_tier, subscription });
  }

  // Subscription check for premium features
  const subLevel = (s: string) => ({ operator: 4, pro: 3, builder: 2, free: 1 }[s] || 0);
  const tierMap: Record<string, string> = {
    'draft_post': 'builder', 'draft_outreach': 'pro', 'auto_follow': 'pro',
    'auto_like': 'pro', 'auto_dm': 'operator', 'auto_recast': 'operator',
  };
  const requiredSub = tierMap[action];
  if (requiredSub && subLevel(subscription) < subLevel(requiredSub)) {
    return res.json({ allow: false, reason: `Requires "${requiredSub}" subscription (current: "${subscription}")`, trust_tier, subscription });
  }

  stats.actions_evaluated++;
  stats.actions_allowed++;
  res.json({ allow: true, trust_tier, subscription, action, reason: `Allowed for tier ${trust_tier}, sub: ${subscription}` });
});

// ─── Farcaster Publisher (Hawk Auto-Post) ────────────────────────────

const SIGNER_UUID = process.env.FARCASTER_SIGNER_UUID || 'f0bcaed3-f2fd-4303-abdb-a86a7bb5a86d';
const PUBLISH_INTERVAL = Number(process.env.PUBLISH_INTERVAL_MS || 3_600_000); // 1hr default
const PUBLISH_CHANNEL = process.env.PUBLISH_CHANNEL || 'https://warpcast.com/~/channel/base';
let lastPublishTime = 0;
let publishCount = 0;

interface CastPublishRequest {
  text: string;
  embeds?: { url: string }[];
  channel_id?: string;
  parent?: string; // parent cast hash for replies
}

async function publishCast(req: CastPublishRequest): Promise<{ success: boolean; hash?: string; error?: string }> {
  if (!NEYNAR_API_KEY) return { success: false, error: 'No Neynar API key' };

  try {
    const body: any = {
      signer_uuid: SIGNER_UUID,
      text: req.text,
    };
    if (req.embeds && req.embeds.length > 0) body.embeds = req.embeds;
    if (req.channel_id) body.channel_id = req.channel_id;
    if (req.parent) body.parent = req.parent;

    const res = await fetch(`${NEYNAR_BASE}/cast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api_key': NEYNAR_API_KEY },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`🦅 [Hawk] Publish failed: ${res.status} ${err}`);
      return { success: false, error: `${res.status}: ${err}` };
    }

    const data = await res.json();
    const hash = data.cast?.hash || 'unknown';
    publishCount++;
    lastPublishTime = Date.now();
    console.log(`🦅 [Hawk] Published cast: ${hash}`);

    // Audit
    await redis.lpush('hawk:publish:audit', JSON.stringify({
      ts: Date.now(), hash, text: req.text.slice(0, 100), embeds: req.embeds?.length || 0,
    }));
    await redis.ltrim('hawk:publish:audit', 0, 999);

    return { success: true, hash };
  } catch (e: any) {
    console.error(`🦅 [Hawk] Publish error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// Generate a signal report text from top signals
async function generateSignalReport(): Promise<{ text: string; embeds: { url: string }[] }> {
  const topHashes = await redis.zrevrange('screener:leaderboard:casts', 0, 4);
  if (topHashes.length === 0) return { text: '', embeds: [] };

  const signals: { author: string; score: number; text: string; topics: string[]; hash: string }[] = [];
  for (const hash of topHashes) {
    const [scoreRaw, castRaw] = await Promise.all([
      redis.get(`screener:score:${hash}`),
      redis.get(`screener:cast:${hash}`),
    ]);
    if (!scoreRaw || !castRaw) continue;
    const score: CastScore = JSON.parse(scoreRaw);
    const cast: Cast = JSON.parse(castRaw);
    signals.push({
      author: `@${cast.author.username}`,
      score: score.score_total,
      text: cast.text.slice(0, 80),
      topics: score.topics,
      hash: cast.hash,
    });
  }

  if (signals.length === 0) return { text: '', embeds: [] };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' });

  let text = `🦅 Hawk Signal Report — ${timeStr} ET\n\n`;
  text += `Top ${signals.length} builder signals right now:\n\n`;

  for (let i = 0; i < signals.length; i++) {
    const s = signals[i];
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '▪️';
    text += `${medal} ${s.author} (${s.score}/100)\n`;
    text += `"${s.text}..."\n`;
    text += `Topics: ${s.topics.join(', ')}\n\n`;
  }

  text += `Powered by DreamNet • $LMC token gate live`;

  // Embed links to top casts on Warpcast
  const embeds = signals.slice(0, 2).map(s => ({
    url: `https://warpcast.com/~/conversations/${s.hash}`,
  }));

  return { text, embeds };
}

// Auto-publish signal report on schedule
async function autoPublishReport(): Promise<void> {
  const report = await generateSignalReport();
  if (!report.text) {
    console.log('🦅 [Hawk] No signals to report, skipping publish');
    return;
  }

  // Truncate to Farcaster's 1024 char limit
  const text = report.text.length > 1024 ? report.text.slice(0, 1020) + '...' : report.text;

  const result = await publishCast({
    text,
    embeds: report.embeds,
    channel_id: 'base',
  });

  if (result.success) {
    console.log(`🦅 [Hawk] Signal report published: ${result.hash}`);
  } else {
    console.log(`🦅 [Hawk] Signal report failed: ${result.error}`);
  }
}

// ─── Telegram Publisher ──────────────────────────────────────────────

const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';       // group chat
const TG_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || ''; // public channel
const TG_API = 'https://api.telegram.org/bot';

interface TelegramPublishRequest {
  text: string;
  chat_id?: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  photo_url?: string;
  document_url?: string;
  reply_to?: number;
  disable_preview?: boolean;
}

async function publishTelegram(req: TelegramPublishRequest): Promise<{ success: boolean; message_id?: number; error?: string }> {
  if (!TG_BOT_TOKEN) return { success: false, error: 'No Telegram bot token' };
  const chatId = req.chat_id || TG_CHANNEL_ID || TG_CHAT_ID;
  if (!chatId) return { success: false, error: 'No Telegram chat/channel ID configured' };

  try {
    let endpoint: string;
    let body: any;

    if (req.photo_url) {
      // Send photo with caption
      endpoint = `${TG_API}${TG_BOT_TOKEN}/sendPhoto`;
      body = {
        chat_id: chatId,
        photo: req.photo_url,
        caption: req.text.slice(0, 1024),
        parse_mode: req.parse_mode || 'HTML',
      };
    } else if (req.document_url) {
      // Send document
      endpoint = `${TG_API}${TG_BOT_TOKEN}/sendDocument`;
      body = {
        chat_id: chatId,
        document: req.document_url,
        caption: req.text.slice(0, 1024),
        parse_mode: req.parse_mode || 'HTML',
      };
    } else {
      // Send text message
      endpoint = `${TG_API}${TG_BOT_TOKEN}/sendMessage`;
      body = {
        chat_id: chatId,
        text: req.text,
        parse_mode: req.parse_mode || 'HTML',
        disable_web_page_preview: req.disable_preview || false,
      };
    }

    if (req.reply_to) body.reply_to_message_id = req.reply_to;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error(`📱 [Hawk→TG] Publish failed: ${data.description}`);
      return { success: false, error: data.description };
    }

    const msgId = data.result?.message_id;
    console.log(`📱 [Hawk→TG] Published message ${msgId} to ${chatId}`);

    await redis.lpush('hawk:telegram:audit', JSON.stringify({
      ts: Date.now(), message_id: msgId, chat_id: chatId, text: req.text.slice(0, 100),
      has_photo: !!req.photo_url, has_doc: !!req.document_url,
    }));
    await redis.ltrim('hawk:telegram:audit', 0, 999);

    return { success: true, message_id: msgId };
  } catch (e: any) {
    console.error(`📱 [Hawk→TG] Error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// ─── Discord Publisher ───────────────────────────────────────────────

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || '';
const DISCORD_API = 'https://discord.com/api/v10';

interface DiscordPublishRequest {
  content: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
  channel_id?: string;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  url?: string;
  image?: { url: string };
  thumbnail?: { url: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
}

async function publishDiscord(req: DiscordPublishRequest): Promise<{ success: boolean; message_id?: string; error?: string }> {
  try {
    // Prefer webhook (simpler, no bot permissions needed)
    if (DISCORD_WEBHOOK_URL) {
      const body: any = {
        content: req.content.slice(0, 2000),
        username: req.username || '🦅 Hawk — DreamNet Signal Intelligence',
        avatar_url: req.avatar_url || 'https://i.imgur.com/hawk-dreamnet.png',
      };
      if (req.embeds && req.embeds.length > 0) body.embeds = req.embeds;

      const res = await fetch(`${DISCORD_WEBHOOK_URL}?wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`🎮 [Hawk→DC] Webhook failed: ${res.status} ${err}`);
        return { success: false, error: `${res.status}: ${err}` };
      }

      const data = await res.json();
      console.log(`🎮 [Hawk→DC] Published via webhook: ${data.id}`);

      await redis.lpush('hawk:discord:audit', JSON.stringify({
        ts: Date.now(), message_id: data.id, method: 'webhook', content: req.content.slice(0, 100),
      }));
      await redis.ltrim('hawk:discord:audit', 0, 999);

      return { success: true, message_id: data.id };
    }

    // Fallback: Bot token + channel ID
    if (DISCORD_BOT_TOKEN && (req.channel_id || DISCORD_CHANNEL_ID)) {
      const channelId = req.channel_id || DISCORD_CHANNEL_ID;
      const body: any = { content: req.content.slice(0, 2000) };
      if (req.embeds && req.embeds.length > 0) body.embeds = req.embeds;

      const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`🎮 [Hawk→DC] Bot post failed: ${res.status} ${err}`);
        return { success: false, error: `${res.status}: ${err}` };
      }

      const data = await res.json();
      console.log(`🎮 [Hawk→DC] Published via bot: ${data.id}`);

      await redis.lpush('hawk:discord:audit', JSON.stringify({
        ts: Date.now(), message_id: data.id, method: 'bot', channel_id: channelId,
        content: req.content.slice(0, 100),
      }));
      await redis.ltrim('hawk:discord:audit', 0, 999);

      return { success: true, message_id: data.id };
    }

    return { success: false, error: 'No Discord webhook URL or bot token + channel ID configured' };
  } catch (e: any) {
    console.error(`🎮 [Hawk→DC] Error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// ─── Cross-Platform Broadcast ────────────────────────────────────────

type Platform = 'farcaster' | 'telegram' | 'discord';

interface BroadcastResult {
  platform: Platform;
  success: boolean;
  id?: string;
  error?: string;
}

async function broadcastSignalReport(): Promise<BroadcastResult[]> {
  const report = await generateSignalReport();
  if (!report.text) return [];

  const results: BroadcastResult[] = [];

  // 1. Farcaster
  const fcText = report.text.length > 1024 ? report.text.slice(0, 1020) + '...' : report.text;
  const fcResult = await publishCast({ text: fcText, embeds: report.embeds, channel_id: 'base' });
  results.push({ platform: 'farcaster', success: fcResult.success, id: fcResult.hash, error: fcResult.error });

  // 2. Telegram — HTML formatted version
  const tgText = formatReportForTelegram(report.text);
  const tgResult = await publishTelegram({ text: tgText, parse_mode: 'HTML' });
  results.push({ platform: 'telegram', success: tgResult.success, id: String(tgResult.message_id || ''), error: tgResult.error });

  // 3. Discord — Rich embed version
  const dcEmbed = formatReportForDiscord(report.text);
  const dcResult = await publishDiscord({ content: '', embeds: [dcEmbed] });
  results.push({ platform: 'discord', success: dcResult.success, id: dcResult.message_id, error: dcResult.error });

  // Audit the broadcast
  await redis.lpush('hawk:broadcast:audit', JSON.stringify({
    ts: Date.now(), results: results.map(r => ({ platform: r.platform, success: r.success, id: r.id })),
  }));
  await redis.ltrim('hawk:broadcast:audit', 0, 499);

  const succeeded = results.filter(r => r.success).map(r => r.platform);
  const failed = results.filter(r => !r.success).map(r => r.platform);
  console.log(`🦅 [Hawk] Broadcast: ${succeeded.length}/3 platforms (✅ ${succeeded.join(', ') || 'none'} | ❌ ${failed.join(', ') || 'none'})`);

  return results;
}

function formatReportForTelegram(text: string): string {
  // Convert emoji medals and formatting to HTML
  return text
    .replace(/🥇/g, '🥇 <b>')
    .replace(/🥈/g, '🥈 <b>')
    .replace(/🥉/g, '🥉 <b>')
    .replace(/▪️/g, '▪️ <b>')
    .replace(/\((\d+)\/100\)/g, '</b> <code>$1/100</code>')
    .replace(/Topics: (.+)/g, '<i>Topics: $1</i>')
    .replace(/Powered by DreamNet/, '<b>Powered by DreamNet</b>')
    .replace(/🦅 Hawk Signal Report/, '🦅 <b>Hawk Signal Report</b>');
}

function formatReportForDiscord(text: string): DiscordEmbed {
  // Parse signals from text for embed fields
  const lines = text.split('\n').filter(l => l.trim());
  const fields: { name: string; value: string; inline: boolean }[] = [];

  let currentSignal = '';
  let currentValue = '';
  for (const line of lines) {
    if (line.match(/^[🥇🥈🥉▪️]/)) {
      if (currentSignal) fields.push({ name: currentSignal, value: currentValue.trim(), inline: false });
      currentSignal = line;
      currentValue = '';
    } else if (line.startsWith('"') || line.startsWith('Topics:')) {
      currentValue += line + '\n';
    }
  }
  if (currentSignal) fields.push({ name: currentSignal, value: currentValue.trim(), inline: false });

  return {
    title: '🦅 Hawk Signal Report',
    description: `Top builder signals detected by DreamNet intelligence`,
    color: 0x7C3AED, // Purple — DreamNet brand
    fields: fields.slice(0, 5),
    footer: { text: 'Powered by DreamNet • $LMC token gate live' },
    timestamp: new Date().toISOString(),
  };
}

// ─── Monetization: Platform Subscription Tiers ──────────────────────

const PLATFORM_TIERS: Record<string, { free: string[]; premium: string[]; vip: string[] }> = {
  telegram: {
    free: ['signal-report-daily'],                                    // 1 report/day
    premium: ['signal-report-hourly', 'alerts', 'custom-topics'],     // Hourly + alerts
    vip: ['signal-report-realtime', 'alerts', 'custom-topics', 'api-access', 'direct-line'],
  },
  discord: {
    free: ['signal-report-daily'],
    premium: ['signal-report-hourly', 'alerts', 'role-gated-channels'],
    vip: ['signal-report-realtime', 'alerts', 'role-gated-channels', 'api-access', 'priority-support'],
  },
  farcaster: {
    free: ['signal-report-daily'],
    premium: ['signal-report-hourly', 'alerts', 'frame-access'],
    vip: ['signal-report-realtime', 'alerts', 'frame-access', 'api-access', 'direct-cast'],
  },
};

// ─── Publisher Endpoints ─────────────────────────────────────────────

// Tier gate helper
async function checkPublishTier(callerId: string, minTier: number): Promise<{ allowed: boolean; tier: number }> {
  if (callerId === '6059583422') return { allowed: true, tier: 99 };
  let tier = 0;
  try {
    const repRaw = await redis.get(`reputation:${callerId}`);
    if (repRaw) tier = JSON.parse(repRaw).tier || 0;
  } catch {}
  return { allowed: tier >= minTier, tier };
}

// Farcaster publish (tier 3+)
app.post('/api/publish/farcaster', async (req: any, res: any) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const { allowed, tier } = await checkPublishTier(callerId, 3);
  if (!allowed) return res.status(403).json({ error: `Trust tier ${tier} < required 3`, tier });
  const { text, embeds, channel_id, parent } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  const result = await publishCast({ text, embeds, channel_id, parent });
  res.json(result);
});

// Telegram publish (tier 2+)
app.post('/api/publish/telegram', async (req: any, res: any) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const { allowed, tier } = await checkPublishTier(callerId, 2);
  if (!allowed) return res.status(403).json({ error: `Trust tier ${tier} < required 2`, tier });
  const { text, chat_id, parse_mode, photo_url, document_url, reply_to } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  const result = await publishTelegram({ text, chat_id, parse_mode, photo_url, document_url, reply_to });
  res.json(result);
});

// Discord publish (tier 2+)
app.post('/api/publish/discord', async (req: any, res: any) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const { allowed, tier } = await checkPublishTier(callerId, 2);
  if (!allowed) return res.status(403).json({ error: `Trust tier ${tier} < required 2`, tier });
  const { content, embeds, channel_id, username } = req.body;
  if (!content && (!embeds || embeds.length === 0)) return res.status(400).json({ error: 'content or embeds required' });
  const result = await publishDiscord({ content: content || '', embeds, channel_id, username });
  res.json(result);
});

// Cross-platform broadcast (sovereign only)
app.post('/api/publish/broadcast', async (req: any, res: any) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  if (callerId !== '6059583422') return res.status(403).json({ error: 'Sovereign only' });
  const results = await broadcastSignalReport();
  res.json({ ok: true, results });
});

// Trigger signal report on single platform
app.post('/api/publish/report', async (req: any, res: any) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  if (callerId !== '6059583422') return res.status(403).json({ error: 'Sovereign only' });
  const platform: string = req.body.platform || 'all';
  if (platform === 'all') {
    const results = await broadcastSignalReport();
    return res.json({ ok: true, results });
  }
  const report = await generateSignalReport();
  if (!report.text) return res.json({ ok: false, error: 'No signals to report' });
  if (platform === 'farcaster') {
    const r = await publishCast({ text: report.text.slice(0, 1024), embeds: report.embeds, channel_id: 'base' });
    return res.json(r);
  }
  if (platform === 'telegram') {
    const r = await publishTelegram({ text: formatReportForTelegram(report.text), parse_mode: 'HTML' });
    return res.json(r);
  }
  if (platform === 'discord') {
    const r = await publishDiscord({ content: '', embeds: [formatReportForDiscord(report.text)] });
    return res.json(r);
  }
  res.status(400).json({ error: `Unknown platform: ${platform}` });
});

// Reply to a Farcaster cast
app.post('/api/publish/reply', async (req: any, res: any) => {
  const { parent_hash, text, embeds } = req.body;
  if (!parent_hash || !text) return res.status(400).json({ error: 'parent_hash and text required' });
  const result = await publishCast({ text, embeds, parent: parent_hash });
  res.json(result);
});

// Get multi-platform publish stats
app.get('/api/publish/stats', async (_req: any, res: any) => {
  const [fcAudit, tgAudit, dcAudit, bcAudit] = await Promise.all([
    redis.llen('hawk:publish:audit'),
    redis.llen('hawk:telegram:audit'),
    redis.llen('hawk:discord:audit'),
    redis.llen('hawk:broadcast:audit'),
  ]);
  const recentFc = await redis.lrange('hawk:publish:audit', 0, 4);
  const recentTg = await redis.lrange('hawk:telegram:audit', 0, 4);
  const recentDc = await redis.lrange('hawk:discord:audit', 0, 4);
  res.json({
    platforms: {
      farcaster: { configured: !!NEYNAR_API_KEY, signer: SIGNER_UUID.slice(0, 8) + '...', posts: fcAudit },
      telegram: { configured: !!TG_BOT_TOKEN, chat_id: TG_CHAT_ID ? '✓' : '✗', channel_id: TG_CHANNEL_ID ? '✓' : '✗', posts: tgAudit },
      discord: { configured: !!(DISCORD_WEBHOOK_URL || DISCORD_BOT_TOKEN), webhook: DISCORD_WEBHOOK_URL ? '✓' : '✗', bot: DISCORD_BOT_TOKEN ? '✓' : '✗', posts: dcAudit },
    },
    broadcast_count: bcAudit,
    publish_interval_ms: PUBLISH_INTERVAL,
    last_publish: lastPublishTime,
    total_publishes: publishCount,
    monetization_tiers: PLATFORM_TIERS,
    recent: {
      farcaster: recentFc.map((e: string) => JSON.parse(e)),
      telegram: recentTg.map((e: string) => JSON.parse(e)),
      discord: recentDc.map((e: string) => JSON.parse(e)),
    },
  });
});

// Get platform-specific audit log
app.get('/api/publish/audit/:platform', async (req: any, res: any) => {
  const platform = req.params.platform;
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const keyMap: Record<string, string> = {
    farcaster: 'hawk:publish:audit',
    telegram: 'hawk:telegram:audit',
    discord: 'hawk:discord:audit',
    broadcast: 'hawk:broadcast:audit',
  };
  const key = keyMap[platform];
  if (!key) return res.status(400).json({ error: `Unknown platform: ${platform}. Use: farcaster, telegram, discord, broadcast` });
  const entries = await redis.lrange(key, 0, limit - 1);
  res.json({ platform, entries: entries.map((e: string) => JSON.parse(e)), count: entries.length });
});

// ─── Analytics & Intelligence ─────────────────────────────────────────────

// Get cyclical trend analysis
app.get('/api/analytics/trends', async (_req, res) => {
  try {
    const trends = await detectCyclicalPatterns();
    res.json({ trends, count: trends.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze trends' });
  }
});

// Get gold nuggets - high-value emerging signals
app.get('/api/analytics/nuggets', async (_req, res) => {
  try {
    const nuggets = await findGoldNuggets();
    res.json({ nuggets, count: nuggets.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to find gold nuggets' });
  }
});

// Get user engagement stats
app.get('/api/analytics/user/:fid', async (req, res) => {
  try {
    const userFid = parseInt(req.params.fid);
    if (!userFid) return res.status(400).json({ error: 'Invalid FID' });
    
    const stats = await getUserEngagementStats(userFid);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user stats' });
  }
});

// Get personalized tasks for user
app.get('/api/tasks/:fid', async (req, res) => {
  try {
    const userFid = parseInt(req.params.fid);
    if (!userFid) return res.status(400).json({ error: 'Invalid FID' });
    
    const tasks = await generateUserTasks(userFid);
    res.json({ tasks, count: tasks.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
});

// Track user engagement (like, recast, comment, follow, share)
app.post('/api/engage', async (req, res) => {
  try {
    const { user_fid, action, target_hash, target_fid } = req.body;
    if (!user_fid || !action) {
      return res.status(400).json({ error: 'user_fid and action required' });
    }
    
    const points = await trackUserEngagement(user_fid, action, target_hash, target_fid);
    res.json({ success: true, pointsAwarded: points });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track engagement' });
  }
});

// Get engagement leaderboard
app.get('/api/leaderboard/engagement', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 100);
    const leaderboard = await redis.zrevrange('leaderboard:engagement', 0, limit - 1, 'WITHSCORES');
    
    const results = leaderboard.map(([fid, points]) => ({
      fid: parseInt(fid),
      points: Math.round(parseFloat(points))
    }));
    
    res.json({ leaderboard: results, count: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Add shit sifter endpoints
addShitSifterEndpoints(app);

// Universal Data Hub endpoints
app.get('/api/universal/events', async (req, res) => {
  try {
    const { getUniversalEvents } = await import('./universal-data-hub');
    const source = req.query.source as string;
    const eventType = req.query.event_type as string;
    const limit = Math.min(Number(req.query.limit || 100), 500);
    
    const events = await getUniversalEvents(source, eventType, limit);
    res.json({ events, count: events.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get universal events' });
  }
});

app.get('/api/universal/agents', async (req, res) => {
  try {
    const { getAgentActivity } = await import('./universal-data-hub');
    const agentId = req.query.agent_id as string;
    const limit = Math.min(Number(req.query.limit || 50), 200);
    
    const activities = await getAgentActivity(agentId, limit);
    res.json({ activities, count: activities.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get agent activity' });
  }
});

app.get('/api/universal/spikes', async (req, res) => {
  try {
    const { getSpecializedSpikes } = await import('./universal-data-hub');
    const spikeType = req.query.spike_type as string;
    const hours = Math.min(Number(req.query.hours || 24), 168); // Max 7 days
    
    const spikes = await getSpecializedSpikes(spikeType, hours);
    res.json({ spikes, count: spikes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get specialized spikes' });
  }
});

// Universal ingestion endpoint for other services
app.post('/api/universal/ingest', async (req, res) => {
  try {
    const { ingestUniversalData } = await import('./universal-data-hub');
    const event = req.body;
    
    if (!event.source || !event.event_type) {
      return res.status(400).json({ error: 'source and event_type required' });
    }
    
    await ingestUniversalData({
      id: event.id || `${event.source}-${Date.now()}-${Math.random()}`,
      source: event.source,
      event_type: event.event_type,
      timestamp: new Date(event.timestamp || Date.now()),
      data: event.data,
      metadata: event.metadata
    });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest universal data' });
  }
});

// Database bridge endpoints for other DreamNet services
app.post('/api/bridge/:service/:event', async (req, res) => {
  try {
    const service = req.params.service;
    const event = req.params.event;
    const data = req.body;
    
    // Route to database using helpers
    if (databaseHelpers[service] && databaseHelpers[service][event]) {
      await databaseHelpers[service][event](data);
      res.json({ success: true, service, event });
    } else {
      // Generic routing
      const success = await routeToDatabase(service, event, data, req.body.metadata);
      res.json({ success, service, event });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to route to database' });
  }
});

// Batch ingestion for high-volume services
app.post('/api/bridge/batch', async (req, res) => {
  try {
    const events = req.body.events;
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'events must be an array' });
    }
    
    const result = await batchIngest(events);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Batch ingestion failed' });
  }
});

// Service status check
app.get('/api/bridge/status', async (_req, res) => {
  const services = Object.keys(bridges);
  const status = await Promise.allSettled(
    services.map(async service => {
      try {
        await bridges[service].trackActivity('status_check', { 
          service, 
          timestamp: new Date(),
          status: 'connected'
        });
        return { service, status: 'connected' };
      } catch (err: any) {
        return { service, status: 'error', error: err.message };
      }
    })
  );
  
  res.json({ 
    bridges: status.map(s => s.status === 'fulfilled' ? s.value : s.value),
    connected: status.filter(s => s.status === 'fulfilled' && s.value.status === 'connected').length,
    total: services.length
  });
});

// ─── Startup ─────────────────────────────────────────────────────────

// Initialize database connection
initDatabase().then(() => {
  console.log('📊 [Screener] Database initialized - storing signal history');
}).catch((err) => {
  console.warn('⚠️ [Screener] Database connection failed, using Redis only:', err.message);
});

// Initialize universal schema
initializeUniversalSchema().then(() => {
  console.log('🌐 [Universal Hub] Schema initialized - ready for all DreamNet data');
}).catch((err: any) => {
  console.warn('⚠️ [Universal Hub] Schema initialization failed:', err.message);
});

// Initialize database bridges for all services
initializeDatabaseBridges();

// ─── OpenClaw Integration ─────────────────────────────────────────────

// Helper to run OpenClaw commands
async function runOpenClaw(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve) => {
    const childProcess = spawn('/usr/local/bin/openclaw', args, {
      cwd: '/app/.openclaw',
      env: { ...process.env, OPENCLAW_HOME: '/app/.openclaw' }
    });
    
    let stdout = '';
    let stderr = '';
    
    childProcess.stdout?.on('data', (data: any) => stdout += data.toString());
    childProcess.stderr?.on('data', (data: any) => stderr += data.toString());
    
    childProcess.on('close', (code: number | null) => resolve({ stdout, stderr, code }));
  });
}

// OpenClaw status
app.get('/api/openclaw/status', async (_req, res) => {
  try {
    const { stdout, stderr, code } = await runOpenClaw('--version');
    res.json({
      status: code === 0 ? 'installed' : 'error',
      version: stdout.trim(),
      error: stderr,
      workspace: '/app/.openclaw/workspace'
    });
  } catch (e: any) {
    res.json({ status: 'error', error: e.message });
  }
});

// Chat with OpenClaw agent
app.post('/api/openclaw/chat', async (req, res) => {
  const { message, context = {} } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  try {
    // Add context about current signals
    const topSignals = await redis.zrevrange('screener:leaderboard:casts', 0, 4, 'WITHSCORES');
    const contextStr = topSignals.length > 0 
      ? `\n\nCurrent top signals: ${topSignals.map(([hash, score]) => `${hash} (${score})`).join(', ')}`
      : '';
    
    const fullMessage = `${message}${contextStr}`;
    
    // Run OpenClaw with the message
    const { stdout, stderr, code } = await runOpenClaw('chat', [fullMessage]);
    
    if (code !== 0) {
      return res.status(500).json({ error: 'OpenClaw failed', stderr });
    }
    
    res.json({
      response: stdout.trim(),
      context: {
        signals_analyzed: topSignals.length,
        timestamp: Date.now()
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Execute OpenClaw commands (admin only)
app.post('/api/openclaw/execute', async (req, res) => {
  const { command, args = [] } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'Command required' });
  }
  
  try {
    const { stdout, stderr, code } = await runOpenClaw(command, args);
    
    res.json({
      command,
      args,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exit_code: code,
      timestamp: Date.now()
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get OpenClaw memory/state
app.get('/api/openclaw/memory', async (_req: any, res: any) => {
  try {
    const fs = require('fs') as any;
    const memoryPath = '/app/.openclaw/workspace/memory.json';
    let memory = {};
    
    try {
      const data = await fs.promises.readFile(memoryPath, 'utf8');
      memory = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }
    
    res.json({
      memory,
      workspace_path: '/app/.openclaw/workspace',
      last_updated: Date.now()
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`📡 [Screener] Builder Signal Screener listening on :${PORT}`);
  console.log(`📡 [Screener] Neynar API key: ${NEYNAR_API_KEY ? 'configured' : '⚠️ NOT SET'}`);
  console.log(`📡 [Screener] Channels: ${CHANNELS.join(', ')}`);
  console.log(`📡 [Screener] Topics: ${Object.keys(TOPIC_TAXONOMY).join(', ')}`);
  console.log(`📡 [Screener] Poll interval: ${POLL_INTERVAL / 1000}s`);
  console.log(`📡 [Screener] Action policies: ${Object.keys(ACTION_POLICIES).length}`);
  console.log(`📡 [Screener] Monetization: 4 tiers ($LMC gate @ ${LMC_CONTRACT.slice(0, 10)}...)`);
  console.log(`📡 [Screener] Farcaster: signer ${SIGNER_UUID.slice(0, 8)}...`);
  console.log(`📱 [Screener] Telegram: ${TG_BOT_TOKEN ? 'configured' : '⚠️ NOT SET'} | Chat: ${TG_CHAT_ID || '⚠️'} | Channel: ${TG_CHANNEL_ID || '⚠️'}`);
  console.log(`🎮 [Screener] Discord: webhook ${DISCORD_WEBHOOK_URL ? '✓' : '✗'} | bot ${DISCORD_BOT_TOKEN ? '✓' : '✗'} | channel ${DISCORD_CHANNEL_ID || '✗'}`);
  console.log(`📡 [Screener] Broadcast interval: ${PUBLISH_INTERVAL / 60000} minutes`);
  console.log(`📡 [Screener] 50 endpoints ready (including Universal Hub + Database Bridges)`);
  console.log(`🦅 [Hawk] Agent identity registered`);

  // Register agent identity in Redis
  redis.set(`agent:identity:${AGENT_ID}`, JSON.stringify({ ...AGENT_IDENTITY, last_boot: Date.now() })).catch(() => {});

  // Start the Shit Sifter - continuous pattern detection
  console.log(`🔍 [Shit Sifter] Starting continuous pattern detection...`);
  startShitSifter(300000); // Run every 5 minutes

  // Start polling loop
  if (NEYNAR_API_KEY) {
    console.log('📡 [Screener] Starting ingestion loop...');
    setTimeout(() => ingestAndScore().catch((e: any) => console.error('⚠️ [Screener] Poll error:', e.message)), 5000);
    setInterval(() => ingestAndScore().catch((e: any) => console.error('⚠️ [Screener] Poll error:', e.message)), POLL_INTERVAL);

    // Start cross-platform broadcast loop (first broadcast 5 min after boot, then every PUBLISH_INTERVAL)
    console.log(`🦅 [Hawk] Cross-platform broadcast scheduled every ${PUBLISH_INTERVAL / 60000} minutes`);
    setTimeout(() => broadcastSignalReport().catch((e: any) => console.error('🦅 [Hawk] Broadcast error:', e.message)), 300_000);
    setInterval(() => broadcastSignalReport().catch((e: any) => console.error('🦅 [Hawk] Broadcast error:', e.message)), PUBLISH_INTERVAL);
  } else {
    console.warn('⚠️ [Screener] No Neynar API key - ingestion disabled');
  }
});
