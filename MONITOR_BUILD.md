# Quick Start - Monitor Build

## Set Your Token (One Time)

**Option 1: PowerShell (Current Session)**
```powershell
$env:VERCEL_TOKEN="your_token_here"
```

**Option 2: Use Helper Script**
```powershell
.\scripts\set-vercel-token.ps1 "your_token_here"
```

**Option 3: Permanent (User Environment)**
```powershell
[System.Environment]::SetEnvironmentVariable('VERCEL_TOKEN', 'your_token_here', 'User')
```

## Then Monitor

```bash
pnpm vercel:monitor
```

Or quick check:
```bash
pnpm tsx scripts/check-vercel-status.ts
```

---

**Paste your token here and I'll set it and start monitoring!**

