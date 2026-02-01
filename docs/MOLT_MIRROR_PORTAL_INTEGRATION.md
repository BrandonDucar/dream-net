# 🌐 MOLT-MIRROR INTEGRATION WITH ESTABLISHED WEBSITE ARCHITECTURE

## 🎯 Weaving MOLT-MIRROR into Existing Portal Strategy

Based on our established **Portal Domain Integration Strategy** and **Deployment Core Overview**, we'll integrate MOLT-MIRROR as specialized sub-modules within the existing portal architecture rather than separate websites.

---

## 🏗️ Revised Architecture: Portal-Centric Integration

### **Primary Hub Strategy (Option 1 - Enhanced)**
```
dreamnet.ink     → Portal (MAIN HUB with MOLT-MIRROR modules)
├── /molt-mirror  → MOLT-MIRROR control center
├── /crawl-hub    → Firecrawl extraction interface  
├── /bridge-center → Discord/Telegram bridge management
└── /local-ai     → Local AI dashboard

dreamnet.live    → Portal (interactive + MOLT-MIRROR live features)
dadfi.org        → Portal (DeFi + MOLT-MIRROR financial AI)
aethersafe.pro   → Portal (security + MOLT-MIRROR local AI security)
```

---

## 🔧 Integration Implementation

### **1. Portal Enhancement - Add MOLT-MIRROR Module**
```typescript
// apps/portal/src/components/MoltMirrorModule.tsx
import { MoltDashboard } from './molt-mirror/MoltDashboard';
import { CrawlHub } from './molt-mirror/CrawlHub';
import { BridgeCenter } from './molt-mirror/BridgeCenter';
import { LocalAI } from './molt-mirror/LocalAI';

export function MoltMirrorModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="molt-mirror-module">
      <nav className="molt-nav">
        <button onClick={() => setActiveTab('dashboard')}>🤖 Dashboard</button>
        <button onClick={() => setActiveTab('crawl')}>🕷️ Crawl Hub</button>
        <button onClick={() => setActiveTab('bridge')}>🌉 Bridges</button>
        <button onClick={() => setActiveTab('local')}>🧠 Local AI</button>
      </nav>
      
      {activeTab === 'dashboard' && <MoltDashboard />}
      {activeTab === 'crawl' && <CrawlHub />}
      {activeTab === 'bridge' && <BridgeCenter />}
      {activeTab === 'local' && <LocalAI />}
    </div>
  );
}
```

### **2. Portal Route Integration**
```typescript
// apps/portal/src/App.tsx - Enhanced with MOLT-MIRROR
import { MoltMirrorModule } from './components/MoltMirrorModule';
import { FleetSidebar } from './components/FleetSidebar';
import { MissionControl } from './components/MissionControl';

const App = () => {
  const domain = window.location.hostname;
  const [view, setView] = useState('main');
  
  // Enhanced domain detection with MOLT-MIRROR
  const getDomainConfig = () => {
    if (domain.includes('dreamnet.ink')) {
      return {
        main: <DreamNetInkView />,
        modules: ['molt-mirror', 'arc-rail', 'dreamscape']
      };
    }
    if (domain.includes('dreamnet.live')) {
      return {
        main: <DreamNetLiveView />,
        modules: ['molt-mirror-live', 'interactive']
      };
    }
    // ... other domains
  };
  
  const config = getDomainConfig();
  
  return (
    <div className="portal-app">
      <FleetSidebar />
      <main>
        {config.main}
        {config.modules.includes('molt-mirror') && <MoltMirrorModule />}
      </main>
    </div>
  );
};
```

---

## 📁 Updated Directory Structure

```
apps/portal/
├── src/
│   ├── components/
│   │   ├── FleetSidebar.tsx (existing)
│   │   ├── MissionControl.tsx (existing)
│   │   ├── ArcRailRitual.tsx (existing)
│   │   ├── Dreamscape.tsx (existing)
│   │   └── molt-mirror/              # NEW: MOLT-MIRROR module
│   │       ├── MoltDashboard.tsx
│   │       ├── CrawlHub.tsx
│   │       ├── BridgeCenter.tsx
│   │       ├── LocalAI.tsx
│   │       └── index.ts
│   ├── pages/
│   │   ├── index.tsx (enhanced)
│   │   ├── molt-mirror.tsx          # NEW: Dedicated MOLT-MIRROR page
│   │   └── ...
│   ├── services/
│   │   ├── moltMirrorService.ts     # NEW: API integration
│   │   ├── firecrawlService.ts      # NEW: Web extraction
│   │   └── bridgeService.ts         # NEW: Communication bridges
│   └── utils/
│       └── deploymentCore.ts         # EXISTING: Enhanced
├── package.json (updated)
└── vercel.json (updated)
```

---

## 🚀 Deployment Strategy Integration

### **Using Existing Deployment Core**
```typescript
// apps/portal/src/utils/deploymentCore.ts - Enhanced
import { getDeploymentManager } from '@dreamnet/deployment-core';

export class PortalDeploymentManager {
  private manager = getDeploymentManager();
  
  async deployWithMoltMirror() {
    // Deploy main portal with MOLT-MIRROR modules
    return this.manager.deploy({
      platform: 'vercel',
      project: 'dreamnet-portal',
      domains: ['dreamnet.ink', 'dreamnet.live', 'dadfi.org', 'aethersafe.pro'],
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      env: {
        // MOLT-MIRROR environment variables
        'OLLAMA_URL': process.env.OLLAMA_URL,
        'FIRECRAWL_API_KEY': process.env.FIRECRAWL_API_KEY,
        'DISCORD_BOT_TOKEN': process.env.DISCORD_BOT_TOKEN,
        'TELEGRAM_BOT_TOKEN': process.env.TELEGRAM_BOT_TOKEN
      }
    });
  }
}
```

### **Enhanced Vercel Configuration**
```json
// apps/portal/vercel.json - Updated
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "OLLAMA_URL": "@ollama-url",
    "FIRECRAWL_API_KEY": "@firecrawl-api-key",
    "DISCORD_BOT_TOKEN": "@discord-bot-token",
    "TELEGRAM_BOT_TOKEN": "@telegram-bot-token"
  },
  "routes": [
    {
      "src": "/molt-mirror",
      "dest": "/molt-mirror"
    },
    {
      "src": "/crawl-hub", 
      "dest": "/crawl-hub"
    },
    {
      "src": "/bridge-center",
      "dest": "/bridge-center"
    },
    {
      "src": "/local-ai",
      "dest": "/local-ai"
    }
  ],
  "domains": [
    "dreamnet.ink",
    "dreamnet.live", 
    "dadfi.org",
    "aethersafe.pro"
  ]
}
```

---

## 🎨 UI Integration with Existing Portal Design

### **Consistent Design System**
```typescript
// apps/portal/src/components/molt-mirror/MoltDashboard.tsx
import { Card } from '../ui/Card';           // Existing UI components
import { Button } from '../ui/Button';       // Existing UI components
import { Badge } from '../ui/Badge';         // Existing UI components

export function MoltDashboard() {
  return (
    <div className="molt-dashboard">
      <Card title="🤖 MOLT-MIRROR Status">
        <Badge status="active">Local AI Redundancy</Badge>
        <Badge status="active">Firecrawl Ready</Badge>
        <Badge status="connecting">Bridge Setup</Badge>
      </Card>
      
      <Card title="🧠 Local AI Models">
        {/* Ollama integration */}
      </Card>
      
      <Card title="🕷️ Web Extraction">
        {/* Firecrawl interface */}
      </Card>
    </div>
  );
}
```

---

## 🔗 Service Integration

### **Portal Service Layer Enhancement**
```typescript
// apps/portal/src/services/moltMirrorService.ts
export class MoltMirrorService {
  private apiBase = '/api/molt-mirror';
  
  async getOllamaStatus() {
    return fetch(`${this.apiBase}/ollama/status`).then(r => r.json());
  }
  
  async startFirecrawlJob(url: string) {
    return fetch(`${this.apiBase}/firecrawl/start`, {
      method: 'POST',
      body: JSON.stringify({ url })
    }).then(r => r.json());
  }
  
  async getBridgeStatus() {
    return fetch(`${this.apiBase}/bridge/status`).then(r => r.json());
  }
}
```

### **Backend API Integration**
```typescript
// packages/organs/integumentary/server/src/routes/molt-mirror.ts
import { Router } from 'express';
import { MoltMirrorBridge } from '../services/MoltMirrorBridge';

const router = Router();
const moltBridge = new MoltMirrorBridge();

router.get('/ollama/status', async (req, res) => {
  const status = await moltBridge.getOllamaStatus();
  res.json(status);
});

router.post('/firecrawl/start', async (req, res) => {
  const job = await moltBridge.startFirecrawlJob(req.body.url);
  res.json(job);
});

router.get('/bridge/status', async (req, res) => {
  const status = await moltBridge.getBridgeStatus();
  res.json(status);
});

export default router;
```

---

## 📊 Benefits of Integration Approach

### **✅ Advantages**
1. **Unified Architecture** - Single portal, enhanced with modules
2. **Consistent UX** - Same design system across all features
3. **Shared State** - MOLT-MIRROR integrates with existing agent state
4. **Simplified Deployment** - One deployment instead of 4 separate sites
5. **Domain Flexibility** - Each domain can highlight different MOLT-MIRROR features
6. **Existing Infrastructure** - Leverages current portal backend and APIs

### **🎯 Strategic Alignment**
- **Portal as Central Hub** - Aligns with established strategy
- **Domain-Specific Views** - Each domain gets relevant MOLT-MIRROR features
- **Biomimetic Integration** - MOLT-MIRROR becomes another "organ" in the system
- **Deployment Core** - Uses existing deployment abstraction

---

## 🚀 Implementation Plan

### **Phase 1: Module Development (Week 1)**
```bash
# Create MOLT-MIRROR module in existing portal
mkdir -p apps/portal/src/components/molt-mirror
mkdir -p apps/portal/src/services
mkdir -p apps/portal/src/pages/molt-mirror

# Develop components
# - MoltDashboard.tsx
# - CrawlHub.tsx  
# - BridgeCenter.tsx
# - LocalAI.tsx
```

### **Phase 2: Service Integration (Week 2)**
```bash
# Add backend routes
# packages/organs/integumentary/server/src/routes/molt-mirror.ts
# packages/organs/integumentary/server/src/services/MoltMirrorBridge.ts

# Update portal package.json with new dependencies
# - @dreamnet/firecrawl
# - ollama client
# - discord.js
# - node-telegram-bot-api
```

### **Phase 3: Deployment (Week 3)**
```bash
# Deploy enhanced portal to all domains
cd apps/portal
vercel --prod --domains dreamnet.ink,dreamnet.live,dadfi.org,aethersafe.pro

# Test domain-specific MOLT-MIRROR features
# curl https://dreamnet.ink/molt-mirror
# curl https://dreamnet.live/molt-mirror
```

---

## 🎯 Final Architecture

```
🌐 Single Portal Architecture
├── dreamnet.ink (MAIN HUB)
│   ├── All existing features
│   └── MOLT-MIRROR full suite
├── dreamnet.live (INTERACTIVE)
│   ├── Live features
│   └── MOLT-MIRROR live monitoring
├── dadfi.org (DEFI)
│   ├── DeFi features
│   └── MOLT-MIRROR financial AI
└── aethersafe.pro (SECURITY)
    ├── Security features
    └── MOLT-MIRROR local AI security
```

**Status**: 🟢 READY FOR IMPLEMENTATION
**Approach**: Portal-centric integration (recommended)
**Timeline**: 3 weeks to full deployment
**Priority**: 🔴 HIGH - Aligns with MOLT-MIRROR blackboard priority
