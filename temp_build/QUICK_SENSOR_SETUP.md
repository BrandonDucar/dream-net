# Quick Sensor Setup Guide

## ✅ Your .env File Should Have:

```env
# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Telegram (Bot)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here  # Optional

# Twitter (API v2)
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_USERNAME=your_username  # Without @ symbol
```

## 🐦 How to Get Twitter Bearer Token:

1. **Go to**: https://developer.twitter.com/en/portal/dashboard
2. **Sign in** with your Twitter account
3. **Create a Project** (if you don't have one)
   - Click "Create Project"
   - Fill in name, use case, description
4. **Create an App** within the project
5. **Go to "Keys and tokens"** tab
6. **Under "Bearer Token"**, click **"Generate"**
7. **Copy the token** (starts with `AAAAA...`)

**Note**: Free tier gives you 1,500 tweets/month. For production, consider upgrading to Basic ($100/month) for 10,000 tweets/month.

## 📍 Where Sensors Are Configured:

- **File**: `packages/spider-web-core/logic/funnelWebSpider.ts`
- **Function**: `ensureDefaultSensors()`

Sensors automatically read from `.env` when Spider Web Core starts.

## 🔄 How It Works:

1. Sensors check `.env` on startup
2. If credentials exist → Sensor activates and uses real API
3. If no credentials → Sensor stays inactive (simulation mode)
4. **Restart required** after adding credentials to `.env`

## ✅ Test It:

```bash
pnpm exec tsx scripts/runSpiderWebOnce.ts
```

Look for these messages:
- `[FunnelWebSpider] Twilio sensor activated`
- `[FunnelWebSpider] Telegram sensor activated`
- `[FunnelWebSpider] Twitter sensor activated (@your_username)`

## 📚 Full Guide:

See `SENSOR_CONFIG_GUIDE.md` for detailed instructions.

