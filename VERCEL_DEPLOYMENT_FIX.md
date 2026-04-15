# Vercel Deployment Fix

## Problem
Vercel error: "The specified Root Directory "client" does not exist."

## Root Cause
Vercel dashboard has Root Directory set to "client", but for a monorepo, it should be "." (repo root).

## Solution

### Option 1: Update Vercel Dashboard (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Find "Root Directory"
3. Change from `client` to `.` (dot = repo root)
4. Save
5. Redeploy

### Option 2: Use vercel.json (Current Setup)

The `vercel.json` is already configured correctly:
- `buildCommand`: `cd client && pnpm install && pnpm build`
- `outputDirectory`: `client/dist`

**But** Vercel dashboard Root Directory setting overrides this.

## Fix Steps

1. **Update Vercel Dashboard:**
   - Settings → General → Root Directory: Change to `.` (or leave empty)
   - Save

2. **Verify vercel.json:**
   ```json
   {
     "version": 2,
     "buildCommand": "cd client && pnpm install && pnpm build",
     "outputDirectory": "client/dist",
     "installCommand": "pnpm install"
   }
   ```

3. **Redeploy:**
   - Push a commit, or
   - Go to Deployments → Redeploy

## Why This Happens

- **Monorepo structure**: Repo root contains `client/`, `server/`, `packages/`
- **Vercel expects**: Root Directory = where to run commands from
- **Current setting**: `client` (wrong - this is a subdirectory)
- **Correct setting**: `.` (repo root)

## Verification

After fixing, the build should:
1. ✅ Clone repo (root directory = `.`)
2. ✅ Run `pnpm install` (installs all workspace dependencies)
3. ✅ Run `cd client && pnpm install && pnpm build` (builds client)
4. ✅ Output to `client/dist`
5. ✅ Serve from `client/dist`

## If Still Not Working

Check:
- [ ] Root Directory in dashboard is `.` or empty
- [ ] `client/` directory exists in repo
- [ ] `client/package.json` exists
- [ ] `client/vite.config.ts` exists
- [ ] Build logs show correct paths

