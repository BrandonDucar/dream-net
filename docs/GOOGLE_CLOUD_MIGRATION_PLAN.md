# 🔄 DreamNet → Google Cloud Migration Plan

**Problem**: DreamNet was built for Neon + Vercel + Railway, now switching to Google Cloud  
**Goal**: Make it work reliably on Google Cloud without breaking existing functionality

---

## 🔍 Issues Found

### 1. **Database Connection** ❌
- **Current**: Uses `@neondatabase/serverless` (Neon-specific)
- **Needed**: Standard Postgres driver for Cloud SQL
- **File**: `server/db.ts`

### 2. **Static File Serving** ❌
- **Current**: `vite.ts` uses `import.meta.dirname` (ESM-only, breaks in compiled JS)
- **Needed**: Works in production with compiled JS
- **File**: `server/vite.ts`

### 3. **Environment Variables** ⚠️
- **Current**: Assumes Vercel/Railway env var format
- **Needed**: Google Cloud Secret Manager or env vars
- **Files**: Multiple

### 4. **Build Process** ⚠️
- **Current**: Assumes Vercel build process
- **Needed**: Docker build for Cloud Run
- **File**: `Dockerfile`

---

## ✅ Fix Plan

### Step 1: Fix Database Connection
**Make `db.ts` support both Neon AND standard Postgres**

```typescript
// Support both Neon (dev/legacy) and standard Postgres (Cloud SQL)
if (process.env.DATABASE_URL?.includes('neon.tech')) {
  // Use Neon serverless
} else {
  // Use standard pg driver for Cloud SQL
}
```

### Step 2: Fix Static File Serving
**Make `vite.ts` work in production without import.meta**

```typescript
// Use __dirname equivalent that works in compiled JS
const distPath = path.resolve(process.cwd(), "client", "dist");
```

### Step 3: Update Dockerfile
**Ensure all files are copied and build works**

### Step 4: Test Locally First
**Before deploying, test the server starts locally**

---

## 🎯 Priority Order

1. **Fix db.ts** - Database is critical
2. **Fix vite.ts** - Static serving is critical  
3. **Fix Dockerfile** - Deployment needs to work
4. **Test locally** - Verify before Cloud Run
5. **Deploy** - Then deploy to Cloud Run

---

**Let's fix these one by one, starting with the database connection.**

