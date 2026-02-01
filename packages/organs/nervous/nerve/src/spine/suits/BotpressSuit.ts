
import { SocialSuit } from './SocialSuit.js';

/**
 * 🤖 BotpressSuit: The Face (Conversational Interaction)
 * 
 * Role: Relays messages to a hosted Botpress Agent.
 * Use Case: "Sales Bot", "Customer Support", "Interactive FAQ".
 */
export class BotpressSuit implements SocialSuit {
    public name: string = "Botpress-Mech-v1";
    private webhookUrl: string;

    constructor() {
        this.webhookUrl = process.env.BOTPRESS_WEBHOOK_URL || '';
        if (!this.webhookUrl) {
            console.warn("[🤖 BotpressSuit] BOTPRESS_WEBHOOK_URL missing. Suit is dormant.");
        }
    }

    public isOnline(): boolean {
        return !!this.webhookUrl;
    }

    public async ignite(): Promise<void> {
        console.log("[🤖 BotpressSuit] Systems Online (Stateless Relay).");
    }

    /**
     * Post a message TO the Botpress Agent (as a User).
     * And return the Agent's response.
     */
    public async post(content: string | any): Promise<{ success: boolean; url?: string; id?: string; response?: string }> {
        if (!this.isOnline()) throw new Error("SUIT_OFFLINE");

        const text = typeof content === 'string' ? content : content.content;
        const userId = typeof content === 'object' ? content.userId : 'dreamnet-system';

        console.log(`[🤖 BotpressSuit] Relaying to Botpress: "${text}"`);

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'text', text, userId })
            });

            if (!response.ok) throw new Error(`Botpress Config Error: ${response.status}`);

            // Botpress webhooks might handle responses differently (async vs sync).
            // For now, we assume a fire-and-forget or simple ack.
            return { success: true, id: `bp-${Date.now()}` };

        } catch (error: any) {
            console.error("[🤖 BotpressSuit] Relay Failed:", error.message);
            return { success: false, error: error.message };
        }
    }

    // Unused for this specific suit (it's outgoing only for now)
    public async engage(targetId: string, action: 'like' | 'reply' | 'react'): Promise<boolean> { return true; }
    public async scan(query: string = "recent"): Promise<any[]> { return []; }
    public async edit(id: string, content: string): Promise<boolean> { return false; }
    public async delete(id: string): Promise<boolean> { return false; }
    public async interact(id: string, action: string): Promise<boolean> { return false; }
}
