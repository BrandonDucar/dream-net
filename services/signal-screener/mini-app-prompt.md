# DreamNet Alpha - Intelligence Dashboard Mini App

## Overview
Build a sophisticated Farcaster mini app that serves as DreamNet's real-time intelligence dashboard. This app displays gold nuggets, pattern detection, agent activity, and cross-platform alpha from DreamNet's complete data analysis pipeline. Focus on clean data visualization and minimal interaction - maximum intelligence.

## Core Features

### 1. **Real-Time Intelligence Dashboard**
- Live gold nuggets from DreamNet's Shit Sifter organ
- Cross-platform pattern detection results
- Agent activity monitoring (143 agents)
- Market sentiment and spike alerts
- Cyclical trend predictions with confidence scores

### 2. **Data Sources with Fallback Architecture**
All data from DreamNet's Universal Data Hub API at `http://signal-screener:3203` with **graceful fallback system**:

**Primary Intelligence:**
- `GET /api/shit-sifter/nuggets` - Current gold nuggets
- `GET /api/shit-sifter/patterns` - Active patterns
- `GET /api/analytics/trends` - Cyclical trends
- `GET /api/universal/spikes` - Specialized spikes
- `GET /api/universal/agents` - Agent activity

**Direct Neynar API Fallback:**
```javascript
// Graceful API fallback system
const fetchWithFallback = async (primaryEndpoint, fallbackEndpoint, params) => {
  try {
    // Try DreamNet Universal Hub first
    const response = await fetch(`http://signal-screener:3203${primaryEndpoint}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn('Primary API failed, trying Neynar fallback:', error);
  }
  
  try {
    // Fallback to direct Neynar API
    const response = await fetch(`https://api.neynar.com/v2/farcaster${fallbackEndpoint}`, {
      headers: { 'api_key': NEYNAR_API_KEY },
      body: JSON.stringify(params)
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.warn('Neynar fallback failed:', error);
  }
  
  // Final graceful degradation
  return { data: [], fallback: true };
};

// Live Farcaster data ingestion
const fetchLiveFarcaster = async (fid, limit = 100) => {
  return fetchWithFallback(
    `/api/signals/high-signal?fid=${fid}&limit=${limit}`,
    `/feed?fid=${fid}&limit=${limit}`,
    { viewer_fid: fid }
  );
};
```

### 3. **AI SEO Optimization & Content Strategy**

**AI-Generated SEO Content:**
```javascript
// AI-powered SEO optimization for signal content
const generateSEOContent = async (signal) => {
  const seoData = await fetch('/api/ai/seo-optimize', {
    method: 'POST',
    body: JSON.stringify({
      signal: signal.text,
      topics: signal.topics,
      author: signal.author,
      platform: 'farcaster'
    })
  });
  
  return {
    title: seoData.optimized_title,
    description: seoData.meta_description,
    keywords: seoData.target_keywords,
    hashtags: seoData.relevant_hashtags,
    shareable_content: seoData.social_snippets
  };
};

// Auto-generate shareable SEO content
const createShareableContent = async (signal) => {
  const seo = await generateSEOContent(signal);
  return {
    twitter: seo.shareable_content.twitter,
    linkedin: seo.shareable_content.linkedin,
    telegram: seo.shareable_content.telegram,
    seo_title: seo.title,
    meta_description: seo.description
  };
};
```

**Cross-Platform SEO Strategy:**
- Auto-generate SEO-optimized titles and descriptions
- Create platform-specific shareable content snippets
- Hashtag optimization based on trending topics
- Meta tag generation for social sharing
- Backlink tracking and domain authority monitoring

### 4. **Geofencing & Location Intelligence**

**Geofenced Signal Detection:**
```javascript
// Geofencing for location-based alpha
const detectGeofencedSignals = async (userLocation, signals) => {
  const geofencedSignals = signals.filter(signal => {
    // Extract location mentions from signal text
    const locations = extractLocations(signal.text);
    const signalLocation = signal.metadata?.location;
    
    // Check if signal is relevant to user's location
    return locations.some(loc => 
      isWithinRadius(userLocation, loc, 50) // 50km radius
    ) || (signalLocation && isWithinRadius(userLocation, signalLocation, 100));
  });
  
  return geofencedSignals.map(signal => ({
    ...signal,
    location_relevance: calculateLocationRelevance(userLocation, signal),
    geofence_match: true
  }));
};

// Location-based trend detection
const getLocationTrends = async (userLocation) => {
  const trends = await fetch(`/api/trends/location?lat=${userLocation.lat}&lng=${userLocation.lng}`);
  return {
    local_topics: trends.local_topics,
    regional_events: trends.regional_events,
    location_specific_alpha: trends.alpha_signals,
    nearby_builders: trends.active_builders_in_area
  };
};
```

**Location-Based Features:**
- Detect signals relevant to user's geographic area
- Local builder and meetup tracking
- Regional event and conference alpha
- Location-based trend analysis
- Geofenced push notifications for local opportunities

### 5. **Competitive Intelligence - Hijacking Best Features**

**From Friendtech (Social Trading):**
- Creator token tracking and price alerts
- Social graph analysis for influence scoring
- Key opinion leader (KOL) monitoring
- Buy/sell signal integration with social activity

**From Lens Protocol (Social Graph):**
- Cross-platform social graph integration
- Creator ownership and content portability
- Social token economics
- Decentralized identity and reputation

**From Uniswap (DeFi Analytics):**
- Token price correlation with social sentiment
- Liquidity pool social sentiment tracking
- DeFi protocol announcement monitoring
- Yield farming alpha detection

**From Drakula (Video Social):**
- Short-form content engagement patterns
- Creator economy analytics
- Viral content prediction algorithms
- Cross-platform content distribution

**Strategic Feature Hijacking:**
```javascript
// Combined intelligence from multiple platforms
const getCompetitiveIntelligence = async () => {
  return {
    // Friendtech-style social trading signals
    social_trading: await getCreatorTokenSignals(),
    
    // Lens-style social graph analysis
    social_graph: await analyzeCrossPlatformInfluence(),
    
    // Uniswap-style DeFi sentiment
    defi_sentiment: await getProtocolSocialSentiment(),
    
    // Drakula-style viral prediction
    viral_prediction: await predictContentVirality(),
    
    // Our unique DreamNet layer
    dreamnet_alpha: await getUniversalAlpha()
  };
};
```

### 6. **Advanced Analytics & Intelligence**

**AI-Powered Pattern Recognition:**
```javascript
// Advanced AI pattern detection
const detectAdvancedPatterns = async (signals) => {
  const patterns = {
    // Cross-platform correlation patterns
    cross_platform: await detectCrossPlatformPatterns(signals),
    
    // Temporal patterns (time-based)
    temporal: await detectTemporalPatterns(signals),
    
    // Sentiment-driven patterns
    sentiment: await analyzeSentimentPatterns(signals),
    
    // Network effect patterns
    network: await analyzeNetworkEffects(signals),
    
    // Market impact patterns
    market_impact: await correlateWithMarketData(signals)
  };
  
  return rankPatternsByPredictivePower(patterns);
};
```

**Predictive Analytics:**
- Next 24-hour trend prediction
- Viral content probability scoring
- Market movement correlation
- Builder activity forecasting
- Cross-platform momentum analysis

### 3. **"Best of the Best" Middleware - Bulletproof Signal Capture**

**Auto-Capture System:**
- Auto-capture on app load - silently syncs in background
- Debounced/throttled API calls (1 second debounce)
- Background job every 15 minutes while app is open
- Smarter cycle detection with advanced algorithms
- Engagement delta tracking for viral signal detection

**Implementation:**
```javascript
// Auto-capture on app load
const initializeSignalCapture = async () => {
  await syncSignalsInBackground();
  setInterval(syncSignalsInBackground, 15 * 60 * 1000);
  startEngagementDeltaTracking();
};

// Smarter cycle detection
const detectCycles = (historicalData) => {
  const patterns = {
    sineWave: detectSineWavePattern(historicalData),
    exponential: detectExponentialGrowth(historicalData),
    viralSpikes: detectViralSpikes(historicalData),
    crossPlatform: detectCrossPlatformCorrelation(historicalData)
  };
  return rankPatternsByConfidence(patterns);
};

// Engagement delta tracking
const startEngagementDeltaTracking = async () => {
  const oldSignals = await getSignalsFromLast24Hours();
  for (const signal of oldSignals) {
    const delta = await calculateEngagementDelta(signal);
    if (delta > 2.5) await flagAsViral(signal, delta);
  }
};
```

### 4. **UI Components**

#### **Header Section**
- DreamNet branding with live connection status
- Real-time data freshness timestamp
- Last sync indicator with auto-refresh status

#### **Gold Nuggets Section** (Primary Focus)
- Latest gold nuggets with confidence scores
- Each nugget shows: author, why it's gold, actionable insights
- Filter by confidence level (80%+, 70%+, 60%+)
- Auto-refresh every 30 seconds
- Viral alert indicators for rapidly growing signals

#### **Pattern Detection Dashboard**
- Active cyclical patterns with visual indicators
- Trend direction arrows (rising/falling/stable)
- Next peak predictions with countdown timers
- Pattern confidence score bars
- Cross-platform correlation indicators

#### **Agent Activity Monitor**
- Real-time status of all 143 DreamNet agents
- Active vs idle vs error states in grid layout
- Recent agent spawns and lifecycle events
- System health indicators with color coding

#### **Cross-Platform Intelligence**
- Unified view of Farcaster, Telegram, Discord activity
- Platform-specific trend analysis
- Message volume heat maps
- Engagement metrics across platforms

### 5. **Technical Implementation**

#### **Background Processing**
```javascript
// Web Worker for background processing
const signalWorker = new Worker('/workers/signal-processor.js');

signalWorker.onmessage = (event) => {
  const { type, data } = event.data;
  switch (type) {
    case 'NEW_GOLD_NUGGET': displayNewNugget(data); break;
    case 'PATTERN_DETECTED': updatePatternDashboard(data); break;
    case 'VIRAL_ALERT': showViralNotification(data); break;
    case 'ENGAGEMENT_DELTA': updateEngagementMetrics(data); break;
  }
};
```

#### **Smart Caching**
```javascript
const cacheManager = {
  goldNuggets: new TimedCache(2 * 60 * 1000), // 2 minutes
  patterns: new TimedCache(5 * 60 * 1000), // 5 minutes
  agentActivity: new TimedCache(60 * 1000), // 1 minute
  engagementDeltas: new TimedCache(30 * 1000), // 30 seconds
};
```

#### **Real-Time Updates**
- WebSocket connection with auto-reconnect
- Fallback polling every 30 seconds
- Incremental updates to avoid full re-renders
- Offline fallback with cached data

### 6. **Visual Design**

#### **Color Scheme**
- **Gold/Yellow** - Gold nuggets and high-value signals
- **Green** - Rising trends and positive patterns
- **Red** - Falling trends and alerts
- **Blue** - Agent activity and system status
- **Purple** - Viral alerts and high confidence

#### **Data Visualization**
- Line charts for trend predictions
- Bar charts for agent activity
- Heat maps for cross-platform activity
- Progress bars for confidence scores
- Real-time updating metrics

### 7. **Performance Optimization**

- Code splitting for lazy loading
- Intelligent caching with TTL
- Debounced API calls
- Background Web Workers
- Optimized re-renders

### 8. **API Response Examples**

#### Gold Nuggets
```json
{
  "nuggets": [
    {
      "hash": "0x123...",
      "text": "Just deployed a new AI tool on Base...",
      "author": "builder123",
      "score": 89,
      "why_gold": "Emerging author on AI-devtools with cross-platform mentions",
      "confidence": 0.87,
      "viral_potential": 0.92,
      "actionable_insights": ["Watch builder123", "Monitor AI-devtools"]
    }
  ]
}
```

#### Pattern Detection
```json
{
  "patterns": [
    {
      "topic": "base-infra",
      "trend_direction": "rising",
      "confidence": 0.92,
      "cycle_detected": true,
      "cycle_period_days": 3,
      "next_peak_prediction": "2024-02-18T14:00:00Z",
      "cross_platform_correlation": 0.78
    }
  ]
}
```

## Success Metrics
- **Intelligence Value**: User feedback on signal quality
- **Engagement**: Time spent viewing intelligence
- **Performance**: API response times < 500ms
- **Accuracy**: Pattern prediction success rate
- **Retention**: Daily active users and session duration

## Technical Stack
- **Frontend**: React/Next.js with TypeScript
- **State Management**: Zustand
- **Data Fetching**: SWR with caching
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Real-time**: WebSocket + fallback polling
- **Workers**: Web Workers for background processing

Build this as the ultimate alpha discovery tool - clean, fast, and intelligent!
