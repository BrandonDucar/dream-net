# Vercel Commands - Explained

## Two Separate Commands

Vercel runs commands in this order:
1. **Install Command** (runs first) - Installs dependencies
2. **Build Command** (runs second) - Builds the project

---

## Option 1: Separate Commands (RECOMMENDED)

### Install Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional
```

### Build Command:
```bash
cd client && pnpm build
```

**Why this is better:**
- Install runs once, separately
- Build runs after install completes
- Easier to debug if one fails
- Vercel can cache the install step

---

## Option 2: Everything in Build Command

If you want everything in the build command:

### Install Command:
```bash
echo "Install handled in build command"
```

### Build Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional && pnpm build
```

**Why this works:**
- Everything happens in one step
- Simpler, but less efficient
- Can't cache install separately

---

## Option 3: Simplified (If pnpm is already available)

### Install Command:
```bash
cd client && pnpm install --include=optional
```

### Build Command:
```bash
cd client && pnpm build
```

**Use this if:** Vercel already has pnpm available (it usually does)

---

## RECOMMENDED SETUP

Use **Option 1** - Separate commands:

### Install Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional
```

### Build Command:
```bash
cd client && pnpm build
```

### Other Settings:
- **Output Directory:** `client/dist`
- **Root Directory:** (empty)
- **Framework Preset:** `Other`
- **Node.js Version:** `24.x`

---

## How to Set in Vercel Dashboard

1. Go to: https://vercel.com/[your-team]/dreamnet/settings/general
2. Scroll to **Build & Development Settings**
3. Click **Override** for each:

   **Install Command:**
   ```
   corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional
   ```

   **Build Command:**
   ```
   cd client && pnpm build
   ```

   **Output Directory:**
   ```
   client/dist
   ```

   **Root Directory:**
   ```
   (leave empty)
   ```

   **Framework Preset:**
   ```
   Other
   ```

4. Scroll to **Node.js Version**
5. Set to: `24.x`
6. Click **Save**

---

## What Happens During Deployment

1. Vercel clones your repo
2. Runs **Install Command** → Installs dependencies
3. Runs **Build Command** → Builds the project
4. Deploys the output from `client/dist`

That's it! 🚀

