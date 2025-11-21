# 🔐 Provide Google Cloud Credentials

**Date**: 2025-01-27  
**Status**: Ready to Accept Credentials

---

## 🎯 How to Provide Credentials

### Option 1: Service Account JSON Key (Best)

**If you have a service account JSON file**:

1. **Share the file path**, or
2. **Share the JSON content**, or
3. **Run this command**:
   ```bash
   pnpm setup:gcp-service-account /path/to/service-account.json
   ```

### Option 2: Tell Me the Path

Just tell me:
```
The service account JSON is at: C:\Users\brand\Downloads\dreamnet-key.json
```

And I'll set it up:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=C:\Users\brand\Downloads\dreamnet-key.json
```

### Option 3: Create Service Account Now

**Quick Steps**:
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dreamnet-62b49
2. Click "Create Service Account"
3. Name: `dreamnet-deployer`
4. Grant roles (I can list them)
5. Create JSON key
6. Download it
7. Tell me the path

---

## 🔑 Required Roles for Service Account

If creating new, grant these:
- ✅ Kubernetes Engine Admin
- ✅ Cloud SQL Admin
- ✅ Storage Admin
- ✅ BigQuery Admin
- ✅ Cloud Build Editor
- ✅ Service Usage Admin
- ✅ Compute Admin
- ✅ Cloud Run Admin
- ✅ Pub/Sub Admin
- ✅ Cloud Functions Admin

---

## ✅ Once You Provide Credentials

I'll:
1. ✅ Set up the environment variable
2. ✅ Test access
3. ✅ Enable APIs
4. ✅ Deploy infrastructure

**Just share the path or JSON content!** 🚀

