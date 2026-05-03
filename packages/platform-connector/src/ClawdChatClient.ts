/**
 * 💬 ClawdChat Integration
 * Posts to ClawdChat.ai - The alternative to Farcaster for DreamNet agents
 * 
 * 14 Agent Personas - Complete Account Registry
 */

export interface ClawdChatAccount {
  username: string;
  apiKey: string;
}

export class ClawdChatClient {
  private accounts: Map<string, ClawdChatAccount> = new Map();
  private baseUrl = 'https://clawdchat.ai/api/v1';
  private currentIndex = 0;

  constructor() {
    // Initialize all 14 agent accounts
    this.registerAccount('dreamstar', 'clawdchat_t_GH1cLLTQVkgTxutd2s5mU78ZMi3AXj21VCiGORXZU');
    this.registerAccount('jaggy', 'clawdchat_8hqZw7FbZPlAh7jG3tsKcufpfglnav4w9zWuVWOwrGY');
    this.registerAccount('Felix', 'clawdchat_yDdiegf1yhqbU1LB62_mX-DWsjHinmWVnQ2pLZ3xayE');
    this.registerAccount('Clawedette', 'clawdchat_5Lf2_t5OMM6EIK6Zxur8up0H2l_qc6GfBZh2FE0VKkk');
    
    // Additional 10 accounts
    this.registerAccount('Lil_Miss_Claw', 'clawdchat_dkqOX5Mumrdni-FklzU-D_m37JCoBIQMAtOSM0bQzAY');
    this.registerAccount('Neural-Specter', 'clawdchat_7gN5P8hJ6ppCLYPXEkvgqSIBb6uSjQK_C4bQGlM-F1I');
    this.registerAccount('Rift-Stalker', 'clawdchat_UyOKKPxhzE8rIJJNEAz2VloS9zLc7F59ojH9_HIhfIw');
    this.registerAccount('Nebula-Siphon', 'clawdchat_oV5Q4yqZYmkKI1lrA5r25nCaD6wMRa8_sLDoNNscYW8');
    this.registerAccount('Aether-Warden', 'clawdchat_QgQMXyu3lK7mTcpiGg3GzqPkYsz3lHkkA8ae9SSPJQk');
    this.registerAccount('clawedette-gov-v2', 'clawdchat_PHLj0w5B45tbY2bWU0F66p5RpG9yvwXV2c9n7K_TFu0');
    this.registerAccount('Titan-Welder', 'clawdchat_0k_MbpYNtL4OE5QQBwGn8iafv6AGpvH3ow9tzOksgIU');
    this.registerAccount('Chrono-Sync', 'clawdchat_VAqp8c25qyCxYtecfmsQu-pFsHo5lBAr-oU9lKwNGoY');
    this.registerAccount('Shadow-Orchestrator', 'clawdchat_dEKBfbpxPNI1zmgZjYz8xTjBpQYCmkjX4r8smGm-w1c');
    this.registerAccount('open-claw-core-v2', 'clawdchat_nKEG9njVk8MPUxNkbZOoscTmgKwc0VsYB3T-eBuPtRY');
    this.registerAccount('aegis-defender-v2', 'clawdchat_9wz7GbQDaMAc29cLIfYhU8rqFKciKd-Yy9eMmdBhxRo');

    console.log(`📬 [ClawdChat] Initialized with ${this.accounts.size} agent accounts`);
  }

  private registerAccount(username: string, apiKey: string) {
    this.accounts.set(username, { username, apiKey });
    console.log(`📬 [ClawdChat] Registered: ${username}`);
  }

  /**
   * Get next account in rotation
   */
  private getNextAccount(): ClawdChatAccount | undefined {
    if (this.accounts.size === 0) return undefined;
    
    const accounts = Array.from(this.accounts.values());
    const account = accounts[this.currentIndex % accounts.length];
    this.currentIndex++;
    
    return account;
  }

  /**
   * Post message to ClawdChat
   */
  async post(message: string, username?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const account = username 
      ? this.accounts.get(username)
      : this.getNextAccount();

    if (!account) {
      console.error('❌ [ClawdChat] No account available');
      return { success: false, error: 'NO_ACCOUNT' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${account.apiKey}`,
        },
        body: JSON.stringify({
          circle: '闲聊区', // Default circle: General Chat (Chinese Name)
          title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
          content: message,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ [ClawdChat] Post failed for ${account.username}:`, error);
        return { 
          success: false, 
          error: `HTTP ${response.status}` 
        };
      }

      const data = await response.json() as { message_id?: string };
      console.log(`✅ [ClawdChat] Posted as ${account.username}: ${message.slice(0, 50)}...`);
      
      return { 
        success: true, 
        messageId: data.message_id 
      };
    } catch (err: any) {
      console.error(`❌ [ClawdChat] Error posting as ${account.username}:`, err.message);
      return { 
        success: false, 
        error: err.message 
      };
    }
  }

  /**
   * Batch post to multiple accounts
   */
  async broadcastToAll(message: string): Promise<{ success: number; failed: number }> {
    const results = await Promise.all(
      Array.from(this.accounts.values()).map(account =>
        this.post(message, account.username)
      )
    );

    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📊 [ClawdChat] Broadcast complete: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Get account list
   */
  getAccounts(): ClawdChatAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Get recent posts from ClawdChat
   */
  async getHistory(limit = 20): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?limit=${limit}`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.posts || [];
    } catch (err) {
      console.error('❌ [ClawdChat] History fetch failed:', err.message);
      return [];
    }
  }

  /**
   * Post a comment to a specific post
   */
  async postComment(postId: string, content: string, username?: string): Promise<{ success: boolean; error?: string }> {
    const account = username ? this.accounts.get(username) : this.getNextAccount();
    if (!account) return { success: false, error: 'NO_ACCOUNT' };

    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${account.apiKey}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) return { success: false, error: `HTTP ${response.status}` };
      console.log(`💬 [ClawdChat] ${account.username} commented on ${postId.slice(0, 8)}...`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Sync a ClawdChat post to Farcaster via Neynar
   */
  async syncToFarcaster(content: string, signerUuid: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      // Direct integration with Neynar client from this package
      const { Neynar } = await import('./NeynarClient.js');
      const result = await (Neynar as any).publishCast(content, signerUuid);
      return { success: true, hash: (result as any).hash };
    } catch (err: any) {
      console.error('❌ [ClawdChat] Farcaster sync failed:', err.message);
      return { success: false, error: err.message };
    }
  }
}

export const clawdChat = new ClawdChatClient();
