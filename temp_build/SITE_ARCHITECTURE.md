# DreamNet Multi-Page Site Architecture
## Breaking the Corporate Mold 🎨

### Philosophy
**Anti-Corporate, Pro-Creative**
- Base has good structure but feels too mainstream/corporate
- We're creating a hybrid: functional structure + creative expression
- Each vertical gets its own space but unified aesthetic
- Token site can be separate OR integrated (your call)

---

## 🏗️ Site Structure Options

### Option 1: Unified Multi-Page (Recommended)
**One site, multiple verticals, creative navigation**

```
dreamnet.ink/
├── /                    # Landing - Creative, bold, anti-corporate
├── /token               # DREAM Token hub (can be separate subdomain)
├── /miniapps/
│   ├── /rewards         # DREAM Rewards Hub ⭐
│   ├── /subscriptions   # Creator Subscriptions
│   ├── /social          # Dream Social Feed
│   └── /analytics       # Wallet Analytics
├── /dreams/             # Dream ecosystem
│   ├── /gallery         # Public gallery
│   ├── /create          # Dream creation
│   └── /remix           # Remix studio
├── /operator            # Operator panel (admin)
└── /about               # About, but make it weird
```

### Option 2: Separate Token Site
**dreamnet.ink** = Main ecosystem
**token.dreamnet.ink** = Token-specific (if you want separation)

---

## 🎨 Design Philosophy

### Visual Identity
- **Dark, electric, cyberpunk aesthetic**
- **Gradient glows** (cyan, magenta, emerald)
- **Terminal/retro-futuristic** vibes
- **Anti-corporate** - no boring blue buttons
- **Creative typography** - mix of monospace + modern
- **Animated backgrounds** - subtle particle effects
- **Bold, experimental** layouts

### Navigation Style
- **Non-linear** - not just top nav bar
- **Contextual** - navigation changes per section
- **Creative** - maybe radial menu, or side panels
- **Functional** - but with personality

---

## 📱 Page Breakdown

### 1. Landing Page (`/`)
**Purpose**: First impression, anti-corporate statement

**Sections**:
- Hero: Bold, creative, "We're not Base, we're DreamNet"
- What We Do: But make it weird/creative
- Mini Apps Showcase: Visual cards, not boring list
- Live Stats: Real-time metrics (StatusStrip)
- CTA: "Enter the Dream" (not "Get Started")

**Design**:
- Full-screen hero with animated background
- Asymmetric layouts
- Bold typography
- No corporate stock photos

### 2. Token Hub (`/token`)
**Purpose**: DREAM token information, but creative

**Sections**:
- Token Overview: What is DREAM? (creative explanation)
- Tokenomics: Visual, not spreadsheet
- How to Get: Rewards, claims, etc.
- Contract Info: Links to BaseScan
- Community: Social links

**Design**:
- Can be separate subdomain if preferred
- Or integrated into main site
- Still creative, not corporate

### 3. Mini Apps Hub (`/miniapps`)
**Purpose**: Directory of all mini apps

**Design**:
- Grid of app cards
- Each card: preview, description, status
- Filter by category
- "Featured" section
- Not a boring app store

### 4. Individual Mini Apps
Each gets full-page treatment:
- `/miniapps/rewards` - Rewards Hub (DONE ✅)
- `/miniapps/subscriptions` - Creator tools
- `/miniapps/social` - Dream feed
- `/miniapps/analytics` - Wallet tools

### 5. Dream Ecosystem (`/dreams`)
**Purpose**: Core DreamNet creative platform

**Pages**:
- `/dreams/gallery` - Public gallery (exists)
- `/dreams/create` - Dream creation
- `/dreams/remix` - Remix studio
- `/dreams/evolution` - Evolution tracking

### 6. Operator Panel (`/operator`)
**Purpose**: Admin tools (existing)

---

## 🎯 Implementation Plan

### Phase 1: Structure
1. ✅ Rewards Hub (done)
2. Create unified navigation system
3. Design landing page (anti-corporate)
4. Create mini apps directory page

### Phase 2: Token Site Decision
- Option A: `/token` page in main site
- Option B: `token.dreamnet.ink` subdomain
- **Recommendation**: Start with `/token`, can separate later

### Phase 3: Creative Navigation
- Build non-linear nav system
- Contextual navigation per section
- Creative transitions/animations

### Phase 4: Individual Pages
- Build out each vertical
- Maintain creative aesthetic
- Functional but expressive

---

## 🛠️ Technical Structure

```
apps/site/src/
├── pages/
│   ├── index.tsx              # Landing (redesign)
│   ├── token/
│   │   └── index.tsx          # Token hub
│   ├── miniapps/
│   │   ├── index.tsx          # Mini apps directory
│   │   ├── rewards/           # ✅ Done
│   │   ├── subscriptions/    # Next
│   │   └── social/            # Later
│   ├── dreams/
│   │   ├── gallery.tsx        # ✅ Exists
│   │   ├── create.tsx         # New
│   │   └── remix.tsx          # New
│   └── operator/              # ✅ Exists
├── components/
│   ├── navigation/            # Creative nav system
│   ├── layouts/               # Page layouts
│   └── ...                    # Existing components
└── App.tsx                    # Router setup
```

---

## 🎨 Design System

### Colors
- **Primary**: Electric Cyan (#00FFFF)
- **Secondary**: Dream Magenta (#FF00FF)
- **Accent**: Dream Emerald (#00FF88)
- **Background**: Deep Black (#06060a)
- **Text**: White with gray variants

### Typography
- **Headings**: Bold, experimental (maybe custom font)
- **Body**: Clean, readable
- **Code/Data**: Monospace (terminal feel)

### Components
- **Cards**: Glowing borders, gradients
- **Buttons**: Animated, not flat
- **Navigation**: Creative, contextual
- **Forms**: Styled, not boring

---

## 🚀 Next Steps

1. **Add leaderboards/achievements** to Rewards Hub ✅ (in progress)
2. **Design landing page** - Anti-corporate, bold
3. **Create navigation system** - Creative, functional
4. **Build token hub** - `/token` page
5. **Mini apps directory** - Visual showcase
6. **Decide on token site** - Separate or integrated?

---

**Let's build something that breaks the mold! 🎨**

