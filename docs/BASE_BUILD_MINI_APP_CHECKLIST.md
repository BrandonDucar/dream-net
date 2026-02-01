# 🚀 Base Build Mini App Checklist
**Objective**: Build successful mini apps on Base with maximum discovery and engagement

---

## 📋 PRE-BUILD PREPARATION

### 1. **Register for Base Build** ✅ MANDATORY
**Why**: Unlocks Builder Rewards, boosts featuring chances, provides growth insights, and gives Preview tool

**Steps**:
```bash
# 1. Visit https://www.base.org/build
# 2. Connect your wallet
# 3. Register as a builder
# 4. Complete builder profile
# 5. Enable analytics and insights
```

**Benefits**:
- ✅ Builder Rewards eligibility
- ✅ Higher featuring probability
- ✅ Growth analytics dashboard
- ✅ Preview tool for testing
- ✅ Early access to new features

---

## 🔐 AUTHENTICATION STRATEGY

### **Fast, Optional Sign-In**
**Principle**: Authenticate when it unlocks value, not before

**Implementation**:
```typescript
// DreamNet authentication pattern
const useDreamNetAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Only authenticate when needed
  const authenticate = async () => {
    if (!user && needsAuthentication) {
      setIsLoading(true);
      const passport = await issuePassport();
      setUser(passport);
      setIsLoading(false);
    }
  };
  
  return { user, authenticate, isLoading };
};
```

**Best Practices**:
- ✅ Let users explore before signing
- ✅ Show value proposition first
- ✅ Use wallet connection + DreamNet passport
- ✅ Keep authentication < 10 seconds
- ✅ Store session securely

---

## 📋 MANIFEST OPTIMIZATION

### **Complete Manifest Fields**
**Location**: `public/manifest.json`

```json
{
  "name": "Your Mini App Name",
  "short_name": "AppName",
  "description": "Clear, compelling description of your app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#00F3FF",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["finance", "productivity", "utilities"],
  "lang": "en",
  "dir": "ltr",
  "noindex": true // During testing only
}
```

### **Asset Requirements**:
- ✅ **Icon**: 512x512 PNG, transparent background
- ✅ **Screenshot**: 1280x720 PNG, app interface
- ✅ **Hero Image**: 1200x630 PNG, marketing
- ✅ **Favicon**: 32x32 PNG/ICO

---

## 🎨 EMBEDS & PREVIEWS

### **Compelling Preview Design**
**Goal**: Turn impressions into launches

#### OpenGraph Tags
```html
<meta property="og:title" content="Your Mini App - DreamNet" />
<meta property="og:description" content="Brief, compelling description" />
<meta property="og:image" content="https://yourapp.dreamnet.ink/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="https://yourapp.dreamnet.ink" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="DreamNet" />
```

#### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@dreamnet" />
<meta name="twitter:creator" content="@yourhandle" />
<meta name="twitter:title" content="Your Mini App" />
<meta name="twitter:description" content="Brief description" />
<meta name="twitter:image" content="https://yourapp.dreamnet.ink/twitter-card.png" />
```

#### Farcaster Frames (DreamNet Integration)
```typescript
// Generate dynamic OG images for Farcaster
const generateFrameImage = async (appData: AppData) => {
  const image = await createOGImage({
    title: appData.name,
    description: appData.description,
    action: "Launch App",
    theme: "dreamnet-cyber-void"
  });
  
  return image;
};
```

---

## 🔍 SEARCH & DISCOVERY

### **Primary Category Selection**
**Categories**: 
- Finance (DeFi, trading, payments)
- Gaming (Web3 games, metaverse)
- Social (DAOs, communities, messaging)
- Utilities (tools, dashboards, infrastructure)
- Creative (NFTs, art, music)
- Productivity (automation, workflows)

### **Indexing Optimization**
```typescript
// SEO meta tags
const seoMeta = {
  title: "App Name - DreamNet Mini App",
  description: "Detailed description with keywords",
  keywords: ["web3", "base", "defi", "app category"],
  author: "Your Name",
  robots: "index, follow"
};

// Structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "App Name",
  "description": "App description",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};
```

### **Discovery Triggers**:
- ✅ Share once to trigger indexing
- ✅ Keep assets valid (no broken links)
- ✅ Use relevant keywords
- ✅ Update regularly for freshness

---

## 🌐 SHARING & SOCIAL GRAPH

### **Native Share Flows**
```typescript
const shareApp = async (appData: AppData) => {
  const shareData = {
    title: appData.name,
    text: `Check out ${appData.name} on DreamNet!`,
    url: `https://${appData.domain}.dreamnet.ink`,
    // For mobile sharing
    files: [await generateShareImage(appData)]
  };
  
  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareData.url);
  }
};
```

### **Social Navigation Design**
- ✅ **One-click sharing** to Twitter, Farcaster, Discord
- ✅ **Referral links** with tracking
- ✅ **Social proof** (user count, testimonials)
- ✅ **Community integration** (Discord, Telegram)

---

## 🔔 NOTIFICATIONS STRATEGY

### **Re-engagement Notifications**
```typescript
const notificationStrategy = {
  // Welcome series
  welcome: {
    trigger: "first_app_launch",
    delay: "24h",
    message: "Discover advanced features in {app_name}"
  },
  
  // Milestone celebrations
  milestone: {
    trigger: "user_action_count",
    threshold: 10,
    message: "You've used {app_name} 10 times! 🎉"
  },
  
  // Re-engagement
  reengage: {
    trigger: "days_inactive",
    threshold: 7,
    message: "Your {app_name} dashboard misses you"
  }
};
```

### **Best Practices**:
- ✅ Rate limit notifications (max 3/week)
- ✅ Personalize with user data
- ✅ Time for user timezone
- ✅ Provide clear value in each notification
- ✅ Easy unsubscribe option

---

## 📱 UX BEST PRACTICES

### **Mobile-First Design**
```css
/* Safe area handling */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Touch targets */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Concise interface */
.card {
  max-width: 100%;
  margin: 8px;
  border-radius: 12px;
}
```

### **Design Patterns**:
- ✅ **Bottom navigation** for key actions
- ✅ **Swipe gestures** for navigation
- ✅ **Pull-to-refresh** for data updates
- ✅ **Loading states** for async operations
- ✅ **Error boundaries** for graceful failures

---

## 🛠 ONCHAINKIT INTEGRATION

### **Required Components**
```typescript
import { 
  OnchainKitProvider,
  ConnectButton,
  Transaction,
  Balance
} from '@coinbase/onchainkit';

// Provider setup
const App = ({ children }) => (
  <OnchainKitProvider chain={base}>
    <ConnectButton />
    {children}
  </OnchainKitProvider>
);
```

### **Transaction Patterns**
```typescript
// Send transaction
const { sendTransaction } = useTransaction();

const handleAction = async () => {
  const tx = await sendTransaction({
    to: contractAddress,
    data: encodedData,
    value: '0'
  });
  
  await tx.wait();
};
```

---

## 📈 GROWTH OPTIMIZATION

### **Engagement Metrics**
- **DAU/MAU Ratio**: Target > 20%
- **Session Duration**: Target > 2 minutes
- **Feature Adoption**: Track per feature
- **Retention Rate**: 7-day > 40%, 30-day > 20%

### **Growth Tactics**
```typescript
// Referral program
const referralSystem = {
  generateLink: (userId: string) => {
    return `https://app.dreamnet.ink?ref=${userId}`;
  },
  trackReferral: (referralCode: string) => {
    // Award referrer and new user
  }
};

// Feature discovery
const featureTour = {
  trigger: "first_time_user",
  steps: [
    { element: "#connect-wallet", message: "Connect to get started" },
    { element: "#main-feature", message: "This is our core feature" },
    { element: "#share-button", message: "Share with friends" }
  ]
};
```

---

## ✅ FINAL CHECKLIST

### Pre-Launch
- [ ] Registered for Base Build
- [ ] Manifest complete and valid
- [ ] All assets optimized (icons, images)
- [ ] OpenGraph/Twitter cards set up
- [ ] SEO meta tags implemented
- [ ] Social sharing functional
- [ ] Notifications configured
- [ ] Mobile responsive tested
- [ ] OnchainKit integrated
- [ ] Analytics tracking installed

### Post-Launch
- [ ] Submit to Base Build featuring
- [ ] Share on social channels
- [ ] Enable user reviews
- [ ] Monitor analytics dashboard
- [ ] Gather user feedback
- [ ] Iterate based on data

---

## 🚀 DREAMNET-SPECIFIC ENHANCEMENTS

### **DreamNet Integration**
```typescript
// DreamNet passport integration
import { useDreamNetPassport } from '@dreamnet/passport';

const App = () => {
  const { passport, issuePassport } = useDreamNetPassport();
  
  // Auto-issue .dream domain
  useEffect(() => {
    if (passport && !passport.domain) {
      issueDreamDomain(passport.id);
    }
  }, [passport]);
};
```

### **Biomimetic Features**
- **Swarm Intelligence**: Community-driven recommendations
- **Wolf Pack Coordination**: Multi-user collaboration
- **Octopus Multi-Task**: Parallel operation handling
- **Dream Snail Trail**: User journey visualization

---

**This checklist ensures your mini app maximizes discovery, engagement, and success on the Base ecosystem through DreamNet's biomimetic advantages.**
