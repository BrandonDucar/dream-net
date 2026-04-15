# 🔍 Find the Right Google Cloud Account for DreamNet

**Current Situation**:
- ✅ Account 1: `brandonducar1234@gmail.com` → Has project `aqueous-tube-470317-m6`
- ❓ Account 2: `???@gmail.com` → Likely owns `dreamnet-62b49`

---

## 🎯 Step 1: Authenticate Your Second Account

**Run**:
```bash
gcloud auth login
```

**When prompted**:
- Choose "Add a new account" or select your second email
- Complete authentication in browser

**Then check**:
```bash
gcloud auth list
```

Should show both accounts now.

---

## 🔍 Step 2: Check Which Account Owns dreamnet-62b49

**Switch to account 2**:
```bash
gcloud config set account YOUR_SECOND_EMAIL@gmail.com
```

**Check if it has access**:
```bash
gcloud projects describe dreamnet-62b49
```

**List its projects**:
```bash
gcloud projects list
```

**If it shows `dreamnet-62b49`**:
- ✅ This is the right account!
- Make sure billing is linked on this account
- Grant yourself Owner role if needed

---

## ✅ Step 3: Set Up DreamNet with the Right Account

**Once you identify the correct account**:

1. **Set it as active**:
   ```bash
   gcloud config set account CORRECT_EMAIL@gmail.com
   gcloud config set project dreamnet-62b49
   ```

2. **Verify billing**:
   - Go to: https://console.cloud.google.com/billing?project=dreamnet-62b49
   - Make sure billing account is linked

3. **Grant Owner role** (if needed):
   - Go to: https://console.cloud.google.com/iam-admin/iam?project=dreamnet-62b49
   - Find your email
   - If missing, click "Grant Access" → Add email → Role: **Owner**

4. **Re-authenticate**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

5. **Enable APIs**:
   ```bash
   pnpm enable:gcp-apis
   ```

6. **Verify**:
   ```bash
   pnpm check:gcp-setup
   ```

---

## 💡 Alternative: Use Your Current Account's Project

**If you prefer to use `aqueous-tube-470317-m6`**:

1. **Update project ID in scripts**:
   - Change `dreamnet-62b49` to `aqueous-tube-470317-m6`
   - Or set environment variable: `export GCP_PROJECT_ID=aqueous-tube-470317-m6`

2. **Link billing**:
   - Go to: https://console.cloud.google.com/billing?project=aqueous-tube-470317-m6

3. **Enable APIs**:
   ```bash
   GCP_PROJECT_ID=aqueous-tube-470317-m6 pnpm enable:gcp-apis
   ```

---

## 🚀 Quick Commands

**Authenticate second account**:
```bash
gcloud auth login
```

**Check all accounts**:
```bash
gcloud auth list
pnpm check:gcp-accounts
```

**Switch accounts**:
```bash
gcloud config set account EMAIL@gmail.com
```

**Check project access**:
```bash
gcloud projects describe dreamnet-62b49
```

---

**Next**: Authenticate second account → Find which owns `dreamnet-62b49` → Set it up! 🚀

