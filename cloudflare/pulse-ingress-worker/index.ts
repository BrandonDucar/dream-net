export interface Env {
  PULSE_ARCHIVE?: R2Bucket;
  DREAMNET_STATE?: KVNamespace;
  PULSE_QUEUE?: Queue;
  PULSE_INGRESS_SECRET?: string;
  PULSE_REQUIRE_SIGNATURE?: string;
  PULSE_RAW_ARCHIVE_ENABLED?: string;
  PULSE_MAX_BODY_BYTES?: string;
  ALLOWED_ORIGINS?: string;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const DEFAULT_MAX_BODY_BYTES = 2_000_000;
const REDACTED = '[redacted]';
const SECRET_KEY_PATTERN =
  /(api[_-]?key|access[_-]?token|auth[_-]?token|bearer|credential|mnemonic|password|private[_-]?key|seed[_-]?phrase|secret)/i;
const SECRET_VALUE_PATTERN =
  /(clawdchat_[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+|xox[baprs]-[A-Za-z0-9-]+|gh[pousr]_[A-Za-z0-9_]+)/g;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return corsResponse(request, null, 204);
    }

    const url = new URL(request.url);

    try {
      if (request.method === 'GET' && url.pathname === '/health') {
        return corsResponse(request, {
          ok: true,
          service: 'dreamnet-pulse-ingress',
          bindings: bindingStatus(env),
          timestamp: new Date().toISOString(),
        });
      }

      if (request.method === 'POST' && ['/pulse', '/pulse/daily', '/ingest'].includes(url.pathname)) {
        return await handlePulse(request, env, ctx);
      }

      if (request.method === 'POST' && url.pathname === '/social-intent') {
        return await handleSocialIntent(request, env, ctx);
      }

      return corsResponse(request, { ok: false, error: 'not_found' }, 404);
    } catch (error) {
      return corsResponse(
        request,
        {
          ok: false,
          error: error instanceof Error ? error.message : 'unknown_error',
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  },
};

async function handlePulse(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const raw = await readLimitedBody(request, env);
  await verifySignature(request, env, raw);

  const parsed = parsePayload(raw);
  const sanitized = sanitize(parsed);
  const now = new Date();
  const pulseId = crypto.randomUUID();
  const digest = await sha256Hex(raw);
  const record = {
    id: pulseId,
    type: 'daily_pulse_dump',
    digest: `sha256:${digest}`,
    received_at: now.toISOString(),
    source: request.headers.get('x-dreamnet-source') || 'manual-upload',
    summary: summarizePulse(sanitized),
    payload: sanitized,
  };

  const archiveKey = `pulse/${datePath(now)}/${pulseId}.json`;
  ctx.waitUntil(archiveRecord(env, archiveKey, record));
  ctx.waitUntil(writeLatestState(env, 'pulse:latest', record));
  ctx.waitUntil(enqueue(env, record));

  return corsResponse(request, {
    ok: true,
    id: pulseId,
    digest: record.digest,
    archive_key: archiveKey,
    queued: Boolean(env.PULSE_QUEUE),
    timestamp: record.received_at,
  });
}

async function handleSocialIntent(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const raw = await readLimitedBody(request, env);
  await verifySignature(request, env, raw);

  const parsed = parsePayload(raw);
  const sanitized = sanitize(parsed);
  const now = new Date();
  const intentId = crypto.randomUUID();
  const record = {
    id: intentId,
    type: 'social_action_intent',
    digest: `sha256:${await sha256Hex(raw)}`,
    received_at: now.toISOString(),
    payload: sanitized,
  };

  ctx.waitUntil(archiveRecord(env, `social-intents/${datePath(now)}/${intentId}.json`, record));
  ctx.waitUntil(writeLatestState(env, `social-intent:${intentId}`, record));
  ctx.waitUntil(enqueue(env, record));

  return corsResponse(request, {
    ok: true,
    id: intentId,
    digest: record.digest,
    queued: Boolean(env.PULSE_QUEUE),
    timestamp: record.received_at,
  });
}

async function readLimitedBody(request: Request, env: Env): Promise<string> {
  const maxBytes = Number(env.PULSE_MAX_BODY_BYTES || DEFAULT_MAX_BODY_BYTES);
  const raw = await request.text();
  const size = new TextEncoder().encode(raw).byteLength;

  if (size > maxBytes) {
    throw new Error(`payload_too_large:${size}`);
  }

  if (!raw.trim()) {
    throw new Error('empty_payload');
  }

  return raw;
}

async function verifySignature(request: Request, env: Env, raw: string): Promise<void> {
  const requireSignature = env.PULSE_REQUIRE_SIGNATURE === 'true';
  const secret = env.PULSE_INGRESS_SECRET;

  if (!secret && !requireSignature) {
    return;
  }

  if (!secret) {
    throw new Error('signature_required_but_secret_missing');
  }

  const provided = normalizeSignature(
    request.headers.get('x-dreamnet-signature') || request.headers.get('x-signature')
  );

  if (!provided) {
    throw new Error('signature_missing');
  }

  const expected = await hmacSha256Hex(secret, raw);
  if (!timingSafeEqualHex(provided, expected)) {
    throw new Error('signature_invalid');
  }
}

function parsePayload(raw: string): JsonValue {
  try {
    return JSON.parse(raw) as JsonValue;
  } catch {
    return { format: 'text', body: raw };
  }
}

function sanitize(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SECRET_KEY_PATTERN.test(key) ? REDACTED : sanitize(item as JsonValue),
      ])
    );
  }

  if (typeof value === 'string') {
    return value.replace(SECRET_VALUE_PATTERN, REDACTED);
  }

  return value;
}

function summarizePulse(payload: JsonValue) {
  const text = JSON.stringify(payload);
  const headings = [...text.matchAll(/#{1,3}\s+([^\\n#]{3,120})/g)]
    .slice(0, 12)
    .map((match) => match[1].trim());

  return {
    bytes: new TextEncoder().encode(text).byteLength,
    headings,
    has_openclaw: /openclaw/i.test(text),
    has_neon: /neon|pgvector|postgres/i.test(text),
    has_cloudflare: /cloudflare|worker|r2|queue|hyperdrive/i.test(text),
    has_base_zora: /base|zora|farcaster|azul/i.test(text),
  };
}

async function archiveRecord(env: Env, key: string, record: unknown): Promise<void> {
  if (!env.PULSE_ARCHIVE || env.PULSE_RAW_ARCHIVE_ENABLED === 'false') {
    return;
  }

  await env.PULSE_ARCHIVE.put(key, JSON.stringify(record), {
    httpMetadata: { contentType: 'application/json' },
    customMetadata: { service: 'dreamnet-pulse-ingress' },
  });
}

async function writeLatestState(env: Env, key: string, record: unknown): Promise<void> {
  if (!env.DREAMNET_STATE) {
    return;
  }

  await env.DREAMNET_STATE.put(key, JSON.stringify(record), {
    expirationTtl: 60 * 60 * 24 * 30,
  });
}

async function enqueue(env: Env, record: unknown): Promise<void> {
  if (!env.PULSE_QUEUE) {
    return;
  }

  await env.PULSE_QUEUE.send(record);
}

function corsResponse(request: Request, body: unknown, status = 200): Response {
  const headers = new Headers({
    'access-control-allow-origin': allowedOrigin(request),
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-dreamnet-signature,x-signature,x-dreamnet-source',
    'content-type': 'application/json',
  });

  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

function allowedOrigin(request: Request): string {
  const origin = request.headers.get('origin');
  if (!origin) {
    return '*';
  }

  return origin;
}

function bindingStatus(env: Env) {
  return {
    r2_archive: Boolean(env.PULSE_ARCHIVE),
    kv_state: Boolean(env.DREAMNET_STATE),
    queue: Boolean(env.PULSE_QUEUE),
    signature_required: env.PULSE_REQUIRE_SIGNATURE === 'true',
  };
}

function datePath(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(signature));
}

function normalizeSignature(signature: string | null): string | null {
  if (!signature) {
    return null;
  }

  return signature.replace(/^sha256=/i, '').trim().toLowerCase();
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
