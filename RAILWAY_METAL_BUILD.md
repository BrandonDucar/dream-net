# Railway Metal Build Beta - Should You Use It?

## What is Metal Build Beta?

Railway's Metal Build Beta is a new build infrastructure using metal-based hardware for faster, more reliable builds.

## Pros ✅

- **Faster Build Times** - Users report significantly faster builds
- **Improved Reliability** - More stable build environment
- **Better Performance** - Metal-based infrastructure

## Cons ⚠️

- **Still Beta** - May have unexpected issues
- **Region Changes** - Some users report services moving regions automatically (US East → US West)
- **Auto-Enabled** - Can be enabled without user action, causing unexpected behavior
- **Deployment Errors** - Some users report build failures

## Recommendation for DreamNet

### For Now: **Skip It** ❌

**Why:**
1. You're already having deployment issues - don't add beta complexity
2. Monorepo builds are complex - need stability first
3. Region changes could break your setup
4. Can always enable later when stable

### When to Consider It ✅

**Enable Metal Build Beta if:**
- Current builds are working perfectly
- Build times are slow (>5 minutes)
- You're okay troubleshooting beta issues
- You can monitor deployments closely

## How to Enable (If You Want to Try)

1. Go to Railway Dashboard
2. Click on your service (`@dreamnet/server`)
3. Go to **Settings** tab
4. Find **Build Environment** section
5. Toggle **Metal Build Beta** ON
6. Monitor first few deployments closely

## Current Setup (Recommended)

**Stick with standard Railway build environment:**
- More stable
- Well-tested
- No surprises
- Works with your monorepo setup

## If You Enable Metal Build Beta

**Watch for:**
- Unexpected region changes
- Build failures
- Longer build times (sometimes beta is slower)
- Deployment errors

**If issues occur:**
- Disable Metal Build Beta immediately
- Revert to standard build environment
- Check Railway logs for errors

## Bottom Line

**For DreamNet right now:** Stick with standard Railway builds until Metal Build Beta is stable. Focus on getting your current setup working first, then optimize later.

