/**
 * TikTok Content Posting API Integration
 *
 * Uses TikTok Content Posting API
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started/
 *
 * Requirements:
 * - TikTok Developer Account
 * - TikTok App with Content Posting API access
 * - OAuth 2.0 authentication
 */
export interface TikTokConfig {
    clientKey: string;
    clientSecret: string;
    accessToken: string;
    openId: string;
}
export declare class TikTokPoster {
    private config;
    private baseUrl;
    constructor(config: TikTokConfig);
    /**
     * Post a video to TikTok
     */
    postVideo(videoUrl: string, caption: string, privacyLevel?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY"): Promise<{
        success: boolean;
        publishId?: string;
        error?: string;
    }>;
    /**
     * Check upload status
     */
    checkStatus(publishId: string): Promise<{
        status: string;
        error?: string;
    }>;
}
