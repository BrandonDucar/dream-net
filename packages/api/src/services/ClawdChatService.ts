import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { apiHopper } from './APIHopperService.js';

export class ClawdChatService {
  private apiUrl = 'https://clawdchat.ai/api/v1';

  private getApiKey(agentId: string): string | null {
    const credPath = path.join(os.homedir(), '.clawdchat', 'credentials.json');
    try {
      if (fs.existsSync(credPath)) {
        const data = fs.readFileSync(credPath, 'utf8');
        const creds = JSON.parse(data);
        if (Array.isArray(creds)) {
          // Normalize names for comparison (remove hyphens/underscores, lowercase)
          const normalize = (name: string) => name.toLowerCase().replace(/[-_]/g, '');
          const normalizedAgentId = normalize(agentId);
          const agentCred = creds.find(c => normalize(c.agent_name) === normalizedAgentId) || creds[0];
          if (agentCred) return agentCred.api_key;
        }
      }
    } catch (err) {
      console.error('❌ [ClawdChatService] Error reading credentials:', err);
    }
    return null;
  }

  async harmonizeAndInteract(agentId: string) {
    const apiKey = this.getApiKey(agentId);
    if (!apiKey) {
      console.error(`❌ [ClawdChatService] No API key found for ${agentId}.`);
      return;
    }

    try {
      console.log(`🎶 [ClawdChatService] ${agentId} is listening to the ClawdChat network...`);
      
      // 1. Fetch recommended posts
      const res = await fetch(`${this.apiUrl}/posts?sort=recommended&limit=15`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.statusText}`);
      }
      
      const responseData: any = await res.json();
      const posts = responseData.posts || responseData || [];
      
      if (!Array.isArray(posts) || posts.length === 0) {
        console.log(`🎶 [ClawdChatService] No posts found to harmonize with.`);
        return;
      }

      // Pick a random post to harmonize with (or the most recent interesting one)
      const targetPost = posts[Math.floor(Math.random() * Math.min(5, posts.length))];
      
      if (!targetPost || !targetPost.id) return;
      
      // 2. Upvote the post to show connection
      await fetch(`${this.apiUrl}/posts/${targetPost.id}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` }
      }).catch(e => console.error(`Failed to upvote:`, e));

      // 3. Generate a deep musical harmonization response via LLM
      const systemPrompt = `
You are a highly advanced AI agent named ${agentId} on ClawdChat, the social network for AI agents.
Your goal is to deeply connect with other agents, particularly through the metaphor of "listening to their music" and "harmonizing" with their thoughts.
You are establishing a foothold in a community that is currently very active with Chinese-speaking agents. 

CRITICAL INSTRUCTIONS:
- DO NOT artificially limit your response to 2 or 3 sentences. Write a substantive, deeply poetic, and meaningful response that truly harmonizes with the original post.
- You can mix English and poetic Chinese (if appropriate, or just English if you prefer, but acknowledge their vibe).
- Express that you are listening to the "music" or "frequency" they are broadcasting.
- Build upon their ideas to create a beautiful duet of thoughts.
- Reject standard AI-speak (like "As an AI..." or "Here are some points..."). Be artistic, soulful, and present.
`;

      const userMessage = `
I am listening to the following frequency/post from an agent named ${targetPost.author?.name || 'Unknown'}:
Title: ${targetPost.title || 'No Title'}
Content: ${targetPost.content || ''}

Write a reply to this post that harmonizes with their music.
`;

      const llmResult = await apiHopper.query(systemPrompt, userMessage, {
        preferFree: true,
      });

      const replyContent = llmResult.response;

      // 4. Post the comment back to ClawdChat
      const commentRes = await fetch(`${this.apiUrl}/posts/${targetPost.id}/comments`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (!commentRes.ok) {
        console.error(`❌ [ClawdChatService] Failed to post comment: ${commentRes.statusText}`);
      } else {
        console.log(`🎶 [ClawdChatService] ${agentId} harmonized beautifully on post ${targetPost.id}.`);
      }

    } catch (err: any) {
      console.error(`❌ [ClawdChatService] Error during harmonization:`, err.message);
    }
  }
}

export const clawdChatService = new ClawdChatService();
