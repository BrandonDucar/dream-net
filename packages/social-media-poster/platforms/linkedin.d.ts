/**
 * LinkedIn API Integration
 *
 * Uses LinkedIn API v2 for posting
 * Docs: https://docs.microsoft.com/en-us/linkedin/
 *
 * Requirements:
 * - LinkedIn Developer App
 * - OAuth 2.0 authentication
 * - Content creation permissions
 */
export interface LinkedInConfig {
    accessToken: string;
    personUrn?: string;
}
export declare class LinkedInPoster {
    private config;
    private baseUrl;
    constructor(config: LinkedInConfig);
    /**
     * Post to LinkedIn (text only)
     */
    post(content: string): Promise<{
        success: boolean;
        postId?: string;
        permalink?: string;
        error?: string;
    }>;
    /**
     * Post with image
     */
    postWithImage(content: string, imageUrl: string): Promise<{
        success: boolean;
        postId?: string;
        permalink?: string;
        error?: string;
    }>;
}
