# Domain Migration Guide - Replit to DreamNet Platform

## 🌐 Your Current Domain Setup

### Domains You Have:
1. **`dreamnet.ink`** → Currently configured for Vercel (via DomainKeeper)
2. **`dreamnet.live`** → Currently pointing to Firebase
3. **`dadf.org`** → On Namecheap, not configured yet
4. **`aethersafe`** → In Replit (needs migration)

---

## 🚀 Migration Strategy

### Option 1: Keep Everything Separate (Recommended for Now)
- **`dreamnet.ink`** → Main DreamNet Hub (Vercel or Railway)
- **`dreamnet.live`** → Keep on Firebase (or migrate to Railway)
- **`dadf.org`** → Configure for a specific project/mini-app
- **`aethersafe`** → Migrate from Replit to DreamNet platform

### Option 2: Consolidate Everything
- All domains → Point to DreamNet unified platform
- Use subdomains for different projects:
  - `dreamnet.ink` → Main Hub
  - `aethersafe.dreamnet.ink` → Aethersafe app
  - `dadf.dreamnet.ink` → DADF project

---

## 📦 Step 1: Migrate from Replit

### What's in Replit?
- **Aethersafe** website/app
- Possibly other projects

### How to Get Code Out of Replit:

#### Method 1: Export via Git (Easiest)
1. **In Replit:**
   - Open your Replit project
   - Click the **"Version Control"** icon (or Git icon)
   - Click **"Connect to GitHub"**
   - Create a new GitHub repo or connect to existing one
   - Push your code

2. **Then in DreamNet:**
   ```bash
   # Clone the repo locally
   git clone https://github.com/yourusername/aethersafe.git
   
   # Or add as a submodule to DreamNet
   cd packages
   git submodule add https://github.com/yourusername/aethersafe.git aethersafe
   ```

#### Method 2: Download ZIP
1. **In Replit:**
   - Click the **three dots** (⋮) menu
   - Select **"Download as ZIP"**
   - Extract locally

2. **Add to DreamNet:**
   ```bash
   # Extract the ZIP
   unzip aethersafe.zip
   
   # Move to DreamNet packages
   mv aethersafe packages/
   
   # Install dependencies
   cd packages/aethersafe
   pnpm install
   ```

#### Method 3: Copy Files Manually
1. **In Replit:**
   - Select all files (Ctrl+A / Cmd+A)
   - Copy files
   - Paste into DreamNet project structure

---

## 🔧 Step 2: Configure `dreamnet.live` (Firebase)

### Current Status:
- ✅ Already pointing to Firebase
- ✅ `firebase.json` configured for `client/dist`

### Options:

#### Option A: Keep on Firebase
- No changes needed
- Continue deploying with: `firebase deploy --only hosting`

#### Option B: Migrate to Railway
1. **Deploy to Railway** (already set up)
2. **Update DNS** at your domain registrar:
   ```
   Type: CNAME
   Name: @
   Value: [your-railway-domain].up.railway.app
   ```
3. **Remove Firebase domain** (optional)

---

## 🎯 Step 3: Configure `dadf.org` (Namecheap)

### Quick Setup Options:

#### Option A: Point to DreamNet Hub
1. **In Namecheap DNS:**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
   (Or Railway domain if using Railway)

2. **In Vercel/Railway:**
   - Add `dadf.org` as a custom domain
   - SSL certificate will auto-generate

#### Option B: Create a Mini-App for DADF
1. **Create new mini-app:**
   ```bash
   cd packages
   mkdir dadf-app
   # Build your DADF app here
   ```

2. **Deploy separately:**
   - Deploy to Firebase, Railway, or Vercel
   - Point `dadf.org` to that deployment

#### Option C: Use as Subdomain
- Point `dadf.org` → `dadf.dreamnet.ink`
- Or create `dadf.dreamnet.ink` subdomain

---

## 🔄 Step 4: Migrate Aethersafe from Replit

### After Getting Code Out:

#### Step 1: Add to DreamNet Monorepo
```bash
# Option A: As a package
cd packages
mkdir aethersafe
# Copy Replit code here

# Option B: As a mini-app
cd packages/base-mini-apps/frontend
# Add Aethersafe component
```

#### Step 2: Integrate with DreamNet
1. **Add to mini-apps registry:**
   ```typescript
   // packages/base-mini-apps/frontend/index.tsx
   export { AethersafeMini } from './AethersafeMini';
   
   export const MINI_APPS = {
     // ... existing apps
     'aethersafe': {
       id: 'aethersafe',
       name: 'Aethersafe',
       component: AethersafeMini,
       // ...
     }
   };
   ```

2. **Add to Hub catalog:**
   ```typescript
   // client/src/mocks/apps.ts
   {
     id: 'aethersafe',
     name: 'Aethersafe',
     category: 'security',
     route: '/hub/apps/aethersafe',
   }
   ```

#### Step 3: Deploy
- Deploy as part of DreamNet Hub
- Or deploy separately and point domain

---

## 📋 Domain Configuration Checklist

### For Each Domain:

- [ ] **`dreamnet.ink`**
  - [ ] DNS pointing to Vercel/Railway
  - [ ] Domain added in Vercel/Railway dashboard
  - [ ] SSL certificate active
  - [ ] DomainKeeper configured (if using Vercel)

- [ ] **`dreamnet.live`**
  - [ ] DNS pointing to Firebase
  - [ ] Firebase project configured
  - [ ] Domain added in Firebase Console
  - [ ] SSL certificate active

- [ ] **`dadf.org`**
  - [ ] DNS configured at Namecheap
  - [ ] Domain added to hosting platform
  - [ ] SSL certificate active
  - [ ] Content deployed

- [ ] **Aethersafe**
  - [ ] Code migrated from Replit
  - [ ] Integrated into DreamNet (or separate deployment)
  - [ ] Domain configured (if using custom domain)

---

## 🛠️ Quick Commands

### Check Domain DNS:
```bash
# Check where domain points
nslookup dreamnet.ink
nslookup dreamnet.live
nslookup dadf.org
```

### Deploy to Firebase:
```bash
cd client
pnpm build
cd ..
firebase deploy --only hosting
```

### Deploy to Railway:
```bash
# Already configured via Railway dashboard
# Or use Railway CLI:
railway up
```

### Deploy to Vercel:
```bash
vercel --prod
```

---

## 💡 Recommendations

1. **Keep `dreamnet.live` on Firebase** for now (it's working)
2. **Migrate Aethersafe** from Replit → DreamNet packages
3. **Configure `dadf.org`** → Point to a specific mini-app or the Hub
4. **Use DomainKeeper** for `dreamnet.ink` automation (already set up)

---

## 🆘 Need Help?

If you want me to:
- **Migrate Aethersafe code** → Share the Replit project link or export
- **Configure `dadf.org`** → Tell me where you want it to point
- **Set up domain automation** → I can extend DomainKeeper for all domains
- **Create deployment scripts** → I can automate the whole process

**Just let me know what you want to do first!** 🚀

