// Use native fetch (Node 18+)

type Health = {
  service: string;
  version: string;
  status: "ok" | "degraded" | "down";
  uptime_s: number;
  latency_ms: number;
  kpis: { 
    new_users_24h: number; 
    events_24h: number; 
    errors_24h: number 
  };
  last_block: number;
  error?: string;
};

const TARGETS = [
  { name: "dream-hub", url: process.env.DREAM_HUB_HEALTH || "https://dreamnet.ink/api/healthz" },
  { name: "dream-snipe", url: process.env.DREAM_SNIPE_HEALTH || "https://dreamnet.ink/api/snipe/healthz" },
  { name: "dream-shop", url: process.env.DREAM_SHOP_HEALTH || "https://dreamnet.ink/api/shop/healthz" },
  { name: "dream-vault", url: process.env.DREAM_VAULT_HEALTH || "https://dreamnet.ink/api/vault/healthz" },
  { name: "dream-keeper", url: process.env.DREAM_KEEPER_HEALTH || "https://dreamnet.ink/api/dreamkeeper/healthz" },
  { name: "web", url: process.env.WEB_HEALTH || "https://dreamnet.ink/healthz" },
  { name: "api", url: process.env.API_HEALTH || "https://api.dreamnet.ink/healthz" },
  { name: "agents", url: process.env.AGENTS_HEALTH || "https://agents.dreamnet.ink/healthz" },
  { name: "dreamkeeper", url: process.env.DREAMKEEPER_HEALTH || "https://dreamkeeper.dreamnet.ink/healthz" },
];

const TIMEOUT_MS = 12000;

async function ping(url: string): Promise<{ data?: Health; ms: number; error?: string }> {
  const start = Date.now();
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    const res = await fetch(url, { 
      signal: ctl.signal as any, 
      headers: { "user-agent": "DreamNet-Heartbeat/1.0" } 
    });
    clearTimeout(t);
    const json = await res.json() as Health;
    return { data: json, ms: Date.now() - start };
  } catch (e: any) {
    return { error: e?.message || "unknown", ms: Date.now() - start };
  }
}

function isBad(h: { data?: Health; error?: string }) {
  if (h.error) return true;
  if (!h.data) return true;
  return h.data.status !== "ok";
}

function formatLine(n: string, h: { data?: Health; ms: number; error?: string }) {
  if (h.error) return `❌ ${n} — ${h.error}`;
  const d = h.data!;
  const tag = d.status === "ok" ? "✅" : d.status === "degraded" ? "⚠️" : "❌";
  return `${tag} ${n} v${d.version} ${d.status} • ${h.ms}ms • new:${d.kpis.new_users_24h} ev:${d.kpis.events_24h} err:${d.kpis.errors_24h} • block:${d.last_block}`;
}

async function main() {
  const results = await Promise.all(TARGETS.map(t => ping(t.url)));
  const lines = results.map((r, i) => formatLine(TARGETS[i].name, r));
  const bad = results.map(isBad).some(Boolean);

  // Persist raw (swap with your DB/log)
  console.log(JSON.stringify({ ts: new Date().toISOString(), results }, null, 2));

  // Optional: push metrics (Prometheus, Influx, GCP Metrics) or write to Postgres

  // Alerts (send once if anything is bad)
  if (bad) {
    // replace with your notifier (Telegram/Discord/Slack/Email)
    console.error("[ALERT] One or more services degraded/down.");
  }

  // Emit Sunrise Report (plain text)
  const report = [
    `🌅 DreamNet Sunrise Report — ${new Date().toUTCString()}`,
    "----------------------------------------------",
    ...lines
  ].join("\n");

  // Write to storage & send to your channel
  console.log(report);
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
});

