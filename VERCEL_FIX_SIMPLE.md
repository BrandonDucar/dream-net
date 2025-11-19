# Vercel Fix - Simple & Direct

## The Real Problem

Vercel dashboard settings are **OVERRIDING** `vercel.json`.

Even though `vercel.json` says to build `client/`, the dashboard has old settings that override it.

## The Fix (2 Steps)

### Step 1: Clear ALL Dashboard Settings

Go to Vercel Dashboard → Project → Settings → Build & Development Settings

**CLEAR THESE FIELDS (make them empty/blank):**
- ❌ Root Directory: **BLANK** (already done)
- ❌ Build Command: **BLANK** (clear it!)
- ❌ Install Command: **BLANK** (clear it!)
- ❌ Output Directory: **BLANK** (clear it!)

**Save**

This forces Vercel to use `vercel.json` instead of dashboard overrides.

---

### Step 2: Verify vercel.json is Correct

Our `vercel.json` at root is correct:
```json
{
  "buildCommand": "cd client && pnpm install --frozen-lockfile --no-optional && pnpm build",
  "outputDirectory": "client/dist"
}
```

This will build `client/` when dashboard settings are cleared.

---

## Why This Works

- Dashboard settings **OVERRIDE** `vercel.json`
- When dashboard fields are blank, Vercel uses `vercel.json`
- `vercel.json` correctly points to `client/`

---

## That's It

Clear Build Command, Install Command, and Output Directory in dashboard.
Leave Root Directory blank.
Save.
Redeploy.

Done.

