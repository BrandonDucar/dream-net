/**
 * Social Media Authentication Routes
 * 
 * Handles OAuth flows for connecting user's personal social media accounts
 * or creating/managing DreamNet social accounts
 */

import { Router } from "express";
import { SocialMediaPoster } from "../../packages/social-media-poster/SocialMediaPoster";

const router = Router();
const poster = new SocialMediaPoster();

// ============================================================================
// Account Management
// ============================================================================

/**
 * POST /api/social-media-auth/register
 * Register a social media account (user's personal or DreamNet account)
 */
router.post("/register", async (req, res) => {
  try {
    const { platform, accountId, username, credentials, isPersonal } = req.body;

    if (!platform || !accountId || !credentials) {
      return res.status(400).json({
        success: false,
        error: "platform, accountId, and credentials are required",
      });
    }

    // Register account with poster
    poster.registerAccount(
      {
        platform,
        accountId,
        username: username || accountId,
        isPersonal: isPersonal || false,
      },
      credentials
    );

    res.json({
      success: true,
      message: `Account registered for ${platform}`,
      accountId,
    });
  } catch (error: any) {
    console.error("[Social Media Auth] Registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Registration failed",
    });
  }
});

/**
 * GET /api/social-media-auth/accounts
 * List all registered accounts
 */
router.get("/accounts", async (req, res) => {
  try {
    const platform = req.query.platform as string | undefined;
    const accounts = poster.getAccounts(platform as any);

    res.json({
      success: true,
      accounts,
      count: accounts.length,
    });
  } catch (error: any) {
    console.error("[Social Media Auth] List error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to list accounts",
    });
  }
});

// ============================================================================
// OAuth Flows (Placeholder - needs actual OAuth implementation)
// ============================================================================

/**
 * GET /api/social-media-auth/oauth/:platform/authorize
 * Start OAuth flow for a platform
 */
router.get("/oauth/:platform/authorize", async (req, res) => {
  try {
    const { platform } = req.params;
    const redirectUri = req.query.redirect_uri as string || `${req.protocol}://${req.get("host")}/api/social-media-auth/oauth/${platform}/callback`;

    // Generate OAuth URLs for each platform
    const oauthUrls: Record<string, string> = {
      twitter: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${Date.now()}`,
      instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code&state=${Date.now()}`,
      facebook: `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,pages_read_engagement&state=${Date.now()}`,
      linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social&state=${Date.now()}`,
      tiktok: `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic,video.upload&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${Date.now()}`,
    };

    const url = oauthUrls[platform.toLowerCase()];
    if (!url) {
      return res.status(400).json({
        success: false,
        error: `Unsupported platform: ${platform}`,
      });
    }

    res.json({
      success: true,
      authorizationUrl: url,
      platform,
    });
  } catch (error: any) {
    console.error("[Social Media Auth] OAuth error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "OAuth flow failed",
    });
  }
});

/**
 * GET /api/social-media-auth/oauth/:platform/callback
 * Handle OAuth callback
 */
router.get("/oauth/:platform/callback", async (req, res) => {
  try {
    const { platform } = req.params;
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Authorization code missing",
      });
    }

    // TODO: Exchange code for access token
    // This requires platform-specific token exchange logic

    res.json({
      success: true,
      message: `OAuth callback received for ${platform}`,
      note: "Token exchange needs to be implemented per platform",
      code,
    });
  } catch (error: any) {
    console.error("[Social Media Auth] Callback error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "OAuth callback failed",
    });
  }
});

export { router as createSocialMediaAuthRouter };

