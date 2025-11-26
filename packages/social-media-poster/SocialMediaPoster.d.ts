/**
 * Social Media Poster - Unified Interface
 *
 * Handles posting to all platforms with account management
 * Now supports 12+ platforms!
 */
import type { SocialPlatform, SocialPost, SocialAccount, PostResult } from "./index";
export declare class SocialMediaPoster {
    private accounts;
    private platformClients;
    constructor();
    /**
     * Auto-configure from environment variables
     */
    private autoConfigureFromEnv;
    /**
     * Register an account for posting
     */
    registerAccount(account: SocialAccount, credentials: Record<string, string>): void;
    /**
     * Post to a platform
     */
    post(post: SocialPost & {
        type?: string;
        title?: string;
    }): Promise<PostResult>;
    private postToTwitter;
    private postToInstagram;
    private postToFacebook;
    private postToLinkedIn;
    private postToTikTok;
    private postToYouTube;
    private postToGitHub;
    private postToNotion;
    private postToSlack;
    private postToDiscord;
    /**
     * Get registered accounts
     */
    getAccounts(platform?: SocialPlatform): SocialAccount[];
    /**
     * Check if a platform is configured
     */
    isPlatformConfigured(platform: SocialPlatform): boolean;
    /**
     * Get list of configured platforms
     */
    getConfiguredPlatforms(): SocialPlatform[];
}
