# 📱 Frontend Structure Overview

## 📁 Directory Structure

```
packages/base-mini-apps/frontend/
├── index.tsx                    # Main entry point & app registry
├── config.ts                    # Contract addresses configuration
│
├── [29 Mini-App Components]
│
└── [All components are flat - no subdirectories]
```

---

## 🎯 Component Organization

### **Entry Point: `index.tsx`**
- Exports all 29 mini-app components
- Contains `MINI_APPS` registry object for routing
- Each app has metadata: `component`, `name`, `category`, `requiresPassport`, `minTier`

### **Configuration: `config.ts`**
- Centralized contract address management
- `CONTRACT_ADDRESSES` object with all 16 contract addresses
- Environment variable support via `VITE_*` prefix
- Hardcoded fallbacks to deployed addresses

---

## 📊 Mini-Apps by Category

### **Identity (2 apps)**
1. `PassportMintApp.tsx` - Mint Dream Passport NFTs
2. `GovernanceApp.tsx` - Dream State Governance

### **Government Offices (3 apps)**
3. `APIKeeperGovernmentOffice.tsx` - API Keeper governance
4. `JaggyGovernmentOffice.tsx` - Jaggy governance
5. `MyceliumGovernmentOffice.tsx` - Mycelium governance

### **Dashboards & Monitoring (4 apps)**
6. `APIKeeperDashboard.tsx` - API Keeper monitoring
7. `AgentDashboardMini.tsx` - Agent status dashboard
8. `EcosystemDashboardMini.tsx` - Ecosystem overview
9. `ShieldMonitor.tsx` - Shield status monitoring

### **Exploration & Discovery (3 apps)**
10. `DreamGalleryExplorer.tsx` - Browse dream gallery
11. `DreamNetworkExplorer.tsx` - Explore dream network
12. `BadgeBoardMini.tsx` - Achievement badges

### **Social & Commerce (3 apps)**
13. `SocialHub.tsx` - DreamNet social network
14. `WhalePackCommerce.tsx` - Commerce platform
15. `WolfPackPortal.tsx` - Funding portal

### **Treasury & Finance (2 apps)**
16. `Treasury.tsx` - Treasury management
17. `RevenueSharingDashboard.tsx` - Revenue distribution

### **Creative & Content (5 apps)**
18. `DreamVaultMini.tsx` - Dream vaults
19. `DreamRemixStudio.tsx` - Remix creation
20. `DreamTimeCapsuleApp.tsx` - Time-locked dreams ⭐ NEW
21. `WhisperMessengerApp.tsx` - Encrypted messaging
22. `SeasonalEventsHub.tsx` - Seasonal events

### **Utility & Operations (5 apps)**
23. `BountyBoardMini.tsx` - Bounty management
24. `MissionCenter.tsx` - Mission tracking
25. `NightmareNetwork.tsx` - Nightmare registry
26. `ProgressionTracker.tsx` - XP & tier tracking
27. `DreamDNASequencerApp.tsx` - Dream genetic analysis ⭐ NEW

### **Governance & DeFi (2 apps)**
28. `DreamDriftersDAO.tsx` - Drifters DAO
29. `DreamPredictionMarketApp.tsx` - Prediction market ⭐ NEW

---

## 🔧 Component Structure Pattern

All components follow a similar pattern:

```tsx
import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config';

export function ComponentName() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    // Placeholder - would integrate with contract
    alert('Action coming soon! Contract: ' + CONTRACT_ADDRESSES.ContractName);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Component Title</h1>
      {/* UI content */}
    </div>
  );
}
```

**Common Features:**
- React functional components with hooks
- Tailwind CSS styling (dark theme)
- Contract address from `config.ts`
- Placeholder UI ready for contract integration
- Consistent styling patterns

---

## 📋 MINI_APPS Registry Structure

```typescript
export const MINI_APPS = {
  'app-id': {
    component: 'ComponentName',      // Component export name
    name: 'Display Name',            // Human-readable name
    category: 'category',            // Category for grouping
    requiresPassport: boolean,        // Passport requirement
    minTier?: 'visitor' | 'dreamer' | 'citizen' | 'operator' | 'architect' | 'founder'
  },
  // ... 29 total apps
}
```

**Categories:**
- `identity` - Identity & passports
- `governance` - Governance & DAOs
- `utility` - Utility tools
- `creative` - Creative content
- `commerce` - Commerce & trading
- `defi` - DeFi & finance
- `social` - Social features
- `events` - Events & festivals
- `exploration` - Exploration & discovery

---

## 🎨 Styling Conventions

**Color Scheme:**
- Background: `bg-gray-800`, `bg-gray-700`
- Text: `text-white`, `text-gray-300`, `text-gray-400`
- Accents: `text-cyan-400`, `border-cyan-500/20`
- Buttons: `bg-cyan-500 hover:bg-cyan-600`
- Status: `text-green-400` (success), `text-red-400` (error), `text-yellow-400` (warning)

**Layout:**
- Container: `max-w-6xl mx-auto`
- Padding: `p-6`
- Cards: `bg-gray-800 rounded-lg p-4 border border-cyan-500/20`
- Grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

---

## 🔗 Contract Integration Status

### **Fully Integrated (2 apps)**
- `PassportMintApp.tsx` - Uses wagmi hooks
- `GovernanceApp.tsx` - Uses wagmi hooks

### **Placeholder UI (27 apps)**
- All other apps have placeholder UI
- Ready for contract integration
- Contract addresses already configured
- Need wagmi/ethers integration

---

## 📦 Dependencies

**Current:**
- `react` - UI framework
- `wagmi` - Web3 hooks (used in 2 apps)
- Tailwind CSS classes (inline)

**Missing (for full integration):**
- `@wagmi/core` - Core wagmi functionality
- `viem` - Ethereum library
- `@tanstack/react-query` - Data fetching (wagmi dependency)

---

## 🚀 Next Steps for Frontend

1. **Add Wagmi Provider** - Wrap app in WagmiConfig
2. **Connect Components** - Replace placeholders with contract calls
3. **Add Error Handling** - Handle contract errors gracefully
4. **Loading States** - Show loading during transactions
5. **Transaction Feedback** - Show success/error messages
6. **Responsive Design** - Ensure mobile compatibility
7. **Theme System** - Centralize styling (if needed)

---

## 📊 Statistics

- **Total Components:** 29
- **Contract-Based:** 13 apps
- **No Contract:** 16 apps (dashboards, explorers, etc.)
- **Fully Integrated:** 2 apps
- **Placeholder:** 27 apps
- **Contract Addresses:** 16 contracts configured

---

## 🎯 Component Naming Convention

- **Original Apps:** `ComponentName.tsx` (e.g., `PassportMintApp.tsx`)
- **Mini Apps:** `ComponentNameMini.tsx` (e.g., `DreamVaultMini.tsx`)
- **New Creative Apps:** `DreamFeatureApp.tsx` (e.g., `DreamTimeCapsuleApp.tsx`)

---

## 📝 Notes

- All components are **flat** (no subdirectories)
- Components are **self-contained** (no shared UI components yet)
- **No routing** - components are exported for external routing
- **No state management** - each component manages its own state
- **No API layer** - direct contract interaction (when integrated)

