# ⚠️ CRITICAL: Vercel Dashboard Settings Must Be Fixed

## Problem

Vercel is using **npm** instead of **pnpm** because dashboard settings override `vercel.json`.

**Evidence**: Build logs show `npm run build` instead of `pnpm build`

---

## 🔧 Required Fix in Vercel Dashboard

### Step 1: Login to Vercel
1. Go to: https://vercel.com/dashboard
2. Login with your GitHub account

### Step 2: Navigate to Project Settings
1. Find project: **dream-net** (or your project name)
2. Click on the project
3. Go to: **Settings** → **Build & Development Settings**

### Step 3: Clear/Update Build Settings

**CRITICAL**: Dashboard settings override vercel.json!

**Option A: Clear Settings (Recommended)**
- **Build Command**: DELETE/EMPTY this field (let vercel.json handle it)
- **Install Command**: DELETE/EMPTY this field (let vercel.json handle it)
- **Output Directory**: Set to `client/dist`
- Click **Save**

**Option B: Set to Match vercel.json**
- **Build Command**: 
  ```
  corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional && pnpm build
  ```
- **Install Command**: 
  ```
  corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional
  ```
- **Output Directory**: `client/dist`
- Click **Save**

### Step 4: Verify Node Version
- In **Build & Development Settings**
- **Node.js Version**: Set to `24.x` (or highest available)
- Click **Save**

### Step 5: Trigger New Deployment
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. **UNCHECK** "Use existing Build Cache"
5. Click **Redeploy**

---

## ✅ What to Look For in Build Logs

After fixing, build logs should show:
```
Installing dependencies...
> corepack enable pnpm
> corepack prepare pnpm@10.21.0 --activate
> cd client && pnpm install --include=optional
...
✓ Installed @rollup/rollup-linux-x64-gnu
...
Building...
> pnpm build
> vite build
✓ Built successfully
```

**NOT**:
```
Installing dependencies...
> npm install
...
Building...
> npm run build
```

---

## 🎯 Why This Happens

1. Vercel detects `package-lock.json` → defaults to npm
2. Dashboard settings override `vercel.json`
3. npm doesn't install optional dependencies by default
4. Rollup native module missing → build fails

---

## 📝 After Fixing

Once dashboard settings are cleared/updated:
- ✅ Vercel will use `vercel.json` commands
- ✅ pnpm will be used (via corepack)
- ✅ Optional dependencies will install
- ✅ Rollup native module will be available
- ✅ Build will succeed

---

**This is the root cause. Dashboard settings MUST be fixed for deployment to work!**

