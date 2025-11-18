# Sensor Configuration Guide

## Overview

Spider Web sensors automatically read API credentials from your `.env` file. When credentials are present, sensors automatically switch from simulation mode to real API mode.

## Location

Sensor configuration is handled in:
- **File**: `packages/spider-web-core/logic/funnelWebSpider.ts`
- **Function**: `ensureDefaultSensors()`

Sensors are automatically initialized when Spider Web Core runs.

## Environment Variables

Add these to your `.env` file:

### Twilio (SMS)

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Where to get these:**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up or log in
3. Your Account SID and Auth Token are on the dashboard
4. Get a phone number from "Phone Numbers" → "Buy a number"

### Telegram (Bot)

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here  # Optional
```

**Where to get these:**
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow instructions
3. BotFather will give you a token like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
4. For Chat ID: Send a message to your bot, then visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":123456789}` - that's your chat ID

### Twitter (API v2)

```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_USERNAME=your_username_here  # Optional, without @
TWITTER_HANDLE=your_handle_here  # Alternative to TWITTER_USERNAME
```

**Where to get Twitter Bearer Token:**

1. **Go to Twitter Developer Portal**
   - Visit: https://developer.twitter.com/en/portal/dashboard
   - Sign in with your Twitter account

2. **Create a Project & App**
   - Click "Create Project"
   - Fill in project details (name, use case, description)
   - Create an App within the project

3. **Get Bearer Token**
   - Go to your App's "Keys and tokens" tab
   - Under "Bearer Token", click "Generate"
   - Copy the token (starts with `AAAAAAAAAAAAAAAAAAAAA...`)

4. **Set Permissions** (if needed)
   - Go to "User authentication settings"
   - Enable "Read" permissions for mentions/timeline
   - Save changes

**Note:** Twitter API v2 requires:
- Free tier: 1,500 tweets/month
- Basic tier ($100/month): 10,000 tweets/month
- For production, consider upgrading

## How It Works

1. **On Startup**: `ensureDefaultSensors()` reads `.env` variables
2. **If credentials exist**: Sensor is activated and `simulateFlies: false`
3. **If no credentials**: Sensor stays inactive and uses simulation mode
4. **Automatic switching**: When you add credentials and restart, sensors automatically switch to real APIs

## Testing

After adding credentials to `.env`:

1. Restart your server/service
2. Run a Spider Web cycle:
   ```bash
   pnpm exec tsx scripts/runSpiderWebOnce.ts
   ```
3. Check logs for:
   - `[FunnelWebSpider] Twilio sensor activated`
   - `[FunnelWebSpider] Telegram sensor activated`
   - `[FunnelWebSpider] Twitter sensor activated`

## Current Status

Check sensor status:
```bash
pnpm exec tsx scripts/runSpiderWebOnce.ts
```

Look for sensor activation messages in the output.

## Troubleshooting

### Sensors not activating?

1. **Check `.env` file exists** in project root
2. **Verify variable names** match exactly (case-sensitive)
3. **Restart server** after adding credentials
4. **Check logs** for activation messages

### API errors?

1. **Twilio**: Verify Account SID and Auth Token are correct
2. **Telegram**: Verify bot token is valid (should start with numbers)
3. **Twitter**: Verify bearer token is valid (should start with `AAAAA...`)

### Still using simulation?

- Sensors fall back to simulation if:
  - Credentials are missing
  - API calls fail
  - Sensor is explicitly disabled

To force real APIs, ensure credentials are in `.env` and sensor is active.

