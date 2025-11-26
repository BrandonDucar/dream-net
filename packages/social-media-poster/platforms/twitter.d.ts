/**
 * Twitter/X API Integration
 *
 * Uses Twitter API v2 for posting tweets
 * Docs: https://developer.twitter.com/en/docs/twitter-api
 */
export interface TwitterConfig {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    bearerToken?: string;
}
export declare class TwitterPoster {
    private client;
    private config;
    constructor(config: TwitterConfig);
    /**
     * Post a tweet
     */
    postTweet(content: string, mediaIds?: string[]): Promise<{
        success: boolean;
        tweetId?: string;
        url?: string;
        error?: string;
    }>;
    /**
     * Upload media (image/video)
     */
    uploadMedia(mediaUrl: string, mediaType?: "image" | "video"): Promise<{
        success: boolean;
        mediaId?: string;
        error?: string;
    }>;
    /**
     * Post a thread (multiple tweets)
     */
    postThread(tweets: string[]): Promise<{
        success: boolean;
        tweetIds?: string[];
        error?: string;
    }>;
}
