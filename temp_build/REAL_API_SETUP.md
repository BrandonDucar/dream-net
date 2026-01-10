# Real API Setup Guide

## ✅ Using Real API Keys (No Simulations)

DreamNet is configured to use **REAL API keys** from environment variables. Here's what's active:

### 🔑 API Keeper Auto-Discovery

API Keeper automatically discovers and uses:
- `OPENAI_API_KEY` - Real OpenAI API calls
- `ANTHROPIC_API_KEY` - Real Anthropic API calls  
- `TWILIO_ACCOUNT_SID` - Real Twilio SMS
- `TWILIO_AUTH_TOKEN` - Real Twilio SMS
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `DREAMNET_VOICE_RECIPIENT` - Where to send SMS (+15613378933)

### 📱 Twilio SMS Setup

**Your Phone Number**: +15613378933

**To Set Up**:
1. Get Twilio credentials from https://console.twilio.com
2. Set environment variables:
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   DREAMNET_VOICE_RECIPIENT=+15613378933
   ```

3. Test it:
   ```bash
   pnpm test:voice
   ```

### 🤖 Real API Usage

**OpenAI**:
- Used in: `server/routes/dream-titles.ts` - Real GPT-4o title generation
- Uses: `process.env.OPENAI_API_KEY` directly
- No mocks - fails if key missing

**Anthropic**:
- Auto-discovered by API Keeper
- Ready for use in any agent that needs Claude

**Twilio SMS**:
- Real SMS sending via Twilio API
- Configured to send to: +15613378933
- Auto-routes operational events to SMS

### 🚫 What's Still Mocked (For Reference)

These are NOT using real APIs yet (but can be):
- `server/routes/wallet-scan.ts` - Wallet scanning (mock data)
- `server/gpt-dream-processor.ts` - GPT processing (has mock function)
- Some agent fallbacks use mock data when APIs fail

### ✅ To Use Real APIs Everywhere

1. Set all API keys in `.env` file
2. API Keeper auto-discovers them on startup
3. All systems use real keys automatically
4. No manual configuration needed!

### 🧪 Test Real APIs

```bash
# Test Voice/SMS
pnpm test:voice

# Test API Keeper discovery
# Check startup logs for "Auto-discovered X API key(s)"
```

