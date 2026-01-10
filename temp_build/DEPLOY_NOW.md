# Deploy Now - You're Ready!

## You're Already in the Right Place

Your terminal shows: `PS C:\Users\brand\OneDrive\Documents\GitHub\dream-net\client>`

**You're already in `client/` - don't `cd client` again!**

---

## Just Deploy

Since you're already in `client/`, just run:

```bash
vercel --prod
```

That's it! No `cd` needed.

---

## What Will Happen

1. Vercel CLI reads `.vercel/project.json` (already linked)
2. Uses `client/vercel.json` (no rootDirectory, builds from here)
3. Runs `pnpm run build` (builds dreamops-launcher)
4. Outputs to `dist/`
5. Deploys to production

---

## If It Still Fails

Check the error message. Common issues:

**"rootDirectory" error:**
- Go to Vercel dashboard → Settings → General
- Clear/delete "Root Directory" field
- Save, then try `vercel --prod` again

**"pnpm not found":**
- Vercel needs pnpm installed
- Dashboard → Settings → Build & Development
- Add: `corepack enable` to Install Command

**"No projects matched":**
- The workspace filter isn't working
- Try: `pnpm install` first, then `vercel --prod`

---

## Quick Command

Just run this (you're already in client/):

```bash
vercel --prod
```

That's all you need!
