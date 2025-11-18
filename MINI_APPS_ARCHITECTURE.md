# 🏗️ Mini Apps Architecture - Understanding the Design

## What Are Base Mini Apps?

**Base Mini Apps are NOT nodes** - they're **discoverable web applications** that run inside Base App (similar to how apps work in an app store).

### Key Concepts:

1. **Discoverability**: Mini apps appear in Base App's directory, making them searchable and accessible to Base users
2. **Standalone Experience**: Each mini app is a complete, focused experience
3. **Base App Integration**: They run inside Base App's interface, with wallet connection and context
4. **Web Apps**: They're regular web applications (React, HTML, etc.) hosted on your server

### Think of it like:
- **App Store Apps**: Each mini app is like an app in the App Store
- **Not Nodes**: They're not network nodes or blockchain nodes
- **Web Applications**: They're web apps that Base App can discover and embed

## Why Mini Apps vs Main Website?

### Mini Apps Are For:
✅ **Discovery in Base App** - Users find them in Base App's directory
✅ **Focused Experiences** - Single-purpose, optimized flows
✅ **Base Ecosystem** - Part of Base's app ecosystem
✅ **Standalone Access** - Can be accessed directly via URL

### Main Website Is For:
✅ **Complete Experience** - Full DreamNet ecosystem
✅ **Integrated Features** - Everything in one place
✅ **Deep Linking** - Features work together seamlessly
✅ **Primary Interface** - Main way users interact with DreamNet

## The Right Architecture

### Current State (What We Have):
```
Main Website (dreamnet.ink)
├── Landing Page
├── Mini Apps Directory
├── Gallery
└── Mini Apps (separate pages)
    ├── /miniapps/rewards
    ├── /miniapps/subscriptions
    ├── /miniapps/social
    └── /miniapps/contributions
```

### Better Architecture (What We Should Have):
```
Main Website (dreamnet.ink)
├── Landing Page
├── Dream Viewing Pages
│   ├── Dream Details (with contributions UI)
│   ├── Dream Gallery
│   └── Dream Evolution Tracking
├── Mini Apps (also accessible standalone)
│   ├── /miniapps/rewards (standalone)
│   ├── /miniapps/subscriptions (standalone)
│   ├── /miniapps/social (standalone)
│   └── /miniapps/contributions (standalone)
└── Integrated Features
    └── Contributions embedded in dream pages
```

## The Problem with Current Approach

**Contributions should be BOTH:**
1. ✅ A standalone mini app (for Base App discovery)
2. ✅ Integrated into dream viewing pages (for main site users)

**Right now we only have #1** - users have to navigate to a separate page to contribute, which breaks the flow.

## Solution: Dual Integration

### Option 1: Embed Contributions in Dream Pages
- When viewing a dream on the main site, show contribution UI directly
- No need to navigate away
- Seamless experience

### Option 2: Keep Mini App + Add to Main Site
- Mini app for Base App discovery
- Same component reused in dream pages
- Best of both worlds

## What Should Be Mini Apps?

### Good Mini Apps (Focused, Standalone):
- ✅ **Rewards Hub** - Daily claims, leaderboards (focused experience)
- ✅ **Subscriptions** - Creator subscription management (specific use case)
- ✅ **Social Feed** - Browse and discover dreams (social experience)
- ✅ **Contributions** - Support dreams (focused action)

### Should Also Be Integrated:
- ✅ **Contributions** - Should appear on dream detail pages
- ✅ **Social Feed** - Should be accessible from dream pages
- ✅ **Rewards** - Should show balance in main site

## Base Mini Apps = Discoverable Web Apps

**Not:**
- ❌ Network nodes
- ❌ Blockchain nodes
- ❌ Separate services
- ❌ Independent applications

**Are:**
- ✅ Web applications
- ✅ Discoverable in Base App
- ✅ Accessible via URL
- ✅ Can be embedded elsewhere
- ✅ Part of Base ecosystem

## Recommendation

1. **Keep mini apps** for Base App discovery
2. **Also integrate** key features into main site
3. **Reuse components** - same contribution UI in both places
4. **Best of both worlds** - discoverable AND integrated

---

**TL;DR**: Mini apps are discoverable web apps in Base App (like App Store apps), not network nodes. Contributions should be BOTH a mini app (for discovery) AND integrated into dream pages (for main site users).

