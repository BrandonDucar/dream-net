# 📱 Social Media Quick Setup - Automated

## 🤖 API Keeper Auto-Discovery

**Good news!** API Keeper automatically discovers API keys from your `.env` file!

### How It Works

1. **Add keys to `.env`** - API Keeper scans on startup
2. **Auto-registers** - Keys are automatically available
3. **Orca Pack uses them** - No manual registration needed

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get API Keys (I can help navigate!)

Run this script to get guided setup:
```bash
tsx scripts/auto-setup-social-media.ts
```

This will:
- Open browser to developer portals
- Guide you through getting keys
- Extract keys when possible

### Step 2: Add to `.env`

Just add the keys you got:
```bash
# Twitter (fastest to get)
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_TOKEN_SECRET=your_secret

# Instagram (requires Facebook Developer account)
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_id

# Facebook (same as Instagram)
FACEBOOK_PAGE_ACCESS_TOKEN=your_token
FACEBOOK_PAGE_ID=your_page_id

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_token

# TikTok
TIKTOK_CLIENT_KEY=your_key
TIKTOK_CLIENT_SECRET=your_secret
TIKTOK_ACCESS_TOKEN=your_token
```

### Step 3: Check What's Ready

```bash
tsx scripts/setup-social-media-keys.ts
```

This will:
- Check which keys you have
- Tell you what's missing
- Show which platforms are ready to post

---

## 🎯 Minimum Setup (Just Twitter)

**Fastest way to start posting:**

1. Get Twitter API keys (5 minutes)
2. Add to `.env`
3. Run `tsx scripts/orca-post-marketplace.ts`
4. Orca Pack will post automatically!

---

## 🔄 What Happens Next

1. **API Keeper** auto-discovers keys from `.env`
2. **Orca Pack** generates posts about marketplace
3. **SocialMediaOps** uses real APIs to post
4. **Posts go live** on your accounts!

---

## 💡 Pro Tips

- **Start with Twitter** - Easiest to get API keys
- **Use personal accounts** - Faster than creating new ones
- **API Keeper handles everything** - Just add keys to `.env`

---

**Ready?** Add your keys to `.env` and Orca Pack will start posting! 🚀

