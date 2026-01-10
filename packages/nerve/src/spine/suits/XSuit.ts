
import { SocialSuit } from './SocialSuit.js';
import { TwitterApi } from 'twitter-api-v2';
import { metabolicCortex } from '../MetabolicCortex.js';

/**
 * 🐦 XSuit: The Biomech Skin for Twitter/X
 * 
 * Capabilities:
 * - Real-time posting & engagement via Twitter API v2
 * - Sentiment analysis via Limbic System
 * - "Real Data" enforcement (No mocks)
 */
export class XSuit implements SocialSuit {
    public name: string = "X-Biomech-Suit-v1";
    private client: TwitterApi | null = null;
    private userId: string | null = null;
    private handle: string | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[❌ XSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.client;
    }

    public async ignite(): Promise<void> {
        const appKey = process.env.TWITTER_API_KEY;
        const appSecret = process.env.TWITTER_API_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessSecret = process.env.TWITTER_ACCESS_SECRET;

        if (!appKey || !appSecret || !accessToken || !accessSecret) {
            console.warn("[❌ XSuit] Keys missing in .env. Suit is powerless.");
            return;
        }

        // Real Authentication
        this.client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });

        // Verify Identity
        const me = await this.client.v2.me();
        this.userId = me.data.id;
        this.handle = me.data.username; // Should match @BDuke669952 if keys align

        console.log(`[🐦 XSuit] Systems Online. Pilot: @${this.handle} [ID: ${this.userId}]`);
    }

    public async post(content: string | Buffer | any): Promise<{ success: boolean; url?: string; id?: string }> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        try {
            // Determine valence before speaking
            const vibe = await metabolicCortex.assessValence(content.toString());
            if (vibe < -0.5) console.warn("[🐦 XSuit] Toxicity Alert. Posting with caution.");

            let tweetId;
            if (Buffer.isBuffer(content)) {
                // Media upload logic would go here (v1.1 API usually needed for media upload)
                throw new Error("MEDIA_NOT_YET_SUPPORTED");
            } else {
                const result = await this.client.v2.tweet(typeof content === 'string' ? content : JSON.stringify(content));
                tweetId = result.data.id;
            }

            console.log(`[🐦 XSuit] Tweet Dispatched: ${tweetId}`);
            return { success: true, id: tweetId, url: `https://x.com/${this.handle}/status/${tweetId}` };

        } catch (error: any) {
            console.error("[🐦 XSuit] Motor Function Failure (Post):", error);
            return { success: false };
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'repost', content?: string): Promise<boolean> {
        if (!this.client || !this.userId) throw new Error("SUIT_OFFLINE");

        try {
            switch (action) {
                case 'like':
                    await this.client.v2.like(this.userId, targetId);
                    break;
                case 'repost':
                    await this.client.v2.retweet(this.userId, targetId);
                    break;
                case 'reply':
                    if (!content) throw new Error("REPLY_CONTENT_MISSING");
                    await this.client.v2.reply(content, targetId);
                    break;
            }
            console.log(`[🐦 XSuit] Engaged (${action}) with Target ${targetId}`);
            return true;
        } catch (error) {
            console.error(`[🐦 XSuit] Motor Function Failure (${action}):`, error);
            return false;
        }
    }

    public async scan(query: string = "DreamNet", limit: number = 10): Promise<any[]> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        try {
            const results = await this.client.v2.search(query, { max_results: limit });
            return results.tweets.map(t => ({
                id: t.id,
                text: t.text,
                authorId: t.author_id,
                createdAt: t.created_at
            }));
        } catch (error) {
            console.error("[🐦 XSuit] Sensory Failure (Scan):", error);
            return [];
        }
    }

    // Stubbed Motor Functions
    public async edit(id: string, content: any): Promise<boolean> { return false; } // X Premium only
    public async delete(id: string): Promise<boolean> {
        if (!this.client) return false;
        try {
            await this.client.v2.deleteTweet(id);
            return true;
        } catch { return false; }
    }
    public async interact(id: string, action: string): Promise<boolean> { return false; }
}
