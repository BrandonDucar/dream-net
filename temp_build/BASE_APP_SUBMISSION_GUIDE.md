# 📱 Base App Mini Apps Submission Guide

## Current Status

**Mini Apps Built**: ✅ 4 apps ready
**Deployed**: ✅ All on dreamnet.ink
**Manifests Created**: ✅ farcaster.json files
**Submitted to Base**: ❌ **NOT YET**

## What Users Can Do NOW

### ✅ Direct Access (Works Now):
- Go to `dreamnet.ink/miniapps/rewards` → **Works!**
- Go to `dreamnet.ink/miniapps/subscriptions` → **Works!**
- Go to `dreamnet.ink/miniapps/social` → **Works!**
- Go to `dreamnet.ink/miniapps/contributions` → **Works!**

### ✅ Main Site Navigation (Works Now):
- Navigate from main site
- Use Mini Apps Directory
- All links functional

### ❌ Base App Discovery (NOT YET):
- Can't search in Base App
- Won't appear in Base App directory
- Need to submit first

## How to Submit to Base App

### Step 1: Prepare Assets

**Icons Needed:**
- `icon.png` (512x512px) for each mini app
- Upload to `dreamnet.ink/icons/`

**Splash Images Needed:**
- `splash.png` (1200x630px) for each mini app
- Upload to `dreamnet.ink/splash/`

**Screenshots Needed:**
- `screenshot-1.png` for each mini app
- Upload to `dreamnet.ink/screenshots/`

### Step 2: Update Manifests

Update manifest URLs to point to real images:
```json
{
  "iconUrl": "https://dreamnet.ink/icons/rewards.png",
  "splashImageUrl": "https://dreamnet.ink/splash/rewards.png",
  "screenshots": [
    "https://dreamnet.ink/screenshots/rewards-1.png"
  ]
}
```

### Step 3: Find Submission Process

**Option A: Base Developer Portal**
1. Go to Base's developer portal (if exists)
2. Look for "Submit Mini App" or "Register App"
3. Fill out submission form
4. Provide manifest URL: `dreamnet.ink/.well-known/farcaster.json`

**Option B: Base API**
1. Check if Base has API for mini app registration
2. Use API to submit programmatically
3. Faster than manual submission

**Option C: Contact Base Team**
1. Reach out via Base Discord/Telegram
2. Ask about mini app submission process
3. May get direct guidance

### Step 4: Submit Each Mini App

For each of the 4 mini apps:
1. **DREAM Rewards Hub**
   - Manifest: `dreamnet.ink/.well-known/farcaster.json`
   - URL: `dreamnet.ink/miniapps/rewards`

2. **Creator Subscriptions**
   - Manifest: `dreamnet.ink/.well-known/farcaster-subscriptions.json`
   - URL: `dreamnet.ink/miniapps/subscriptions`

3. **Dream Social Feed**
   - Manifest: `dreamnet.ink/.well-known/farcaster-social.json`
   - URL: `dreamnet.ink/miniapps/social`

4. **Dream Contributions**
   - Manifest: `dreamnet.ink/.well-known/farcaster-contributions.json`
   - URL: `dreamnet.ink/miniapps/contributions`

### Step 5: Wait for Approval

- Base team reviews submission
- May take days/weeks
- Once approved, appears in directory

## What Base Likely Needs

### Required Information:
- ✅ App name
- ✅ Description
- ✅ Category
- ✅ Tags
- ✅ Web URL
- ✅ Manifest URL
- ⚠️ Icon (need to create)
- ⚠️ Screenshots (need to create)
- ⚠️ Splash image (need to create)

### Optional but Helpful:
- Demo video
- User testimonials
- Usage statistics
- Grant application (if applying)

## Quick Test

**Test if mini apps work:**
```bash
# Open in browser:
https://dreamnet.ink/miniapps/rewards
https://dreamnet.ink/miniapps/subscriptions
https://dreamnet.ink/miniapps/social
https://dreamnet.ink/miniapps/contributions
```

**All should load and be functional!** ✅

## Next Actions

1. **Create icons/screenshots** for each mini app
2. **Update manifest URLs** with real images
3. **Find Base submission process** (portal/API/contact)
4. **Submit all 4 mini apps**
5. **Wait for approval**
6. **Celebrate when they appear in Base App!** 🎉

---

**TL;DR**: Mini apps work via direct URLs NOW, but won't appear in Base App directory until we submit them. Need to find Base's submission process and submit! 🚀

