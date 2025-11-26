# Local Build Commands

## Quick Build (Recommended)

From the **repo root** (`c:\dev\dream-net`):

```powershell
# Enable pnpm
corepack enable pnpm
corepack prepare pnpm@10.21.0 --activate

# Install dependencies for client workspace
pnpm --filter client... install --include=optional

# Build the client
pnpm --filter client run build
```

Or as a one-liner:
```powershell
corepack enable pnpm; corepack prepare pnpm@10.21.0 --activate; pnpm --filter client... install --include=optional; pnpm --filter client run build
```

---

## Alternative: Build from Client Directory

If you prefer to work from the `client` directory:

```powershell
# Navigate to client directory
cd client

# Enable pnpm (if not already enabled)
corepack enable pnpm
corepack prepare pnpm@10.21.0 --activate

# Install dependencies
pnpm install --include=optional

# Build
pnpm build
```

---

## What Happens

1. **Enable pnpm** - Makes pnpm available
2. **Install dependencies** - Installs all packages needed for client
3. **Build** - Runs `vite build --mode production`
4. **Output** - Creates `client/dist/` folder with built files

---

## Verify Build Success

After building, check:
```powershell
# Check if dist folder exists
Test-Path client/dist

# List files in dist
Get-ChildItem client/dist
```

You should see:
- `index.html`
- `assets/` folder with JS/CSS files

---

## Common Issues

### Issue: "pnpm: command not found"
**Fix:** Install pnpm globally or use corepack:
```powershell
npm install -g pnpm
# OR
corepack enable pnpm
```

### Issue: "Cannot find module"
**Fix:** Make sure you're in the repo root and run install first:
```powershell
pnpm install
```

### Issue: "Unsupported engine"
**Fix:** Make sure you're using Node 24.x:
```powershell
node --version  # Should show v24.x.x
```

---

## Build Output Location

The built files will be in:
```
client/dist/
```

This is what Vercel will deploy!

