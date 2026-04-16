/**
 * @dreamnet/integumentary — Social Skin & Public Interface
 * 
 * The outer layer of DreamNet. Manages public-facing content,
 * social presence, branding, and user-facing UI generation.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'integumentary',
  name: 'DreamNet Integumentary System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['social-presence', 'content-generation', 'branding', 'ui-generation', 'public-api'],
  metadata: { organ: 'integumentary', role: 'social-skin' },
});

export interface SocialPost { id: string; platform: string; content: string; media?: string[]; scheduledAt?: number; postedAt?: number; engagement?: { likes: number; shares: number; replies: number }; }

const posts: SocialPost[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function createPost(post: SocialPost): void { posts.push(post); }
export function getPosts(limit = 20): SocialPost[] { return posts.slice(-limit); }

export async function publishToAll(content: string, platforms: string[]): Promise<void> {
  for (const platform of platforms) {
    const post: SocialPost = { id: `post-${Date.now()}`, platform, content, postedAt: Date.now() };
    posts.push(post);
  }
  await bridge.broadcast(`[SKIN] Published to ${platforms.join(', ')}: ${content.slice(0, 60)}`, { platforms, content: content.slice(0, 100) }, 'low');
}

export { bridge };
export default { connect, createPost, getPosts, publishToAll, bridge };
