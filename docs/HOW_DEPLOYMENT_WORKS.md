# How DreamNet Deployment Works

## Where Users See Your Website

**The frontend that users see at `dreamnet.ink` lives in `client/`**

- **Location**: `client/` directory
- **What it is**: React app (DreamNet Hub) with all your UI
- **Current deployment**: Vercel (via `vercel.json`)
- **Domain**: `dreamnet.ink` → points to Vercel

## The Relationship

```
┌─────────────────────────────────────────────────────────┐
│  client/ (Your Frontend)                                │
│  ├── src/                                               │
│  ├── package.json                                       │
│  └── dist/ (built output)                               │
└─────────────────────────────────────────────────────────┘
           │
           │ Deploys to...
           ▼
┌─────────────────────────────────────────────────────────┐
│  Unified Deployment System                              │
│  (packages/deployment-core)                             │
│                                                          │
│  Can deploy to:                                          │
│  • DreamNet Native (dreamnet.ink)                       │
│  • Vercel (vercel.app)                                  │
│  • Netlify (netlify.app)                                │
│  • Railway (railway.app)                                │
│  • Cloudflare Pages (pages.dev)                         │
│  • ... and 10+ more platforms                           │
└─────────────────────────────────────────────────────────┘
           │
           │ Your domain points to...
           ▼
┌─────────────────────────────────────────────────────────┐
│  dreamnet.ink → Currently points to Vercel              │
│  (But can point anywhere you deploy!)                   │
└─────────────────────────────────────────────────────────┘
```

## Current Setup

**Right now:**
- `client/` builds your frontend
- `vercel.json` tells Vercel how to deploy it
- `dreamnet.ink` DNS points to Vercel
- Users see your site at `dreamnet.ink` (hosted on Vercel)

## What the Unified Deployment System Does

The new system (`packages/deployment-core`) is a **tool** that lets you:

1. **Deploy `client/` to ANY platform** (not just Vercel)
2. **Deploy to ALL platforms simultaneously** (for redundancy)
3. **Use DreamNet's native platform** (no external dependencies)
4. **Switch platforms easily** without changing code

## How to Use It

### Option 1: Keep Using Vercel (Current Setup)
- Nothing changes! Your `vercel.json` still works
- `dreamnet.ink` continues pointing to Vercel
- Users see your site as normal

### Option 2: Deploy to DreamNet Native Platform
```bash
POST /api/deployment/deploy
{
  "platform": "dreamnet",
  "projectName": "dreamnet-hub",
  "sourceDirectory": "client/dist",
  "customDomain": "dreamnet.ink"
}
```
Then update DNS to point `dreamnet.ink` to DreamNet's platform.

### Option 3: Deploy to Multiple Platforms
```bash
POST /api/deployment/deploy-all
{
  "projectName": "dreamnet-hub",
  "sourceDirectory": "client/dist"
}
```
Deploys to all 15+ platforms simultaneously. Then choose which one `dreamnet.ink` points to.

### Option 4: Deploy to a Different Platform
```bash
POST /api/deployment/deploy
{
  "platform": "netlify",  // or "cloudflare-pages", "render", etc.
  "projectName": "dreamnet-hub",
  "sourceDirectory": "client/dist",
  "customDomain": "dreamnet.ink"
}
```

## Where Is My Site Right Now?

**Current Status:**
- ✅ Frontend code: `client/` directory
- ✅ Built output: `client/dist/` (when you run `pnpm build`)
- ✅ Deployed to: Vercel (via `vercel.json`)
- ✅ Live at: `dreamnet.ink` (DNS points to Vercel)
- ✅ Backend API: Railway (`api.dreamnet.ink`)

## What Changed?

**Before:**
- Only could deploy to Vercel
- Locked into Vercel's system
- Had to use Vercel CLI/config

**Now:**
- Can deploy to 15+ platforms
- Unified API for all platforms
- DreamNet native platform option
- No vendor lock-in

**But your site is still at `dreamnet.ink` on Vercel until you deploy elsewhere!**

## Next Steps

1. **Keep current setup**: Do nothing, site stays on Vercel
2. **Try DreamNet native**: Deploy via `/api/deployment/deploy` with `platform: "dreamnet"`
3. **Deploy everywhere**: Use `/api/deployment/deploy-all` to deploy to all platforms
4. **Switch platforms**: Deploy to new platform, update DNS

---

**TL;DR**: Your frontend is in `client/`, it's currently deployed to Vercel, and users see it at `dreamnet.ink`. The new deployment system is a tool to deploy it anywhere, but doesn't change where it currently lives!

