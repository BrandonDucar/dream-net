# AI Coordination Matrix - DREAMNET V3

**Project**: DREAMNET V3  
**AIs**: Composer (Me), Antigravity, Firebase AI, ChatGPT  
**Status**: Active Coordination

---

## 👥 AI Roles & Responsibilities

### 🎨 Composer (Me) - Frontend & Deployment
**Focus Areas**:
- ✅ Frontend development (React, Vite, TypeScript)
- ✅ Mini Apps (Base Mini Apps, OnchainKit)
- ✅ Landing pages & UI/UX
- ✅ Deployment automation (Cloud Build, Docker, Vercel)
- ✅ Build processes & static assets
- ✅ Documentation & planning

**Files I Own**:
- `client/` - Frontend code
- `miniapps/` - Mini Apps
- `Dockerfile`, `cloudbuild.yaml` - Deployment configs
- `docs/` - Documentation

---

### ⚙️ Antigravity - Backend Layers & Subsystems
**Focus Areas**:
- ✅ Backend server layers (Tier II/III/IV subsystems)
- ✅ Server initialization & configuration
- ✅ Backend API routes
- ✅ Subsystem integration
- ✅ Server debugging & testing
- ✅ Cloud Run deployment

**Files Antigravity Owns**:
- `server/` - Backend server code
- `packages/*/` - Backend packages/subsystems
- `server/config/` - Server configuration
- `infrastructure/google/` - Google Cloud deployment

---

### 🔥 Firebase AI - Firebase Infrastructure
**Focus Areas**:
- ✅ Firebase project setup & configuration
- ✅ Firestore database design & setup
- ✅ Firebase Authentication
- ✅ Firebase Storage
- ✅ Cloud Functions
- ✅ Firebase security rules
- ✅ Firebase hosting (optional)
- ✅ Firebase integrations

**Files Firebase AI Owns**:
- `firebase.json`, `.firebaserc` - Firebase config
- `firestore.rules`, `storage.rules` - Security rules
- `functions/` - Cloud Functions
- `server/integrations/firebase.ts` - Firebase Admin SDK
- `client/src/lib/firebase.ts` - Firebase SDK

---

### 💬 ChatGPT - General Support & Brainstorming
**Focus Areas**:
- ✅ General questions & answers
- ✅ Architecture brainstorming
- ✅ Problem-solving discussions
- ✅ Code review suggestions
- ✅ Best practices guidance
- ✅ General knowledge queries

**ChatGPT Role**:
- Consultant & advisor
- No direct file ownership
- Provides input to other AIs

---

## 🔄 Workflow & Handoffs

### Scenario 1: Frontend Needs Firebase
**Flow**:
1. **Composer** (me) needs Firebase Auth in frontend
2. **Composer** creates: `docs/composer-prompts/FIREBASE_AUTH_FRONTEND.md`
3. **Firebase AI** reads prompt, sets up Firebase Auth
4. **Firebase AI** creates: `docs/firebase-status/FIREBASE_AUTH_SETUP.md`
5. **Composer** integrates Firebase Auth SDK in frontend
6. **Composer** tests integration

---

### Scenario 2: Backend Needs Firebase
**Flow**:
1. **Antigravity** needs Firestore for data storage
2. **Antigravity** creates: `docs/antigravity-prompts/FIRESTORE_INTEGRATION.md`
3. **Firebase AI** reads prompt, sets up Firestore
4. **Firebase AI** creates: `docs/firebase-status/FIRESTORE_SETUP.md`
5. **Antigravity** integrates Firebase Admin SDK in backend
6. **Antigravity** tests integration

---

### Scenario 3: New Feature Needs Multiple AIs
**Flow**:
1. **ChatGPT** suggests feature architecture
2. **Composer** implements frontend UI
3. **Antigravity** implements backend API
4. **Firebase AI** sets up Firebase services
5. **Composer** coordinates integration

---

## 📁 Documentation Structure

### Handoff Documents:
```
docs/
├── composer-prompts/          # Composer → Other AIs
│   ├── FIREBASE_AUTH_FRONTEND.md
│   └── ...
├── antigravity-prompts/       # Antigravity → Other AIs
│   ├── FIRESTORE_INTEGRATION.md
│   └── ...
├── firebase-prompts/          # Firebase AI → Other AIs
│   ├── FRONTEND_SDK_SETUP.md
│   └── ...
└── status/                    # Status updates
    ├── COMPOSER_STATUS.md
    ├── ANTIGRAVITY_STATUS.md
    └── FIREBASE_STATUS.md
```

---

## 🎯 Current Active Tasks

### Composer (Me):
- ✅ Token Balance Mini App migration to OnchainKit
- ⏳ Vercel deployment setup
- ⏳ Mini Apps deployment

### Antigravity:
- ⏳ Layer Two deployment (Tier II subsystems)
- ⏳ Backend server optimization
- ⏳ Subsystem integration

### Firebase AI:
- 🆕 **STARTING NOW**: Firebase project discovery
- 🆕 **NEXT**: Firebase infrastructure setup
- 🆕 **THEN**: Firebase integration planning

### ChatGPT:
- 💬 Available for questions & brainstorming

---

## 📋 Communication Protocol

### Creating Handoffs:
1. Create prompt document in appropriate folder
2. Include: Current state, desired state, steps, success criteria
3. Reference in status document
4. Other AI picks up and responds

### Status Updates:
1. Create status document after completing work
2. Note any dependencies on other AIs
3. Update coordination matrix
4. Tag other AIs if needed

### Questions:
1. Use ChatGPT for general questions
2. Use handoff docs for specific tasks
3. Use status docs for progress updates

---

## 🔗 Integration Points

### Composer ↔ Firebase AI:
- **Frontend Firebase SDK**: Composer adds SDK, Firebase AI configures
- **Firebase Auth UI**: Composer implements UI, Firebase AI sets up Auth
- **Firestore Queries**: Composer writes queries, Firebase AI sets up collections

### Antigravity ↔ Firebase AI:
- **Firebase Admin SDK**: Antigravity integrates, Firebase AI configures
- **Firestore Backend**: Antigravity writes data, Firebase AI sets up schema
- **Cloud Functions**: Antigravity writes functions, Firebase AI deploys

### Composer ↔ Antigravity:
- **API Endpoints**: Antigravity creates endpoints, Composer consumes
- **Data Models**: Antigravity defines backend models, Composer uses in frontend
- **Deployment**: Composer handles frontend, Antigravity handles backend

---

## ✅ Success Metrics

### Coordination is Successful When:
- ✅ Clear handoff documents exist
- ✅ Each AI knows their responsibilities
- ✅ No duplicate work
- ✅ Integration points are clear
- ✅ Status updates are regular
- ✅ Dependencies are documented

---

## 🚀 Next Steps

### For Firebase AI (Starting Now):
1. **Discovery**: Analyze codebase for Firebase integration points
2. **Setup**: Configure Firebase project
3. **Report**: Create `docs/firebase-status/DISCOVERY_REPORT.md`

### For Composer (Me):
1. **Continue**: Mini Apps deployment
2. **Wait**: For Firebase AI discovery report
3. **Integrate**: Firebase SDK when Firebase AI is ready

### For Antigravity:
1. **Continue**: Backend layer deployment
2. **Wait**: For Firebase AI Firestore setup
3. **Integrate**: Firebase Admin SDK when ready

### For ChatGPT:
1. **Available**: For questions from any AI
2. **Support**: Architecture discussions
3. **Advise**: On best practices

---

## 📚 Reference Documents

- `docs/FIREBASE_AI_PROMPT.md` - Firebase AI initial prompt
- `docs/ANTIGRAVITY_HANDOFF_PROTOCOL.md` - Antigravity protocol
- `docs/ANTIGRAVITY_CURRENT_SESSION_UPDATE.md` - Antigravity status
- `docs/COMPOSER_VS_ANTIGRAVITY_STRENGTHS.md` - Role definitions

---

**All AIs coordinated and ready to work!**

