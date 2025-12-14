/**
 * Social Media Poster
 * 
 * Real API integrations for posting to:
 * - Twitter/X
 * - Instagram
 * - TikTok
 * - Facebook
 * - LinkedIn
 * - YouTube
 * - GitHub
 * - Notion
 * - Slack
 * - Discord
 * - Telegram
 * - Base/Farcaster
 * - Reddit
 * 
 * Supports both DreamNet accounts and user personal accounts (OAuth)
 */

export type SocialPlatform = 
  | "twitter" 
  | "instagram" 
  | "facebook" 
  | "linkedin" 
  | "tiktok" 
  | "threads"
  | "youtube"
  | "github"
  | "notion"
  | "slack"
  | "discord"
  | "telegram"
  | "farcaster"
  | "base"
  | "reddit";

export interface SocialPost {
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  platform: SocialPlatform;
}

export interface SocialAccount {
  platform: SocialPlatform;
  accountId: string;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isPersonal?: boolean; // true if using user's personal account
}

export interface PostResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

// Export platform-specific clients
export { TwitterPoster } from "./platforms/twitter";
export { InstagramPoster } from "./platforms/instagram";
export { FacebookPoster } from "./platforms/facebook";
export { LinkedInPoster } from "./platforms/linkedin";
export { TikTokPoster } from "./platforms/tiktok";
export { YouTubePoster } from "./src/platforms/youtube";
export { GitHubPoster } from "./src/platforms/github";
export { NotionPoster } from "./src/platforms/notion";
export { SlackPoster } from "./src/platforms/slack";
export { DiscordPoster } from "./src/platforms/discord";

// Media scanner
export { MediaScanner, type MediaFile, type MediaScanOptions } from "./src/media-scanner";

// Media aggregator (Dropbox, OneDrive, iCloud, social media)
export { MediaAggregator, type AggregatedMedia, type MediaSource } from "./src/media-aggregator";

// Cloud storage access
export { DropboxMediaAccess, type DropboxFile } from "./src/platforms/dropbox";
export { OneDriveMediaAccess, type OneDriveFile } from "./src/platforms/onedrive";
export { iCloudPhotosAccess, type iCloudPhoto } from "./src/platforms/icloud-photos";

// Main poster class
export { SocialMediaPoster } from "./SocialMediaPoster";

