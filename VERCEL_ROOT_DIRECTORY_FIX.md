# Vercel Root Directory Fix

## The Problem

Vercel dashboard won't accept just `.` in the Root Directory field.

## Solutions

### Option 1: Leave It Empty (Recommended) ✅

1. Go to **Settings → General → Root Directory**
2. **Delete/clear the field** (make it empty/blank)
3. **Save**

Vercel will default to repo root (`.`).

---

### Option 2: Use `./` 

1. Set Root Directory to: `./`
2. Save

---

### Option 3: Remove Root Directory Setting

If the field is required and won't accept empty:

1. Try setting it to: `./` (with the slash)
2. Or: Remove the setting entirely if there's a "Remove" option

---

### Option 4: Use vercel.json Only

If dashboard won't cooperate:

1. **Remove Root Directory from dashboard** (set to empty or remove)
2. **Rely on vercel.json** which already has:
   ```json
   {
     "buildCommand": "cd client && pnpm install && pnpm build",
     "outputDirectory": "client/dist"
   }
   ```

The `cd client` in buildCommand handles the directory navigation.

---

## What vercel.json Does

Your `vercel.json` already specifies:
- `buildCommand`: `cd client && pnpm install && pnpm build`
- `outputDirectory`: `client/dist`

This means:
- Vercel starts at repo root
- Build command navigates to `client/`
- Builds from there
- Outputs to `client/dist`

**So Root Directory should be empty or `.`** - the build command handles navigation.

---

## Try This Order

1. **Clear Root Directory** (make it blank/empty)
2. **Save**
3. **Redeploy**

If that doesn't work:

1. Set Root Directory to: `./`
2. Save
3. Redeploy

---

## If Still Not Working

Check:
- [ ] Is there a "Remove" or "Clear" button?
- [ ] Can you delete the value entirely?
- [ ] Does it accept `./` instead of `.`?

The key is: **Root Directory should point to repo root**, not `client/`.

