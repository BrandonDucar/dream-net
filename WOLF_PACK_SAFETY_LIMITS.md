# Wolf Pack Email Safety Limits

## 🛡️ Protection Against Gmail Rate Limits

The Wolf Pack mailer now includes **automatic safety limits** to prevent hitting Gmail's 500 emails/day limit and avoid any unexpected costs.

## 📊 Default Limits

### Daily Limit
- **Default: 50 emails/day** (10% of Gmail's 500/day limit)
- **Gmail Hard Limit: 500 emails/day**
- **Configurable via:** `WOLFMAIL_MAX_PER_DAY` environment variable

### Per-Cycle Limit
- **Default: 10 emails per cycle**
- **Configurable via:** `WOLFMAIL_MAX_PER_CYCLE` environment variable

## 🧮 The Math

### With Default Settings (30-minute intervals):
- **Cycles per day:** 48 (every 30 minutes)
- **Max per cycle:** 10 emails
- **Theoretical max:** 10 × 48 = 480 emails/day
- **Actual default limit:** 50 emails/day (safety cap)

### What This Means:
- ✅ **Safe:** Even if you have 1000 leads, only 50 will be emailed per day
- ✅ **No surprises:** Won't hit Gmail's limit
- ✅ **Gradual:** Emails spread throughout the day
- ✅ **Cost-free:** Gmail is free, no per-email charges

## ⚙️ Configuration

### Increase Daily Limit (if needed):
```bash
# Set to 200/day (still safe, well under 500)
WOLFMAIL_MAX_PER_DAY=200
```

### Increase Per-Cycle Limit:
```bash
# Send 20 per cycle instead of 10
WOLFMAIL_MAX_PER_CYCLE=20
```

### Adjust Cycle Interval:
```bash
# Run every 60 minutes instead of 30
WOLF_FUNDING_INTERVAL_MIN=60
```

## 🔄 How It Works

1. **Daily Counter:** Tracks emails sent today (resets at midnight)
2. **Per-Cycle Check:** Only sends up to `WOLFMAIL_MAX_PER_CYCLE` per cycle
3. **Daily Check:** Stops if daily limit reached
4. **Rate Limiting:** 1-second delay between emails to avoid SMTP rate limits
5. **Queue Management:** Skipped emails stay in queue for next cycle

## 📈 Example Scenarios

### Scenario 1: 100 Leads, All Qualified
- **Day 1:** Sends 50 emails (hits daily limit)
- **Day 2:** Sends remaining 50 emails
- **Result:** All leads contacted over 2 days ✅

### Scenario 2: 5 New Leads Every Cycle
- **Per cycle:** Sends 5 emails (under 10 limit)
- **Per day:** ~240 emails (but capped at 50)
- **Result:** First 50 leads get emails, rest queue for next day ✅

### Scenario 3: 10 Leads, 30-Minute Cycles
- **Cycle 1:** Sends 10 emails
- **Cycle 2:** Sends 10 emails
- **Cycle 3:** Sends 10 emails
- **Cycle 4:** Sends 10 emails
- **Cycle 5:** Sends 10 emails (hits daily limit)
- **Cycle 6+:** Skips sending, logs "Daily limit reached"
- **Result:** 50 emails sent, rest queued for tomorrow ✅

## 🚨 Important Notes

1. **Gmail is FREE** - No per-email charges, but there is a 500/day limit
2. **Daily limit resets at midnight** (local time)
3. **Failed emails don't count** toward daily limit (only successful sends)
4. **Queue persists** - Skipped emails will be sent on subsequent days
5. **No cost risk** - Even if you set limits too high, Gmail will just reject after 500

## 🔍 Monitoring

The service logs safety limit information:
```
[WolfPackMailer] Safety limits: max 10 per cycle, 45 remaining today (limit: 50/day)
[WolfPackMailer] Queue processing complete:
  ✓ Sent: 10
  ✗ Failed: 0
  ⏸ Skipped: 5 (will be processed in next cycle)
  📊 Remaining today: 35 emails
```

## ✅ Summary

**You're protected!** The system will:
- ✅ Never send more than 50/day by default (well under 500)
- ✅ Never send more than 10 per cycle
- ✅ Automatically skip cycles when limit reached
- ✅ Queue remaining emails for next day
- ✅ Log everything clearly

**No cost risk, no rate limit surprises!** 🎉

