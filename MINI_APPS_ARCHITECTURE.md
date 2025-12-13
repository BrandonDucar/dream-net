# 📱 Mini Apps Architecture Explained

## Current Architecture: Single Static Site (SPA)

**Answer: NO, each mini app does NOT need its own static site.**

All 59 mini apps are bundled together into **one single static site** that gets deployed.

---

## How It Works Now

### 1. **Build Process**
```
client/ (React SPA)
  ├── src/
  │   ├── pages/miniapps/[id].tsx  ← Dynamic route handler
  │   └── miniapps/registry.ts      ← Mini app registry
  └── vite.config.ts                ← Builds to client/dist/

Build Output:
  client/dist/
    ├── index.html       ← Single HTML file
    ├── assets/
    │   └── app-[hash].js  ← ONE JavaScript bundle (all apps)
    └── assets/
        └── app-[hash].css ← ONE CSS bundle
```

### 2. **Deployment**
```
Dockerfile:
  - Builds client → client/dist/
  - Copies client/dist/ to server
  - Server serves static files from client/dist/
  
Result:
  - ONE static site
  - All 59 mini apps included
  - Single deployment
```

### 3. **Routing**
```
Routes in App.tsx:
  /miniapps              → Mini apps directory
  /miniapps/:id          → Individual mini app (dynamic)
  
All handled by React Router (wouter)
All in the same JavaScript bundle
```

---

## Pros of Current Approach ✅

1. **Single Deployment** - Deploy once, all apps available
2. **Shared Code** - Common components, utilities, providers
3. **Fast Navigation** - No page reloads between apps
4. **Smaller Bundle** - Code splitting handles unused apps
5. **Consistent UX** - Same header, navigation, theme
6. **Easy Updates** - Update all apps in one deploy

---

## Cons of Current Approach ❌

1. **Large Initial Bundle** - All apps loaded upfront (mitigated by code splitting)
2. **Coupled Deployments** - Can't deploy one app independently
3. **Shared Dependencies** - Version conflicts possible
4. **Single Point of Failure** - One bug affects all apps

---

## When You MIGHT Want Separate Sites

### Option 1: Micro-Frontends (Advanced)
Each mini app as separate deployable app:
```
miniapp-token-balance/
  ├── dist/              ← Own static site
  └── Deploy to: token-balance.dreamnet.ink

miniapp-simple-swap/
  ├── dist/              ← Own static site  
  └── Deploy to: swap.dreamnet.ink
```

**Pros:**
- Independent deployments
- Different teams can own different apps
- Can use different tech stacks
- Isolated failures

**Cons:**
- More complex infrastructure
- Need shared component library
- More deployments to manage
- Cross-app navigation harder

### Option 2: Subdomain Routing
```
dreamnet.ink/miniapps/token-balance
  → Served from same static site (current)

OR

token-balance.dreamnet.ink
  → Separate static site (micro-frontend)
```

---

## Current Implementation Details

### Mini App Registry
```typescript
// client/src/miniapps/registry.ts
export const MINI_APPS: MiniAppConfig[] = [
  {
    id: 'token-balance',
    name: 'Token Balance',
    component: TokenBalanceApp,  // ← React component
    route: '/miniapps/token-balance',
  },
  // ... 59 total apps
];
```

### Dynamic Route Handler
```typescript
// client/src/pages/miniapps/[id].tsx
export default function MiniAppPage() {
  const [match, params] = useRoute('/miniapps/:id');
  const Component = getMiniAppComponent(params.id);
  return <Component />;  // ← Renders the component
}
```

### Build Output
```bash
# Single build command
pnpm build

# Creates:
client/dist/
  ├── index.html
  └── assets/
      ├── index-[hash].js   # Contains ALL apps
      └── index-[hash].css
```

---

## Code Splitting (Already Implemented)

Even though it's one bundle, Vite automatically code-splits:

```typescript
// Lazy loading in App.tsx
<Route 
  path="/miniapps/:id" 
  component={lazy(() => import('@/pages/miniapps/[id]'))} 
/>
```

**Result:**
- Initial bundle: Only core app code
- Mini app code: Loaded on-demand when user visits `/miniapps/:id`
- Each mini app: Separate chunk loaded lazily

---

## Recommendation

**Keep the current architecture** unless you have specific needs:

### Keep Single Site If:
- ✅ You want simple deployments
- ✅ Apps share common code/components
- ✅ You deploy all apps together
- ✅ You want fast navigation between apps

### Consider Separate Sites If:
- ❌ Different teams own different apps
- ❌ Apps need different tech stacks
- ❌ You need independent deployments
- ❌ Apps have very different requirements

---

## How to Make Separate Sites (If Needed)

### Step 1: Create Separate Build Configs
```typescript
// vite.config.token-balance.ts
export default {
  build: {
    outDir: 'dist/token-balance',
    rollupOptions: {
      input: 'src/miniapps/token-balance/index.html'
    }
  }
}
```

### Step 2: Separate Deployments
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'token-balance', '-f', 'Dockerfile.token-balance', '.']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'token-balance', '--image', 'token-balance']
```

### Step 3: Subdomain Routing
```
token-balance.dreamnet.ink → Separate Cloud Run service
swap.dreamnet.ink → Separate Cloud Run service
```

---

## Current Setup Summary

✅ **One static site** (`client/dist/`)  
✅ **All 59 apps bundled** (with code splitting)  
✅ **Single deployment** (Cloud Run)  
✅ **Dynamic routing** (`/miniapps/:id`)  
✅ **Lazy loading** (apps load on-demand)  

**No changes needed** - this is a solid architecture! 🎉
