# Server Test Plan

## 🎯 **TESTING OBJECTIVES**

1. Verify server starts without crashes
2. Test fixed routes (social-media-ops, ott)
3. Check for import errors
4. Verify service integrations

---

## 📋 **TEST CHECKLIST**

### Pre-Test Setup:
- [ ] Environment variables set (optional for basic test)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Server can be built (if needed)

### Server Startup Test:
- [ ] Start server: `pnpm dev:app`
- [ ] Check for startup errors
- [ ] Verify server listens on port
- [ ] Check console logs for errors

### Route Tests:

#### Social Media Ops Routes:
- [ ] `GET /api/social-media-ops/status` - Should return status
- [ ] `POST /api/social-media-ops/initialize` - Should initialize accounts
- [ ] `POST /api/social-media-ops/post` - Should create posts
- [ ] `GET /api/social-media-ops/messages` - Should return recent posts

#### OTT Routes:
- [ ] `GET /api/ott/config` - Should return OTT config
- [ ] `GET /api/ott/stats` - Should return statistics
- [ ] `POST /api/ott/publish` - Should publish content
- [ ] `POST /api/ott/metrics` - Should record metrics

### Error Checks:
- [ ] No "Cannot find module" errors
- [ ] No "Service not found" errors
- [ ] No TypeScript compilation errors
- [ ] No runtime crashes

---

## 🚀 **TEST COMMANDS**

### Start Server:
```bash
# From root directory
pnpm dev:app

# Or from server directory
cd server
pnpm dev
```

### Test Routes (using curl or browser):
```bash
# Social Media Ops
curl http://localhost:3000/api/social-media-ops/status
curl -X POST http://localhost:3000/api/social-media-ops/initialize

# OTT
curl http://localhost:3000/api/ott/config
curl http://localhost:3000/api/ott/stats
```

### Check Logs:
Look for:
- ✅ `[Social Media Ops]` messages
- ✅ `[OTT]` messages
- ✅ `✅ [Routes] Registered` messages
- ❌ Error messages
- ❌ Import errors

---

## 📊 **EXPECTED RESULTS**

### Successful Startup:
```
✅ Server listening on port 3000
✅ [Routes] Registered /api/social-media-ops
✅ [Routes] Registered /api/ott
✅ [Spine] Event Bus initialized
✅ [Integration Packages] All 19 integrations initialized
```

### Route Responses:
- **Status Routes**: Should return JSON with `ok: true`
- **Initialize Routes**: Should return accounts/status
- **Config Routes**: Should return configuration

---

## 🔍 **TROUBLESHOOTING**

### If Server Won't Start:
1. Check for import errors in console
2. Verify service files exist
3. Check TypeScript compilation
4. Verify dependencies installed

### If Routes Return 404:
1. Check route registration in `server/index.ts`
2. Verify route files export default router
3. Check route paths match

### If Routes Return 500:
1. Check service initialization
2. Verify service methods exist
3. Check error logs for details

---

**Status:** Ready for testing





















