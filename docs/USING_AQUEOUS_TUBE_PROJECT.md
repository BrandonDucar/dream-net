# 🎯 Using aqueous-tube-470317-m6 for DreamNet

**Decision**: Use existing project `aqueous-tube-470317-m6` under `brandonducar1234@gmail.com`  
**Reason**: Keep all DreamNet work separate under this account

---

## ✅ What's Changed

- **Project ID**: `aqueous-tube-470317-m6` (instead of `dreamnet-62b49`)
- **Account**: `brandonducar1234@gmail.com`
- **All scripts**: Updated to use new project ID

---

## 🚀 Setup Steps

### Step 1: Link Billing

**Go to**: https://console.cloud.google.com/billing?project=aqueous-tube-470317-m6

**Link your billing account** (with $300 credits)

---

### Step 2: Grant Owner Role

**Go to**: https://console.cloud.google.com/iam-admin/iam?project=aqueous-tube-470317-m6

**Add**: `brandonducar1234@gmail.com` with **Owner** role

---

### Step 3: Set Project in Environment

**Set environment variable**:
```bash
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"
```

**Or add to `.env`**:
```
GCP_PROJECT_ID=aqueous-tube-470317-m6
```

---

### Step 4: Enable APIs

**Run**:
```bash
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"; pnpm enable:gcp-apis
```

---

### Step 5: Verify

**Run**:
```bash
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"; pnpm check:gcp-setup
```

---

## 📋 Quick Commands

**Set project**:
```bash
gcloud config set project aqueous-tube-470317-m6
```

**Set environment variable** (PowerShell):
```powershell
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"
```

**Enable APIs**:
```bash
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"; pnpm enable:gcp-apis
```

**Deploy**:
```bash
$env:GCP_PROJECT_ID="aqueous-tube-470317-m6"; pnpm deploy:gke
```

---

## 🔧 Update Scripts

All scripts will use `GCP_PROJECT_ID` environment variable or default to `aqueous-tube-470317-m6`.

**To use this project permanently**, update scripts to use:
```typescript
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'aqueous-tube-470317-m6';
```

---

**Next**: Link billing → Grant Owner → Enable APIs → Deploy! 🚀

