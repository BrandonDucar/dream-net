# Railway Environment Variables Setup

## Required Steps

Go to **Railway Dashboard** → Your Project → Variables tab

### Required Environment Variables

Add these variables:

1. **NODE_ENV**
   - Value: `production`
   - Required: Yes

2. **ALLOWED_ORIGINS**
   - Value: `https://dreamnet.ink,https://www.dreamnet.ink`
   - Required: Yes (for CORS)

### Optional Environment Variables

Add these if you're using the features:

3. **DATABASE_URL**
   - Value: Your PostgreSQL connection string
   - Required: No (only if using database features)

4. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - Required: No (only if using AI features)

---

## After Setting Variables

Railway will automatically:
- Detect `railway.json` configuration
- Run build: `pnpm install && pnpm --filter @dreamnet/server build`
- Start server: `node server/dist/index.js` (from Procfile)
- Deploy to `api.dreamnet.ink`

---

## Verify Deployment

1. Check Railway logs for successful build and start
2. Test health endpoint: `https://api.dreamnet.ink/health`
3. Should return: `200 OK` with health status

---

**Note**: Railway will auto-deploy on push to `main` branch after variables are set.

