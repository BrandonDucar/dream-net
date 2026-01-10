import type { SocialHubContext, FeedQuery, FeedItem } from "../types";
/**
 * Build a feed according to a simple query.
 */
export declare function buildFeed(ctx: SocialHubContext, query: FeedQuery): FeedItem[];
