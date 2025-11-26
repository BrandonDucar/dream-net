/**
 * Facebook Graph API Integration
 *
 * Uses Facebook Graph API for posting to Facebook Pages
 * Docs: https://developers.facebook.com/docs/graph-api
 */
export interface FacebookConfig {
    accessToken: string;
    pageId: string;
}
export declare class FacebookPoster {
    private config;
    private baseUrl;
    constructor(config: FacebookConfig);
    /**
     * Post to Facebook Page
     */
    post(content: string, mediaUrl?: string, link?: string): Promise<{
        success: boolean;
        postId?: string;
        permalink?: string;
        error?: string;
    }>;
    /**
     * Post a photo
     */
    postPhoto(imageUrl: string, caption: string): Promise<{
        success: boolean;
        postId?: string;
        permalink?: string;
        error?: string;
    }>;
}
