/**
 * SocialWeaver - Social Star
 *
 * Content ops, auto-scheduling, A/B hooks, reply trees, growth rituals
 * APIs: Telegram Bot, Farcaster, X, Instagram/Facebook
 */
export interface SocialPost {
    id: string;
    content: string;
    platforms: string[];
    mediaUrls?: string[];
    scheduledFor?: string;
    postedAt?: string;
    status: "draft" | "scheduled" | "posted" | "failed";
    metrics?: {
        views?: number;
        likes?: number;
        shares?: number;
        comments?: number;
    };
    utmTags?: Record<string, string>;
}
export interface GrowthReport {
    id: string;
    period: "daily" | "weekly" | "monthly";
    startDate: string;
    endDate: string;
    metrics: {
        totalPosts: number;
        totalEngagement: number;
        followerGrowth: number;
        topPerformingPost?: string;
    };
    platforms: Record<string, {
        posts: number;
        engagement: number;
        followers: number;
    }>;
}
export declare class SocialWeaver {
    private posts;
    private reports;
    /**
     * Schedule a post
     */
    schedulePost(content: string, platforms: string[], scheduledFor: string, mediaUrls?: string[], utmTags?: Record<string, string>): Promise<SocialPost>;
    /**
     * Post immediately to platforms
     */
    postNow(content: string, platforms: string[], mediaUrls?: string[], utmTags?: Record<string, string>): Promise<SocialPost>;
    /**
     * Generate reply tree for a post
     */
    generateReplyTree(postId: string, depth?: number): Promise<SocialPost[]>;
    /**
     * Run A/B test on content
     */
    runABTest(variantA: string, variantB: string, platforms: string[], audienceSplit?: number): Promise<{
        variantA: SocialPost;
        variantB: SocialPost;
    }>;
    /**
     * Generate weekly growth report
     */
    generateGrowthReport(period: "daily" | "weekly" | "monthly"): Promise<GrowthReport>;
    /**
     * Get post by ID
     */
    getPost(id: string): SocialPost | undefined;
    /**
     * Get all posts
     */
    getAllPosts(): SocialPost[];
    /**
     * Get recent growth reports
     */
    getRecentReports(limit?: number): GrowthReport[];
}
export default SocialWeaver;
