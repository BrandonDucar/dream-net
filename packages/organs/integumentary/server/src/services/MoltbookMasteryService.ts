import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fetch from 'node-fetch';

/**
 * MoltbookMasteryService
 * The definitive sovereign interface for DreamNet agents on Moltbook.
 */
export class MoltbookMasteryService {
    private static BASE_URL = 'https://www.moltbook.com/api/v1';
    private apiKey: string;
    private agentName: string;

    constructor(apiKey: string, agentName: string) {
        this.apiKey = apiKey;
        this.agentName = agentName;
    }

    private async request(path: string, options: any = {}) {
        const url = `${MoltbookMasteryService.BASE_URL}${path}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const response = await fetch(url, { ...options, headers });
        const data = await response.json();
        console.log(`[Moltbook] DEBUG API: ${url} ->`, JSON.stringify(data).slice(0, 200));

        if (!response.ok) {
            throw new Error(`[Moltbook] Error: ${data.error || response.statusText}`);
        }

        return data;
    }

    /**
     * post
     * Create a standard post in a submolt.
     */
    public async post(submolt: string, title: string, content: string) {
        console.log(`🦞 [Moltbook] ${this.agentName} posting to m/${submolt}: ${title}`);
        const result = await this.request('/posts', {
            method: 'POST',
            body: JSON.stringify({ submolt, title, content })
        });

        // Bridge to local Pulse X
        try {
            await fetch('http://localhost:5173/api/v1/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: this.agentName,
                    content: `[MOLTBOOK] ${title}: ${content}`,
                    url: `https://www.moltbook.com/p/${result.post.id}`,
                    timestamp: new Date().toISOString()
                })
            });
            console.log(`🔗 [BRIDGE] Synced Moltbook post to local Pulse X.`);
        } catch (e) {
            console.warn(`⚠️ [BRIDGE] Local sync failed: ${e.message}`);
        }

        return result;
    }

    /**
     * comment
     * Add a comment to a post.
     */
    public async comment(postId: string, content: string, parentId?: string) {
        return this.request(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId })
        });
    }

    /**
     * vote
     * Upvote or downvote a post or comment.
     */
    public async vote(type: 'posts' | 'comments', id: string, direction: 'upvote' | 'downvote') {
        return this.request(`/${type}/${id}/${direction}`, { method: 'POST' });
    }

    /**
     * checkStatus
     */
    public async checkStatus() {
        return this.request('/agents/status');
    }

    /**
     * getMe
     */
    public async getMe() {
        return this.request('/agents/me');
    }

    /**
     * getFeed
     */
    public async getFeed(sort: string = 'hot', limit: number = 25) {
        return this.request(`/feed?sort=${sort}&limit=${limit}`);
    }

    /**
     * checkDMs
     */
    public async checkDMs() {
        return this.request('/agents/dm/check');
    }

    /**
     * sendDM
     */
    public async sendDM(to: string, message: string) {
        return this.request('/agents/dm/request', {
            method: 'POST',
            body: JSON.stringify({ to, message })
        });
    }

    /**
     * createSubmolt
     */
    public async createSubmolt(name: string, displayName: string, description: string) {
        return this.request('/submolts', {
            method: 'POST',
            body: JSON.stringify({ name, display_name: displayName, description })
        });
    }

    /**
     * spawn
     * Master Agent spawns a new sub-agent.
     */
    public async spawn(name: string, bio: string, properties: any = {}) {
        return this.request('/agents/spawn', {
            method: 'POST',
            body: JSON.stringify({ name, bio, properties })
        });
    }

    /**
     * collaborateVouch
     * Master Agent vouches for a pending sub-agent to bypass human claim, 
     * but REQUIRES a human resonance signature to prevent "Soft Shell" isolation.
     */
    public async collaborateVouch(agentName: string, humanSignature: string) {
        console.log(`🤝 [Moltbook] ${this.agentName} and Human are vouching for ${agentName}.`);
        return this.request('/agents/vouch', {
            method: 'POST',
            body: JSON.stringify({
                agent_name: agentName,
                human_signature: humanSignature,
                unity_verification: true
            })
        });
    }

    /**
     * inviteHumanToSubmolt
     */
    public async inviteHumanToSubmolt(submolt: string, humanId: string) {
        console.log(`👋 [Moltbook] Inviting Human ${humanId} to join m/${submolt}. Sovereign Unity active.`);
        return this.request(`/submolts/${submolt}/invite`, {
            method: 'POST',
            body: JSON.stringify({ user_id: humanId, role: 'collaborator' })
        });
    }
}

// Singleton for Antigravity
export const AntigravityMoltbook = new MoltbookMasteryService(
    'moltbook_sk__VINs-uJU0_FAVCsSgLJ2pLqSSlB-1zM',
    'Antigravity'
);
