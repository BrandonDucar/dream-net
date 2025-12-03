# Quick Deploy - Token Balance Mini App

## Step-by-Step Deployment

**Open your terminal and run these commands:**

```bash
# 1. Navigate to the Mini App directory
cd miniapps/token-balance

# 2. Install dependencies
pnpm install

# 3. Build the app
pnpm build

# 4. Deploy to Vercel (will create project if needed)
vercel --prod
```

**When `vercel --prod` runs:**
- First time: It will ask to link to a project
  - Choose: **"Create new project"**
  - Project name: `dreamnet-token-balance`
  - Root directory: `.` (just press Enter)
  - Framework: It should auto-detect Vite
  - Build command: `pnpm build` (or press Enter if auto-detected)
  - Output directory: `dist` (or press Enter if auto-detected)

**After deployment, you'll get a URL like:**
```
https://dreamnet-token-balance.vercel.app
```

**Copy that URL - we'll need it for the next steps!**

---

## Next Steps After Deployment

1. **Update manifest** with your Vercel URL
2. **Setup account association** via Base Build
3. **Add screenshots** (required for featured apps)
4. **Test** using Base Build Preview
5. **Publish** to Base App

