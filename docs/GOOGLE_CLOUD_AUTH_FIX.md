# 🔐 Google Cloud Authentication Fix

**Issue**: Credentials expired or need refresh  
**Fix**: Re-authenticate and set quota project

---

## ✅ Step 1: Re-authenticate (Browser)

**Run**:
```bash
gcloud auth login
```

This opens your browser. Click "Allow" to grant permissions.

---

## ✅ Step 2: Set Quota Project for ADC

**After login, run**:
```bash
gcloud auth application-default set-quota-project dreamnet-62b49
```

This sets the project for Application Default Credentials.

---

## ✅ Step 3: Verify Authentication

**Check**:
```bash
gcloud auth list
```

Should show `brandonducar1234@gmail.com` with an asterisk (*) indicating it's active.

---

## ✅ Step 4: Enable APIs

**Now run**:
```bash
pnpm enable:gcp-apis
```

This should work now that billing is enabled and auth is refreshed.

---

## ✅ Step 5: Verify Everything

**Run**:
```bash
pnpm check:gcp-setup
pnpm tsx scripts/test-google-cloud-sdk.ts
```

Should show all green checkmarks.

---

## 🚀 Then Deploy!

```bash
pnpm deploy:gke
```

---

**Quick Commands**:
```bash
gcloud auth login
gcloud auth application-default set-quota-project dreamnet-62b49
pnpm enable:gcp-apis
pnpm check:gcp-setup
```

