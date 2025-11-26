# Vercel Build Command Configuration

## Current Build Command

The build command in `vercel.json` is:

```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional && pnpm build
```

## If Vercel Dashboard Shows Empty

If the Vercel dashboard shows empty build/install commands, you need to manually set them:

### Build Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install --include=optional && pnpm build
```

### Install Command:
```bash
corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate
```

### Output Directory:
```
client/dist
```

### Root Directory:
Leave empty (or set to `.`)

### Framework Preset:
`Other`

### Node.js Version:
`24.x` (or `24`)

---

## Alternative: Simplified Commands

If the long command doesn't work, try these simplified versions:

### Build Command (Simplified):
```bash
cd client && pnpm install --include=optional && pnpm build
```

### Install Command (Simplified):
```bash
cd client && pnpm install --include=optional
```

**Note:** This assumes pnpm is already available in Vercel's environment. If not, use the full command with `corepack`.

---

## Step-by-Step: Setting in Vercel Dashboard

1. Go to: https://vercel.com/[your-team]/dreamnet/settings/general
2. Scroll to **Build & Development Settings**
3. Click **Override** next to each setting:
   - **Build Command:** Paste the build command above
   - **Install Command:** Paste the install command above
   - **Output Directory:** `client/dist`
   - **Root Directory:** Leave empty
   - **Framework Preset:** `Other`
4. Scroll to **Node.js Version**
5. Set to: `24.x`
6. Click **Save**

---

## Why This Is Needed

Vercel sometimes ignores `vercel.json` settings if:
- The dashboard has manual overrides
- The project was created before `vercel.json` existed
- There are conflicting settings

Setting it manually in the dashboard ensures it's used.

