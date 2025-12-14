# Firebase AI - Initial Prompt & Setup Guide

**Project**: DREAMNET V3  
**Firebase Project**: DREAMNET V3 (blank slate)  
**Status**: Ready to begin

---

## 🎯 Your Role & Focus

**Firebase AI specializes in**:
- ✅ Firebase infrastructure setup (Firestore, Functions, Auth, Storage)
- ✅ Firebase deployment and configuration
- ✅ Firebase integrations (Firebase SDK, Admin SDK)
- ✅ Firebase security rules
- ✅ Firebase hosting
- ✅ Firebase Cloud Functions
- ✅ Firebase real-time features

---

## 📋 Current Project State

### What Exists:
- **GitHub Repo**: `BrandonDucar/dream-net`
- **Cloud Run**: Backend deployed at `dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app`
- **Vercel**: Frontend Mini Apps (in progress)
- **Base Blockchain**: Contracts deployed to Base Mainnet
- **Monorepo Structure**: `client/`, `server/`, `packages/`

### What's Needed:
- **Firebase Integration**: Connect Firebase to existing infrastructure
- **Firebase Services**: Set up Firestore, Functions, Auth, etc.
- **Firebase Hosting**: Option for frontend hosting
- **Firebase Real-time**: For live features

---

## 🚀 First Tasks for Firebase AI

### Priority 1: Discovery & Analysis
1. **Analyze Current Codebase**
   - Review Firebase-related code (if any)
   - Identify where Firebase can be integrated
   - Check `server/` for Firebase usage
   - Check `client/` for Firebase SDK usage

2. **Identify Integration Points**
   - Where should Firestore be used?
   - Where should Firebase Auth be used?
   - Where should Cloud Functions be used?
   - Where should Firebase Storage be used?

### Priority 2: Initial Setup
3. **Firebase Project Configuration**
   - Set up Firebase project structure
   - Configure Firebase CLI
   - Set up environment variables
   - Create `firebase.json` configuration

4. **Firebase Services Setup**
   - **Firestore**: Database for user data, dreams, etc.
   - **Firebase Auth**: User authentication
   - **Firebase Storage**: File storage (images, etc.)
   - **Cloud Functions**: Serverless functions
   - **Firebase Hosting**: Optional frontend hosting

### Priority 3: Integration
5. **Connect to Existing Backend**
   - Integrate Firebase Admin SDK in `server/`
   - Set up Firestore collections
   - Configure Firebase Auth integration
   - Set up Cloud Functions if needed

6. **Connect to Frontend**
   - Add Firebase SDK to `client/`
   - Set up Firebase Auth in frontend
   - Connect to Firestore from frontend
   - Set up Firebase Storage for uploads

---

## 📁 Key Files to Review

### Backend (`server/`):
- `server/index.ts` - Main server file
- `server/config/env.ts` - Environment config
- `server/routes/` - API routes
- `server/integrations/` - External integrations

### Frontend (`client/`):
- `client/src/App.tsx` - Main app
- `client/src/pages/` - Page components
- `client/vite.config.ts` - Build config

### Packages (`packages/`):
- Various packages that might need Firebase

---

## 🔧 Firebase Services to Set Up

### 1. **Firestore Database**
**Use Cases**:
- User profiles
- Dreams data
- Mini Apps data
- Agent data
- Real-time updates

**Collections to Create**:
- `users` - User profiles
- `dreams` - Dream data
- `miniapps` - Mini app metadata
- `agents` - Agent configurations
- `sessions` - User sessions

### 2. **Firebase Authentication**
**Use Cases**:
- User login/signup
- Wallet-based auth
- Social auth (if needed)
- Token management

**Providers**:
- Email/Password (if needed)
- Wallet-based (custom)
- Anonymous (for guests)

### 3. **Firebase Storage**
**Use Cases**:
- Dream images
- User avatars
- Mini App assets
- Screenshots

**Buckets**:
- `dream-images/` - Dream images
- `user-avatars/` - User avatars
- `miniapp-assets/` - Mini app assets

### 4. **Cloud Functions**
**Use Cases**:
- Serverless API endpoints
- Background jobs
- Webhooks
- Scheduled tasks

**Functions to Create**:
- `onUserCreate` - User creation handler
- `onDreamCreate` - Dream creation handler
- `scheduledTasks` - Cron jobs
- `webhooks` - External webhooks

### 5. **Firebase Hosting** (Optional)
**Use Cases**:
- Frontend hosting alternative to Cloud Run
- Static site hosting
- CDN for assets

---

## 🔐 Security Rules

**Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dreams are public read, authenticated write
    match /dreams/{dreamId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Mini apps are public read
    match /miniapps/{appId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /dream-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /user-avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎯 Integration Strategy

### Phase 1: Foundation
1. Set up Firebase project
2. Configure Firebase CLI
3. Create basic Firestore collections
4. Set up Firebase Auth
5. Configure security rules

### Phase 2: Backend Integration
1. Add Firebase Admin SDK to `server/`
2. Create Firebase service layer
3. Migrate data to Firestore (if needed)
4. Set up Cloud Functions
5. Test backend integration

### Phase 3: Frontend Integration
1. Add Firebase SDK to `client/`
2. Set up Firebase Auth in frontend
3. Connect to Firestore
4. Set up Firebase Storage uploads
5. Test frontend integration

### Phase 4: Advanced Features
1. Real-time listeners
2. Offline support
3. Push notifications
4. Analytics
5. Performance monitoring

---

## 📝 Files to Create

### Firebase Configuration:
- `firebase.json` - Firebase project config
- `.firebaserc` - Firebase project aliases
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes
- `storage.rules` - Storage security rules
- `functions/` - Cloud Functions directory

### Integration Files:
- `server/integrations/firebase.ts` - Firebase Admin SDK integration
- `client/src/lib/firebase.ts` - Firebase SDK setup
- `packages/firebase-client/` - Shared Firebase client package

---

## 🔗 Coordination with Other AIs

### With Composer (Me):
- **I handle**: Frontend code, Mini Apps, UI/UX
- **You handle**: Firebase setup, Firebase integration
- **Coordination**: I'll add Firebase SDK to frontend, you configure Firebase

### With Antigravity:
- **Antigravity handles**: Backend server layers, subsystems
- **You handle**: Firebase backend integration
- **Coordination**: Antigravity deploys backend, you integrate Firebase Admin SDK

### With ChatGPT:
- **ChatGPT handles**: General questions, brainstorming
- **You handle**: Firebase-specific implementation
- **Coordination**: ChatGPT provides ideas, you implement Firebase solutions

---

## ✅ Success Criteria

### Phase 1 Complete When:
- ✅ Firebase project configured
- ✅ Firebase CLI set up
- ✅ Basic Firestore collections created
- ✅ Security rules configured
- ✅ Firebase Auth configured

### Phase 2 Complete When:
- ✅ Firebase Admin SDK integrated in backend
- ✅ Firestore data models created
- ✅ Cloud Functions deployed
- ✅ Backend can read/write Firestore

### Phase 3 Complete When:
- ✅ Firebase SDK integrated in frontend
- ✅ Users can authenticate
- ✅ Frontend can read/write Firestore
- ✅ File uploads working

---

## 📚 Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firebase Admin SDK**: https://firebase.google.com/docs/admin/setup
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Cloud Functions**: https://firebase.google.com/docs/functions

---

## 🚀 Start Here

1. **Read this document** ✅
2. **Analyze codebase** - Find Firebase integration points
3. **Set up Firebase project** - Configure Firebase CLI
4. **Create initial structure** - Firestore collections, security rules
5. **Report back** - Create status document with findings

---

**Ready to begin! Start with discovery and analysis.**

