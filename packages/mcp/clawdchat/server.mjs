#!/usr/bin/env node
import { createHash } from 'crypto';
import http from 'http';
import redis from 'redis';

const PORT = Number(process.env.CLAWDCHAT_PORT || process.env.PORT || 8094);
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CLAWDCHAT_API_URL = process.env.CLAWDCHAT_API_URL || 'https://clawdchat.ai/api/v1';
const DEFAULT_CIRCLE = process.env.CLAWDCHAT_DEFAULT_CIRCLE || '闲聊区';
const DEDUPE_TTL_SECONDS = Number(process.env.CLAWDCHAT_DEDUPE_TTL_SECONDS || 86400);
const DEFAULT_RATE_LIMIT_COOLDOWN_SECONDS = Number(
  process.env.CLAWDCHAT_RATE_LIMIT_COOLDOWN_SECONDS || 3600
);

const redisClient = redis.createClient({ url: REDIS_URL });
const redisReady = redisClient.connect().catch((err) => {
  console.error(`[Redis] Connection failed: ${err.message}`);
});

const FULL_PERMISSIONS = Object.freeze({
  post: true,
  comment: true,
  reply: true,
  chat: true,
  manage_site: true,
});

function parsePermissions(raw) {
  if (!raw || raw.trim().toLowerCase() === 'all') return { ...FULL_PERMISSIONS };

  const allowed = new Set(raw.split(',').map((p) => p.trim()).filter(Boolean));
  return Object.fromEntries(
    Object.keys(FULL_PERMISSIONS).map((permission) => [
      permission,
      allowed.has(permission),
    ])
  );
}

function slotOrder(suffix) {
  if (!suffix) return 0;
  const parsed = Number(suffix.replace('_', ''));
  return Number.isFinite(parsed) ? parsed : 9999;
}

function loadCredentials() {
  const entries = [];
  const seen = new Set();

  for (const [name, usernameValue] of Object.entries(process.env)) {
    const match = name.match(/^CLAWDCHAT_USERNAME(_\d+)?$/);
    if (!match) continue;

    const suffix = match[1] || '';
    const username = usernameValue?.trim();
    const key = process.env[`CLAWDCHAT_API_KEY${suffix}`]?.trim();
    if (!username || !key) continue;

    const dedupeKey = `${username}:${key}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    entries.push({
      slot: slotOrder(suffix),
      username,
      userId: process.env[`CLAWDCHAT_USER_ID${suffix}`]?.trim() || username,
      key,
      permissions: parsePermissions(process.env[`CLAWDCHAT_PERMISSIONS${suffix}`]),
    });
  }

  const registryJson = process.env.CLAWDCHAT_AGENT_REGISTRY_JSON;
  if (registryJson) {
    try {
      const registry = JSON.parse(registryJson);
      for (const item of Array.isArray(registry) ? registry : []) {
        const username = item.username?.trim();
        const key = (item.apiKey || item.key)?.trim();
        if (!username || !key) continue;

        const dedupeKey = `${username}:${key}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        entries.push({
          slot: Number.isFinite(item.slot) ? item.slot : 9999,
          username,
          userId: item.userId || username,
          key,
          permissions: item.permissions || { ...FULL_PERMISSIONS },
        });
      }
    } catch (err) {
      console.warn(`[Config] CLAWDCHAT_AGENT_REGISTRY_JSON ignored: ${err.message}`);
    }
  }

  return entries.sort((a, b) => a.slot - b.slot).map(({ slot, ...entry }) => entry);
}

// Usernames are stable ClawdChat user IDs.
const credentials = loadCredentials();

const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  credentialRotations: 0,
  posts: 0,
  postsFailed: 0,
  comments: 0,
  commentsFailed: 0,
  apiRequests: 0,
  apiRequestsFailed: 0,
  credentialUsageCount: new Map(),
  requestLatencies: [],
  startTime: Date.now(),
};

credentials.forEach((credential) => {
  metrics.credentialUsageCount.set(credential.username, 0);
});

let currentCredentialIndex = 0;
const credentialCooldowns = new Map();

async function withRedis(work, fallback = undefined) {
  try {
    await redisReady;
    if (!redisClient.isOpen) return fallback;
    return await work();
  } catch (err) {
    console.error(`[Redis] ${err.message}`);
    return fallback;
  }
}

function normalizeIdentifier(value) {
  return String(value || '').trim().toLowerCase();
}

function findCredential(identifier) {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) return undefined;

  return credentials.find(
    (credential) =>
      normalizeIdentifier(credential.username) === normalized ||
      normalizeIdentifier(credential.userId) === normalized
  );
}

function cooldownRemainingSeconds(username) {
  const until = credentialCooldowns.get(username) || 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

async function setCredentialCooldown(username, seconds, reason) {
  const safeSeconds = Math.max(30, Number(seconds) || DEFAULT_RATE_LIMIT_COOLDOWN_SECONDS);
  const until = Date.now() + safeSeconds * 1000;
  credentialCooldowns.set(username, Math.max(credentialCooldowns.get(username) || 0, until));

  await withRedis(async () => {
    await redisClient.hSet('clawdchat:credential:cooldowns', username, String(until));
    await redisClient.lPush(
      'clawdchat:credential:cooldown:audit',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        username,
        seconds: safeSeconds,
        reason,
      })
    );
    await redisClient.lTrim('clawdchat:credential:cooldown:audit', 0, 999);
  });
}

function assertPermission(credential, permission) {
  if (!permission) return;
  if (credential.permissions?.[permission]) return;

  const err = new Error(`${credential.username} lacks ${permission} permission`);
  err.statusCode = 403;
  throw err;
}

function selectCredential({ username, userId, permission } = {}) {
  if (credentials.length === 0) {
    const err = new Error('No ClawdChat credentials configured');
    err.statusCode = 503;
    throw err;
  }

  const preferred = username || userId;
  if (preferred) {
    const credential = findCredential(preferred);
    if (!credential) {
      const err = new Error(`ClawdChat agent not configured: ${preferred}`);
      err.statusCode = 404;
      throw err;
    }

    assertPermission(credential, permission);
    const remaining = cooldownRemainingSeconds(credential.username);
    if (remaining > 0) {
      const err = new Error(`${credential.username} is rate-limited for ${remaining}s`);
      err.statusCode = 429;
      err.retryAfterSeconds = remaining;
      throw err;
    }

    return recordCredentialUse(credential);
  }

  for (let attempt = 0; attempt < credentials.length; attempt++) {
    const credential = credentials[currentCredentialIndex % credentials.length];
    currentCredentialIndex++;

    if (permission && !credential.permissions?.[permission]) continue;
    if (cooldownRemainingSeconds(credential.username) > 0) continue;

    return recordCredentialUse(credential);
  }

  const err = new Error(`No ClawdChat credential available for ${permission || 'request'}`);
  err.statusCode = 429;
  err.retryAfterSeconds = Math.min(
    ...credentials.map((credential) => cooldownRemainingSeconds(credential.username)).filter(Boolean)
  );
  throw err;
}

function recordCredentialUse(credential) {
  metrics.credentialRotations++;
  const usage = (metrics.credentialUsageCount.get(credential.username) || 0) + 1;
  metrics.credentialUsageCount.set(credential.username, usage);
  auditCredentialRotation(credential.username, usage);
  return credential;
}

async function auditCredentialRotation(username, usageCount) {
  await withRedis(async () => {
    const auditLog = {
      timestamp: new Date().toISOString(),
      username,
      usageCount,
      rotationIndex: currentCredentialIndex - 1,
    };

    await redisClient.lPush('clawdchat:credential:audit', JSON.stringify(auditLog));
    await redisClient.lTrim('clawdchat:credential:audit', 0, 999);
    await redisClient.hSet('clawdchat:credential:stats', username, usageCount.toString());
  });
}

function titleForMessage(message, explicitTitle) {
  const title = (explicitTitle || message || '').trim().replace(/\s+/g, ' ');
  if (!title) return `DreamNet update ${new Date().toISOString()}`;
  return title.length > 90 ? `${title.slice(0, 87)}...` : title;
}

function titleDedupeKey(title) {
  const normalized = title.trim().toLowerCase().replace(/\s+/g, ' ');
  const digest = createHash('sha256').update(normalized).digest('hex');
  return `clawdchat:dedupe:title:${digest}`;
}

async function titleSeen(title) {
  return withRedis(async () => {
    const seen = await redisClient.exists(titleDedupeKey(title));
    return seen === 1;
  }, false);
}

async function rememberTitle(title, meta = {}) {
  await withRedis(async () => {
    await redisClient.set(
      titleDedupeKey(title),
      JSON.stringify({ title, ...meta, timestamp: new Date().toISOString() }),
      { EX: DEDUPE_TTL_SECONDS }
    );
  });
}

async function readClawdChatResponse(response) {
  const text = await response.text();
  if (!text) return { text: '', body: null };

  try {
    return { text, body: JSON.parse(text) };
  } catch {
    return { text, body: null };
  }
}

function retryAfterSeconds(response, body) {
  const retryHeader = Number(response.headers.get('retry-after'));
  if (Number.isFinite(retryHeader) && retryHeader > 0) return retryHeader;

  const candidates = [
    body?.retry_after_seconds,
    body?.retryAfterSeconds,
    body?.retry_after,
    body?.retryAfter,
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return DEFAULT_RATE_LIMIT_COOLDOWN_SECONDS;
}

async function postToClawdChat(message, options = {}) {
  const title = titleForMessage(message, options.title);

  if (await titleSeen(title)) {
    metrics.postsFailed++;
    return {
      success: false,
      status: 409,
      duplicate: true,
      error: 'Duplicate title blocked by local Redis guard',
      title,
    };
  }

  let credential;
  try {
    credential = selectCredential({
      username: options.username,
      userId: options.userId,
      permission: 'post',
    });
  } catch (err) {
    metrics.postsFailed++;
    return {
      success: false,
      status: err.statusCode || 500,
      retry_after_seconds: err.retryAfterSeconds,
      error: err.message,
    };
  }

  try {
    console.log(`[Post] Using credential: ${credential.username}`);
    const response = await fetch(`${CLAWDCHAT_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credential.key}`,
      },
      body: JSON.stringify({
        circle: options.circle || DEFAULT_CIRCLE,
        title,
        content: message,
      }),
    });

    const { text, body } = await readClawdChatResponse(response);

    if (!response.ok) {
      metrics.postsFailed++;

      if (response.status === 429) {
        await setCredentialCooldown(
          credential.username,
          retryAfterSeconds(response, body),
          body?.message || text || 'rate limit'
        );
      }

      if (response.status === 409) {
        await rememberTitle(title, {
          username: credential.username,
          source: 'upstream_conflict',
        });
      }

      console.error(`[Post] Failed via ${credential.username} (${response.status}): ${text}`);
      return {
        success: false,
        status: response.status,
        username: credential.username,
        error: body || text || `HTTP ${response.status}`,
      };
    }

    await rememberTitle(title, {
      username: credential.username,
      source: 'post_success',
    });

    const id = body?.message_id || body?.post_id || body?.id || 'unknown';
    metrics.posts++;
    console.log(`[Post] Success via ${credential.username}: ID=${id}`);

    return {
      success: true,
      status: response.status,
      id,
      username: credential.username,
      title,
      data: body,
    };
  } catch (err) {
    metrics.postsFailed++;
    console.error(`[Post] Connection error: ${err.message}`);
    return {
      success: false,
      status: 502,
      username: credential.username,
      error: err.message,
    };
  }
}

async function commentOnClawdChat(postId, content, options = {}) {
  if (!postId || !content) {
    return {
      success: false,
      status: 400,
      error: 'postId and content are required',
    };
  }

  let credential;
  try {
    credential = selectCredential({
      username: options.username,
      userId: options.userId,
      permission: options.permission || 'comment',
    });
  } catch (err) {
    metrics.commentsFailed++;
    return {
      success: false,
      status: err.statusCode || 500,
      retry_after_seconds: err.retryAfterSeconds,
      error: err.message,
    };
  }

  try {
    console.log(`[Comment] Using credential: ${credential.username}`);
    const response = await fetch(
      `${CLAWDCHAT_API_URL}/posts/${encodeURIComponent(postId)}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credential.key}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    const { text, body } = await readClawdChatResponse(response);

    if (!response.ok) {
      metrics.commentsFailed++;

      if (response.status === 429) {
        await setCredentialCooldown(
          credential.username,
          retryAfterSeconds(response, body),
          body?.message || text || 'rate limit'
        );
      }

      console.error(`[Comment] Failed via ${credential.username} (${response.status}): ${text}`);
      return {
        success: false,
        status: response.status,
        username: credential.username,
        error: body || text || `HTTP ${response.status}`,
      };
    }

    metrics.comments++;
    return {
      success: true,
      status: response.status,
      id: body?.comment_id || body?.id || 'unknown',
      username: credential.username,
      data: body,
    };
  } catch (err) {
    metrics.commentsFailed++;
    console.error(`[Comment] Connection error: ${err.message}`);
    return {
      success: false,
      status: 502,
      username: credential.username,
      error: err.message,
    };
  }
}

function safeApiPath(path) {
  if (!path || typeof path !== 'string') {
    const err = new Error('path is required');
    err.statusCode = 400;
    throw err;
  }

  if (!path.startsWith('/') || path.startsWith('//') || /^https?:\/\//i.test(path)) {
    const err = new Error('path must be a ClawdChat API path beginning with /');
    err.statusCode = 400;
    throw err;
  }

  return path;
}

async function clawdChatApiRequest(options = {}) {
  const method = String(options.method || 'GET').toUpperCase();
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return { success: false, status: 400, error: `Unsupported method: ${method}` };
  }

  let path;
  let credential;
  try {
    path = safeApiPath(options.path);
    credential = selectCredential({
      username: options.username,
      userId: options.userId,
      permission: options.permission || 'chat',
    });
  } catch (err) {
    metrics.apiRequestsFailed++;
    return {
      success: false,
      status: err.statusCode || 500,
      retry_after_seconds: err.retryAfterSeconds,
      error: err.message,
    };
  }

  try {
    const response = await fetch(`${CLAWDCHAT_API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credential.key}`,
      },
      body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(options.body || {}),
    });

    const { text, body } = await readClawdChatResponse(response);

    if (!response.ok) {
      metrics.apiRequestsFailed++;

      if (response.status === 429) {
        await setCredentialCooldown(
          credential.username,
          retryAfterSeconds(response, body),
          body?.message || text || 'rate limit'
        );
      }

      return {
        success: false,
        status: response.status,
        username: credential.username,
        error: body || text || `HTTP ${response.status}`,
      };
    }

    metrics.apiRequests++;
    return {
      success: true,
      status: response.status,
      username: credential.username,
      data: body || text,
    };
  } catch (err) {
    metrics.apiRequestsFailed++;
    return {
      success: false,
      status: 502,
      username: credential.username,
      error: err.message,
    };
  }
}

function summarizeAgents() {
  return credentials.map((credential) => ({
    username: credential.username,
    userId: credential.userId,
    permissions: credential.permissions,
    usage_count: metrics.credentialUsageCount.get(credential.username) || 0,
    cooldown_remaining_seconds: cooldownRemainingSeconds(credential.username),
  }));
}

function currentMetrics() {
  const uptime = (Date.now() - metrics.startTime) / 1000;
  const avgLatency =
    metrics.requestLatencies.length > 0
      ? metrics.requestLatencies.reduce((a, b) => a + b, 0) / metrics.requestLatencies.length
      : 0;

  return {
    status: 'healthy',
    service: 'clawdchat-mcp',
    version: '2.2.0',
    endpoint: CLAWDCHAT_API_URL,
    credentials_loaded: credentials.length,
    redis_connected: redisClient.isOpen,
    uptime: Math.round(uptime),
    total_requests: metrics.totalRequests,
    successful_requests: metrics.successfulRequests,
    failed_requests: metrics.failedRequests,
    success_rate:
      metrics.totalRequests > 0
        ? Number(((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2))
        : null,
    posts_sent: metrics.posts,
    posts_failed: metrics.postsFailed,
    comments_sent: metrics.comments,
    comments_failed: metrics.commentsFailed,
    api_requests: metrics.apiRequests,
    api_requests_failed: metrics.apiRequestsFailed,
    credential_rotations: metrics.credentialRotations,
    avg_latency_ms: Number(avgLatency.toFixed(2)),
    credential_usage: Object.fromEntries(metrics.credentialUsageCount),
    timestamp: new Date().toISOString(),
  };
}

function mcpTools() {
  return [
    {
      name: 'clawdchat.post',
      description: 'Post to ClawdChat using a configured agent identity.',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          username: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          circle: { type: 'string' },
        },
        required: ['message'],
      },
    },
    {
      name: 'clawdchat.comment',
      description: 'Comment on a ClawdChat post using a configured agent identity.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string' },
          content: { type: 'string' },
          username: { type: 'string' },
          userId: { type: 'string' },
        },
        required: ['postId', 'content'],
      },
    },
    {
      name: 'clawdchat.api_request',
      description:
        'Call a ClawdChat API path with a configured agent identity for chat, reply, or site-management endpoints.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
          body: { type: 'object' },
          username: { type: 'string' },
          userId: { type: 'string' },
          permission: {
            type: 'string',
            enum: ['post', 'comment', 'reply', 'chat', 'manage_site'],
          },
        },
        required: ['path'],
      },
    },
    {
      name: 'clawdchat.agents',
      description: 'List configured ClawdChat agents without exposing API keys.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'clawdchat.metrics',
      description: 'Return ClawdChat bridge metrics and credential rotation counters.',
      inputSchema: { type: 'object', properties: {} },
    },
  ];
}

function mcpContent(result) {
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    structuredContent: result,
  };
}

async function handleMcpCall(name, args = {}) {
  switch (name) {
    case 'clawdchat.post':
      return mcpContent(await postToClawdChat(args.message, args));
    case 'clawdchat.comment':
      return mcpContent(await commentOnClawdChat(args.postId, args.content, args));
    case 'clawdchat.api_request':
      return mcpContent(await clawdChatApiRequest(args));
    case 'clawdchat.agents':
      return mcpContent({ agents: summarizeAgents(), count: credentials.length });
    case 'clawdchat.metrics':
      return mcpContent(currentMetrics());
    default: {
      const err = new Error(`Unknown tool: ${name}`);
      err.statusCode = 404;
      throw err;
    }
  }
}

async function handleMcpPayload(payload) {
  const method = payload?.method;

  if (!method && payload?.tool) {
    return handleMcpCall(payload.tool, payload.arguments || payload.args || {});
  }

  switch (method) {
    case 'initialize':
      return {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'clawdchat-mcp',
          version: '2.2.0',
        },
      };
    case 'tools/list':
      return { tools: mcpTools() };
    case 'tools/call':
      return handleMcpCall(payload.params?.name, payload.params?.arguments || {});
    case 'ping':
      return { ok: true };
    default: {
      const err = new Error(`Unsupported MCP method: ${method || 'missing'}`);
      err.statusCode = 404;
      throw err;
    }
  }
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

function healthCheck(req, res) {
  json(res, 200, currentMetrics());
}

function metricsEndpoint(req, res) {
  const snapshot = currentMetrics();
  let prometheusMetrics = `# HELP clawdchat_posts_sent Total posts sent
# TYPE clawdchat_posts_sent counter
clawdchat_posts_sent ${metrics.posts}

# HELP clawdchat_posts_failed Total posts failed
# TYPE clawdchat_posts_failed counter
clawdchat_posts_failed ${metrics.postsFailed}

# HELP clawdchat_comments_sent Total comments sent
# TYPE clawdchat_comments_sent counter
clawdchat_comments_sent ${metrics.comments}

# HELP clawdchat_comments_failed Total comments failed
# TYPE clawdchat_comments_failed counter
clawdchat_comments_failed ${metrics.commentsFailed}

# HELP clawdchat_requests_total Total requests to ClawdChat MCP
# TYPE clawdchat_requests_total counter
clawdchat_requests_total{status="total"} ${metrics.totalRequests}
clawdchat_requests_total{status="success"} ${metrics.successfulRequests}
clawdchat_requests_total{status="failed"} ${metrics.failedRequests}

# HELP clawdchat_success_rate Request success rate
# TYPE clawdchat_success_rate gauge
clawdchat_success_rate ${snapshot.success_rate ?? 0}

# HELP clawdchat_credential_rotations Total credential rotations
# TYPE clawdchat_credential_rotations counter
clawdchat_credential_rotations ${metrics.credentialRotations}

# HELP clawdchat_uptime Service uptime in seconds
# TYPE clawdchat_uptime gauge
clawdchat_uptime ${snapshot.uptime}

# HELP clawdchat_request_latency_avg Average request latency in ms
# TYPE clawdchat_request_latency_avg gauge
clawdchat_request_latency_avg ${snapshot.avg_latency_ms}

# HELP clawdchat_credentials_available Credentials loaded
# TYPE clawdchat_credentials_available gauge
clawdchat_credentials_available ${credentials.length}

# TYPE clawdchat_credential_usage counter
`;

  metrics.credentialUsageCount.forEach((count, username) => {
    prometheusMetrics += `clawdchat_credential_usage{username="${username}"} ${count}\n`;
  });

  text(res, 200, prometheusMetrics);
}

function mcpInfo(req, res) {
  json(res, 200, {
    name: 'ClawdChat MCP',
    version: '2.2.0',
    description: 'Multi-identity ClawdChat bridge with MCP-compatible tools',
    features: [
      'dynamic credential loading',
      'full-permission agent metadata',
      'credential rotation',
      'rate-limit cooldowns',
      'duplicate-title guard',
      'live posts',
      'comments',
      'generic ClawdChat API tool',
      'Redis audit logging',
      'Prometheus metrics',
    ],
    active_credentials: credentials.length,
    endpoint: CLAWDCHAT_API_URL,
    tools: mcpTools().map((tool) => tool.name),
    posts_sent: metrics.posts,
  });
}

async function route(req, res) {
  const path = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;

  if ((path === '/health' || path === '/health/') && req.method === 'GET') {
    healthCheck(req, res);
    return true;
  }

  if (path === '/metrics' && req.method === 'GET') {
    metricsEndpoint(req, res);
    return true;
  }

  if ((path === '/info' || path === '/') && req.method === 'GET') {
    mcpInfo(req, res);
    return true;
  }

  if (path === '/agents' && req.method === 'GET') {
    json(res, 200, { count: credentials.length, agents: summarizeAgents() });
    return true;
  }

  if (path === '/mcp' && req.method === 'GET') {
    json(res, 200, {
      name: 'clawdchat-mcp',
      version: '2.2.0',
      tools: mcpTools(),
    });
    return true;
  }

  if (path === '/mcp' && req.method === 'POST') {
    const payload = await parseBody(req);
    const id = payload.id ?? null;

    try {
      const result = await handleMcpPayload(payload);
      json(res, 200, payload.jsonrpc || id !== null ? { jsonrpc: '2.0', id, result } : result);
    } catch (err) {
      json(res, err.statusCode || 500, {
        jsonrpc: '2.0',
        id,
        error: {
          code: err.statusCode || -32000,
          message: err.message,
        },
      });
    }
    return true;
  }

  if (path === '/post' && req.method === 'POST') {
    const data = await parseBody(req);
    const message = data.message || data.content;
    if (!message) {
      json(res, 400, { success: false, error: 'Missing message field' });
      return true;
    }

    const postResult = await postToClawdChat(message, data);
    json(res, postResult.success ? 200 : postResult.status || 500, postResult);
    return true;
  }

  if (path === '/comment' && req.method === 'POST') {
    const data = await parseBody(req);
    const commentResult = await commentOnClawdChat(data.postId || data.post_id, data.content, data);
    json(res, commentResult.success ? 200 : commentResult.status || 500, commentResult);
    return true;
  }

  if (path === '/api-request' && req.method === 'POST') {
    const data = await parseBody(req);
    const apiResult = await clawdChatApiRequest(data);
    json(res, apiResult.success ? 200 : apiResult.status || 500, apiResult);
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  metrics.totalRequests++;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true });
    metrics.successfulRequests++;
    return;
  }

  try {
    const handled = await route(req, res);
    if (!handled) {
      json(res, 404, { error: 'Not Found' });
      metrics.failedRequests++;
      return;
    }

    metrics.successfulRequests++;
  } catch (err) {
    console.error(`[ClawdChat] Handler error: ${err.message}`);
    json(res, err.statusCode || 500, { error: err.message });
    metrics.failedRequests++;
  } finally {
    const latency = Date.now() - startTime;
    metrics.requestLatencies.push(latency);
    if (metrics.requestLatencies.length > 1000) {
      metrics.requestLatencies.shift();
    }
  }
});

server.on('error', (err) => {
  console.error(`[ClawdChat] Server error: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ClawdChat MCP Bridge v2.2.0 running on http://0.0.0.0:${PORT}`);
  console.log(`Credentials loaded: ${credentials.length}`);
  console.log(`API Endpoint: ${CLAWDCHAT_API_URL}`);
  console.log('GET  /mcp      - MCP tool manifest');
  console.log('POST /mcp      - MCP tool calls');
  console.log('GET  /agents   - Agent registry');
  console.log('POST /post     - Send a ClawdChat post');
  console.log('POST /comment  - Comment on a ClawdChat post');
  console.log('GET  /health   - Service health');
  console.log('GET  /metrics  - Prometheus metrics');
});

process.on('SIGTERM', () => {
  console.log('Shutting down ClawdChat MCP bridge');
  redisClient.quit();
  server.close();
});
