# Fix: Directory Package Import Error

## 🐛 **ERROR**

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './src/registry' is not defined by "exports" in C:\dev\dream-net\server\node_modules\@dreamnet\directory\package.json imported from C:\dev\dream-net\server\gpt-agents\GPTAgentRegistry.ts
```

## 🔍 **ROOT CAUSE**

The import was using the wrong path:
- **Wrong**: `@dreamnet/directory/src/registry`
- **Correct**: `@dreamnet/directory/registry`

The `package.json` exports define `./registry` (not `./src/registry`), which maps to `./src/registry.ts`.

## ✅ **FIX**

**File**: `server/gpt-agents/GPTAgentRegistry.ts`
- **Line 10**: Changed import from `@dreamnet/directory/src/registry` to `@dreamnet/directory/registry`

## 📝 **PACKAGE EXPORTS**

The `@dreamnet/directory` package exports:
- `./registry` → `./src/registry.ts`
- `./bootstrap` → `./src/bootstrap.ts`
- `./idGenerator` → `./src/idGenerator.ts`
- `./types` → `./src/types.ts`

Always use the exported paths (without `/src/`), not the direct file paths.

## ✅ **VERIFICATION**

- ✅ Import path fixed
- ✅ No other files use incorrect path
- ✅ Linter shows no errors
- ✅ Ready to test server startup

---

**Status:** ✅ Fixed - Server should start without this import error now.





















