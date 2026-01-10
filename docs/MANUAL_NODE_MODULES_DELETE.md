# Manual node_modules Deletion Guide

If scripts fail, follow these steps:

## Step 1: Close Everything
- Close VS Code
- Close all terminals
- Close browsers
- Close any Node.js processes

## Step 2: Stop OneDrive
1. Right-click OneDrive icon in system tray
2. Click "Pause syncing" → "2 hours" (or longer)
3. Or open Task Manager → End "OneDrive" process

## Step 3: Delete node_modules
**Option A: File Explorer**
1. Navigate to project folder
2. Right-click `node_modules` folder
3. Click "Delete"
4. If it says "file in use", skip to Option B

**Option B: Command Prompt (as Admin)**
1. Open Command Prompt as Administrator
2. Navigate to project: `cd "C:\Users\brand\OneDrive\Documents\GitHub\dream-net"`
3. Run: `rmdir /s /q node_modules`
4. Wait for it to complete (may take 2-5 minutes)

**Option C: PowerShell (as Admin)**
1. Open PowerShell as Administrator
2. Navigate to project: `cd "C:\Users\brand\OneDrive\Documents\GitHub\dream-net"`
3. Run: `Remove-Item -Path "node_modules" -Recurse -Force`
4. Wait for it to complete

**Option D: If All Else Fails**
1. Restart your computer
2. Immediately after restart (before OneDrive starts syncing)
3. Delete `node_modules` folder
4. Run `pnpm install`

## Step 4: Install Dependencies
After deletion succeeds:
```powershell
pnpm install
```

## Prevention
Move project outside OneDrive:
- From: `C:\Users\brand\OneDrive\Documents\GitHub\dream-net`
- To: `C:\dev\dream-net` (create folder first)

This prevents OneDrive from syncing `node_modules` and causing file locks.

