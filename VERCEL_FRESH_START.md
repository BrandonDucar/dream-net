# Vercel Fresh Start - Step by Step Instructions

## ✅ What I've Done

1. **Cleaned up Vercel configs**:
   - Removed duplicate `client/vercel.json` (conflicts with root)
   - Removed duplicate `docs/vercel.json` files
   - Created clean root `vercel.json` with minimal config

2. **Updated `.vercelignore`**:
   - Excludes old disabled site (`apps/_site-old-DISABLED/`)
   - Excludes server, contracts, scripts, docs
   - Ensures `client/`, `packages/`, `pnpm-workspace.yaml` are included

3. **Old site is already disabled**: `apps/_site-old-DISABLED/` won't be built

---

## 📋 Vercel Dashboard Setup Instructions

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account if needed
5. Select **ONE repository**: `BrandonDucar/dream-net` (or your repo name)
6. Click **"Import"**

### Step 2: Configure Project Settings

**IMPORTANT**: Leave these fields **BLANK** in Vercel dashboard (they're in `vercel.json`):

- ❌ **Framework Preset**: Leave as "Other" or blank
- ❌ **Root Directory**: Leave blank (we use `rootDirectory: "client"` in vercel.json)
- ❌ **Build Command**: Leave blank (we use `buildCommand` in vercel.json)
- ❌ **Output Directory**: Leave blank (we use `outputDirectory` in vercel.json)
- ❌ **Install Command**: Leave blank (Vercel auto-detects pnpm)

**What Vercel Will Use** (from `vercel.json`):
- ✅ Root Directory: `client`
- ✅ Build Command: `pnpm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: Auto-detected (pnpm)

### Step 3: Environment Variables (Optional for Frontend)

The frontend doesn't need most env vars, but you can add:

```
NODE_ENV=production
```

**Backend env vars** (like `DATABASE_URL`) should stay in Railway, not Vercel.

### Step 4: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies using pnpm (auto-detected)
   - Run `pnpm run build` from `client/` directory
   - Output to `client/dist/`
   - Deploy the static files

### Step 5: Configure Custom Domain (dreamnet.ink)

1. After deployment succeeds, go to **Project Settings → Domains**
2. Add domain: `dreamnet.ink`
3. Follow Vercel's DNS instructions:
   - Add a CNAME record pointing to Vercel
   - Or use Vercel's nameservers

---

## 🔍 What Vercel Will Build

**Vercel will:**
1. Clone your repo
2. Navigate to `client/` directory (via `rootDirectory`)
3. Run `pnpm install` (auto-detected from `pnpm-workspace.yaml`)
4. Run `pnpm run build` (from `vercel.json`)
5. Serve files from `client/dist/`

**Vercel will NOT:**
- Build `apps/_site-old-DISABLED/` (excluded in `.vercelignore`)
- Build `server/` (excluded in `.vercelignore`)
- Build `contracts/` (excluded in `.vercelignore`)

---

## 📁 File Structure Vercel Sees

```
dream-net/
├── client/              ← Vercel builds this
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/            ← Output directory
├── packages/            ← Included (for workspace dependencies)
├── pnpm-workspace.yaml  ← Included (for pnpm to work)
├── package.json         ← Included (root package.json)
├── pnpm-lock.yaml       ← Included (lockfile)
├── vercel.json          ← Included (Vercel config)
└── .vercelignore        ← Included (exclusion rules)
```

---

## 🚨 Troubleshooting

### Build Fails: "Cannot find module"
- **Fix**: Make sure `pnpm-workspace.yaml` is included (it is)
- **Fix**: Make sure `packages/` are included (they are)

### Build Fails: "No projects matched the filters"
- **Fix**: Vercel is looking in wrong directory
- **Fix**: Make sure `rootDirectory: "client"` is in `vercel.json` (it is)
- **Fix**: Make sure Vercel dashboard has Root Directory **BLANK**

### Old Site Still Building
- **Fix**: Check `.vercelignore` includes `apps/_site-old-DISABLED/**` (it does)
- **Fix**: Make sure you're deploying the right project

### Wrong Build Command
- **Fix**: Vercel dashboard might override `vercel.json`
- **Fix**: Leave Build Command **BLANK** in dashboard, use `vercel.json` only

---

## ✅ Verification Checklist

After deployment:

- [ ] Build succeeds
- [ ] Site loads at `dreamnet.ink` (or Vercel preview URL)
- [ ] API routes proxy to `api.dreamnet.ink` correctly
- [ ] No old site files in build
- [ ] Only `client/` is built

---

## 🎯 Summary

**What to put in Vercel Dashboard:**
- **Framework**: Other (or blank)
- **Root Directory**: BLANK (uses `vercel.json`)
- **Build Command**: BLANK (uses `vercel.json`)
- **Output Directory**: BLANK (uses `vercel.json`)
- **Install Command**: BLANK (auto-detects pnpm)

**What's in `vercel.json`:**
- Root Directory: `client`
- Build Command: `pnpm run build`
- Output Directory: `dist`
- API rewrites configured

**Ready to deploy!** 🚀

