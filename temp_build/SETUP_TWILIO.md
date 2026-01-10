# Twilio SMS Setup - DreamNet Voice (Phase 2)

## ✅ Your Phone Number Configured
**Phone Number**: `+15613378933` (hardcoded as default)

## 🔑 Required Environment Variables

Set these in your `.env` file or environment:

```bash
# Twilio Credentials (get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Recipient (already set to your number)
DREAMNET_VOICE_RECIPIENT=+15613378933
```

## 🚀 Quick Setup Steps

1. **Get Twilio Credentials**:
   - Go to https://console.twilio.com
   - Sign up/login
   - Get your Account SID and Auth Token from the dashboard
   - Get a phone number (or use trial number)

2. **Set Environment Variables**:
   ```powershell
   # PowerShell (Windows)
   $env:TWILIO_ACCOUNT_SID = "your_account_sid"
   $env:TWILIO_AUTH_TOKEN = "your_auth_token"
   $env:TWILIO_PHONE_NUMBER = "+1234567890"
   $env:DREAMNET_VOICE_RECIPIENT = "+15613378933"
   ```

   Or add to `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   DREAMNET_VOICE_RECIPIENT=+15613378933
   ```

3. **Test It**:
   ```bash
   pnpm test:voice
   ```

## 📱 How It Works

- **Auto-Discovery**: API Keeper automatically finds Twilio keys from environment variables
- **Fallback**: If API Keeper doesn't have keys, Twilio sender checks env vars directly
- **Default Recipient**: Your phone number (+15613378933) is hardcoded as default
- **Event Routing**: Operational events (Wolf Pack wins, Shield threats, etc.) automatically route to SMS

## 🎯 What Gets Sent to SMS

DreamNet will send SMS for:
- 🐺 Wolf Pack wins (hot leads found)
- 🛡️ Shield Core threats blocked
- 🏥 Health check failures
- 🚨 Kill-switch enabled/disabled
- 💰 Cost threshold alerts
- ⚡ Auto-scaling decisions
- 📋 Critical incidents

Rate limited to 10 messages/hour (except critical events).

## ✅ Real API Usage Status

### Using Real APIs ✅
- **OpenAI**: `server/routes/dream-titles.ts` - Real GPT-4o calls
- **OpenAI**: `server/routes/dream-shopping.ts` - Real GPT-4o calls
- **OpenAI**: `server/routes/seoToolsRoutes.ts` - Real GPT-4o calls
- **Twilio**: `packages/dreamnet-voice-twilio` - Real SMS sending

### API Keeper Auto-Discovery ✅
- Automatically discovers: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- No manual configuration needed - just set env vars!

### Still Using Mock Data ⚠️
- `server/routes/wallet-scan.ts` - Wallet scanning (mock data)
- Some agent fallbacks use mock data when APIs fail

## 🧪 Test Commands

```bash
# Test Voice/SMS
pnpm test:voice

# Check API Keeper discovery
# Look for "Auto-discovered X API key(s)" in startup logs
```

## 📝 Notes

- Your phone number (+15613378933) is hardcoded as the default recipient
- Twilio sender checks API Keeper first, then falls back to env vars
- All operational events automatically route to SMS (if configured)
- Rate limiting prevents spam (10 messages/hour max)

