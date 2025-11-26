# Reddit Setup - Complete Guide

## ✅ Current Status

### Reddit App Creation Form
- **Status**: Form is filled out and ready
- **App Name**: DreamNet Social Media
- **Type**: script (selected)
- **Description**: Automated social media posting and content management for DreamNet platform
- **About URL**: https://dreamnet.ink
- **Redirect URI**: http://localhost:3000/oauth/reddit/callback

### Next Steps:
1. **Complete CAPTCHA** - Check the "I'm not a robot" box
2. **Click "create app"** button
3. **Get credentials**:
   - Client ID (shown under app name)
   - Client Secret (click "secret" to reveal)
4. **Add to .env**:
   ```env
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   REDDIT_USERNAME=GhostMintOps
   REDDIT_PASSWORD=your_password_here
   ```

## 🖼️ Profile Picture Upload

### Avatar Upload (Ready)
- **Status**: Avatar upload dialog should be open
- **Image**: Use the hooded figure with red visor (primary image)
- **Steps**:
  1. Click "Upload" or "Choose File" button
  2. Select your hooded figure image
  3. Crop/resize if needed (Reddit accepts square images)
  4. Save changes

### Profile Settings URL
- **Direct link**: https://www.reddit.com/settings/profile
- **Avatar button**: Click "Open modal to change setting: Avatar"

## 📋 Reddit API Integration

### Using Reddit API with snoowrap

```typescript
import snoowrap from 'snoowrap';

const reddit = new snoowrap({
  userAgent: 'DreamNet Social Media Bot',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

// Post to subreddit
async function postToReddit(subreddit: string, title: string, text: string) {
  return await reddit.getSubreddit(subreddit).submitSelfpost({
    title,
    text
  });
}
```

## 🎯 Profile Picture Strategy

### Primary Image (Hooded Figure)
- **Use for**: Reddit, Twitter/X, Instagram, TikTok, Facebook, LinkedIn, GitHub, Discord, Slack, Notion, YouTube, Telegram
- **Description**: Dark hooded figure with glowing red visor, green circuit patterns, white chest symbol
- **Background**: Digital blue grid with multicolored nodes

### Secondary Image (Robot Creature)
- **Use for**: Farcaster only
- **Description**: Spherical dark metallic robot with cyan/purple glowing circuits, wide grin, orange circle frame

## 📝 All Platform Profile Picture URLs

1. **Reddit**: https://www.reddit.com/settings/profile ✅ (Currently open)
2. **Twitter/X**: https://x.com/settings/profile
3. **Instagram**: https://www.instagram.com/accounts/edit/
4. **TikTok**: https://www.tiktok.com/setting
5. **Facebook**: https://www.facebook.com/settings?tab=profile
6. **LinkedIn**: https://www.linkedin.com/me/profile-edit/
7. **GitHub**: https://github.com/settings/profile
8. **Discord**: Discord app → User Settings → My Account → Edit
9. **Slack**: Slack workspace → Profile → Edit → Change photo
10. **Notion**: Notion → Settings & Members → My account → Profile photo
11. **YouTube**: https://studio.youtube.com/channel/UC.../branding
12. **Telegram**: Telegram app → Settings → Edit Profile → Change Photo
13. **Farcaster**: https://warpcast.com/~/settings (use robot creature)

## 🚀 Next Actions

1. **Complete Reddit app creation** - Check CAPTCHA and click "create app"
2. **Upload Reddit profile picture** - Use hooded figure image
3. **Get Reddit API credentials** - Copy Client ID and Secret
4. **Work through other platforms** - Upload profile pictures systematically

