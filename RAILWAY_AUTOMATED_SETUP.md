# Railway Automated Setup Guide

## What's Already Automated ✅

I've configured everything that can be automated via config files:

### 1. Build Configuration (`nixpacks.toml`)
- ✅ Node.js version (20)
- ✅ pnpm installation
- ✅ Build commands (frontend + backend)
- ✅ Start command

### 2. Deployment Configuration (`railway.toml`)
- ✅ Build command
- ✅ Start command
- ✅ Restart policy

### 3. Node Version (`.nvmrc`)
- ✅ Node.js 20 specified

### 4. Package Manager (`package.json`)
- ✅ pnpm@10.21.0 specified
- ✅ Engines field for Node.js version

## What You Need to Do Manually 🔧

### Step 1: Connect GitHub to Railway (One-Time)

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `dream-net` repository
6. Railway will auto-detect the service

### Step 2: Configure Service Settings

Railway should auto-detect from `nixpacks.toml`, but verify:

1. Go to Railway Dashboard → Your Service → **Settings**
2. Check **Root Directory**: Should be `server` (or auto-detected)
3. Check **Build Command**: Should auto-detect from `nixpacks.toml`
4. Check **Start Command**: Should auto-detect from `nixpacks.toml`

**If not auto-detected**, manually set:
- **Root Directory**: `server`
- **Build Command**: (leave blank - uses nixpacks.toml)
- **Start Command**: (leave blank - uses nixpacks.toml)

### Step 3: Add Environment Variables

Go to Railway Dashboard → Your Service → **Variables** tab, add:

**Required:**
```
NODE_ENV=production
DATABASE_URL=<your-neon-postgres-connection-string>
```

**Optional (add as needed):**
```
OPENAI_API_KEY=<your-openai-key>
ANTHROPIC_API_KEY=<your-anthropic-key>
JWT_SECRET=<generate-a-random-secret>
ENV_KEEPER_ENCRYPTION_KEY=<generate-a-random-secret>
STRIPE_SECRET_KEY=<your-stripe-key>
VERCEL_TOKEN=<if-using-vercel-integration>
```

**How to generate secrets:**
```bash
# Generate random secrets (run locally):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Add Custom Domain (Optional)

1. Go to Railway Dashboard → Your Service → **Settings** → **Domains**
2. Click **+ Add Domain**
3. Enter: `dreamnet.ink`
4. Railway will show DNS records to configure
5. Add those DNS records at your domain registrar
6. Wait for DNS propagation (5-30 minutes)

### Step 5: Connect Postgres (If Needed)

If you don't have Postgres yet:

1. In Railway Dashboard, click **+ New** → **Database** → **Add Postgres**
2. Railway creates a Postgres instance
3. Copy the `DATABASE_URL` from Postgres service
4. Add it to your server service variables (Step 3)

## What Happens Automatically 🚀

Once you complete the manual steps above:

1. ✅ Railway detects `nixpacks.toml` and uses it for build
2. ✅ Builds frontend (`client/dist`)
3. ✅ Builds backend (`server/dist`)
4. ✅ Starts server
5. ✅ Serves frontend + backend from same URL

## Can I Automate More? 🤖

**What I CAN'T automate:**
- ❌ Railway account creation
- ❌ GitHub connection to Railway
- ❌ Adding environment variables (requires Railway dashboard access)
- ❌ Domain DNS configuration (requires domain registrar access)
- ❌ Postgres setup (requires Railway dashboard)

**What I COULD automate (if you provide Railway API token):**
- ✅ Creating Railway project via API
- ✅ Setting environment variables via API
- ✅ Configuring domains via API
- ✅ Monitoring deployments via API

## Next Steps

1. **Complete manual steps 1-3** (GitHub connection, verify settings, add env vars)
2. **Deploy** - Railway will automatically build and deploy
3. **Add domain** (Step 4) when ready
4. **Monitor** - Check Railway logs if issues occur

## Quick Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Service settings verified (or set manually)
- [ ] Environment variables added
- [ ] Postgres connected (if needed)
- [ ] Custom domain added (optional)
- [ ] First deployment successful

Once you complete these, everything else is automated! 🎉

