# Fix Vercel CLI Deployment

## The Problem

Error: `The provided path "client\client" does not exist`

**Cause:** Vercel project settings still have `rootDirectory: "client"` set. When you run `vercel --prod` from `client/`, it tries to go to `client/client/`.

---

## Solution: Update Vercel Dashboard Settings

Since you've linked via CLI, you need to update the dashboard:

1. **Go to:** https://vercel.com/brandons-projects-91c5553e/dream-net/settings

2. **General Tab:**
   - **Root Directory:** Leave BLANK (empty) or delete `client`
   - This tells Vercel: "The linked directory IS the root"

3. **Build & Development Settings:**
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install` (or leave blank to use default)

4. **Save**

5. **Then try again:**
   ```bash
   cd client
   vercel --prod
   ```

---

## Alternative: Use vercel.json in client/

I've created `client/vercel.json` which should override dashboard settings. Try:

```bash
cd client
vercel --prod
```

The `client/vercel.json` tells Vercel:
- No rootDirectory (we're already in client/)
- Build: `pnpm run build`
- Output: `dist`

---

## What Should Happen

After fixing settings, when you run `vercel --prod` from `client/`:
- ✅ Vercel uses `client/` as root (no nested client/client)
- ✅ Finds `client/package.json` (dreamops-launcher)
- ✅ Runs `pnpm run build`
- ✅ Outputs to `client/dist/`
- ✅ Deploys successfully

---

## Quick Test

After updating dashboard settings:

```bash
cd client
vercel --prod
```

If it still fails, share the error and we'll try something else!

