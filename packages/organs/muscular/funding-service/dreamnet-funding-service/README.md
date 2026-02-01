# DreamNet Funding Service (Wolf Pack)

This is a standalone backend worker that drives the **Wolf Pack Funding** subsystem.

It does the following:

1. Runs `WolfPackFundingCore` to:
   - score funding leads
   - generate email drafts
   - enqueue send-queue items

2. Runs `WolfPackMailerCore` to:
   - send pending emails via SMTP (Gmail-compatible)
   - update queue item statuses

## Environment Variables

The service expects the following env vars (for Gmail SMTP):

- `WOLFMAIL_FROM_NAME` — e.g. `"DreamNet Wolf Pack"` (default: "DreamNet Wolf Pack")
- `WOLFMAIL_FROM_EMAIL` — e.g. `"dreamnetgmo@gmail.com"` (default: "dreamnetgmo@gmail.com")

- `WOLFMAIL_SMTP_HOST` — e.g. `"smtp.gmail.com"` (default: "smtp.gmail.com")
- `WOLFMAIL_SMTP_PORT` — e.g. `465` (default: 465)
- `WOLFMAIL_SMTP_SECURE` — `"true"` or `"false"` (default: "true")

- `WOLFMAIL_SMTP_USER` — SMTP username (usually the email, defaults to WOLFMAIL_FROM_EMAIL)
- `WOLFMAIL_SMTP_PASS` — **REQUIRED** - SMTP password or **Gmail App Password**

You can also configure the funding cycle interval:

- `WOLF_FUNDING_INTERVAL_MIN` — minutes between cycles (default: 30)

Optional testing override:

- `WOLF_FUNDING_FORCE_TEST` — set to `"true"` to force all leads to be qualified for email (default: `false`)
  - Note: The test lead with id `"lead:test-self"` always qualifies regardless of this setting

**Safety Limits (to prevent hitting Gmail's 500/day limit):**

- `WOLFMAIL_MAX_PER_DAY` — Maximum emails to send per day (default: `50`)
  - Gmail allows 500/day, but we default to 50 for safety (10% of limit)
  - Set higher if needed, but never exceed 500
  
- `WOLFMAIL_MAX_PER_CYCLE` — Maximum emails to send per cycle (default: `10`)
  - Prevents sending too many at once
  - With 30-minute intervals: 10 per cycle × 48 cycles = 480/day max (safe)

## Running Locally

From the repo root:

```bash
# Install dependencies (if not already done)
pnpm install

# Build the service
pnpm --filter @dreamnet/dreamnet-funding-service build

# Run the service
pnpm --filter @dreamnet/dreamnet-funding-service start
```

Or for development with auto-reload:

```bash
pnpm --filter @dreamnet/dreamnet-funding-service dev
```

Make sure `.env` or environment variables are set before running.

### Example .env file

```env
WOLFMAIL_FROM_NAME="DreamNet Wolf Pack"
WOLFMAIL_FROM_EMAIL="dreamnetgmo@gmail.com"
WOLFMAIL_SMTP_HOST="smtp.gmail.com"
WOLFMAIL_SMTP_PORT=465
WOLFMAIL_SMTP_SECURE=true
WOLFMAIL_SMTP_USER="dreamnetgmo@gmail.com"
WOLFMAIL_SMTP_PASS="your-gmail-app-password"
WOLF_FUNDING_INTERVAL_MIN=30
```

## Deployment

You can deploy this service to:

- **Railway.app**
- **Fly.io**
- **Render.com**
- **Any Node-capable worker environment**

Set the environment variables securely in the hosting platform and run the `start` script.

### Railway Example

1. Create a new service from GitHub repo
2. Set root directory to: `services/dreamnet-funding-service`
3. Set start command: `pnpm install && pnpm build && pnpm start`
4. Add all required environment variables in Railway dashboard

### Fly.io Example

Create `fly.toml`:

```toml
app = "dreamnet-funding-service"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"
```

Then:

```bash
fly launch
fly secrets set WOLFMAIL_SMTP_PASS=your-password
# ... set other env vars
```

## How It Works

1. **Funding Cycle**: Runs `WolfPackFundingCore.run()` to:
   - Score existing leads based on DreamNet fit
   - Generate email drafts for qualified leads
   - Add items to the send queue

2. **Send Queue**: Runs `WolfPackMailerCore.processSendQueueOnce()` to:
   - Read pending queue items
   - Send emails via SMTP
   - Mark items as `sent` or `failed`

3. **Scheduling**: Runs both cycles every N minutes (default: 30)

## Notes

- This service expects that leads are seeded elsewhere (e.g., via init script or admin panel)
- It does NOT run the full Orchestrator; it runs Wolf Pack funding only
- It does NOT expose HTTP endpoints
- It is safe to run as a standalone background worker

## Troubleshooting

### "WOLFMAIL_SMTP_PASS is not set"

Make sure you've set the `WOLFMAIL_SMTP_PASS` environment variable. For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password in Google Account settings
3. Use that App Password (not your regular password)

### "No pending emails to send"

This is normal if there are no leads in the queue or all leads have already been processed. The service will continue running and check again on the next cycle.

### Service exits immediately

Check the console output for error messages. Common issues:
- Missing environment variables
- Invalid SMTP credentials
- Network connectivity issues

