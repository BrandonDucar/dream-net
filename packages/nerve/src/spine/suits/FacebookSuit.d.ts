import { SocialSuit } from './SocialSuit.js';
/**
 * 📘 FacebookSuit: The Biomech Skin for Social Graph
 *
 * Capabilities:
 * - Page Management
 * - Ad Management (Future)
 * - "Real Data" enforcement
 */
export declare class FacebookSuit implements SocialSuit {
    name: string;
    private api;
    private pageId;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply', content?: string): Promise<boolean>;
    scan(query?: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=FacebookSuit.d.ts.map