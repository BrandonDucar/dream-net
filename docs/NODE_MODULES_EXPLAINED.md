# What is node_modules?

## Quick Answer
**`node_modules`** contains all the **dependencies** (libraries/packages) your DreamNet project needs to run. Think of it as a folder full of code libraries that your code imports and uses.

## Do We Need It?
**YES** - Your code won't run without it. When you run `pnpm install`, it reads `package.json` and downloads all required packages into `node_modules`.

## Can We Rebuild It?
**YES** - That's exactly what `pnpm install` does! You can delete `node_modules` anytime and rebuild it. It's like:
- Deleting a compiled program
- Recompiling it from source code

## The OneDrive Problem
OneDrive is **syncing** your `node_modules` folder to the cloud. While it's syncing, it **locks files**, preventing `pnpm` from modifying them. This causes the `EPERM` error.

## Solutions (Best to Worst)

### Option 1: Move Project Outside OneDrive (BEST)
Move your project to a folder NOT synced by OneDrive:
```
C:\dev\dream-net          ← Good (not synced)
C:\Users\brand\OneDrive\... ← Bad (synced)
```

### Option 2: Exclude node_modules from OneDrive Sync
1. Right-click `node_modules` folder
2. Choose "Always keep on this device" (stops syncing)
3. Or pause OneDrive sync while developing

### Option 3: Stop OneDrive While Installing
Use `pnpm force:clean` to stop OneDrive, then install.

### Option 4: Use .gitignore (Already Done)
`node_modules` is in `.gitignore`, so Git won't track it. But OneDrive syncs everything, ignoring `.gitignore`.

## What's Actually in node_modules?
- **1901 packages** (as shown in your install)
- Libraries like: Express, React, TypeScript, Drizzle ORM, etc.
- All the code your DreamNet server and frontend need

## Can We Deploy Without It?
**NO** - But in production (Cloud Run/Docker), we:
1. Build the project (`pnpm build`)
2. Copy only the built files
3. Run `pnpm install --production` (only runtime deps, not dev deps)
4. The Docker container has its own `node_modules` (not synced by OneDrive!)

## Summary
- ✅ **Need it**: Yes, absolutely
- ✅ **Can rebuild**: Yes, anytime with `pnpm install`
- ❌ **OneDrive syncs it**: That's the problem
- ✅ **Solution**: Move project or exclude from OneDrive sync

