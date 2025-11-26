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
export { YouTubePoster } from "./platforms/youtube";
export { GitHubPoster } from "./platforms/github";
export { NotionPoster } from "./platforms/notion";
export { SlackPoster } from "./platforms/slack";
export { DiscordPoster } from "./platforms/discord";

// Media scanner
export { MediaScanner, type MediaFile, type MediaScanOptions } from "./media-scanner";

// Media aggregator (Dropbox, OneDrive, iCloud, social media)
export { MediaAggregator, type AggregatedMedia, type MediaSource } from "./media-aggregator";

// Cloud storage access
export { DropboxMediaAccess, type DropboxFile } from "./platforms/dropbox";
export { OneDriveMediaAccess, type OneDriveFile } from "./platforms/onedrive";
export { iCloudPhotosAccess, type iCloudPhoto } from "./platforms/icloud-photos";

// Main poster class
export { SocialMediaPoster } from "./SocialMediaPoster";

