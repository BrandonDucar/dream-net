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
export { MediaScanner } from "./media-scanner";
// Media aggregator (Dropbox, OneDrive, iCloud, social media)
export { MediaAggregator } from "./media-aggregator";
// Cloud storage access
export { DropboxMediaAccess } from "./platforms/dropbox";
export { OneDriveMediaAccess } from "./platforms/onedrive";
export { iCloudPhotosAccess } from "./platforms/icloud-photos";
// Main poster class
export { SocialMediaPoster } from "./SocialMediaPoster";
