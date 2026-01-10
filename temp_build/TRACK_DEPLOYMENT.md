# Track Vercel Deployment

## Quick Ways to Track

### Option 1: Vercel Dashboard (Easiest) ✅

1. Go to: **https://vercel.com/dashboard**
2. Click your **DreamNet project**
3. See **Deployments** tab
4. Latest deployment shows:
   - ✅ Status (Building/Ready/Error)
   - 🔗 Preview URL
   - 📝 Build logs
   - ⏱️ Build time

---

### Option 2: Check via Script

I created a script to check deployment status:

```bash
# Set your Vercel token (get from vercel.com/account/tokens)
$env:VERCEL_TOKEN='your_token_here'

# Run the script
pnpm tsx scripts/check-vercel-deployment.ts
```

**Get your token:**
1. Go to: https://vercel.com/account/tokens
2. Create new token
3. Copy it
4. Use in script

---

### Option 3: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Check deployments
vercel ls

# Check specific deployment
vercel inspect [deployment-url]
```

---

### Option 4: GitHub Integration

If Vercel is connected to GitHub:
1. Go to your GitHub repo
2. Check **Actions** tab (if enabled)
3. Or check commit status (green checkmark = deployed)

---

## What to Look For

### ✅ Success Indicators
- Status: **Ready**
- URL: `https://dreamnet-xxx.vercel.app` (or your custom domain)
- Build logs: No errors
- Preview: Site loads correctly

### ❌ Failure Indicators
- Status: **Error**
- Build logs: Show error messages
- Common issues:
  - Root Directory wrong
  - Build command fails
  - Missing dependencies
  - Environment variables missing

---

## Current Deployment Status

After you:
1. ✅ Updated Root Directory (empty or `./`)
2. ✅ Saved settings
3. ✅ Triggered deployment (push commit or redeploy)

**Check:**
- Dashboard: https://vercel.com/dashboard
- Latest deployment should show status
- If building: Wait 2-5 minutes
- If error: Check build logs

---

## Quick Check Commands

```bash
# Check if site is live
curl -I https://dreamnet.ink

# Check deployment via API (if you have token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.vercel.com/v6/deployments?limit=1
```

---

## I Can Help Track

Tell me:
- What status shows in Vercel dashboard?
- Any error messages?
- Build logs showing?

Or I can check via script if you provide VERCEL_TOKEN.

