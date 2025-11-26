/**
 * Social Media Operations Agent
 * 
 * Manages all DreamNet social media accounts:
 * - Creates accounts if needed
 * - Posts content across platforms
 * - Manages content calendar
 * - Tracks engagement
 */

import { randomUUID } from "node:crypto";

export type SocialPlatform = "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "threads";

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  accountId?: string;
  accessToken?: string;
  refreshToken?: string;
  status: "active" | "pending" | "error";
  createdAt: string;
  lastPostAt?: string;
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  scheduledFor?: string;
  postedAt?: string;
  status: "draft" | "scheduled" | "posted" | "failed";
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
  metadata?: Record<string, unknown>;
}

export interface SocialMediaOpsConfig {
  autoPost: boolean;
  postFrequency: {
    twitter: number; // posts per day
    instagram: number;
    facebook: number;
    linkedin: number;
    tiktok: number;
    youtube: number;
    threads: number;
  };
  contentSources: string[]; // e.g., ["dreams", "updates", "community"]
}

class SocialMediaOpsAgent {
  private accounts: Map<string, SocialAccount> = new Map();
  private posts: Map<string, SocialPost> = new Map();
  private config: SocialMediaOpsConfig = {
    autoPost: true,
    postFrequency: {
      twitter: 3,
      instagram: 2,
      facebook: 1,
      linkedin: 1,
      tiktok: 1,
      youtube: 0.1, // weekly
      threads: 2,
    },
    contentSources: ["dreams", "updates", "community"],
  };

  /**
   * Initialize or create social media accounts
   */
  async initializeAccounts(): Promise<SocialAccount[]> {
    const platforms: SocialPlatform[] = [
      "twitter",
      "instagram",
      "facebook",
      "linkedin",
      "tiktok",
      "youtube",
      "threads",
    ];

    const accounts: SocialAccount[] = [];

    for (const platform of platforms) {
      let account = Array.from(this.accounts.values()).find(
        a => a.platform === platform && a.status === "active"
      );

      if (!account) {
        // Create new account entry
        account = {
          id: randomUUID(),
          platform,
          username: this.getDefaultUsername(platform),
          displayName: "DreamNet",
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        this.accounts.set(account.id, account);
        console.log(`📱 [Social Media Ops] Created ${platform} account: ${account.username}`);
      }

      accounts.push(account);
    }

    return accounts;
  }

  /**
   * Get default username for platform
   */
  private getDefaultUsername(platform: SocialPlatform): string {
    const usernames: Record<SocialPlatform, string> = {
      twitter: "@dreamnet_ink",
      instagram: "@dreamnet.ink",
      facebook: "dreamnet.ink",
      linkedin: "dreamnet",
      tiktok: "@dreamnet",
      youtube: "@dreamnet",
      threads: "@dreamnet_ink",
    };
    return usernames[platform];
  }

  /**
   * Create a post
   */
  async createPost(
    platform: SocialPlatform,
    content: string,
    mediaUrls?: string[],
    scheduledFor?: string
  ): Promise<SocialPost> {
    const post: SocialPost = {
      id: randomUUID(),
      platform,
      content,
      mediaUrls,
      scheduledFor,
      status: scheduledFor ? "scheduled" : "draft",
      metadata: {
        createdAt: new Date().toISOString(),
      },
    };

    this.posts.set(post.id, post);

    // Auto-post if enabled and not scheduled
    if (this.config.autoPost && !scheduledFor) {
      await this.postToPlatform(post);
    }

    return post;
  }

  /**
   * Post to platform using real APIs
   */
  private async postToPlatform(post: SocialPost): Promise<void> {
    const account = Array.from(this.accounts.values()).find(
      a => a.platform === post.platform && a.status === "active"
    );

    if (!account) {
      console.warn(`[Social Media Ops] No active account for ${post.platform}`);
      post.status = "failed";
      return;
    }

    try {
      // Import SocialMediaPoster
      const { SocialMediaPoster } = await import("../../packages/social-media-poster/SocialMediaPoster");
      const poster = new SocialMediaPoster();

      // Get credentials from environment or account
      const credentials = this.getCredentialsForAccount(account);

      // Register account if not already registered
      poster.registerAccount(account, credentials);

      // Post using real API
      const result = await poster.post({
        content: post.content,
        mediaUrls: post.mediaUrls,
        hashtags: post.hashtags,
        platform: post.platform,
      }, account.id);

      if (result.success) {
        post.status = "posted";
        post.postedAt = new Date().toISOString();
        post.postId = result.postId;
        post.postUrl = result.postUrl;
        account.lastPostAt = new Date().toISOString();

        console.log(`✅ [Social Media Ops] Posted to ${post.platform}: ${result.postUrl || result.postId}`);

        // Update engagement tracking (will be fetched later)
        post.engagement = {
          likes: 0,
          shares: 0,
          comments: 0,
          views: 0,
        };
      } else {
        throw new Error(result.error || "Post failed");
      }
    } catch (error: any) {
      console.error(`[Social Media Ops] Failed to post to ${post.platform}:`, error);
      post.status = "failed";
      post.error = error.message;
    }
  }

  /**
   * Get credentials for an account from environment variables
   */
  private getCredentialsForAccount(account: SocialAccount): Record<string, string> {
    const platform = account.platform;
    const credentials: Record<string, string> = {};

    switch (platform) {
      case "twitter":
        credentials.apiKey = process.env.TWITTER_API_KEY || "";
        credentials.apiSecret = process.env.TWITTER_API_SECRET || "";
        credentials.accessToken = process.env.TWITTER_ACCESS_TOKEN || account.accessToken || "";
        credentials.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || "";
        credentials.bearerToken = process.env.TWITTER_BEARER_TOKEN;
        break;

      case "instagram":
        credentials.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || account.accessToken || "";
        credentials.instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || account.accountId;
        credentials.pageId = process.env.FACEBOOK_PAGE_ID;
        break;

      case "facebook":
        credentials.accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || account.accessToken || "";
        credentials.pageId = process.env.FACEBOOK_PAGE_ID || account.accountId;
        break;

      case "linkedin":
        credentials.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || account.accessToken || "";
        credentials.personUrn = process.env.LINKEDIN_PERSON_URN;
        break;

      case "tiktok":
        credentials.clientKey = process.env.TIKTOK_CLIENT_KEY || "";
        credentials.clientSecret = process.env.TIKTOK_CLIENT_SECRET || "";
        credentials.accessToken = process.env.TIKTOK_ACCESS_TOKEN || account.accessToken || "";
        credentials.openId = process.env.TIKTOK_OPEN_ID || account.accountId;
        break;
    }

    return credentials;
  }

  /**
   * Post to all platforms
   */
  async postToAllPlatforms(content: string, mediaUrls?: string[]): Promise<SocialPost[]> {
    const platforms: SocialPlatform[] = [
      "twitter",
      "instagram",
      "facebook",
      "linkedin",
      "threads",
    ];

    const posts: SocialPost[] = [];

    for (const platform of platforms) {
      const post = await this.createPost(platform, content, mediaUrls);
      posts.push(post);
    }

    return posts;
  }

  /**
   * Get content from sources
   */
  async generateContent(source: string): Promise<string> {
    // TODO: Integrate with content generation
    // For now, return template content
    const templates: Record<string, string[]> = {
      dreams: [
        "🌟 New dream launched on DreamNet! Check it out: [link]",
        "✨ Another dream is evolving. Watch it grow: [link]",
        "🚀 DreamNet is alive. Dreams are becoming reality: [link]",
      ],
      updates: [
        "📢 DreamNet Update: New features, new possibilities: [link]",
        "🎉 Exciting news from DreamNet: [details]",
        "⚡ DreamNet is evolving. Here's what's new: [link]",
      ],
      community: [
        "👥 Join the DreamNet community: [link]",
        "💬 What dreams are you building? Share with us: [link]",
        "🤝 DreamNet community is growing. Be part of it: [link]",
      ],
    };

    const options = templates[source] || templates.dreams;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Start auto-posting
   */
  startAutoPosting(): void {
    if (!this.config.autoPost) return;

    console.log("📱 [Social Media Ops] Starting auto-posting...");

    // Post to Twitter every 8 hours
    setInterval(async () => {
      const content = await this.generateContent("dreams");
      await this.createPost("twitter", content);
    }, 8 * 60 * 60 * 1000);

    // Post to Instagram every 12 hours
    setInterval(async () => {
      const content = await this.generateContent("updates");
      await this.createPost("instagram", content);
    }, 12 * 60 * 60 * 1000);

    // Post to other platforms daily
    setInterval(async () => {
      const content = await this.generateContent("community");
      await this.postToAllPlatforms(content);
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Get all accounts
   */
  getAccounts(): SocialAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Get all posts
   */
  getPosts(platform?: SocialPlatform): SocialPost[] {
    const allPosts = Array.from(this.posts.values());
    return platform
      ? allPosts.filter(p => p.platform === platform)
      : allPosts;
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<SocialMediaOpsConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton
export const socialMediaOps = new SocialMediaOpsAgent();

