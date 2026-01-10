# Monitor Vercel Build in Real-Time

## Quick Start

### 1. Get Your Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `dream-net-monitor`
4. Copy the token

### 2. Set Token (Windows PowerShell)

```powershell
$env:VERCEL_TOKEN="your_token_here"
```

Or permanently:
```powershell
[System.Environment]::SetEnvironmentVariable('VERCEL_TOKEN', 'your_token_here', 'User')
```

### 3. Monitor Build

```bash
pnpm vercel:monitor
```

This will:
- ✅ Find your project automatically
- ✅ Show latest deployment status
- ✅ Stream build logs in real-time
- ✅ Alert when build completes or fails

---

## Alternative: Quick Status Check

```bash
tsx scripts/check-vercel-status.ts
```

Shows:
- Recent deployments
- Current state (BUILDING, READY, ERROR)
- URLs
- Stuck build detection

---

## What the Monitor Shows

```
🔍 Monitoring Vercel Build...

📦 Project: dream-net
🔑 Token: vercel_abc...

✅ Found project: dream-net (prj_xxx)

📋 Latest deployment: dpl_xxx
   State: 🔨 BUILDING
   URL: https://dream-net-xxx.vercel.app

⏳ Monitoring for updates...

🔨 BUILDING - 2:30:45 PM
🌐 URL: https://dream-net-xxx.vercel.app
⏱️  Building since: 2:30:45 PM
   Installing dependencies...
   Running pnpm install...
   Building client...
   ✓ Built successfully

✅ READY - 2:32:15 PM
🌐 URL: https://dream-net-xxx.vercel.app
✅ Ready at: 2:32:15 PM

==================================================
✅ Deployment successful!
🌐 Live at: https://dream-net-xxx.vercel.app
==================================================
```

---

## Troubleshooting

### "Project not found"
- Check project name in script matches your Vercel project name
- Default: `dream-net`
- Edit `scripts/monitor-vercel-build.ts` line 8 if different

### "No deployments found"
- Build hasn't started yet
- Trigger a deployment in Vercel dashboard
- Or push a commit to GitHub

### "Token invalid"
- Regenerate token at https://vercel.com/account/tokens
- Make sure it has read access to deployments

---

## Manual Check (No Script)

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click **"Deployments"** tab
4. See latest deployment status

---

**Ready to monitor!** 🚀

