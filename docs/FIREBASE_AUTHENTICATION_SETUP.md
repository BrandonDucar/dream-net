# Firebase Authentication Setup - Service Account Key

**Project**: DREAMNET V3  
**Purpose**: Authenticate Firebase CLI for deployment

---

## 🔐 Option 1: Service Account Key (Recommended for CI/CD)

### Step 1: Get Service Account Key

1. **Go to Firebase Console**:
   - https://console.firebase.google.com/
   - Select project: **DREAMNET V3**

2. **Navigate to Service Accounts**:
   - Click gear icon ⚙️ → **Project Settings**
   - Go to **Service Accounts** tab

3. **Generate Private Key**:
   - Click **"Generate New Private Key"**
   - Click **"Generate Key"** in popup
   - JSON file will download automatically

4. **Save the Key**:
   - Save as: `firebase-service-account.json`
   - **IMPORTANT**: Add to `.gitignore` (never commit this!)

### Step 2: Set Environment Variable

**Windows (PowerShell)**:
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\dev\dream-net\firebase-service-account.json"
```

**Windows (Command Prompt)**:
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\dev\dream-net\firebase-service-account.json
```

**Linux/Mac**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/firebase-service-account.json"
```

### Step 3: Verify Authentication

```bash
firebase projects:list
```

Should show your projects.

---

## 🔐 Option 2: Firebase Login (Recommended for Local Development)

### Step 1: Login with Firebase CLI

```bash
firebase login
```

This will:
1. Open browser
2. Ask you to sign in with Google
3. Grant permissions
4. Return to terminal

### Step 2: Verify Login

```bash
firebase projects:list
firebase use dreamnet-v3
```

---

## 🔐 Option 3: Application Default Credentials (ADC)

### For Google Cloud Integration:

If you're already authenticated with `gcloud`:

```bash
gcloud auth application-default login
```

This sets up Application Default Credentials that Firebase can use.

---

## 📁 File Setup

### 1. Create `.gitignore` Entry

Add to `.gitignore`:
```
# Firebase
firebase-service-account.json
firebase-service-account-*.json
*.json.key
```

### 2. Create Service Account File Location

**Recommended location**: Root of project
```
dream-net/
├── firebase-service-account.json  ← Save here (gitignored)
├── .firebaserc
├── firebase.json
└── ...
```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use environment variables
- ✅ Add service account JSON to `.gitignore`
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Use least privilege (minimal permissions)

### ❌ DON'T:
- ❌ Commit service account keys to Git
- ❌ Share keys in chat/messages
- ❌ Use same key for multiple projects
- ❌ Give keys excessive permissions

---

## 🎯 Quick Setup Script

Create `scripts/setup-firebase-auth.ps1`:

```powershell
# Setup Firebase Authentication
# Run this script to set up Firebase auth

Write-Host "Setting up Firebase authentication..." -ForegroundColor Cyan

# Check if service account file exists
$serviceAccountPath = "$PSScriptRoot\..\firebase-service-account.json"

if (Test-Path $serviceAccountPath) {
    Write-Host "Found service account file!" -ForegroundColor Green
    
    # Set environment variable
    $env:GOOGLE_APPLICATION_CREDENTIALS = $serviceAccountPath
    Write-Host "Set GOOGLE_APPLICATION_CREDENTIALS=$serviceAccountPath" -ForegroundColor Green
    
    # Verify
    Write-Host "`nVerifying authentication..." -ForegroundColor Cyan
    firebase projects:list
    
} else {
    Write-Host "Service account file not found!" -ForegroundColor Yellow
    Write-Host "Please download it from Firebase Console:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.firebase.google.com/" -ForegroundColor Yellow
    Write-Host "2. Select project: DREAMNET V3" -ForegroundColor Yellow
    Write-Host "3. Project Settings → Service Accounts" -ForegroundColor Yellow
    Write-Host "4. Generate New Private Key" -ForegroundColor Yellow
    Write-Host "5. Save as: firebase-service-account.json" -ForegroundColor Yellow
    Write-Host "`nOr use: firebase login" -ForegroundColor Cyan
}
```

---

## 🚀 For Firebase AI

### If Using Service Account Key:

1. **Get the key** from Firebase Console (user needs to do this)
2. **Save it** as `firebase-service-account.json` in project root
3. **Set environment variable**: `GOOGLE_APPLICATION_CREDENTIALS`
4. **Verify**: `firebase projects:list`

### If Using Firebase Login:

1. **Run**: `firebase login`
2. **Follow browser prompts**
3. **Verify**: `firebase projects:list`

---

## ✅ Verification Checklist

- [ ] Service account key downloaded OR Firebase login completed
- [ ] Environment variable set (if using service account)
- [ ] `.gitignore` updated (if using service account)
- [ ] `firebase projects:list` works
- [ ] `firebase use dreamnet-v3` works
- [ ] Ready to deploy!

---

## 📚 References

- **Firebase Service Accounts**: https://firebase.google.com/docs/admin/setup
- **Application Default Credentials**: https://cloud.google.com/docs/authentication/application-default-credentials
- **Firebase CLI Auth**: https://firebase.google.com/docs/cli#authentication

---

**Ready to authenticate! Choose your method above.**

