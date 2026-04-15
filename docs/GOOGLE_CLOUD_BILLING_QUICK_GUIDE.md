# 💳 Google Cloud Billing Setup - Quick Guide

**Project**: dreamnet-62b49  
**Credits Available**: $1,300

---

## 🎯 Enable Billing (2 Minutes)

### Step 1: Go to Billing Console

**Direct Link**: https://console.cloud.google.com/billing?project=dreamnet-62b49

### Step 2: Link Billing Account

**If You Have a Billing Account**:
1. Select your billing account from the list
2. Click "Set Account"
3. Done! ✅

**If You Don't Have a Billing Account**:
1. Click "Create Billing Account"
2. Fill in:
   - Account name: `DreamNet Production`
   - Country: Your country
   - Payment method: Credit card (won't be charged if you have credits)
3. Click "Submit and Enable Billing"
4. Link to project `dreamnet-62b49`
5. Done! ✅

### Step 3: Verify

**In Console**:
- Should see billing account linked
- Should see $1,300 credits available

**Via CLI**:
```bash
gcloud billing projects describe dreamnet-62b49
```

Should show billing account name (not "billing not enabled").

---

## ⚠️ Important Notes

- ✅ **Credits Available**: $1,300 - You won't be charged until credits run out
- ✅ **Free Tier**: Many services have free tiers (Cloud SQL, BigQuery, etc.)
- ✅ **No Immediate Charges**: Billing is just to enable services
- ⚠️ **Set Budget Alerts**: Recommended to monitor spending

---

## 🔔 Set Budget Alerts (Recommended)

1. **Go to**: https://console.cloud.google.com/billing/budgets?project=dreamnet-62b49
2. **Click**: "Create Budget"
3. **Set**:
   - Budget amount: $50/month (or your preference)
   - Alert threshold: 50%, 90%, 100%
4. **Save**

This will email you if spending approaches your limit.

---

## ✅ After Billing is Enabled

### Enable APIs
```bash
pnpm enable:gcp-apis
```

### Test Access
```bash
pnpm check:gcp-setup
```

### Deploy
```bash
pnpm deploy:gke
```

---

**Direct Link**: https://console.cloud.google.com/billing?project=dreamnet-62b49  
**Time**: 2 minutes  
**Next**: Enable APIs → Deploy! 🚀

