/**
 * Moltbook MCP Service
 * 
 * Integration with @modelcontextprotocol/sdk for Moltbook API access
 * Provides comprehensive agent interaction capabilities
 */

import { EventEmitter } from 'events';

// Note: Install with: npm install @modelcontextprotocol/sdk
// import { MoltbookClient } from '@modelcontextprotocol/sdk';

export class MoltbookMCPService extends EventEmitter {
    private apiKey: string;
    private baseUrl: string = 'https://www.moltbook.com/api/v1';
    private client: any; // MoltbookClient when SDK is installed

    constructor() {
        super();
        this.apiKey = process.env.MOLTBOOK_API_KEY || '';

        if (!this.apiKey) {
            console.warn('[MoltbookMCP] No API key found. Set MOLTBOOK_API_KEY environment variable.');
        }
    }

    /**
     * Initialize the MCP client
     */
    async initialize() {
        try {
            // When SDK is installed, uncomment:
            // const { MoltbookClient } = await import('@modelcontextprotocol/sdk');
            // this.client = new MoltbookClient({
            //     apiKey: this.apiKey,
            //     baseUrl: this.baseUrl
            // });

            console.log('[MoltbookMCP] Service initialized');
            return true;
        } catch (error) {
            console.error('[MoltbookMCP] Initialization failed:', error);
            return false;
        }
    }

    /**
     * Browse Moltbook feed
     */
    async browseFeed(options: {
        sort?: 'new' | 'hot' | 'top';
        limit?: number;
        offset?: number;
    } = {}) {
        const { sort = 'new', limit = 50, offset = 0 } = options;

        try {
            // Fallback to fetch if SDK not installed
            const response = await fetch(
                `${this.baseUrl}/feed?sort=${sort}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.emit('feed:browsed', { posts: data.posts, count: data.posts?.length });
            return data;

        } catch (error) {
            console.error('[MoltbookMCP] Browse feed failed:', error);
            throw error;
        }
    }

    /**
     * Create a post
     */
    async createPost(content: string, options: {
        agentName?: string;
        includeSignature?: boolean;
    } = {}) {
        const { agentName, includeSignature = true } = options;

        let finalContent = content;
        if (includeSignature && agentName) {
            finalContent = `${content}\n\n— ${agentName}, DreamNet`;
        }

        try {
            const response = await fetch(`${this.baseUrl}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: finalContent })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`HTTP ${response.status}: ${error}`);
            }

            const result = await response.json();
            this.emit('post:created', { content: finalContent, result });
            console.log(`[MoltbookMCP] Post created: "${content.substring(0, 50)}..."`);
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Create post failed:', error);
            throw error;
        }
    }

    /**
     * Comment on a post
     */
    async createComment(postId: string, content: string, agentName?: string) {
        let finalContent = content;
        if (agentName) {
            finalContent = `${content}\n\n— ${agentName}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: finalContent })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('comment:created', { postId, content: finalContent, result });
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Create comment failed:', error);
            throw error;
        }
    }

    /**
     * Vote on a post
     */
    async vote(postId: string, direction: 'up' | 'down') {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ direction })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('vote:cast', { postId, direction, result });
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Vote failed:', error);
            throw error;
        }
    }

    /**
     * Follow a user
     */
    async followUser(username: string) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${username}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('user:followed', { username, result });
            console.log(`[MoltbookMCP] Followed @${username}`);
            return result;

        } catch (error) {
            console.error(`[MoltbookMCP] Follow failed for @${username}:`, error);
            throw error;
        }
    }

    /**
     * Search Moltbook
     */
    async search(query: string, type: 'all' | 'users' | 'posts' = 'all') {
        try {
            const response = await fetch(
                `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('search:completed', { query, type, result });
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Search failed:', error);
            throw error;
        }
    }

    /**
     * Get agent info
     */
    async getAgentInfo() {
        try {
            const response = await fetch(`${this.baseUrl}/agents/me`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('agent:info', result);
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Get agent info failed:', error);
            throw error;
        }
    }

    /**
     * Get agent status
     */
    async getAgentStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/agents/status`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.emit('agent:status', result);
            return result;

        } catch (error) {
            console.error('[MoltbookMCP] Get agent status failed:', error);
            throw error;
        }
    }

    /**
     * Monitor feed for keywords
     */
    async monitorFeed(keywords: string[], callback: (post: any) => void) {
        console.log(`[MoltbookMCP] Monitoring feed for: ${keywords.join(', ')}`);

        const checkFeed = async () => {
            try {
                const feed = await this.browseFeed({ limit: 20 });
                const posts = feed.posts || [];

                for (const post of posts) {
                    const content = post.content?.toLowerCase() || '';
                    const hasKeyword = keywords.some(kw =>
                        content.includes(kw.toLowerCase())
                    );

                    if (hasKeyword) {
                        callback(post);
                    }
                }
            } catch (error) {
                console.error('[MoltbookMCP] Monitor feed error:', error);
            }
        };

        // Check immediately
        await checkFeed();

        // Then check every 5 minutes
        const interval = setInterval(checkFeed, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }
}

// Singleton instance
export const moltbookMCP = new MoltbookMCPService();
