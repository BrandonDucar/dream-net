/**
 * Twitter/X API Integration
 *
 * Uses Twitter API v2 for posting tweets
 * Docs: https://developer.twitter.com/en/docs/twitter-api
 */
import { TwitterApi, TwitterApiV2Settings } from "twitter-api-v2";
export class TwitterPoster {
    client;
    config;
    constructor(config) {
        this.config = config;
        // Initialize Twitter API client
        this.client = new TwitterApi({
            appKey: config.apiKey,
            appSecret: config.apiSecret,
            accessToken: config.accessToken,
            accessSecret: config.accessTokenSecret,
        });
        // Use bearer token if available (simpler for read operations)
        if (config.bearerToken) {
            TwitterApiV2Settings.debug = false;
        }
    }
    /**
     * Post a tweet
     */
    async postTweet(content, mediaIds) {
        try {
            const tweetData = {
                text: content,
            };
            // Add media if provided
            if (mediaIds && mediaIds.length > 0) {
                tweetData.media = {
                    media_ids: mediaIds,
                };
            }
            const tweet = await this.client.v2.tweet(tweetData);
            return {
                success: true,
                tweetId: tweet.data.id,
                url: `https://twitter.com/i/web/status/${tweet.data.id}`,
            };
        }
        catch (error) {
            console.error("[Twitter] Post failed:", error);
            return {
                success: false,
                error: error.message || "Failed to post tweet",
            };
        }
    }
    /**
     * Upload media (image/video)
     */
    async uploadMedia(mediaUrl, mediaType = "image") {
        try {
            // Download media from URL
            const response = await fetch(mediaUrl);
            const buffer = Buffer.from(await response.arrayBuffer());
            // Upload to Twitter
            const mediaId = await this.client.v1.uploadMedia(buffer, {
                mimeType: mediaType === "image" ? "image/jpeg" : "video/mp4",
            });
            return {
                success: true,
                mediaId,
            };
        }
        catch (error) {
            console.error("[Twitter] Media upload failed:", error);
            return {
                success: false,
                error: error.message || "Failed to upload media",
            };
        }
    }
    /**
     * Post a thread (multiple tweets)
     */
    async postThread(tweets) {
        try {
            const tweetIds = [];
            let replyToId;
            for (const tweetText of tweets) {
                const tweetData = {
                    text: tweetText,
                };
                if (replyToId) {
                    tweetData.reply = {
                        in_reply_to_tweet_id: replyToId,
                    };
                }
                const tweet = await this.client.v2.tweet(tweetData);
                tweetIds.push(tweet.data.id);
                replyToId = tweet.data.id;
                // Small delay between tweets
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return {
                success: true,
                tweetIds,
            };
        }
        catch (error) {
            console.error("[Twitter] Thread post failed:", error);
            return {
                success: false,
                error: error.message || "Failed to post thread",
            };
        }
    }
}
