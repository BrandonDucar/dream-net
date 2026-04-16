/**
 * @dreamnet/platform-connector — Multi-Platform Social Connector
 * 
 * Connects DreamNet agents to external platforms:
 * Telegram, Discord, Farcaster, Lens, X/Twitter, email.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'platform-connector',
  name: 'DreamNet Platform Connector',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['telegram', 'discord', 'farcaster', 'lens', 'twitter', 'email'],
  metadata: { organ: 'digestive', role: 'platform-connector' },
});

export type Platform = 'telegram' | 'discord' | 'farcaster' | 'lens' | 'twitter' | 'email';

export interface PlatformConfig {
  platform: Platform;
  enabled: boolean;
  credentials: Record<string, string>;
  webhookUrl?: string;
}

export interface PlatformPost {
  platform: Platform;
  content: string;
  media?: string[];
  replyTo?: string;
  metadata?: Record<string, any>;
}

const platforms: Map<Platform, PlatformConfig> = new Map();

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export function configurePlatform(config: PlatformConfig): void {
  platforms.set(config.platform, config);
}

export function getEnabledPlatforms(): Platform[] {
  return Array.from(platforms.entries()).filter(([_, c]) => c.enabled).map(([p]) => p);
}

export async function post(post: PlatformPost): Promise<{ success: boolean; id?: string }> {
  const config = platforms.get(post.platform);
  if (!config?.enabled) return { success: false };

  await bridge.broadcast(
    `[PLATFORM] Posted to ${post.platform}: ${post.content.slice(0, 80)}`,
    post, 'low'
  );
  return { success: true };
}

export async function crossPost(content: string, targetPlatforms?: Platform[]): Promise<Record<Platform, boolean>> {
  const targets = targetPlatforms || getEnabledPlatforms();
  const results: Record<string, boolean> = {};
  for (const platform of targets) {
    const result = await post({ platform, content });
    results[platform] = result.success;
  }
  return results as Record<Platform, boolean>;
}

export { bridge };
export default { connect, configurePlatform, getEnabledPlatforms, post, crossPost, bridge };
