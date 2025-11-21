# 🔐 Google Cloud Multi-Account Setup

**Situation**: You have 2 Google Cloud accounts, each with $300 credits  
**Goal**: Use the right account for DreamNet project `dreamnet-62b49`

---

## 🔍 Step 1: Identify Which Account Owns the Project

**Check all authenticated accounts**:
```bash
gcloud auth list
```

**Check which account has access to dreamnet-62b49**:
```bash
gcloud projects describe dreamnet-62b49
```

**List all projects for each account**:
```bash
# Switch to account 1
gcloud config set account EMAIL1@gmail.com
gcloud projects list

# Switch to account 2
gcloud config set account EMAIL2@gmail.com
gcloud projects list
```

---

## ✅ Step 2: Choose Your Strategy

### Option A: Use One Account (Recommended)

**If `dreamnet-62b49` belongs to one account**:
1. Use that account for DreamNet
2. Keep the other account for other projects
3. Switch between accounts as needed

**Set the active account**:
```bash
gcloud config set account YOUR_EMAIL@gmail.com
gcloud config set project dreamnet-62b49
```

---

### Option B: Grant Access to Both Accounts

**If you want both accounts to access DreamNet**:

1. **Go to IAM Console**: https://console.cloud.google.com/iam-admin/iam?project=dreamnet-62b49

2. **Add the second account**:
   - Click "Grant Access"
   - Enter the second email
   - Grant role: **Owner** or **Editor**
   - Click "Save"

3. **Now both accounts can use the project**

---

## 🚀 Step 3: Set Up DreamNet with Active Account

**After choosing the account**:

1. **Set active account**:
   ```bash
   gcloud config set account YOUR_CHOSEN_EMAIL@gmail.com
   ```

2. **Set project**:
   ```bash
   gcloud config set project dreamnet-62b49
   ```

3. **Re-authenticate**:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

4. **Grant yourself Owner role** (if not already):
   - Go to: https://console.cloud.google.com/iam-admin/iam?project=dreamnet-62b49
   - Find your email
   - If missing, click "Grant Access" → Add email → Role: **Owner**

5. **Enable APIs**:
   ```bash
   pnpm enable:gcp-apis
   ```

6. **Verify**:
   ```bash
   pnpm check:gcp-setup
   ```

---

## 💡 Pro Tips

### Switch Between Accounts Quickly

**List accounts**:
```bash
gcloud auth list
```

**Switch account**:
```bash
gcloud config set account EMAIL@gmail.com
```

**Check current account**:
```bash
gcloud config get-value account
```

### Use Application Default Credentials

**Set ADC for current account**:
```bash
gcloud auth application-default login
```

**Set quota project** (after permissions are granted):
```bash
gcloud auth application-default set-quota-project dreamnet-62b49
```

---

## 📋 Quick Checklist

- [ ] List all accounts: `gcloud auth list`
- [ ] Identify which account owns `dreamnet-62b49`
- [ ] Set active account: `gcloud config set account EMAIL@gmail.com`
- [ ] Grant Owner role to active account (if needed)
- [ ] Re-authenticate: `gcloud auth login`
- [ ] Set ADC: `gcloud auth application-default login`
- [ ] Enable APIs: `pnpm enable:gcp-apis`
- [ ] Verify: `pnpm check:gcp-setup`

---

## 🎯 Recommended Approach

**For DreamNet**:
1. Use the account that owns `dreamnet-62b49` (or has Owner access)
2. Make sure billing is linked on that account
3. Grant yourself Owner role if needed
4. Enable APIs
5. Deploy!

**For Other Projects**:
- Use the other account
- Switch accounts as needed: `gcloud config set account EMAIL@gmail.com`

---

**Next**: Identify which account owns the project → Set it as active → Grant permissions → Enable APIs → Deploy! 🚀

