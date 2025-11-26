#!/usr/bin/env tsx
/**
 * API Key Collection Helper
 * Opens all developer portals and guides you through getting API keys
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const DEVELOPER_PORTALS = {
  // Easiest (2-5 minutes)
  telegram: {
    name: 'Telegram Bot',
    url: 'https://t.me/BotFather',
    instructions: [
      '1. Open Telegram and search for @BotFather',
      '2. Send: /newbot',
      '3. Follow prompts to create bot',
      '4. Copy the token (looks like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)',
      '5. Add to .env as: TELEGRAM_BOT_TOKEN=your_token_here',
      '6. To get Chat ID: Send message to your bot, then visit:',
      '   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates',
      '   Look for "chat":{"id":123456789}',
      '7. Add to .env as: TELEGRAM_CHAT_ID=123456789',
    ],
    envVars: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'],
  },
  
  // Twitter/X (5-10 minutes)
  twitter: {
    name: 'Twitter/X API',
    url: 'https://developer.twitter.com/en/portal/dashboard',
    instructions: [
      '1. Log in to Twitter/X',
      '2. Click "Create Project" (if you don\'t have one)',
      '3. Fill in project details (name, use case, description)',
      '4. Create an App within the project',
      '5. Go to "Keys and tokens" tab',
      '6. Generate/regenerate API Key, API Secret, Access Token, Access Token Secret',
      '7. Generate Bearer Token (if available)',
      '8. Add to .env:',
      '   TWITTER_API_KEY=your_api_key',
      '   TWITTER_API_SECRET=your_api_secret',
      '   TWITTER_ACCESS_TOKEN=your_access_token',
      '   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret',
      '   TWITTER_BEARER_TOKEN=your_bearer_token (optional)',
    ],
    envVars: [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_TOKEN_SECRET',
      'TWITTER_BEARER_TOKEN',
    ],
  },

  // Reddit (5 minutes)
  reddit: {
    name: 'Reddit API',
    url: 'https://www.reddit.com/prefs/apps',
    instructions: [
      '1. Log in to Reddit',
      '2. Click "create another app" or "create app"',
      '3. Fill in:',
      '   - Name: DreamNet Bot',
      '   - Type: script',
      '   - Description: Social media automation for DreamNet',
      '   - About URL: https://dreamnet.ink',
      '   - Redirect URI: http://localhost:3000',
      '4. Copy Client ID (under app name)',
      '5. Copy Secret (the "secret" field)',
      '6. Add to .env:',
      '   REDDIT_CLIENT_ID=your_client_id',
      '   REDDIT_CLIENT_SECRET=your_client_secret',
      '   REDDIT_USERNAME=your_reddit_username',
      '   REDDIT_PASSWORD=your_reddit_password',
    ],
    envVars: [
      'REDDIT_CLIENT_ID',
      'REDDIT_CLIENT_SECRET',
      'REDDIT_USERNAME',
      'REDDIT_PASSWORD',
    ],
  },

  // GitHub (5 minutes)
  github: {
    name: 'GitHub Personal Access Token',
    url: 'https://github.com/settings/tokens',
    instructions: [
      '1. Log in to GitHub',
      '2. Click "Generate new token" → "Generate new token (classic)"',
      '3. Give it a name: "DreamNet Social Media"',
      '4. Select scopes: repo, gist, workflow',
      '5. Click "Generate token"',
      '6. Copy the token immediately (you won\'t see it again!)',
      '7. Add to .env:',
      '   GITHUB_TOKEN=your_token_here',
      '   GITHUB_OWNER=your_username',
      '   GITHUB_DEFAULT_REPO=your_repo_name',
    ],
    envVars: ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_DEFAULT_REPO'],
  },

  // Discord (5 minutes)
  discord: {
    name: 'Discord Bot',
    url: 'https://discord.com/developers/applications',
    instructions: [
      '1. Log in to Discord',
      '2. Click "New Application"',
      '3. Name it: "DreamNet Bot"',
      '4. Go to "Bot" tab',
      '5. Click "Add Bot"',
      '6. Copy the "Token" (click "Reset Token" if needed)',
      '7. Enable "Message Content Intent" under Privileged Gateway Intents',
      '8. Go to "OAuth2" → "URL Generator"',
      '9. Select scopes: bot, webhook.incoming',
      '10. Copy the generated URL and open it to invite bot to your server',
      '11. Add to .env:',
      '    DISCORD_BOT_TOKEN=your_bot_token',
      '    DISCORD_DEFAULT_CHANNEL_ID=your_channel_id',
      '',
      'OR use Webhooks (easier):',
      '1. Go to your Discord channel',
      '2. Settings → Integrations → Webhooks → New Webhook',
      '3. Copy the webhook URL',
      '4. Add to .env:',
      '    DISCORD_WEBHOOK_URL=your_webhook_url',
    ],
    envVars: [
      'DISCORD_BOT_TOKEN',
      'DISCORD_DEFAULT_CHANNEL_ID',
      'DISCORD_WEBHOOK_URL',
    ],
  },

  // Slack (5 minutes)
  slack: {
    name: 'Slack App',
    url: 'https://api.slack.com/apps',
    instructions: [
      'Option 1: Webhook (Easiest)',
      '1. Go to your Slack workspace',
      '2. Apps → Incoming Webhooks → Add to Slack',
      '3. Choose channel and create webhook',
      '4. Copy webhook URL',
      '5. Add to .env:',
      '    SLACK_WEBHOOK_URL=your_webhook_url',
      '',
      'Option 2: Bot Token (More features)',
      '1. Go to https://api.slack.com/apps',
      '2. Click "Create New App" → "From scratch"',
      '3. Name: "DreamNet Bot", Workspace: your workspace',
      '4. Go to "OAuth & Permissions"',
      '5. Add Bot Token Scopes: chat:write, channels:read',
      '6. Install app to workspace',
      '7. Copy "Bot User OAuth Token"',
      '8. Add to .env:',
      '    SLACK_BOT_TOKEN=xoxb-your-token',
      '    SLACK_DEFAULT_CHANNEL=#general',
    ],
    envVars: [
      'SLACK_WEBHOOK_URL',
      'SLACK_BOT_TOKEN',
      'SLACK_DEFAULT_CHANNEL',
    ],
  },

  // Instagram (10-15 minutes, requires Business Account)
  instagram: {
    name: 'Instagram (via Facebook)',
    url: 'https://developers.facebook.com/apps/',
    instructions: [
      '1. You need an Instagram Business Account (convert from personal if needed)',
      '2. Go to https://developers.facebook.com/apps/',
      '3. Log in with Facebook account',
      '4. Click "Create App" → Select "Business" type',
      '5. Fill in app details',
      '6. Add "Instagram" product',
      '7. Link Instagram Business Account to a Facebook Page',
      '8. Go to "Tools" → "Graph API Explorer"',
      '9. Select your app and generate token with permissions:',
      '    - instagram_basic',
      '    - pages_show_list',
      '    - pages_read_engagement',
      '10. Get Instagram Business Account ID from Instagram settings',
      '11. Get Facebook Page ID from Facebook Page settings',
      '12. Add to .env:',
      '    INSTAGRAM_ACCESS_TOKEN=your_access_token',
      '    INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id',
      '    FACEBOOK_PAGE_ID=your_page_id',
    ],
    envVars: [
      'INSTAGRAM_ACCESS_TOKEN',
      'INSTAGRAM_BUSINESS_ACCOUNT_ID',
      'FACEBOOK_PAGE_ID',
    ],
  },

  // Facebook (10 minutes)
  facebook: {
    name: 'Facebook Page',
    url: 'https://developers.facebook.com/apps/',
    instructions: [
      '1. Go to https://developers.facebook.com/apps/',
      '2. Use the same app you created for Instagram (or create new)',
      '3. Add "Facebook Login" product if not already added',
      '4. Go to "Tools" → "Graph API Explorer"',
      '5. Select your app and page',
      '6. Generate Page Access Token with permissions:',
      '    - pages_show_list',
      '    - pages_read_engagement',
      '    - pages_manage_posts',
      '7. Get Page ID from your Facebook Page settings',
      '8. Add to .env:',
      '    FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token',
      '    FACEBOOK_PAGE_ID=your_page_id',
    ],
    envVars: [
      'FACEBOOK_PAGE_ACCESS_TOKEN',
      'FACEBOOK_PAGE_ID',
    ],
  },

  // TikTok (10-15 minutes)
  tiktok: {
    name: 'TikTok Content Posting API',
    url: 'https://developers.tiktok.com/',
    instructions: [
      '1. Go to https://developers.tiktok.com/',
      '2. Log in with TikTok account',
      '3. Click "Create App"',
      '4. Fill in app details',
      '5. Select "Content Posting" as primary use case',
      '6. Get Client Key and Client Secret from app dashboard',
      '7. Go to "Tools" → "Generate Token"',
      '8. Select permissions: video.upload, user.info.basic',
      '9. Complete OAuth flow to get Access Token',
      '10. Get Open ID from user info endpoint',
      '11. Add to .env:',
      '    TIKTOK_CLIENT_KEY=your_client_key',
      '    TIKTOK_CLIENT_SECRET=your_client_secret',
      '    TIKTOK_ACCESS_TOKEN=your_access_token',
      '    TIKTOK_OPEN_ID=your_open_id',
    ],
    envVars: [
      'TIKTOK_CLIENT_KEY',
      'TIKTOK_CLIENT_SECRET',
      'TIKTOK_ACCESS_TOKEN',
      'TIKTOK_OPEN_ID',
    ],
  },

  // LinkedIn (10-15 minutes, may require approval)
  linkedin: {
    name: 'LinkedIn API',
    url: 'https://www.linkedin.com/developers/apps',
    instructions: [
      '1. Go to https://www.linkedin.com/developers/apps',
      '2. Log in with LinkedIn account',
      '3. Click "Create app"',
      '4. Fill in app details',
      '5. Request "Marketing Developer Platform" access (may take days)',
      '6. Get Client ID and Client Secret from app dashboard',
      '7. Generate Access Token with OAuth flow',
      '8. Required permission: w_member_social',
      '9. Get Person URN from your profile (format: urn:li:person:123456)',
      '10. Add to .env:',
      '    LINKEDIN_CLIENT_ID=your_client_id',
      '    LINKEDIN_CLIENT_SECRET=your_client_secret',
      '    LINKEDIN_ACCESS_TOKEN=your_access_token',
      '    LINKEDIN_PERSON_URN=urn:li:person:your_id',
    ],
    envVars: [
      'LINKEDIN_CLIENT_ID',
      'LINKEDIN_CLIENT_SECRET',
      'LINKEDIN_ACCESS_TOKEN',
      'LINKEDIN_PERSON_URN',
    ],
  },

  // YouTube (10-15 minutes)
  youtube: {
    name: 'YouTube Data API',
    url: 'https://console.cloud.google.com/apis/credentials',
    instructions: [
      '1. Go to https://console.cloud.google.com/',
      '2. Create a new project or select existing',
      '3. Enable "YouTube Data API v3"',
      '4. Go to "APIs & Services" → "Credentials"',
      '5. Click "Create Credentials" → "OAuth client ID"',
      '6. Application type: "Web application"',
      '7. Add authorized redirect URI: http://localhost:3000/oauth/youtube/callback',
      '8. Copy Client ID and Client Secret',
      '9. Complete OAuth flow to get Refresh Token',
      '10. Add to .env:',
      '    YOUTUBE_CLIENT_ID=your_client_id',
      '    YOUTUBE_CLIENT_SECRET=your_client_secret',
      '    YOUTUBE_REFRESH_TOKEN=your_refresh_token',
    ],
    envVars: [
      'YOUTUBE_CLIENT_ID',
      'YOUTUBE_CLIENT_SECRET',
      'YOUTUBE_REFRESH_TOKEN',
    ],
  },

  // Notion (5-10 minutes)
  notion: {
    name: 'Notion Integration',
    url: 'https://www.notion.so/my-integrations',
    instructions: [
      '1. Go to https://www.notion.so/my-integrations',
      '2. Click "New integration"',
      '3. Name: "DreamNet Social Media"',
      '4. Select workspace',
      '5. Copy the "Internal Integration Token"',
      '6. Share your Notion pages/databases with the integration',
      '7. Get Database ID or Page ID from the URL:',
      '    https://notion.so/YourWorkspace/DATABASE_ID?v=...',
      '8. Add to .env:',
      '    NOTION_TOKEN=your_integration_token',
      '    NOTION_DATABASE_ID=your_database_id (optional)',
      '    NOTION_DEFAULT_PAGE_ID=your_page_id (optional)',
    ],
    envVars: [
      'NOTION_TOKEN',
      'NOTION_DATABASE_ID',
      'NOTION_DEFAULT_PAGE_ID',
    ],
  },
};

function generateEnvTemplate(): string {
  const allVars = new Set<string>();
  Object.values(DEVELOPER_PORTALS).forEach(portal => {
    portal.envVars.forEach(v => allVars.add(v));
  });

  let template = '# Social Media API Keys\n';
  template += '# Generated by collect-api-keys.ts\n';
  template += '# Fill in the values below after getting keys from developer portals\n\n';

  // Group by platform
  Object.entries(DEVELOPER_PORTALS).forEach(([key, portal]) => {
    template += `# ${portal.name}\n`;
    portal.envVars.forEach(v => {
      template += `${v}=\n`;
    });
    template += '\n';
  });

  return template;
}

function main() {
  console.log('\n🚀 DreamNet API Key Collection Helper\n');
  console.log('This script will help you collect API keys from all developer portals.\n');

  // Generate .env template
  const envTemplate = generateEnvTemplate();
  const envPath = join(process.cwd(), '.env.social-media.template');
  writeFileSync(envPath, envTemplate);
  console.log(`✅ Generated template: ${envPath}\n`);

  // Print instructions
  console.log('📋 Platform Priority Order (Easiest → Hardest):\n');
  const priority = [
    'telegram',
    'github',
    'discord',
    'slack',
    'reddit',
    'notion',
    'twitter',
    'youtube',
    'tiktok',
    'instagram',
    'facebook',
    'linkedin',
  ];

  priority.forEach((key, index) => {
    const portal = DEVELOPER_PORTALS[key as keyof typeof DEVELOPER_PORTALS];
    if (portal) {
      console.log(`${index + 1}. ${portal.name}`);
      console.log(`   URL: ${portal.url}`);
      console.log(`   Time: ${key === 'telegram' ? '2 min' : key === 'linkedin' ? '10-15 min (may need approval)' : '5-10 min'}`);
      console.log('');
    }
  });

  console.log('\n📝 Instructions:\n');
  console.log('1. Start with Telegram (easiest - 2 minutes)');
  console.log('2. Work through each platform in order');
  console.log('3. Copy keys to your .env file as you get them');
  console.log('4. API Keeper will auto-discover them when you restart\n');

  console.log('🌐 Opening developer portals...\n');
  console.log('Copy these URLs and open them in your browser:\n');
  
  priority.forEach((key) => {
    const portal = DEVELOPER_PORTALS[key as keyof typeof DEVELOPER_PORTALS];
    if (portal) {
      console.log(`${portal.name}: ${portal.url}`);
    }
  });

  console.log('\n💡 Tip: Open each portal in a new tab and work through them one by one.\n');
  console.log('📖 Detailed instructions are in SOCIAL_MEDIA_SETUP_GUIDE.md\n');
}

main();

