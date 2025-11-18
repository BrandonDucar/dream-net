# 🚀 DreamNet Quick Reference

## Current Status

### ✅ Live & Working
- **Site**: https://dreamnet.ink
- **Mini Apps**: 3 live (Rewards, Subscriptions, Social)
- **Contracts**: Deployed to Base Mainnet
- **Navigation**: Creative anti-corporate design

### ❌ Critical Gaps
1. **Mini apps NOT in Base App directory** - Can't be discovered
2. **No welcome/onboarding** - New users are lost
3. **No cross-navigation prompts** - Users don't explore
4. **Agents hidden** - Powerful features not exposed

---

## Base App Integration (DO THIS FIRST)

### Why It Matters
Without Base App integration, users can only find mini apps if they know the URL. They won't appear in Base App's "Apps" section.

### What to Do

#### 1. Install Base MiniKit
```bash
cd apps/site
pnpm add @coinbase/onchainkit
```

#### 2. Create Manifests
Each mini app needs its own manifest:
- `public/.well-known/farcaster-rewards.json`
- `public/.well-known/farcaster-subscriptions.json`
- `public/.well-known/farcaster-social.json`

#### 3. Submit to Base
- Use Base's submission form
- Or contact Base team
- Get listed in directory

---

## Welcome Agent (DO THIS SECOND)

### Why It Matters
New users land on the site and have no idea what to do. Welcome agent guides them.

### What to Build

1. **WELCOME Agent** (`server/agents/WELCOME.ts`)
   - Detects first-time users
   - Provides personalized greeting
   - Suggests next actions

2. **Welcome Component** (`apps/site/src/components/WelcomeAgent.tsx`)
   - Modal/tour interface
   - Step-by-step walkthrough
   - Progress tracking

3. **Onboarding Flow**
   - What is DreamNet?
   - How to earn DREAM
   - Explore mini apps
   - Meet the agents

---

## Cross-Navigation (DO THIS THIRD)

### Why It Matters
Users get stuck in one section. Need prompts to explore other areas.

### What to Build

1. **ContextualPrompts Component**
   - "You might also like" suggestions
   - Based on current page
   - Smart recommendations

2. **ProgressTracker**
   - Shows exploration progress
   - "You've explored X of Y sections"
   - Next suggested action

---

## Agent System (DO THIS FOURTH)

### Why It Matters
You have powerful agents (LUCID, CANVAS, ROOT, etc.) but users don't know about them.

### What to Build

1. **Agent Explorer Page** (`/agents`)
   - List all agents
   - Descriptions & capabilities
   - Unlock requirements

2. **Agent Status Dashboard**
   - Real-time status
   - Active tasks
   - Trust scores

---

## Quick Wins (Do These Now)

### 1. Base App Detection (30 min)
```typescript
// apps/site/src/lib/base-app.ts
export function isBaseApp(): boolean {
  return typeof window !== 'undefined' && 
    window.location.search.includes('baseApp=true');
}
```

### 2. Simple Welcome Modal (2 hours)
- Detect first visit
- Show welcome message
- Link to key sections

### 3. Contextual Prompts (2 hours)
- Add "You might also like" to each mini app
- Link to other sections

### 4. Agent Explorer (3 hours)
- Create `/agents` page
- List all agents
- Show descriptions

**Total: ~8 hours for immediate improvements**

---

## File Locations

### Mini Apps
- Rewards: `apps/site/src/pages/miniapps/rewards/index.tsx`
- Subscriptions: `apps/site/src/pages/miniapps/subscriptions/index.tsx`
- Social: `apps/site/src/pages/miniapps/social/index.tsx`

### Agents
- LUCID: `server/agents/LUCID.ts`
- CANVAS: `server/agents/CANVAS.ts`
- ROOT: `server/agents/ROOT.ts`
- ECHO: `server/agents/ECHO.ts`
- Welcome: **MISSING** - needs to be built

### Components
- Navigation: `apps/site/src/App.tsx` (lines 223-310)
- Landing: `apps/site/src/App.tsx` (main component)

---

## Next Steps

1. **Start with Base App integration** - Highest priority
2. **Build welcome agent** - Critical for new users
3. **Add cross-navigation** - Improves engagement
4. **Expose agent system** - Unlocks powerful features

---

## Questions to Answer

1. **How do users find mini apps?** → Base App directory
2. **How do new users get started?** → Welcome agent
3. **How do users discover other sections?** → Contextual prompts
4. **How do users learn about agents?** → Agent explorer

---

**Priority Order:**
1. Base App Integration (discovery)
2. Welcome Agent (onboarding)
3. Cross-Navigation (engagement)
4. Agent System (features)

