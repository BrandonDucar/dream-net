# Netlify Database Setup Guide

## Neon & Liquid Metal Configuration

You've installed Neon and Liquid Metal on Netlify. Here's how to connect them to DreamNet.

## Getting Connection Strings

### From Netlify Dashboard:

1. **Go to your Netlify site**: https://app.netlify.com/sites/dreamnet-hub
2. **Navigate to**: Site settings → Environment variables
3. **Or**: Site settings → Integrations → Neon / Liquid Metal

### Neon Database Connection

Neon provides a connection string in this format:
```
postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Liquid Metal Connection

Liquid Metal (Netlify's serverless Postgres) uses a similar format:
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

## Setting Environment Variables

### Option 1: Netlify Dashboard (Recommended)

1. Go to: **Site settings → Environment variables**
2. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon/Liquid Metal connection string
3. **Scope**: Production, Preview, or both
4. **Save**

### Option 2: Netlify CLI

```bash
netlify env:set DATABASE_URL "postgresql://user:pass@host.neon.tech/dbname?sslmode=require" --context production
```

### Option 3: netlify.toml

Create/update `netlify.toml`:
```toml
[build.environment]
  DATABASE_URL = "postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
```

## DreamNet Auto-Detection

DreamNet automatically detects Neon databases by checking for `neon.tech` in the `DATABASE_URL`:

- ✅ **Neon detected**: Uses `@neondatabase/serverless` driver
- ✅ **Standard Postgres**: Uses standard `pg` driver

## Verification

After setting `DATABASE_URL`, your next deployment will:
1. Connect to Neon/Liquid Metal automatically
2. Run database migrations (if configured)
3. Enable all database features

## Testing Connection

You can test the connection locally:

```bash
# Set DATABASE_URL in your .env
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require

# Start server
pnpm dev:app

# Check logs for:
# [Database] ✅ Connected to Neon PostgreSQL (legacy)
```

## Next Steps

1. ✅ Get connection string from Netlify dashboard
2. ✅ Add `DATABASE_URL` to Netlify environment variables
3. ✅ Trigger a new deployment
4. ✅ Verify connection in deployment logs

Your DreamNet Hub will automatically connect to Neon/Liquid Metal on the next deployment!

