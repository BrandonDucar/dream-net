# Deployment Clarification

## What "." Means

**Just a dot (period)** - no space, no quotes, just: `.`

This is the standard way to say "current directory" or "repo root" in file systems.

## Vercel (Frontend) - Mini-App Site

### What Gets Built
- ✅ **Client frontend** (`client/` directory)
- ✅ **DreamNet Hub** (the mini-apps launcher)
- ✅ **All 20 mini-apps** (games + practical apps)
- ✅ **Everything in `client/src/`**

### Vercel Dashboard Setting
1. Go to: **Settings → General → Root Directory**
2. Change to: **`.`** (just a dot, nothing else)
3. Save

### What Happens
```
Vercel clones repo
  ↓
Root Directory = "." (repo root)
  ↓
Runs: cd client && pnpm install && pnpm build
  ↓
Builds: client/src → client/dist
  ↓
Serves: client/dist (your mini-app site)
```

### Result
Your website at **dreamnet.ink** will show:
- DreamNet Hub
- All mini-apps
- Games (Jaggy Stealth Run, Dream DNA Sequencer, etc.)
- Practical apps (CoinSensei, Inbox², etc.)

---

## Railway (Backend) - API Server

### What Gets Deployed
- ✅ **Backend API** (`server/` directory)
- ✅ **All API routes** (`/api/*`)
- ✅ **DreamNet agents** (DeployKeeper, CoinSensei, etc.)
- ✅ **Database connections**

### Railway Configuration
Already configured in `railway.json`:
```json
{
  "buildCommand": "pnpm install && pnpm build:app",
  "startCommand": "pnpm start"
}
```

### What Happens
```
Railway clones repo
  ↓
Runs: pnpm install && pnpm build:app
  ↓
Builds: server/index.ts → server/dist/index.js
  ↓
Starts: pnpm start (runs server/dist/index.js)
  ↓
Serves: API at api.dreamnet.ink
```

### Railway Settings
- **Root Directory**: `.` (repo root) - should already be set
- **Build Command**: `pnpm install && pnpm build:app` (from railway.json)
- **Start Command**: `pnpm start` (from Procfile)

### Result
Your API at **api.dreamnet.ink** will serve:
- `/api/dreams`
- `/api/coinsensei`
- `/api/inbox-squared`
- `/api/agent-wallets`
- All other API endpoints

---

## Summary

| Service | What It Does | Root Directory | Builds |
|---------|--------------|----------------|--------|
| **Vercel** | Frontend website | `.` (just a dot) | `client/` → Mini-app site |
| **Railway** | Backend API | `.` (just a dot) | `server/` → API server |

---

## Quick Fix Steps

### Vercel (Frontend)
1. Dashboard → Settings → General
2. Root Directory: Change to **`.`** (just a dot)
3. Save → Auto-redeploys

### Railway (Backend)
1. Should already be correct
2. Check: Dashboard → Settings → Root Directory = `.`
3. If wrong, change to `.`

---

## Visual Guide

```
dream-net/ (repo root)
├── client/          ← Vercel builds this → dreamnet.ink
│   ├── src/
│   ├── dist/        ← Output (served by Vercel)
│   └── package.json
│
├── server/          ← Railway builds this → api.dreamnet.ink
│   ├── index.ts
│   ├── dist/        ← Output (run by Railway)
│   └── routes/
│
└── packages/        ← Shared code (used by both)
    └── base-mini-apps/
```

---

## Both Use "." (Just a Dot)

- **Vercel**: `.` = repo root → builds `client/`
- **Railway**: `.` = repo root → builds `server/`

No spaces, no quotes, just: **`.`**

