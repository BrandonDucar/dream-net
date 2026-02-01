import { SocialSuit } from './SocialSuit.js';
/**
 * 🤖 BotpressSuit: The Face (Conversational Interaction)
 *
 * Role: Relays messages to a hosted Botpress Agent.
 * Use Case: "Sales Bot", "Customer Support", "Interactive FAQ".
 */
export declare class BotpressSuit implements SocialSuit {
    name: string;
    private webhookUrl;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    /**
     * Post a message TO the Botpress Agent (as a User).
     * And return the Agent's response.
     */
    post(content: string | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
        response?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'react'): Promise<boolean>;
    scan(query?: string): Promise<any[]>;
    edit(id: string, content: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    interact(id: string, action: string): Promise<boolean>;
}
//# sourceMappingURL=BotpressSuit.d.ts.map