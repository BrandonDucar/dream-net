/**
 * Social Media Poster - Unified Interface
 *
 * Handles posting to all platforms with account management
 * Now supports 12+ platforms!
 */
import { TwitterPoster } from "./platforms/twitter";
import { InstagramPoster } from "./platforms/instagram";
import { FacebookPoster } from "./platforms/facebook";
import { LinkedInPoster } from "./platforms/linkedin";
import { TikTokPoster } from "./platforms/tiktok";
import { YouTubePoster } from "./platforms/youtube";
import { GitHubPoster } from "./platforms/github";
import { NotionPoster } from "./platforms/notion";
import { SlackPoster } from "./platforms/slack";
import { DiscordPoster } from "./platforms/discord";
export class SocialMediaPoster {
    accounts = new Map();
    platformClients = new Map();
    constructor() {
        this.autoConfigureFromEnv();
    }
    /**
     * Auto-configure from environment variables
     */
    autoConfigureFromEnv() {
        // Twitter
        if (process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN) {
            this.platformClients.set("twitter", new TwitterPoster({
                apiKey: process.env.TWITTER_API_KEY,
                apiSecret: process.env.TWITTER_API_SECRET || "",
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
                bearerToken: process.env.TWITTER_BEARER_TOKEN,
            }));
        }
        // Instagram
        if (process.env.INSTAGRAM_ACCESS_TOKEN) {
            this.platformClients.set("instagram", new InstagramPoster({
                accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
                instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "",
                pageId: process.env.FACEBOOK_PAGE_ID,
            }));
        }
        // Facebook
        if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
            this.platformClients.set("facebook", new FacebookPoster({
                accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
                pageId: process.env.FACEBOOK_PAGE_ID || "",
            }));
        }
        // LinkedIn
        if (process.env.LINKEDIN_ACCESS_TOKEN) {
            this.platformClients.set("linkedin", new LinkedInPoster({
                accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
                personUrn: process.env.LINKEDIN_PERSON_URN,
            }));
        }
        // TikTok
        if (process.env.TIKTOK_ACCESS_TOKEN) {
            this.platformClients.set("tiktok", new TikTokPoster({
                clientKey: process.env.TIKTOK_CLIENT_KEY || "",
                clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
                accessToken: process.env.TIKTOK_ACCESS_TOKEN,
                openId: process.env.TIKTOK_OPEN_ID,
            }));
        }
        // YouTube
        if (process.env.YOUTUBE_REFRESH_TOKEN) {
            this.platformClients.set("youtube", new YouTubePoster({
                clientId: process.env.YOUTUBE_CLIENT_ID,
                clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
                refreshToken: process.env.YOUTUBE_REFRESH_TOKEN,
            }));
        }
        // GitHub
        if (process.env.GITHUB_TOKEN) {
            this.platformClients.set("github", new GitHubPoster({
                token: process.env.GITHUB_TOKEN,
                owner: process.env.GITHUB_OWNER,
                defaultRepo: process.env.GITHUB_DEFAULT_REPO,
            }));
        }
        // Notion
        if (process.env.NOTION_TOKEN) {
            this.platformClients.set("notion", new NotionPoster({
                token: process.env.NOTION_TOKEN,
                defaultDatabaseId: process.env.NOTION_DATABASE_ID,
                defaultPageId: process.env.NOTION_DEFAULT_PAGE_ID,
            }));
        }
        // Slack
        if (process.env.SLACK_WEBHOOK_URL || process.env.SLACK_BOT_TOKEN) {
            this.platformClients.set("slack", new SlackPoster({
                webhookUrl: process.env.SLACK_WEBHOOK_URL,
                token: process.env.SLACK_BOT_TOKEN,
                defaultChannel: process.env.SLACK_DEFAULT_CHANNEL,
            }));
        }
        // Discord
        if (process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_BOT_TOKEN) {
            this.platformClients.set("discord", new DiscordPoster({
                webhookUrl: process.env.DISCORD_WEBHOOK_URL,
                botToken: process.env.DISCORD_BOT_TOKEN,
                defaultChannelId: process.env.DISCORD_DEFAULT_CHANNEL_ID,
            }));
        }
    }
    /**
     * Register an account for posting
     */
    registerAccount(account, credentials) {
        this.accounts.set(`${account.platform}:${account.accountId}`, account);
        // Clients are auto-configured from env, but can be overridden here
    }
    /**
     * Post to a platform
     */
    async post(post) {
        const client = this.platformClients.get(post.platform);
        if (!client) {
            return {
                success: false,
                error: `No client configured for ${post.platform}. Check environment variables.`,
            };
        }
        try {
            switch (post.platform) {
                case "twitter":
                case "x":
                    return await this.postToTwitter(client, post);
                case "instagram":
                    return await this.postToInstagram(client, post);
                case "facebook":
                    return await this.postToFacebook(client, post);
                case "linkedin":
                    return await this.postToLinkedIn(client, post);
                case "tiktok":
                    return await this.postToTikTok(client, post);
                case "youtube":
                    return await this.postToYouTube(client, post);
                case "github":
                    return await this.postToGitHub(client, post);
                case "notion":
                    return await this.postToNotion(client, post);
                case "slack":
                    return await this.postToSlack(client, post);
                case "discord":
                    return await this.postToDiscord(client, post);
                case "telegram":
                case "farcaster":
                case "base":
                case "reddit":
                    // These need separate implementations
                    return {
                        success: false,
                        error: `${post.platform} posting not yet implemented in SocialMediaPoster`,
                    };
                default:
                    return {
                        success: false,
                        error: `Unsupported platform: ${post.platform}`,
                    };
            }
        }
        catch (error) {
            console.error(`[SocialMediaPoster] Post failed for ${post.platform}:`, error);
            return {
                success: false,
                error: error.message || "Post failed",
            };
        }
    }
    async postToTwitter(client, post) {
        let mediaIds;
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            mediaIds = [];
            for (const mediaUrl of post.mediaUrls) {
                const uploadResult = await client.uploadMedia(mediaUrl);
                if (uploadResult.success && uploadResult.mediaId) {
                    mediaIds.push(uploadResult.mediaId);
                }
            }
        }
        const isThread = post.content.includes("\n\n---\n\n");
        if (isThread) {
            const tweets = post.content.split("\n\n---\n\n");
            const result = await client.postThread(tweets);
            return {
                success: result.success,
                postId: result.tweetIds?.[0],
                postUrl: result.tweetIds?.[0] ? `https://twitter.com/i/web/status/${result.tweetIds[0]}` : undefined,
                error: result.error,
            };
        }
        else {
            const result = await client.postTweet(post.content, mediaIds);
            return {
                success: result.success,
                postId: result.tweetId,
                postUrl: result.url,
                error: result.error,
            };
        }
    }
    async postToInstagram(client, post) {
        if (!post.mediaUrls || post.mediaUrls.length === 0) {
            return { success: false, error: "Instagram requires media" };
        }
        const isVideo = post.mediaUrls[0].match(/\.(mp4|mov|avi)$/i);
        if (isVideo) {
            const result = await client.postVideo(post.mediaUrls[0], post.content);
            return {
                success: result.success,
                postId: result.mediaId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
        else {
            const result = await client.postPhoto(post.mediaUrls[0], post.content);
            return {
                success: result.success,
                postId: result.mediaId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
    }
    async postToFacebook(client, post) {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            const result = await client.postPhoto(post.mediaUrls[0], post.content);
            return {
                success: result.success,
                postId: result.postId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
        else {
            const result = await client.post(post.content);
            return {
                success: result.success,
                postId: result.postId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
    }
    async postToLinkedIn(client, post) {
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            const result = await client.postWithImage(post.content, post.mediaUrls[0]);
            return {
                success: result.success,
                postId: result.postId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
        else {
            const result = await client.post(post.content);
            return {
                success: result.success,
                postId: result.postId,
                postUrl: result.permalink,
                error: result.error,
            };
        }
    }
    async postToTikTok(client, post) {
        if (!post.mediaUrls || post.mediaUrls.length === 0) {
            return { success: false, error: "TikTok requires a video" };
        }
        const result = await client.postVideo(post.mediaUrls[0], post.content);
        return {
            success: result.success,
            postId: result.publishId,
            error: result.error,
        };
    }
    async postToYouTube(client, post) {
        if (!post.mediaUrls || post.mediaUrls.length === 0) {
            return { success: false, error: "YouTube requires a video" };
        }
        const videoType = post.type === "short" ? "short" : "video";
        const result = await client.post({
            type: videoType,
            title: post.title || "DreamNet Update",
            description: post.content,
            videoUrl: post.mediaUrls[0],
            privacy: "public",
        });
        return {
            success: result.success,
            postId: result.videoId,
            postUrl: result.url,
            error: result.error,
        };
    }
    async postToGitHub(client, post) {
        const postType = post.type || "issue";
        const result = await client.post({
            type: postType,
            title: post.title || "DreamNet Update",
            content: post.content,
        });
        return {
            success: result.success,
            postUrl: result.url,
            error: result.error,
        };
    }
    async postToNotion(client, post) {
        const postType = post.type || "page";
        const result = await client.post({
            type: postType,
            title: post.title || "DreamNet Update",
            content: post.content,
        });
        return {
            success: result.success,
            postUrl: result.url,
            error: result.error,
        };
    }
    async postToSlack(client, post) {
        const result = await client.post({
            channel: post.channel || process.env.SLACK_DEFAULT_CHANNEL,
            text: post.content,
        });
        return {
            success: result.success,
            postUrl: result.url,
            error: result.error,
        };
    }
    async postToDiscord(client, post) {
        const result = await client.post({
            channelId: post.channelId || process.env.DISCORD_DEFAULT_CHANNEL_ID,
            content: post.content,
        });
        return {
            success: result.success,
            postUrl: result.url,
            error: result.error,
        };
    }
    /**
     * Get registered accounts
     */
    getAccounts(platform) {
        const accounts = Array.from(this.accounts.values());
        if (platform) {
            return accounts.filter(a => a.platform === platform);
        }
        return accounts;
    }
    /**
     * Check if a platform is configured
     */
    isPlatformConfigured(platform) {
        return this.platformClients.has(platform);
    }
    /**
     * Get list of configured platforms
     */
    getConfiguredPlatforms() {
        return Array.from(this.platformClients.keys());
    }
}
