# Validation Steps - Frontend Deployment

## 1. Local Build Verification
Run the following commands to ensure the build works locally before pushing:

```powershell
# 1. Install dependencies (root)
pnpm install --no-frozen-lockfile

# 2. Build client
cd client
pnpm run build

# 3. Verify output
# Should show "dist" directory with index.html and assets
ls dist
```

## 2. Vercel Dashboard Checklist
Go to the Vercel Project Settings for `dreamnet` (or whatever the project is named):

- [ ] **Root Directory:** Ensure it is set to `client` (or "Edit" and select `client`).
- [ ] **Build Command:** Should be OVERRIDDEN by `vercel.json` (so leave blank or default).
    - *Verification:* Check "Deployments" tab, view a build, expand "Build" step. It should say `pnpm run build`.
- [ ] **Install Command:** Should be OVERRIDDEN by `vercel.json`.
    - *Verification:* Build logs should show `pnpm install --no-frozen-lockfile`.
- [ ] **Output Directory:** Should be `dist` (default for Vite, confirmed in `vercel.json`).

## 3. Deployment Verification
After pushing to `main`:

1.  **Visit URL:** `https://dreamnet.ink`
2.  **Check Console:** Ensure no 404s for JS/CSS assets.
3.  **Check API:** Open Network tab, filter for `api`. Refresh.
    - Calls to `/api/...` should receive responses (or 401/403 from backend), NOT the HTML index page.
    - If you see HTML returned for `/api/...`, the rewrite is failing.
