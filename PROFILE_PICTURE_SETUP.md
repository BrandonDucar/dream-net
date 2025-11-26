# Profile Picture Setup - DreamNet Branding

## 🎨 Image Strategy

### Primary Image: Hooded Figure with Red Visor
**Use for:** All platforms except Farcaster
- Represents: Digital guardian, AI agent, network operator
- Visual: Dark hooded figure with glowing red visor, green circuit patterns, white chest symbol
- Background: Digital blue grid with multicolored nodes

### Secondary Image: Spherical Robot Creature  
**Use for:** Farcaster only
- Represents: Powerful AI entity, DreamNet mascot
- Visual: Dark metallic robot with cyan/purple glowing circuits, wide grin, orange circle frame

## 📋 Platform Setup Checklist

### ✅ Reddit (IN PROGRESS)
- [x] Navigate to Reddit apps page
- [ ] Check existing app or create new
- [ ] Get Client ID and Secret
- [ ] Navigate to profile settings
- [ ] Upload primary image (hooded figure)

### Profile Picture Upload URLs

1. **Reddit**: https://www.reddit.com/settings/profile
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
13. **Farcaster**: https://warpcast.com/~/settings (use robot creature image)

## 🖼️ Image Specifications

### Primary Image (Hooded Figure)
- **Format**: PNG (recommended) or JPG
- **Size**: 400x400px to 1024x1024px (square)
- **File size**: Under 2MB
- **Aspect ratio**: 1:1 (square)
- **Optimization**: May need to compress for some platforms

### Secondary Image (Robot Creature)
- **Format**: PNG (recommended) or JPG
- **Size**: 400x400px to 1024x1024px (square)
- **File size**: Under 2MB
- **Aspect ratio**: 1:1 (square)
- **Platform**: Farcaster only

## 🔧 Reddit App Configuration

### Steps to Configure Reddit App:
1. Navigate to: https://www.reddit.com/prefs/apps
2. Click "create an app..." button
3. Fill in:
   - **Name**: DreamNet Social Media
   - **Type**: script
   - **Description**: Automated social media posting for DreamNet
   - **About URL**: https://dreamnet.ink
   - **Redirect URI**: http://localhost:3000/oauth/reddit/callback
4. Get credentials:
   - **Client ID**: (shown under app name)
   - **Client Secret**: (click "secret" to reveal)
5. Add to `.env`:
   ```env
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_client_secret
   REDDIT_USERNAME=your_reddit_username
   REDDIT_PASSWORD=your_reddit_password
   ```

## 📝 Next Steps

1. **Complete Reddit app setup** - Get Client ID and Secret
2. **Upload profile picture to Reddit** - Use primary image
3. **Work through all other platforms** - Upload primary image to each
4. **Set Farcaster profile** - Upload secondary image (robot creature)
5. **Update all platform integrations** - Ensure profile pictures are set

## 🚀 Automation

I've created scripts to help navigate to all profile picture upload pages. The browser automation can:
- Navigate to each platform's profile settings
- Fill in forms where possible
- Guide you through the upload process

**Note**: Actual image upload requires you to select the file, but I can navigate to the right pages and guide you through it.

