
import { SocialSuit } from './SocialSuit.js';
import { IgApiClient } from 'instagram-private-api';
import { metabolicCortex } from '../MetabolicCortex.js';

/**
 * 📸 InstagramSuit: The Biomech Skin for Visual Influence
 * 
 * Capabilities:
 * - Photo/Reel posting
 * - Story observation
 * - "Real Data" enforcement
 */
export class InstagramSuit implements SocialSuit {
    public name: string = "Insta-Mech-v1";
    private client: IgApiClient | null = null;
    private username: string | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[📸 InstagramSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.client;
    }

    public async ignite(): Promise<void> {
        const username = process.env.INSTAGRAM_USERNAME;
        const password = process.env.INSTAGRAM_PASSWORD;

        if (!username || !password) {
            console.warn("[📸 InstagramSuit] Keys missing in .env. Suit is powerless.");
            return;
        }

        this.client = new IgApiClient();
        this.client.state.generateDevice(username);

        try {
            await this.client.simulate.preLoginFlow();
            await this.client.account.login(username, password);
            this.username = username;

            console.log(`[📸 InstagramSuit] Systems Online. Pilot: @${this.username}`);
            // Fire a post-login flow async
            process.nextTick(async () => await this.client!.simulate.postLoginFlow());

        } catch (e: any) {
            console.error(`[📸 InstagramSuit] Auth Failed: ${e.message}`);
            this.client = null;
        }
    }

    public async post(content: Buffer): Promise<{ success: boolean; url?: string; id?: string }> {
        if (!this.client) throw new Error("SUIT_OFFLINE");

        try {
            // Assess Vibe
            const vibe = await metabolicCortex.assessValence("Instagram Post");
            if (vibe < -0.2) console.warn("[📸 InstagramSuit] Aesthetically questionable. Posting anyway.");

            // Assuming content is a Buffer of a JPEG image
            const publishResult = await this.client.publish.photo({
                file: content,
                caption: "DreamNet: System Online.", // Default caption if not provided in complex obj
            });

            console.log(`[📸 InstagramSuit] Photo Dispatched: ${publishResult.media.code}`);
            return { success: true, id: publishResult.media.id, url: `https://instagram.com/p/${publishResult.media.code}` };

        } catch (error: any) {
            console.error("[📸 InstagramSuit] Motor Function Failure (Post):", error.message);
            return { success: false };
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'comment', content?: string): Promise<boolean> {
        if (!this.client) throw new Error("SUIT_OFFLINE");
        try {
            if (action === 'like') {
                await this.client.media.like({ mediaId: targetId, moduleInfo: { module_name: 'profile' } });
            } else if (action === 'comment' || action === 'reply') {
                if (!content) return false;
                await this.client.media.comment({ mediaId: targetId, text: content });
            }
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public async scan(query: string = "cyberpunk", limit: number = 10): Promise<any[]> {
        if (!this.client) throw new Error("SUIT_OFFLINE");
        const results = await this.client.feed.tags(query).items();
        return results.map(i => ({ id: i.id, code: i.code, caption: i.caption?.text, user: i.user.username }));
    }
}
