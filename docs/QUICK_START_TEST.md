# Quick Start Test Guide

## 🚀 **FASTEST WAY TO TEST**

### 1. Start Server (Development Mode)
```bash
# From root directory
pnpm dev:app
```

**Expected Output:**
```
✅ Server listening on port 3000
✅ [Routes] Registered /api/social-media-ops
✅ [Routes] Registered /api/ott
✅ [Spine] Event Bus initialized
```

### 2. Test Fixed Routes

**In another terminal or browser:**

```bash
# Test Social Media Ops Status
curl http://localhost:3000/api/social-media-ops/status

# Test OTT Config
curl http://localhost:3000/api/ott/config
```

**Expected Response:**
```json
{
  "ok": true,
  "status": { ... }
}
```

---

## ✅ **WHAT WE FIXED**

1. **social-media-ops.ts** ✅
   - Now uses `SocialMediaOpsAgent`
   - All routes fixed
   - No more `CampaignMasterAgent` errors

2. **OTTService.ts** ✅
   - Created missing service file
   - Integrates with Jellyfin/PeerTube
   - All methods implemented

---

## 🔍 **WHAT TO LOOK FOR**

### ✅ Success Indicators:
- Server starts without crashes
- Routes respond with 200 OK
- No import errors in console
- Services initialize correctly

### ❌ Error Indicators:
- "Cannot find module" errors
- Routes return 500 errors
- Server crashes on startup
- Missing service errors

---

## 📋 **NEXT STEPS AFTER TESTING**

### If Server Starts Successfully:
1. ✅ Document working routes
2. ✅ Test all endpoints
3. ✅ Update Antigravity prompts
4. ✅ Plan next features

### If Server Has Errors:
1. ❌ Fix import errors
2. ❌ Check service files
3. ❌ Add error handling
4. ❌ Retest

---

**Ready to test!** Run `pnpm dev:app` and check the console.





















