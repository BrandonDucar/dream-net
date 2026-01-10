# How to Open DreamNet in Cursor (After Moving)

## Quick Steps

### Option 1: File Menu (Easiest)
1. In Cursor, click **File** (top menu)
2. Click **Open Folder...**
3. Navigate to: `C:\dev\dream-net`
4. Click **Select Folder**

### Option 2: Keyboard Shortcut
1. Press **Ctrl + K, Ctrl + O** (or **Ctrl + O**)
2. Navigate to: `C:\dev\dream-net`
3. Click **Select Folder**

### Option 3: Drag and Drop
1. Open File Explorer (Windows key + E)
2. Navigate to: `C:\dev\dream-net`
3. Drag the `dream-net` folder into Cursor window

### Option 4: Command Palette
1. Press **Ctrl + Shift + P**
2. Type: `Open Folder`
3. Select **File: Open Folder**
4. Navigate to: `C:\dev\dream-net`
5. Click **Select Folder**

## Verify You're in the Right Place

After opening, check the bottom-left of Cursor - it should show:
```
C:\dev\dream-net
```

NOT:
```
C:\Users\brand\OneDrive\Documents\GitHub\dream-net
```

## If You See the Old Location

If Cursor is still showing the old OneDrive location:
1. Close all Cursor windows
2. Reopen Cursor
3. Use File → Open Folder → `C:\dev\dream-net`

## Quick Test

Once opened, press **Ctrl + `** (backtick) to open terminal in Cursor.

Run:
```powershell
Get-Location
```

It should show: `C:\dev\dream-net`

If it shows the old OneDrive path, you're in the wrong folder - close and reopen!

