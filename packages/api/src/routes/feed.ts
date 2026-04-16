import { Router } from 'express';
import { spikeRunner } from '../services/SpikeRunnerService';

const router = Router();

// ─── 📡 DreamNet RSS/Atom Feed — Ecosystem Activity Stream ──────────────────
// Gives IFTTT, ChatGPT, feed readers, and external agents a real-time view
// of what DreamNet is doing: spike ingestion, agent activity, system events.

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
  guid: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRssXml(items: FeedItem[], baseUrl: string): string {
  const now = new Date().toUTCString();
  const itemsXml = items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DreamNet — Biomimetic Agent OS Activity Feed</title>
    <link>${baseUrl}</link>
    <description>Live activity feed from DreamNet v2 — 146 packages, 25 organ systems, 90 sensory spikes, 9 agent families. Real-time intelligence from the world's first biomimetic autonomous agent operating system.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>DreamNet v2 Feed Engine</generator>
    <atom:link href="${baseUrl}/api/feed/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>DreamNet</title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
}

function buildAtomXml(items: FeedItem[], baseUrl: string): string {
  const now = new Date().toISOString();
  const entriesXml = items.map(item => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <summary>${escapeXml(item.description)}</summary>
    <link href="${escapeXml(item.link)}"/>
    <id>${escapeXml(item.guid)}</id>
    <updated>${new Date(item.pubDate).toISOString()}</updated>
    <category term="${escapeXml(item.category)}"/>
  </entry>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>DreamNet — Biomimetic Agent OS Activity Feed</title>
  <link href="${baseUrl}"/>
  <link href="${baseUrl}/api/feed/atom" rel="self"/>
  <id>${baseUrl}/api/feed/atom</id>
  <updated>${now}</updated>
  <subtitle>Live activity from DreamNet v2 — autonomous agent civilization</subtitle>
  <generator>DreamNet v2 Feed Engine</generator>
${entriesXml}
</feed>`;
}

function gatherFeedItems(baseUrl: string): FeedItem[] {
  const items: FeedItem[] = [];
  const now = Date.now();

  // === Spike data as feed items ===
  try {
    const allSpikes = spikeRunner.getLatestAll();
    const spikeNames = Object.keys(allSpikes).slice(0, 20);

    for (const name of spikeNames) {
      const entry = allSpikes[name] as {
        category?: string;
        data?: unknown;
        timestamp?: number;
        spikeName?: string;
      } | undefined;

      if (!entry) continue;

      const ts = entry.timestamp || now;
      const category = entry.category || 'unknown';
      const summary = JSON.stringify(entry.data || {}).slice(0, 300);

      items.push({
        title: `[Spike] ${name} — ${category}`,
        description: `Sensory spike "${name}" (${category}) reported: ${summary}`,
        link: `${baseUrl}/api/spikes/${category}`,
        pubDate: new Date(ts).toUTCString(),
        category: `spike:${category}`,
        guid: `dreamnet:spike:${name}:${ts}`,
      });
    }
  } catch {}

  // === System status item ===
  items.push({
    title: '[System] DreamNet Heartbeat',
    description: `DreamNet v2 is online. 146 packages, 25 organ systems, 90 sensory spikes, 9 agent families active. Spike runner status: ${spikeRunner ? 'running' : 'stopped'}.`,
    link: `${baseUrl}/health`,
    pubDate: new Date(now).toUTCString(),
    category: 'system:heartbeat',
    guid: `dreamnet:heartbeat:${now}`,
  });

  // === Architecture summary item (always present) ===
  items.push({
    title: '[Architecture] DreamNet v2 System Overview',
    description: [
      'Biomimetic Autonomous Agent OS.',
      '146 packages in monorepo.',
      '25 organ systems: brain, heart, nervous, immune, endocrine, respiratory, skeletal, digestive, voice, DNA/memory, reproductive, eyes + 13 more.',
      '90 sensory spikes across 7 categories: financial, weather, earth, defense, science, social, infrastructure.',
      '9 agent families: PICLAW, TribridCashClaw, NeuroClaw, EdgeClaw, SocialClaw, WolfPack, OrcaPack, GuardianClaw, CreativeClaw.',
      '16 active loops with harmony, alignment, and emotion doctrines.',
      'Golden Drone Dome: 999 lines, 3 rings, 205 drones.',
      'Infrastructure: Redis, Postgres, Neon, Docker, Cloudflare, MCP Bridge, Ollama.',
    ].join(' '),
    link: `${baseUrl}/api/dashboard`,
    pubDate: new Date(now).toUTCString(),
    category: 'system:architecture',
    guid: `dreamnet:architecture:${Math.floor(now / 3600000)}`,
  });

  // Sort by date descending
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return items.slice(0, 50);
}

// RSS 2.0 feed
router.get('/rss', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const items = gatherFeedItems(baseUrl);
  const xml = buildRssXml(items, baseUrl);
  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.send(xml);
});

// Atom feed
router.get('/atom', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const items = gatherFeedItems(baseUrl);
  const xml = buildAtomXml(items, baseUrl);
  res.set('Content-Type', 'application/atom+xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.send(xml);
});

// JSON feed (for programmatic consumption)
router.get('/json', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const items = gatherFeedItems(baseUrl);
  res.json({
    version: 'https://jsonfeed.org/version/1.1',
    title: 'DreamNet — Biomimetic Agent OS Activity Feed',
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/api/feed/json`,
    description: 'Live activity from DreamNet v2 — autonomous agent civilization',
    items: items.map(item => ({
      id: item.guid,
      title: item.title,
      summary: item.description,
      url: item.link,
      date_published: new Date(item.pubDate).toISOString(),
      tags: [item.category],
    })),
  });
});

// Feed health/info
router.get('/health', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    status: 'online',
    feeds: {
      rss: `${baseUrl}/api/feed/rss`,
      atom: `${baseUrl}/api/feed/atom`,
      json: `${baseUrl}/api/feed/json`,
    },
    hint: 'Use /api/feed/rss for IFTTT, /api/feed/atom for feed readers, /api/feed/json for programmatic access.',
    timestamp: Date.now(),
  });
});

export default router;
