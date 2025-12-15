# Fix: Directory Package Import Path Error

## 🐛 **ERROR**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\dev\dream-net\packages\directory\registry' imported from C:\dev\dream-net\server\routes\directory.ts
```

## 🔍 **ROOT CAUSE**

When using relative paths like `../../packages/directory/registry`, Node.js tries to resolve it as a directory/file path, not using the package.json exports. The package exports define `./registry` which maps to `./src/registry.ts`, but this only works when using the package name.

## ✅ **FIX**

Changed relative paths to use package name instead:

**Before:**
```typescript
import { ... } from "../../packages/directory/registry";
```

**After:**
```typescript
import { ... } from "@dreamnet/directory/registry";
```

**Files Fixed:**
- ✅ `server/routes/register-agents.ts`
- ✅ `server/routes/discovery.ts`
- ✅ `server/routes/directory.ts`

## 📝 **WHY THIS WORKS**

When using `@dreamnet/directory/registry`:
1. Node.js resolves the package name `@dreamnet/directory`
2. Reads `package.json` exports
3. Finds `./registry` export
4. Maps to `./src/registry.ts` as defined in exports

When using `../../packages/directory/registry`:
1. Node.js tries to resolve as file path
2. Looks for `packages/directory/registry` (file or directory)
3. Doesn't use package.json exports
4. Fails because `registry` is not a file (it's `registry.ts`)

## ✅ **VERIFICATION**

- ✅ All imports now use package name
- ✅ Package exports will be used correctly
- ✅ Linter shows no errors
- ✅ Ready to test server startup

---

**Status:** ✅ Fixed - Server should start without this import error now.






















