# 📱 DreamNet Social Media Setup Guide

## 🎯 Priority Order

1. **Telegram** ⭐ (Easiest - 2 minutes)
2. **Base + Farcaster** ⭐ (Blockchain social - uses your wallet)
3. **Instagram** (Traditional platform)
4. **Reddit** (Traditional platform)
5. **TikTok** (Traditional platform)
6. **LinkedIn** (Optional)

---

## 🤖 1. Telegram (DreamNet Bot)

### Quick Setup (2 minutes)

1. **Open Telegram** and search for `@BotFather`
2. **Send:** `/newbot`
3. **Follow prompts:**
   - Bot name: `DreamNet Bot`
   - Username: `dreamnet_bot` (or whatever is available)
4. **BotFather gives you a token** like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. **Copy token** and add to `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### Get Chat ID

1. **Send a message** to your new bot (search for it in Telegram)
2. **Visit:** `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   (Replace `<YOUR_TOKEN>` with your actual token)
3. **Look for:** `"chat":{"id":123456789}`
4. **Add to .env:**
   ```env
   TELEGRAM_CHAT_ID=123456789
   ```

**✅ Done!** Telegram is now configured for DreamNet.

---

## ⛓️ 2. Base (Blockchain Social)

Base is a Layer 2 blockchain. For social posting:

### Option A: Use Your Existing Wallet
- Base uses the same wallet as DreamNet
- Add to `.env`:
  ```env
  BASE_WALLET_PRIVATE_KEY=your_existing_wallet_private_key
  ```

### Option B: Use Farcaster (Recommended)
- Farcaster is the social layer on Base
- See "Farcaster" section below

**Base API:**
- Go to: https://base.org/developers
- Base is primarily blockchain-based (smart contracts)
- Social features are via Farcaster

---

## 🌐 3. Farcaster (Decentralized Social on Base)

Farcaster is the social protocol that runs on Base.

### Setup Steps

1. **Go to:** https://warpcast.com/
2. **Create account** (or use existing)
3. **Install Warpcast app** (iOS/Android) or use web
4. **Get your credentials:**
   - Go to **Settings** → **Developer** → **Create Signer**
   - Copy your **mnemonic phrase** (keep it secret!)
   - Get your **FID** (Farcaster ID) from your profile
5. **Add to .env:**
   ```env
   FARCASTER_MNEMONIC=your twelve word mnemonic phrase here
   FARCASTER_FID=12345
   ```

**✅ Done!** You can now post to Farcaster (which appears on Base).

---

## 📸 4. Instagram (via Facebook Developer)

Instagram uses Facebook's API.

### Setup Steps

1. **Go to:** https://developers.facebook.com/apps/
2. **Log in** with Facebook account
3. **Create App:**
   - Click "Create App"
   - Select "Business" type
   - Fill in app details
4. **Add Instagram Product:**
   - Go to "Add Products"
   - Find "Instagram" and click "Set Up"
5. **Link Instagram Business Account:**
   - You need an Instagram Business Account
   - Link it to a Facebook Page
6. **Get Access Token:**
   - Go to "Tools" → "Graph API Explorer"
   - Select your app
   - Generate token with `instagram_basic`, `pages_show_list`, `pages_read_engagement` permissions
7. **Get IDs:**
   - Instagram Business Account ID (from Instagram settings)
   - Facebook Page ID (from Facebook Page settings)
8. **Add to .env:**
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_access_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=123456789
   FACEBOOK_PAGE_ID=987654321
   ```

**Note:** Instagram requires a Business Account (not personal).

---

## 🔴 5. Reddit

### Setup Steps

1. **Go to:** https://www.reddit.com/prefs/apps
2. **Log in** to Reddit
3. **Create App:**
   - Click "create another app" or "create app"
   - Fill in:
     - **Name:** DreamNet Bot
     - **Type:** script
     - **Description:** Social media automation for DreamNet
     - **About URL:** https://dreamnet.ink
     - **Redirect URI:** http://localhost:3000
4. **Copy Credentials:**
   - **Client ID:** Under the app name (looks like: `abc123def456`)
   - **Secret:** The "secret" field (looks like: `xyz789_secret_key`)
5. **Add to .env:**
   ```env
   REDDIT_CLIENT_ID=abc123def456
   REDDIT_CLIENT_SECRET=xyz789_secret_key
   REDDIT_USERNAME=your_reddit_username
   REDDIT_PASSWORD=your_reddit_password
   ```

**✅ Done!** Reddit is configured.

---

## 🎵 6. TikTok

### Setup Steps

1. **Go to:** https://developers.tiktok.com/
2. **Log in** with TikTok account
3. **Create App:**
   - Click "Create App"
   - Fill in app details
   - Select "Content Posting" as primary use case
4. **Get Credentials:**
   - **Client Key:** From app dashboard
   - **Client Secret:** From app dashboard
5. **Generate Access Token:**
   - Go to "Tools" → "Generate Token"
   - Select permissions: `video.upload`, `user.info.basic`
6. **Add to .env:**
   ```env
   TIKTOK_CLIENT_KEY=your_client_key
   TIKTOK_CLIENT_SECRET=your_client_secret
   TIKTOK_ACCESS_TOKEN=your_access_token
   ```

**✅ Done!** TikTok is configured.

---

## 💼 7. LinkedIn (Optional)

### Setup Steps

1. **Go to:** https://www.linkedin.com/developers/apps
2. **Log in** with LinkedIn account
3. **Create App:**
   - Click "Create app"
   - Fill in app details
4. **Request Access:**
   - Request "Marketing Developer Platform" access
   - Wait for approval (can take a few days)
5. **Get Credentials:**
   - **Client ID:** From app dashboard
   - **Client Secret:** From app dashboard
6. **Generate Access Token:**
   - Use OAuth flow or generate token manually
   - Required permission: `w_member_social`
7. **Add to .env:**
   ```env
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_ACCESS_TOKEN=your_access_token
   ```

**✅ Done!** LinkedIn is configured.

---

## 🚀 Quick Setup Script

Run this to see what's configured and what's missing:

```bash
tsx scripts/setup-all-social-platforms.ts
```

This will:
- ✅ Check which platforms are already configured
- 📋 Show setup instructions for missing platforms
- 📄 Generate `.env.social-media.template` with all keys

---

## ✅ After Setup

1. **Add all keys to `.env`**
2. **API Keeper auto-discovers** them (no manual registration needed!)
3. **Orca Pack automatically** starts posting to configured platforms
4. **Check status:**
   ```bash
   tsx scripts/setup-social-media-keys.ts
   ```

---

## 🎯 Recommended Order

1. **Telegram** (2 min) ⭐
2. **Farcaster** (5 min) ⭐
3. **Instagram** (10 min)
4. **Reddit** (5 min)
5. **TikTok** (10 min)
6. **LinkedIn** (optional, requires approval)

**Start with Telegram and Farcaster - they're the fastest!** 🚀
