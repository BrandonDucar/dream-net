/**
 * Instagram Graph API Integration
 *
 * Uses Instagram Graph API (Meta) for posting
 * Docs: https://developers.facebook.com/docs/instagram-api
 *
 * Requirements:
 * - Instagram Business Account
 * - Facebook Page linked to Instagram
 * - Facebook App with Instagram permissions
 */
export interface InstagramConfig {
    accessToken: string;
    instagramBusinessAccountId: string;
    pageId?: string;
}
export declare class InstagramPoster {
    private config;
    private baseUrl;
    constructor(config: InstagramConfig);
    /**
     * Post a photo to Instagram
     */
    postPhoto(imageUrl: string, caption: string): Promise<{
        success: boolean;
        mediaId?: string;
        permalink?: string;
        error?: string;
    }>;
    /**
     * Post a video to Instagram
     */
    postVideo(videoUrl: string, caption: string, thumbnailUrl?: string): Promise<{
        success: boolean;
        mediaId?: string;
        permalink?: string;
        error?: string;
    }>;
}
