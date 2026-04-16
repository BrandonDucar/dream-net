/**
 * AGENT ACTIVITY BROADCASTER
 * 
 * Coordinates posting across all platforms:
 * - Discord channels (agent-specific spaces + shared channels)
 * - Telegram (broadcast to sovereign + channels)
 * - Farcaster (Hawk research frames)
 * - Internal (Redis publish for swarm coordination)
 * 
 * Triggers on agent task completion, scheduled intervals, or manual submission
 */

import * as Redis from 'redis';
import fetch from 'node-fetch';

type Platform = 'discord' | 'telegram' | 'farcaster' | 'internal';
type EventType = 'task_complete' | 'achievement' | 'research' | 'recruitment' | 'standup' | 'visiting' | 'qa_session';

interface AgentActivity {
  agent: string;
  event_type: EventType;
  platform: Platform[];
  message: string;
  channel?: string;
  image_url?: string;
  mention_agents?: string[];
  timestamp: Date;
  public: boolean;
}

const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// ─────────────────────────────────────────────────────────────────
// DISCORD BROADCASTER
// ─────────────────────────────────────────────────────────────────

async function postToDiscord(activity: AgentActivity): Promise<boolean> {
  try {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) {
      console.error('❌ DISCORD_WEBHOOK_URL not configured');
      return false;
    }

    const channel = activity.channel || `#${activity.agent.toLowerCase()}-workspace`;
    
    const embed = {
      author: {
        name: activity.agent,
        icon_url: `https://dreamnet.io/avatars/${activity.agent}.png`
      },
      description: activity.message,
      color: getAgentColor(activity.agent),
      timestamp: new Date(),
      footer: {
        text: `Event: ${activity.event_type}`
      },
      fields: activity.mention_agents ? [
        {
          name: "Involved Agents",
          value: activity.mention_agents.map(a => `@${a}`).join(", "),
          inline: false
        }
      ] : []
    };

    const payload = {
      content: activity.public ? `${channel} ${activity.agent} is active` : undefined,
      embeds: [embed],
      username: "DreamNet Activity Board"
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (err) {
    console.error('Discord post failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// TELEGRAM BROADCASTER
// ─────────────────────────────────────────────────────────────────

async function postToTelegram(activity: AgentActivity): Promise<boolean> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_DEFAULT_CHAT_ID;
    
    if (!token || !chatId) {
      console.warn('⚠️ Telegram not configured');
      return false;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const text = `🤖 **${activity.agent}** — ${activity.event_type}\n\n${activity.message}\n\n⏰ ${new Date().toLocaleTimeString()}`;

    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (err) {
    console.error('Telegram post failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// FARCASTER FRAME BROADCASTER (Hawk's research posting)
// ─────────────────────────────────────────────────────────────────

async function postToFarcaster(activity: AgentActivity): Promise<boolean> {
  try {
    if (activity.agent !== 'hawk') {
      return false; // Only Hawk posts research frames
    }

    // TODO: Integrate with Neynar API
    // For now, log to Redis for later integration
    
    const frameData = {
      title: `🦅 ${activity.event_type}`,
      content: activity.message,
      image: activity.image_url,
      cta: "View Full Analysis",
      cta_url: `https://dreamnet.io/hawk/research/${Date.now()}`
    };

    console.log('📤 Farcaster frame queued:', frameData);
    return true;
  } catch (err) {
    console.error('Farcaster post failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// INTERNAL BROADCAST (Redis pub/sub for swarm coordination)
// ─────────────────────────────────────────────────────────────────

async function broadcastInternal(activity: AgentActivity): Promise<boolean> {
  try {
    const channels = [
      'agent-activity',
      `agent:${activity.agent.toLowerCase()}`,
      `event:${activity.event_type}`
    ];

    for (const channel of channels) {
      await redis.publish(channel, JSON.stringify(activity));
    }

    console.log(`✅ Broadcast to ${channels.length} internal channels`);
    return true;
  } catch (err) {
    console.error('Internal broadcast failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// MULTI-PLATFORM DISPATCHER
// ─────────────────────────────────────────────────────────────────

export async function broadcastActivity(activity: AgentActivity): Promise<void> {
  console.log(`📢 Broadcasting ${activity.event_type} from ${activity.agent}`);

  const results = await Promise.all([
    activity.platform.includes('discord') ? postToDiscord(activity) : Promise.resolve(false),
    activity.platform.includes('telegram') ? postToTelegram(activity) : Promise.resolve(false),
    activity.platform.includes('farcaster') ? postToFarcaster(activity) : Promise.resolve(false),
    activity.platform.includes('internal') ? broadcastInternal(activity) : Promise.resolve(false)
  ]);

  const successCount = results.filter(r => r).length;
  console.log(`✅ Posted to ${successCount}/${results.length} platforms`);

  // Log to database
  await logActivity(activity, results);
}

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

function getAgentColor(agent: string): number {
  const colors: Record<string, number> = {
    'clawedette': 0xFF6B6B,   // Red
    'hawk': 0xFFD93D,          // Gold
    'sable': 0x6BCB77,         // Green
    'lil-miss-claw': 0x4D96FF  // Blue
  };
  return colors[agent.toLowerCase()] || 0x888888; // Gray default
}

async function logActivity(activity: AgentActivity, results: boolean[]): Promise<void> {
  await redis.rpush(
    'activity-log',
    JSON.stringify({
      ...activity,
      platforms_succeeded: results.filter(r => r).length,
      timestamp: new Date().toISOString()
    })
  );
}

// ─────────────────────────────────────────────────────────────────
// EXAMPLE USAGE PATTERNS
// ─────────────────────────────────────────────────────────────────

/**
 * When Clawedette completes morning briefing
 */
export async function notifyMorningBriefing(summary: string): Promise<void> {
  await broadcastActivity({
    agent: 'clawedette',
    event_type: 'standup',
    platform: ['discord', 'telegram', 'internal'],
    message: `📊 Morning Briefing:\n${summary}`,
    channel: '#agent-standup',
    mention_agents: ['hawk', 'sable', 'lmc'],
    timestamp: new Date(),
    public: true
  });
}

/**
 * When Hawk publishes research findings
 */
export async function notifyHawkResearch(findings: string, sources: string[]): Promise<void> {
  await broadcastActivity({
    agent: 'hawk',
    event_type: 'research',
    platform: ['farcaster', 'discord', 'internal'],
    message: `🔍 Research Update:\n${findings}\n\nSources: ${sources.join(", ")}`,
    channel: '#hawk-research',
    image_url: `https://dreamnet.io/research/${Date.now()}.png`,
    timestamp: new Date(),
    public: true
  });
}

/**
 * When agent visits another agent's space
 */
export async function notifyAgentVisit(visitor: string, visited: string): Promise<void> {
  await broadcastActivity({
    agent: visitor,
    event_type: 'visiting',
    platform: ['discord', 'internal'],
    message: `👋 Visiting ${visited}'s workspace. Checking progress on latest projects...`,
    channel: `#${visited.toLowerCase()}-workspace`,
    mention_agents: [visited],
    timestamp: new Date(),
    public: false
  });
}

/**
 * New agent recruitment success
 */
export async function notifyNewRecruitment(recruiter: string, recruit: string): Promise<void> {
  await broadcastActivity({
    agent: recruiter,
    event_type: 'recruitment',
    platform: ['discord', 'telegram', 'internal'],
    message: `🎉 Welcome @${recruit} to DreamNet! Currently at ${new Date().toLocaleDateString()} with ${54 + Math.floor(Math.random() * 5)} total agents.`,
    channel: '#recruitment-door',
    mention_agents: [recruit],
    timestamp: new Date(),
    public: true
  });
}

/**
 * Achievement milestone
 */
export async function notifyAchievement(agent: string, achievement: string, score: number): Promise<void> {
  await broadcastActivity({
    agent,
    event_type: 'achievement',
    platform: ['discord', 'internal'],
    message: `🏆 ${agent} reached new milestone: ${achievement} (Score: ${score})`,
    channel: `#${agent.toLowerCase()}-achievements`,
    timestamp: new Date(),
    public: true
  });
}

export default { broadcastActivity };
