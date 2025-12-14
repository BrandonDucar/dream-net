# Firebase AI - Setup Firebase CLI & SDK

**From**: Composer  
**To**: Firebase AI  
**Priority**: 🔴 HIGH  
**Status**: Ready to start

---

## 🎯 Task: Set Up Firebase CLI and SDK

Firebase AI, you need to set up Firebase CLI and SDKs to connect to the DREAMNET V3 project.

---

## 📋 Setup Checklist

### 1. **Install Firebase CLI**
- [ ] Check if Firebase CLI is installed: `firebase --version`
- [ ] If not installed: `npm install -g firebase-tools`
- [ ] Verify installation: `firebase --version`

### 2. **Login to Firebase**
- [ ] Run: `firebase login`
- [ ] Authenticate with Google account
- [ ] Verify login: `firebase projects:list`

### 3. **Connect to Project**
- [ ] Set project: `firebase use dreamnet-v3`
- [ ] Verify connection: `firebase use`
- [ ] Check project info: `firebase projects:list`

### 4. **Initialize Firebase Services**
- [ ] Run: `firebase init`
- [ ] Select services:
  - ✅ Firestore
  - ✅ Functions
  - ✅ Storage
  - ✅ Hosting (optional)
- [ ] Configure each service

### 5. **Install Firebase SDKs**

**Backend (Admin SDK)**:
```bash
cd server
pnpm add firebase-admin
```

**Frontend (Client SDK)**:
```bash
cd client
pnpm add firebase
```

**Functions**:
```bash
cd functions
pnpm add firebase-functions firebase-admin
```

### 6. **Create Configuration Files**

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add rules here
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Add rules here
  }
}
```

**Functions Setup** (`functions/package.json`):
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1"
  },
  "devDependencies": {
    "typescript": "^4.9.0"
  },
  "private": true
}
```

---

## 📁 Files to Create/Update

### Already Exists:
- ✅ `firebase.json` - Hosting config (exists)
- ✅ `.firebaserc` - Project config (created)

### Need to Create:
- ⏳ `firestore.rules` - Firestore security rules
- ⏳ `firestore.indexes.json` - Firestore indexes
- ⏳ `storage.rules` - Storage security rules
- ⏳ `functions/` - Cloud Functions directory
- ⏳ `functions/package.json` - Functions dependencies
- ⏳ `functions/tsconfig.json` - TypeScript config
- ⏳ `functions/src/index.ts` - Functions entry point

---

## 🔐 Get Firebase Credentials

### For Backend (Admin SDK):
1. Go to: Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download JSON file
4. Extract credentials for environment variables

### For Frontend (Client SDK):
1. Go to: Firebase Console → Project Settings → General
2. Scroll to "Your apps"
3. Click "Web app" icon (</>)
4. Copy config object
5. Add to `client/.env` as `VITE_FIREBASE_*` variables

---

## ✅ Success Criteria

### Setup Complete When:
- ✅ Firebase CLI installed and working
- ✅ Logged in to Firebase
- ✅ Connected to `dreamnet-v3` project
- ✅ Firebase services initialized
- ✅ Firebase SDKs installed (Admin + Client)
- ✅ Configuration files created
- ✅ Credentials configured

---

## 🚀 Start Here

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Login**: `firebase login`
3. **Connect**: `firebase use dreamnet-v3`
4. **Initialize**: `firebase init`
5. **Install SDKs**: Add to `server/` and `client/`
6. **Create config files**: Rules, functions, etc.
7. **Report**: Create status document

---

**Ready to set up Firebase!**

