
import { SocialSuit } from './SocialSuit.js';
import Snoowrap from 'snoowrap';
import { metabolicCortex } from '../MetabolicCortex.js';

/**
 * 🔴 RedditSuit: The Biomech Skin for Reddit
 * 
 * Capabilities:
 * - Real-time posting & karma farming via Snoowrap
 * - Subreddit scanning
 * - "Real Data" enforcement (No mocks)
 */
export class RedditSuit implements SocialSuit {
    public name: string = "Reddit-Mech-v1";
    private client: Snoowrap | null = null;
    private username: string | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[🔴 RedditSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.client;
    }

    public async ignite(): Promise<void> {
        const userAgent = 'DreamNet-Biomech-Agent/1.0';
        const clientId = process.env.REDDIT_CLIENT_ID;
        const clientSecret = process.env.REDDIT_CLIENT_SECRET;
        const username = process.env.REDDIT_USERNAME;
        const password = process.env.REDDIT_PASSWORD;

        if (!clientId || !clientSecret || !username || !password) {
            console.warn("[🔴 RedditSuit] Keys missing in .env. Suit is powerless.");
            return;
        }

        // Real Authentication
        this.client = new Snoowrap({
            userAgent,
            clientId,
            clientSecret,
            username,
            password
        });

        this.username = username;
        console.log(`[🔴 RedditSuit] Systems Online. Pilot: u/${this.username}`);
    }

    public async post(content: any): Promise<{ success: boolean; url?: string; id?: string }> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        // Content expectation: { subreddit: string, title: string, text?: string, url?: string }
        const { subreddit, title, text, url } = content;

        if (!subreddit || !title) throw new Error("INVALID_PAYLOAD");

        try {
            let submission;
            if (url) {
                submission = await this.client.getSubreddit(subreddit).submitLink({ title, url });
            } else {
                submission = await this.client.getSubreddit(subreddit).submitSelfpost({ title, text: text || '' });
            }

            console.log(`[🔴 RedditSuit] Post Dispatched to r/${subreddit}: ${submission.name}`);
            return { success: true, id: submission.name, url: `https://reddit.com${submission.permalink}` };

        } catch (error: any) {
            console.error("[🔴 RedditSuit] Motor Function Failure (Post):", error);
            return { success: false };
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'comment', content?: string): Promise<boolean> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        try {
            const item = this.client.getSubmission(targetId); // Works for comments too usually via ID wrapper

            switch (action) {
                case 'like': // Upvote
                    // @ts-ignore - Snoowrap types can be tricky
                    await item.upvote();
                    break;
                case 'reply':
                case 'comment':
                    if (!content) throw new Error("REPLY_CONTENT_MISSING");
                    // @ts-ignore
                    await item.reply(content);
                    break;
            }
            console.log(`[🔴 RedditSuit] Engaged (${action}) with Target ${targetId}`);
            return true;
        } catch (error) {
            console.error(`[🔴 RedditSuit] Motor Function Failure (${action}):`, error);
            return false;
        }
    }

    public async scan(query: string = "DreamNet", limit: number = 10): Promise<any[]> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        try {
            const results = await this.client.search({ query, limit, sort: 'new' });
            return results.map((p: any) => ({
                id: p.name,
                title: p.title,
                subreddit: p.subreddit_name_prefixed,
                author: p.author.name,
                created: p.created_utc
            }));
        } catch (error) {
            console.error("[🔴 RedditSuit] Sensory Failure (Scan):", error);
            return [];
        }
    }
}
