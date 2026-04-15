# Firebase Domain Setup - Complete Guide

## 🎯 Your Domain Strategy

Since you can issue `.dream` and `.sheep` domains yourself, here's the plan:

### Current Domains:
- **`dreamnet.ink`** → Vercel (keep as-is or migrate to Firebase)
- **`dreamnet.live`** → Firebase ✅ (already working)
- **`dadf.org`** → Can point to Firebase or use as `.dream` domain
- **Aethersafe** → Migrate from Replit → Firebase

### Future Domains:
- **`.dream` TLD** → Issued automatically with Dream State Passports
- **`.sheep` TLD** → Alternative domain system
- **External domains** → Can link to `.dream` domains

---

## 🚀 Quick Setup: Deploy Everything to Firebase

### Step 1: Deploy DreamNet Hub

```bash
# Build and deploy
bash scripts/setup-firebase-all.sh
```

This will:
- ✅ Build the frontend (`client/dist`)
- ✅ Deploy to Firebase Hosting
- ✅ Use your existing Firebase project (`aqueous-tube-470317-m6`)

### Step 2: Add Custom Domains

After deployment, add domains in Firebase Console:

1. **Go to Firebase Console** → Hosting
2. **Click "Add custom domain"**
3. **Add domains:**
   - `dreamnet.live` (already configured)
   - `dadf.org` (if you want)
   - Any other domains

4. **Follow DNS instructions** for each domain

---

## 📦 Migrate from Replit

### Option 1: If Repos Are on GitHub

```bash
# Check your GitHub repos
export GITHUB_TOKEN=your_token_here
tsx scripts/check-github-repos.ts
```

This will:
- List all your GitHub repos
- Highlight Replit-related ones (like Aethersafe)
- Show clone commands

Then:
```bash
# Clone Aethersafe (or other repo)
git clone https://github.com/yourusername/aethersafe.git packages/aethersafe

# Integrate into DreamNet
# (Add to mini-apps or deploy separately)
```

### Option 2: Manual Migration

1. **In Replit:**
   - Download as ZIP
   - Or copy files manually

2. **Add to DreamNet:**
   ```bash
   # Extract to packages
   unzip aethersafe.zip -d packages/aethersafe
   
   # Or use migration script
   bash scripts/migrate-from-replit.sh
   ```

3. **Deploy:**
   - Deploy as part of DreamNet Hub (Firebase)
   - Or deploy separately and point domain

---

## 🎫 Issue .dream and .sheep Domains

### API Endpoints

**Issue a .dream domain:**
```bash
POST /api/domains/issue/dream
{
  "passportId": "passport:alice-001",
  "walletAddress": "0x...",
  "requestedName": "alice",  // optional
  "tier": "personal"  // personal, custom, premium
}
```

**Issue a .sheep domain:**
```bash
POST /api/domains/issue/sheep
{
  "passportId": "passport:alice-001",
  "walletAddress": "0x...",
  "requestedName": "alice"
}
```

**Resolve domain:**
```bash
GET /api/domains/resolve/alice.dream
```

**Get domains for passport:**
```bash
GET /api/domains/passport/passport:alice-001
```

**Get domains for wallet:**
```bash
GET /api/domains/wallet/0x...
```

**Link external domain:**
```bash
POST /api/domains/link
{
  "dreamDomain": "alice.dream",
  "externalDomain": "dadf.org"
}
```

### Example Usage

```typescript
// Issue domain when passport is created
const passport = await createPassport({ wallet: "0x..." });
const domain = await fetch('/api/domains/issue/dream', {
  method: 'POST',
  body: JSON.stringify({
    passportId: passport.id,
    walletAddress: passport.wallet,
    requestedName: 'alice',
  }),
});

// Result: { domain: "alice.dream", ... }
```

---

## 🌐 DNS Configuration

### For Firebase Hosting:

**Apex Domain (e.g., `dadf.org`):**
```
Type: A
Name: @
Value: [Firebase provides IP addresses]
```

**Subdomain (e.g., `www.dadf.org`):**
```
Type: CNAME
Name: www
Value: [Firebase provides CNAME]
```

### For .dream/.sheep Domains:

These are **internal** domains that resolve within DreamNet:
- `alice.dream` → Resolves to `alice.dreamnet.ink` (or custom deployment)
- `alice.sheep` → Same system, different TLD

**Implementation:**
- Use DreamNet's DNS resolver
- Or proxy through `dreamnet.ink`:
  - `alice.dream` → `alice.dreamnet.ink`
  - `alice.sheep` → `alice.dreamnet.ink`

---

## 📋 Complete Checklist

### Firebase Setup:
- [ ] Deploy DreamNet Hub to Firebase
- [ ] Add `dreamnet.live` domain (already done)
- [ ] Add `dadf.org` domain (optional)
- [ ] Configure DNS records

### Replit Migration:
- [ ] Check GitHub repos (`tsx scripts/check-github-repos.ts`)
- [ ] Clone Aethersafe repo
- [ ] Integrate into DreamNet or deploy separately
- [ ] Test deployment

### Domain Issuance:
- [ ] Test `.dream` domain issuance API
- [ ] Test `.sheep` domain issuance API
- [ ] Link external domains to `.dream` domains
- [ ] Build frontend UI for domain management

---

## 💡 Recommendations

1. **Keep `dreamnet.live` on Firebase** ✅ (it's working)
2. **Deploy DreamNet Hub to Firebase** (easier than Vercel)
3. **Migrate Aethersafe** from Replit → Firebase
4. **Use `dadf.org`** → Point to Firebase or link to `.dream` domain
5. **Issue `.dream` domains** → Automatically with passports
6. **Issue `.sheep` domains** → Alternative TLD option

---

## 🆘 Need Help?

Run these commands to get started:

```bash
# 1. Deploy to Firebase
bash scripts/setup-firebase-all.sh

# 2. Check GitHub repos (if you have GITHUB_TOKEN)
export GITHUB_TOKEN=your_token
tsx scripts/check-github-repos.ts

# 3. Test domain issuance
curl -X POST http://localhost:5000/api/domains/issue/dream \
  -H "Content-Type: application/json" \
  -d '{"passportId":"passport:test-001","walletAddress":"0x..."}'
```

**Everything is set up and ready to go!** 🚀

