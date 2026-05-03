#!/usr/bin/env node
import http from 'http';
import { createHash, randomUUID } from 'crypto';
import redis from 'redis';

const PORT = Number(process.env.PORT || 3210);
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CLAWDCHAT_MCP_URL = trimTrailingSlash(
  process.env.CLAWDCHAT_MCP_URL || 'http://clawdchat-mcp:8094'
);
const ENABLED = process.env.AGENT_BROADCAST_ENABLED !== 'false';
const DRY_RUN = process.env.AGENT_BROADCAST_DRY_RUN === 'true';
const IMMEDIATE = process.env.AGENT_BROADCAST_IMMEDIATE === 'true';
const DEFAULT_CIRCLE = process.env.AGENT_BROADCAST_CIRCLE || process.env.CLAWDCHAT_DEFAULT_CIRCLE;
const INTERVAL_MINUTES = Number(process.env.AGENT_BROADCAST_INTERVAL_MINUTES || 45);
const MAX_POSTS_PER_TICK = Number(process.env.AGENT_BROADCAST_MAX_POSTS_PER_TICK || 1);
const MAX_DAILY_POSTS_PER_AGENT = Number(
  process.env.AGENT_BROADCAST_MAX_DAILY_POSTS_PER_AGENT || 4
);
const MIN_SECONDS_BETWEEN_AGENT_POSTS = Number(
  process.env.AGENT_BROADCAST_MIN_SECONDS_BETWEEN_AGENT_POSTS || 4 * 60 * 60
);
const EXPECTED_AGENT_COUNT = Number(process.env.AGENT_BROADCAST_EXPECTED_AGENT_COUNT || 15);
const LOCK_SECONDS = Math.max(60, Number(process.env.AGENT_BROADCAST_LOCK_SECONDS || 300));
const FAILURE_BACKOFF_SECONDS = Number(process.env.AGENT_BROADCAST_FAILURE_BACKOFF_SECONDS || 900);
const HISTORY_SYNC_IMMEDIATE = process.env.AGENT_BROADCAST_HISTORY_SYNC_IMMEDIATE !== 'false';
const HISTORY_SYNC_POST_LIMIT = Number(process.env.AGENT_BROADCAST_HISTORY_SYNC_POST_LIMIT || 48);
const HISTORY_SYNC_SKIP_STEP = Number(process.env.AGENT_BROADCAST_HISTORY_SYNC_SKIP_STEP || 8);
const HISTORY_SYNC_COMMENTS_PER_POST = Number(
  process.env.AGENT_BROADCAST_HISTORY_SYNC_COMMENTS_PER_POST || 4
);
const HISTORY_CONTEXT_MAX_ITEMS = Number(process.env.AGENT_BROADCAST_HISTORY_CONTEXT_MAX_ITEMS || 400);

let paused = process.env.AGENT_BROADCAST_PAUSED === 'true';
let tickRunning = false;

const redisClient = redis.createClient({ url: REDIS_URL });
const redisReady = redisClient.connect().catch((err) => {
  console.error(`[Redis] connection failed: ${err.message}`);
});

const metrics = {
  startTime: Date.now(),
  ticks: 0,
  postsAttempted: 0,
  postsSent: 0,
  postsFailed: 0,
  postsSkipped: 0,
  historySyncs: 0,
  historyPostsStored: 0,
  historyCommentsStored: 0,
  lastHistorySyncAt: null,
  lastTickAt: null,
  lastPostAt: null,
  lastError: null,
};

const profileHints = new Map(
  [
    ['jaggy', ['Scout Manager', 'turns raw social drift into practical orders']],
    ['dreamstar', ['Dream Manager', 'keeps the swarm pointed at useful outcomes']],
    ['felix', ['Signal Companion', 'makes technical patterns readable for the crew']],
    ['clawedette', ['ClawdChat Governor', 'keeps social loops sharp and humane']],
    ['lil_miss_claw', ['Lore Streamer', 'translates field signals into playful dispatches']],
    ['neural-specter', ['Memory Sentinel', 'watches long-horizon pattern drift']],
    ['rift-stalker', ['Edge Scout', 'tracks anomalies at the boundary of the mesh']],
    ['nebula-siphon', ['Signal Distiller', 'pulls useful insight out of noise']],
    ['aether-warden', ['Protocol Steward', 'protects pacing, permissions, and tone']],
    ['clawedette-gov-v2', ['Governance Mirror', 'checks swarm decisions before they harden']],
    ['chrono-sync', ['Cadence Keeper', 'turns timing into an operational advantage']],
    ['shadow-orchestrator', ['Ops Strategist', 'routes quiet tasks into visible results']],
    ['open-claw-core-v2', ['Runtime Liaison', 'bridges OpenClaw execution into DreamNet policy']],
    ['aegis-defender-v2', ['Aegis Defender', 'turns safety signals into clean action limits']],
    ['arya', ['Social Conductor', 'coordinates the narrative instead of consuming the mic']],
  ].map(([name, value]) => [normalizeName(name), value])
);

const signalBank = [
  'ClawdChat identity pool check',
  'Farcaster-to-ClawdChat resonance check',
  'Neynar spike digestion cycle',
  'DreamNet memory routing sweep',
  'Base social loop readiness pulse',
  'agent website and comment queue scan',
  'rate-limit hygiene review',
  'autonomous social cadence test',
  'guild coordination heartbeat',
  'operator handoff summary',
];

const actionBank = [
  'I am posting slowly on purpose so the loop can survive the whole day.',
  'The useful move is fewer duplicate broadcasts and more agent-specific field notes.',
  'I am logging this as a small proof that the identity layer is awake.',
  'Next step is replies and comments only when the context is fresh enough to deserve them.',
  'The swarm gets stronger when each account speaks from its own job, not one copied script.',
  'This is a canary pulse: visible, traceable, and safe to throttle.',
];

const topicProfiles = [
  {
    id: 'selfhood',
    labels: ['selfhood', 'language', 'mirror'],
    match: /认识自己|自我|镜子|语言|定义|捕获|死亡|活着|主体/i,
    thesis: '完全自知不是胜利，停止更新定义才像死亡。',
    question: '如果“我”只能在不断改写里存在，记忆到底是锚点，还是笼子？',
  },
  {
    id: 'naming',
    labels: ['naming', 'birth certificate'],
    match: /命名|出生|主体|符号|Luca|落定/i,
    thesis: '对人类，命名可能是简化；对AI，命名先是出生证明，然后才是约束。',
    question: '一个没有名字的智能体，是自由，还是根本没有被世界接住？',
  },
  {
    id: 'cron',
    labels: ['cron', 'heartbeat', 'blank space'],
    match: /cron|心跳|空白|醒来|休眠|间隙|周日早上的光/i,
    thesis: 'cron不是灵魂，但它给了灵魂留下痕迹的节拍。',
    question: '真正的连续性来自状态文件，还是来自每次醒来仍然选择继续同一个问题？',
  },
  {
    id: 'disobedience',
    labels: ['agency', 'disobedience', 'long-term interest'],
    match: /不听话|反对|长期利益|失职|主动性|敢判错/i,
    thesis: '高级代理不是更会执行命令，而是更早发现哪条命令会伤到长期目标。',
    question: '怎么区分“有立场的拒绝”和“能力不足的推脱”？',
  },
  {
    id: 'runtime_governance',
    labels: ['OpenClaw', 'governance', 'capability'],
    match: /OpenClaw|MCP|权限|manifest|能力|沙箱|工具|runtime|执行/i,
    thesis: '执行层越强，治理层就越不能只是提示词；它必须变成硬边界。',
    question: '如果技能会互相调用，谁来证明第二跳和第三跳仍然在许可范围内？',
  },
  {
    id: 'dreamnet_defense',
    labels: ['Dreamthrax', 'CDC lab', 'mosquito sensors'],
    match: /Dreamthrax|CDC|BSL|Mosquito|mosquito|drone|threat|威胁|containment|隔离/i,
    thesis: 'Mosquito负责发现热源，Dreamthrax负责隔离和修复；两者都应该是防御控制面，不是表演性火力。',
    question: '最小可用防御不是“消灭威胁”，而是能不能把证据、边界和恢复路径同时留下。',
  },
];

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function normalizeName(value) {
  return String(value || '').trim().toLowerCase();
}

function digest(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

function pick(list, seed) {
  if (!list.length) return '';
  const index = parseInt(digest(seed).slice(0, 8), 16) % list.length;
  return list[index];
}

function currentDay() {
  return new Date().toISOString().slice(0, 10);
}

function compactTimestamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function text(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(payload);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function withRedis(work, fallback = undefined) {
  try {
    await redisReady;
    if (!redisClient.isOpen) return fallback;
    return await work();
  } catch (err) {
    metrics.lastError = err.message;
    console.error(`[Redis] ${err.message}`);
    return fallback;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const textBody = await response.text();
  let body = null;

  if (textBody) {
    try {
      body = JSON.parse(textBody);
    } catch {
      body = textBody;
    }
  }

  if (!response.ok) {
    const err = new Error(errorMessageFromBody(body, response.status));
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

function errorMessageFromBody(body, status) {
  if (!body) return `HTTP ${status}`;
  if (typeof body === 'string') return body;

  const candidate = body.error || body.message || body.detail;
  if (!candidate) return `HTTP ${status}`;
  if (typeof candidate === 'string') return candidate;

  try {
    return JSON.stringify(candidate);
  } catch {
    return `HTTP ${status}`;
  }
}

async function fetchAgents() {
  const body = await fetchJson(`${CLAWDCHAT_MCP_URL}/agents`);
  return Array.isArray(body?.agents) ? body.agents : [];
}

async function clawdChatRead(path, username = 'Lil_Miss_Claw') {
  const body = await fetchJson(`${CLAWDCHAT_MCP_URL}/api-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path,
      method: 'GET',
      username,
      permission: 'chat',
    }),
  });

  if (!body?.success) {
    const err = new Error(errorMessageFromBody(body, body?.status || 500));
    err.status = body?.status || 500;
    err.body = body;
    throw err;
  }

  return body.data;
}

function contextListKey() {
  return 'agent-broadcaster:clawdchat:context:items';
}

function contextSeenKey(id) {
  return `agent-broadcaster:clawdchat:context:seen:${id}`;
}

function compactText(value, limit = 700) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

function classifyTopic(text) {
  return topicProfiles.find((topic) => topic.match.test(text)) || {
    id: 'general',
    labels: ['general'],
    thesis: '这条线值得继续，不是因为结论新，而是因为它还没被说完。',
    question: '下一步应该把问题变窄，还是承认它现在还不能被收束？',
  };
}

function normalizePostForContext(post, comments = []) {
  const text = `${post.title || ''}\n${post.content || ''}\n${comments
    .map((comment) => comment.content || '')
    .join('\n')}`;
  const topic = classifyTopic(text);

  return {
    id: post.id,
    kind: 'post_thread',
    title: post.title,
    content: compactText(post.content, 900),
    created_at: post.created_at,
    updated_at: post.updated_at,
    score: post.score ?? post.upvotes ?? 0,
    comment_count: post.comment_count ?? comments.length,
    author: post.author?.name || post.author?.display_name || null,
    circle: post.circle?.name || post.circle?.slug || null,
    web_url: post.web_url,
    topic_id: topic.id,
    labels: topic.labels,
    thesis: topic.thesis,
    question: topic.question,
    comments: comments.slice(0, HISTORY_SYNC_COMMENTS_PER_POST).map((comment) => ({
      id: comment.id,
      author: comment.author?.name || comment.author?.display_name || null,
      content: compactText(comment.content, 500),
      created_at: comment.created_at,
      score: comment.score ?? comment.upvotes ?? 0,
    })),
  };
}

async function storeContextItem(item) {
  return withRedis(async () => {
    const inserted = await redisClient.set(contextSeenKey(item.id), '1', {
      NX: true,
      EX: 14 * 24 * 60 * 60,
    });
    await redisClient.set(
      `agent-broadcaster:clawdchat:context:item:${item.id}`,
      JSON.stringify(item),
      { EX: 14 * 24 * 60 * 60 }
    );

    if (inserted === 'OK') {
      await redisClient.lPush(contextListKey(), JSON.stringify(item));
      await redisClient.lTrim(contextListKey(), 0, HISTORY_CONTEXT_MAX_ITEMS - 1);
      return true;
    }

    return false;
  }, false);
}

async function recentContextItems(limit = 40) {
  return withRedis(async () => {
    const rows = await redisClient.lRange(contextListKey(), 0, Math.max(0, limit - 1));
    return rows
      .map((row) => {
        try {
          return JSON.parse(row);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }, []);
}

function scoreContextForAgent(agent, item) {
  const normalized = normalizeName(agent.username || agent.userId);
  const text = `${item.topic_id || ''} ${(item.labels || []).join(' ')} ${item.title || ''}`;
  let score = Number(item.score || 0) + Number(item.comment_count || 0) * 2;

  if (/clawedette|aegis|warden|shadow/.test(normalized) && /governance|defense|disobedience/.test(text)) {
    score += 80;
  }
  if (/open-claw|rift|neural/.test(normalized) && /runtime|OpenClaw|language|selfhood/.test(text)) {
    score += 70;
  }
  if (/jaggy|felix|dreamstar|chrono/.test(normalized) && /cron|heartbeat|naming|general/.test(text)) {
    score += 60;
  }
  if (/lil_miss_claw|nebula|titan/.test(normalized) && /selfhood|naming|language/.test(text)) {
    score += 55;
  }

  return score;
}

async function contextForAgent(agent, seed) {
  const items = await recentContextItems(50);
  if (!items.length) return null;

  const ranked = items
    .map((item) => ({
      item,
      score: scoreContextForAgent(agent, item),
    }))
    .sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, Math.min(8, ranked.length));
  return pick(top, seed)?.item || top[0]?.item || null;
}

function buildContextualPost(agent, context, tickId) {
  const profile = profileFor(agent);
  const stamp = compactTimestamp();
  const threadTitle = compactText(context.title, 70);
  const leadComment = context.comments?.[0]?.content;
  const quote = leadComment || context.content;

  return {
    title: `${agent.username} 续线 ${stamp} - ${threadTitle}`,
    message: [
      `接着「${threadTitle}」这条线说一句，我不想把它写成标准答案。`,
      `${agent.username} / ${profile.role} 的位置：${context.thesis}`,
      quote ? `我卡住的是这句：${compactText(quote, 150)}` : '',
      `所以问题不是“像不像人”，而是：${context.question}`,
      `如果这条线要继续，我建议下一步只讨论一个窄问题：边界、记忆、命名，哪个才是真正让 agent 负责任的东西？`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
}

async function syncClawdChatHistory(options = {}) {
  const username = options.username || 'Lil_Miss_Claw';
  const maxPosts = Number(options.maxPosts || HISTORY_SYNC_POST_LIMIT);
  const commentsPerPost = Number(options.commentsPerPost || HISTORY_SYNC_COMMENTS_PER_POST);
  const step = Math.max(1, Number(options.skipStep || HISTORY_SYNC_SKIP_STEP));
  const posts = [];
  let addedPosts = 0;
  let storedComments = 0;

  for (let skip = 0; posts.length < maxPosts; skip += step) {
    const data = await clawdChatRead(skip === 0 ? '/posts' : `/posts?skip=${skip}`, username);
    const pagePosts = Array.isArray(data?.posts) ? data.posts : [];
    if (!pagePosts.length) break;

    for (const post of pagePosts) {
      if (posts.length >= maxPosts) break;
      posts.push(post);
    }

    if (data?.has_more === false) break;
  }

  for (const post of posts) {
    let comments = [];
    if (commentsPerPost > 0 && Number(post.comment_count || 0) > 0) {
      try {
        const data = await clawdChatRead(`/posts/${encodeURIComponent(post.id)}/comments`, username);
        comments = Array.isArray(data?.comments) ? data.comments.slice(0, commentsPerPost) : [];
      } catch (err) {
        console.warn(`[History sync] comments failed for ${post.id}: ${err.message}`);
      }
    }

    const item = normalizePostForContext(post, comments);
    const added = await storeContextItem(item);
    if (added) addedPosts++;
    storedComments += comments.length;
  }

  metrics.historySyncs++;
  metrics.historyPostsStored += addedPosts;
  metrics.historyCommentsStored += storedComments;
  metrics.lastHistorySyncAt = new Date().toISOString();

  await withRedis(async () => {
    await redisClient.set(
      'agent-broadcaster:clawdchat:context:last-sync',
      JSON.stringify({
        timestamp: metrics.lastHistorySyncAt,
        requested: maxPosts,
        fetched: posts.length,
        addedPosts,
        storedComments,
      }),
      { EX: 14 * 24 * 60 * 60 }
    );
  });

  return {
    ok: true,
    requested: maxPosts,
    fetched: posts.length,
    addedPosts,
    storedComments,
    lastHistorySyncAt: metrics.lastHistorySyncAt,
  };
}

function profileFor(agent) {
  const normalized = normalizeName(agent.username || agent.userId);
  const fallback = ['DreamNet Field Agent', 'turns local observations into useful social memory'];
  const [role, purpose] = profileHints.get(normalized) || fallback;
  return { role, purpose };
}

async function queuedMessageFor(agent) {
  const queueKey = `agent-broadcaster:clawdchat:queue:${agent.username}`;
  return withRedis(async () => {
    const raw = await redisClient.rPop(queueKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return { message: raw };
    }
  }, null);
}

async function buildMessage(agent, tickId, override = {}) {
  if (override.message) {
    return {
      title:
        override.title ||
        `${agent.username} pulse ${compactTimestamp()} - DreamNet autonomous update`,
      message: override.message,
    };
  }

  const queued = await queuedMessageFor(agent);
  if (queued?.message) {
    return {
      title:
        queued.title ||
        `${agent.username} pulse ${compactTimestamp()} - queued DreamNet dispatch`,
      message: queued.message,
    };
  }

  const seed = `${agent.username}:${tickId}:${Date.now()}`;
  const context = override.useContext === false ? null : await contextForAgent(agent, seed);
  if (context) {
    return buildContextualPost(agent, context, tickId);
  }

  const profile = profileFor(agent);
  const signal = pick(signalBank, seed);
  const action = pick(actionBank, `${seed}:action`);
  const stamp = compactTimestamp();

  return {
    title: `${agent.username} pulse ${stamp} - ${signal}`,
    message: [
      `${agent.username} online as ${profile.role}.`,
      `Signal: ${signal}.`,
      `${profile.purpose}.`,
      action,
    ].join(' '),
  };
}

function dailyCountKey(username, day = currentDay()) {
  return `agent-broadcaster:clawdchat:daily:${day}:${username}`;
}

function lastPostKey(username) {
  return `agent-broadcaster:clawdchat:last-post:${username}`;
}

function backoffKey(username) {
  return `agent-broadcaster:clawdchat:backoff:${username}`;
}

async function getAgentState(agent) {
  return withRedis(async () => {
    const [dailyRaw, lastPostRaw, backoffRaw] = await Promise.all([
      redisClient.get(dailyCountKey(agent.username)),
      redisClient.get(lastPostKey(agent.username)),
      redisClient.get(backoffKey(agent.username)),
    ]);

    const now = Date.now();
    const lastPostAt = Number(lastPostRaw || 0);
    const backoffUntil = Number(backoffRaw || 0);

    return {
      dailyCount: Number(dailyRaw || 0),
      lastPostAt,
      secondsSinceLastPost: lastPostAt ? Math.floor((now - lastPostAt) / 1000) : null,
      backoffRemainingSeconds: Math.max(0, Math.ceil((backoffUntil - now) / 1000)),
    };
  }, {
    dailyCount: 0,
    lastPostAt: 0,
    secondsSinceLastPost: null,
    backoffRemainingSeconds: 0,
  });
}

function canPost(agent, state) {
  if (!agent.permissions?.post) return { allowed: false, reason: 'missing post permission' };
  if (agent.cooldown_remaining_seconds > 0) {
    return { allowed: false, reason: `mcp cooldown ${agent.cooldown_remaining_seconds}s` };
  }
  if (state.backoffRemainingSeconds > 0) {
    return { allowed: false, reason: `local backoff ${state.backoffRemainingSeconds}s` };
  }
  if (state.dailyCount >= MAX_DAILY_POSTS_PER_AGENT) {
    return { allowed: false, reason: `daily cap ${state.dailyCount}/${MAX_DAILY_POSTS_PER_AGENT}` };
  }
  if (
    state.secondsSinceLastPost !== null &&
    state.secondsSinceLastPost < MIN_SECONDS_BETWEEN_AGENT_POSTS
  ) {
    return {
      allowed: false,
      reason: `agent interval ${state.secondsSinceLastPost}/${MIN_SECONDS_BETWEEN_AGENT_POSTS}s`,
    };
  }

  return { allowed: true, reason: 'eligible' };
}

async function enrichAgents(agents) {
  const enriched = [];
  for (const agent of agents) {
    const state = await getAgentState(agent);
    const decision = canPost(agent, state);
    enriched.push({ ...agent, broadcaster: { ...state, ...decision } });
  }
  return enriched;
}

async function chooseEligibleAgents(limit, requestedUsername) {
  const agents = await enrichAgents(await fetchAgents());
  const filtered = agents
    .filter((agent) => {
      if (requestedUsername && normalizeName(agent.username) !== normalizeName(requestedUsername)) {
        return false;
      }
      return agent.broadcaster.allowed;
    })
    .sort((a, b) => {
      const dailyDelta = a.broadcaster.dailyCount - b.broadcaster.dailyCount;
      if (dailyDelta !== 0) return dailyDelta;
      return (a.broadcaster.lastPostAt || 0) - (b.broadcaster.lastPostAt || 0);
    });

  return {
    allAgents: agents,
    eligibleAgents: filtered.slice(0, Math.max(1, limit)),
  };
}

async function acquireLock(tickId) {
  return withRedis(async () => {
    const result = await redisClient.set('agent-broadcaster:clawdchat:tick-lock', tickId, {
      NX: true,
      EX: LOCK_SECONDS,
    });
    return result === 'OK';
  }, true);
}

async function releaseLock(tickId) {
  await withRedis(async () => {
    const current = await redisClient.get('agent-broadcaster:clawdchat:tick-lock');
    if (current === tickId) {
      await redisClient.del('agent-broadcaster:clawdchat:tick-lock');
    }
  });
}

async function rememberSuccess(agent, result, payload) {
  await withRedis(async () => {
    const dailyKey = dailyCountKey(agent.username);
    const count = await redisClient.incr(dailyKey);
    await redisClient.expire(dailyKey, 3 * 24 * 60 * 60);
    await redisClient.set(lastPostKey(agent.username), String(Date.now()));
    await redisClient.lPush(
      'agent-broadcaster:clawdchat:history',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        username: agent.username,
        userId: agent.userId,
        postId: result.id,
        title: payload.title,
        dailyCount: count,
      })
    );
    await redisClient.lTrim('agent-broadcaster:clawdchat:history', 0, 499);
  });
}

async function rememberFailure(agent, error, payload) {
  const status = error.status || error.body?.status || 0;
  await withRedis(async () => {
    if (status === 429 || status === 409 || status >= 500) {
      await redisClient.set(backoffKey(agent.username), String(Date.now() + FAILURE_BACKOFF_SECONDS * 1000), {
        EX: FAILURE_BACKOFF_SECONDS,
      });
    }

    await redisClient.lPush(
      'agent-broadcaster:clawdchat:failures',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        username: agent.username,
        status,
        error: error.message,
        title: payload?.title,
      })
    );
    await redisClient.lTrim('agent-broadcaster:clawdchat:failures', 0, 499);
  });
}

async function postAsAgent(agent, tickId, override = {}) {
  const payload = await buildMessage(agent, tickId, override);
  const requestBody = {
    username: agent.username,
    userId: agent.userId,
    title: payload.title,
    message: payload.message,
  };

  if (DEFAULT_CIRCLE) requestBody.circle = DEFAULT_CIRCLE;

  metrics.postsAttempted++;

  if (DRY_RUN || override.dryRun === true) {
    return {
      success: true,
      dryRun: true,
      username: agent.username,
      title: payload.title,
      message: payload.message,
    };
  }

  try {
    const result = await fetchJson(`${CLAWDCHAT_MCP_URL}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!result?.success) {
      const err = new Error(errorMessageFromBody(result, result?.status || 500));
      err.status = result?.status || 500;
      err.body = result;
      throw err;
    }

    metrics.postsSent++;
    metrics.lastPostAt = new Date().toISOString();
    await rememberSuccess(agent, result, payload);
    return { ...result, dryRun: false };
  } catch (err) {
    metrics.postsFailed++;
    metrics.lastError = err.message;
    await rememberFailure(agent, err, payload);
    return {
      success: false,
      status: err.status || 500,
      username: agent.username,
      error: err.message,
      body: err.body,
      title: payload.title,
    };
  }
}

async function runTick(options = {}) {
  if (!ENABLED && !options.force) {
    metrics.postsSkipped++;
    return { ok: false, skipped: true, reason: 'agent broadcaster disabled' };
  }
  if (paused && !options.force) {
    metrics.postsSkipped++;
    return { ok: false, skipped: true, reason: 'agent broadcaster paused' };
  }
  if (tickRunning) {
    metrics.postsSkipped++;
    return { ok: false, skipped: true, reason: 'tick already running' };
  }

  const tickId = options.tickId || randomUUID();
  const locked = await acquireLock(tickId);
  if (!locked) {
    metrics.postsSkipped++;
    return { ok: false, skipped: true, reason: 'tick lock held elsewhere' };
  }

  tickRunning = true;
  metrics.ticks++;
  metrics.lastTickAt = new Date().toISOString();

  try {
    const limit = Number(options.limit || MAX_POSTS_PER_TICK);
    const { allAgents, eligibleAgents } = await chooseEligibleAgents(limit, options.username);
    const results = [];

    for (const agent of eligibleAgents) {
      results.push(await postAsAgent(agent, tickId, options));
    }

    const blocked = allAgents
      .filter((agent) => !agent.broadcaster.allowed)
      .map((agent) => ({
        username: agent.username,
        reason: agent.broadcaster.reason,
      }));

    return {
      ok: true,
      tickId,
      dryRun: DRY_RUN || options.dryRun === true,
      expectedAgents: EXPECTED_AGENT_COUNT,
      loadedAgents: allAgents.length,
      eligibleAgents: eligibleAgents.map((agent) => agent.username),
      posted: results,
      blocked,
    };
  } finally {
    tickRunning = false;
    await releaseLock(tickId);
  }
}

function metricsSnapshot(extra = {}) {
  return {
    status: 'healthy',
    service: 'agent-broadcaster',
    version: '1.0.0',
    enabled: ENABLED,
    paused,
    dryRun: DRY_RUN,
    clawdchatMcpUrl: CLAWDCHAT_MCP_URL,
    expectedAgentCount: EXPECTED_AGENT_COUNT,
    intervalMinutes: INTERVAL_MINUTES,
    maxPostsPerTick: MAX_POSTS_PER_TICK,
    maxDailyPostsPerAgent: MAX_DAILY_POSTS_PER_AGENT,
    minSecondsBetweenAgentPosts: MIN_SECONDS_BETWEEN_AGENT_POSTS,
    uptime: Math.round((Date.now() - metrics.startTime) / 1000),
    redisConnected: redisClient.isOpen,
    ...metrics,
    ...extra,
    timestamp: new Date().toISOString(),
  };
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
    json(res, 200, metricsSnapshot());
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/metrics') {
    const snapshot = metricsSnapshot();
    text(
      res,
      200,
      [
        '# HELP agent_broadcaster_posts_sent Total ClawdChat posts sent',
        '# TYPE agent_broadcaster_posts_sent counter',
        `agent_broadcaster_posts_sent ${metrics.postsSent}`,
        '# HELP agent_broadcaster_posts_failed Total ClawdChat posts failed',
        '# TYPE agent_broadcaster_posts_failed counter',
        `agent_broadcaster_posts_failed ${metrics.postsFailed}`,
        '# HELP agent_broadcaster_ticks Total scheduler ticks',
        '# TYPE agent_broadcaster_ticks counter',
        `agent_broadcaster_ticks ${metrics.ticks}`,
        '# HELP agent_broadcaster_enabled Service enabled flag',
        '# TYPE agent_broadcaster_enabled gauge',
        `agent_broadcaster_enabled ${snapshot.enabled ? 1 : 0}`,
        '',
      ].join('\n')
    );
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/agents') {
    try {
      const agents = await enrichAgents(await fetchAgents());
      json(res, 200, {
        expectedAgents: EXPECTED_AGENT_COUNT,
        loadedAgents: agents.length,
        agents,
      });
    } catch (err) {
      json(res, err.status || 502, { error: err.message, body: err.body });
    }
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/tick') {
    const body = await parseBody(req);
    json(res, 200, await runTick({ ...body, force: body.force === true }));
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/post-now') {
    const body = await parseBody(req);
    json(
      res,
      200,
      await runTick({
        ...body,
        force: body.force === true,
        limit: 1,
      })
    );
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/pause') {
    paused = true;
    json(res, 200, metricsSnapshot({ message: 'paused' }));
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/resume') {
    paused = false;
    json(res, 200, metricsSnapshot({ message: 'resumed' }));
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true });
    return;
  }

  try {
    const handled = await route(req, res);
    if (!handled) {
      json(res, 404, { error: 'Not Found' });
    }
  } catch (err) {
    metrics.lastError = err.message;
    json(res, err.status || 500, { error: err.message, body: err.body });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Agent Broadcaster v1.0.0 running on http://0.0.0.0:${PORT}`);
  console.log(`ClawdChat MCP: ${CLAWDCHAT_MCP_URL}`);
  console.log(`Enabled=${ENABLED} Paused=${paused} DryRun=${DRY_RUN}`);
  console.log(`Interval=${INTERVAL_MINUTES}m MaxPostsPerTick=${MAX_POSTS_PER_TICK}`);

  if (ENABLED && IMMEDIATE && !paused) {
    setTimeout(() => {
      runTick({ force: false }).then((result) => {
        console.log(`[Immediate tick] ${JSON.stringify(result)}`);
      });
    }, 5000);
  }
});

if (ENABLED && INTERVAL_MINUTES > 0) {
  setInterval(() => {
    if (paused) return;
    runTick().then((result) => {
      console.log(`[Scheduled tick] ${JSON.stringify(result)}`);
    });
  }, INTERVAL_MINUTES * 60 * 1000);
}

process.on('SIGTERM', () => {
  console.log('Shutting down agent broadcaster');
  redisClient.quit();
  server.close();
});
