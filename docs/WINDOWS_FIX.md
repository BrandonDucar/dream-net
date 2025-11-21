# Windows PowerShell Fix

**Issue**: `NODE_ENV=development` doesn't work in Windows PowerShell  
**Fix**: Use `cross-env` for cross-platform compatibility

---

## What Was Wrong

```json
"dev:app": "NODE_ENV=development tsx server/index.ts"
```

This Unix/Linux syntax doesn't work in Windows PowerShell.

---

## The Fix

1. **Installed**: `cross-env` (cross-platform environment variable setter)
2. **Updated**: Script to use `cross-env NODE_ENV=development`

```json
"dev:app": "cross-env NODE_ENV=development tsx server/index.ts"
```

---

## Status

- ✅ `cross-env` installed
- ✅ Script updated
- ⏳ Server starting...

---

**This was a Windows compatibility issue, not a server break!** 🪟✅

