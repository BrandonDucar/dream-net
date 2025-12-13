# Firebase Setup Instructions - DREAMNET V3

**Project**: DREAMNET V3  
**Status**: Ready to configure

---

## 🚀 Quick Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

Or with pnpm:
```bash
pnpm add -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Project

```bash
firebase init
```

**Select**:
- ✅ Firestore
- ✅ Functions
- ✅ Storage
- ✅ Hosting (optional)

**Project**: `dreamnet-v3`

---

## 📁 Firebase Project Structure

```
dream-net/
├── firebase.json              ✅ Already exists (hosting config)
├── .firebaserc                ✅ Created (project config)
├── firestore.rules            ⏳ Need to create
├── firestore.indexes.json     ⏳ Need to create
├── storage.rules              ⏳ Need to create
└── functions/                 ⏳ Need to create
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

---

## 🔧 Firebase CLI Commands

### Check Status
```bash
firebase projects:list
firebase use
```

### Deploy
```bash
firebase deploy
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage
```

### Emulators (Local Development)
```bash
firebase emulators:start
```

---

## 📦 Firebase SDK Installation

### Backend (Admin SDK)
```bash
cd server
pnpm add firebase-admin
```

### Frontend (Client SDK)
```bash
cd client
pnpm add firebase
```

### Functions
```bash
cd functions
pnpm add firebase-functions firebase-admin
```

---

## 🔐 Environment Variables

### Backend (`server/.env`):
```
FIREBASE_PROJECT_ID=dreamnet-v3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dreamnet-v3.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Frontend (`client/.env`):
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=dreamnet-v3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dreamnet-v3
VITE_FIREBASE_STORAGE_BUCKET=dreamnet-v3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 🎯 Next Steps

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Login**: `firebase login`
3. **Initialize**: `firebase init`
4. **Select project**: `dreamnet-v3`
5. **Configure services**: Firestore, Functions, Storage
6. **Deploy**: `firebase deploy`

---

**Ready for Firebase AI to configure!**

