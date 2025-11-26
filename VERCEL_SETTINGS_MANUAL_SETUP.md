# Vercel Settings - Manual Setup Guide

## Current URL
You're logged in at: https://vercel.com/brandons-projects-91c5553e/dreamnet/settings/general

## Settings to Configure

### 1. Scroll to "Build & Development Settings" Section

Look for a section titled **"Build & Development Settings"** or **"Build Settings"**

### 2. Click "Override" for Each Setting

For each setting below, click the **"Override"** button (if it exists) and enter the value:

---

## Install Command

**Value:**
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm --filter client... install --include=optional
```

**Or Simplified (if pnpm is already available):**
```bash
pnpm --filter client... install --include=optional
```

---

## Build Command

**Value:**
```bash
pnpm --filter client run build
```

---

## Output Directory

**Value:**
```
client/dist
```

---

## Root Directory

**Value:**
```
.
```
(Just a dot, or leave empty)

---

## Framework Preset

**Value:**
```
Other
```

---

## Node.js Version

**Value:**
```
24.x
```
or
```
24
```

---

## Quick Copy-Paste Checklist

1. ✅ **Install Command:** `corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm --filter client... install --include=optional`
2. ✅ **Build Command:** `pnpm --filter client run build`
3. ✅ **Output Directory:** `client/dist`
4. ✅ **Root Directory:** `.` (or empty)
5. ✅ **Framework Preset:** `Other`
6. ✅ **Node.js Version:** `24.x`

---

## After Setting These

1. Click **"Save"** at the bottom of the page
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. **UNCHECK** "Use existing Build Cache"
5. Click **"Redeploy"**

---

## What to Look For

The settings page should have sections like:
- **General**
- **Build & Development Settings** ← This is what we need
- **Environment Variables**
- **Domains**
- **Deploy Hooks**

Look for fields labeled:
- "Install Command"
- "Build Command"  
- "Output Directory"
- "Root Directory"
- "Framework Preset"
- "Node.js Version"

---

## If You Can't Find the Settings

Try navigating directly to:
https://vercel.com/brandons-projects-91c5553e/dreamnet/settings/general

And scroll down to find the "Build & Development Settings" section.

