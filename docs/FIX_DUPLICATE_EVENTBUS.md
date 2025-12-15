# Fix: Duplicate eventBus Declaration

## 🐛 **ERROR**

```
ERROR: The symbol "eventBus" has already been declared
at C:\dev\dream-net\server\index.ts:425:8
```

## 🔍 **ROOT CAUSE**

The `eventBus` variable was declared twice:
1. **Line 151**: `let eventBus: DreamEventBus | null = null;` (top-level declaration)
2. **Line 425**: `const eventBus = (global as any).dreamEventBus;` (duplicate declaration inside function)

## ✅ **FIX**

Changed line 425 to use a different variable name:
- **Before**: `const eventBus = (global as any).dreamEventBus;`
- **After**: `const spineEventBus = (global as any).dreamEventBus || eventBus;`

Updated all references in that section to use `spineEventBus`:
- `new ShieldCoreWrapper(spineEventBus)`
- `new BrowserAgentWrapper(spineEventBus)`
- `new DeploymentWrapper(spineEventBus)`

## 📝 **CHANGES**

**File**: `server/index.ts`
- Line 425: Changed `const eventBus` to `const spineEventBus`
- Lines 430, 440, 450: Updated wrapper constructors to use `spineEventBus`

## ✅ **VERIFICATION**

- ✅ No more duplicate declaration error
- ✅ All references updated correctly
- ✅ Linter shows no errors
- ✅ Ready to test server startup

---

**Status:** ✅ Fixed - Server should start without this error now.






















