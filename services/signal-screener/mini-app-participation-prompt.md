# DreamNet Engage - Participation Hub Mini App

## Overview
Build an interactive Farcaster mini app that serves as DreamNet's user engagement and participation hub. This app focuses on gamification, social features, and community building around DreamNet's intelligence signals. Users can engage with content, complete tasks, earn points, and climb the leaderboard.

## Core Features

### 1. **User Engagement System**
- Points tracking for all interactions (like, recast, comment, follow, share)
- Personalized task board with challenges
- Engagement streak tracking
- Achievement badges and rewards
- Leaderboard with top engaged users

### 2. **Interactive Signal Engagement**
- Like/recast/comment on high-signal content
- Follow authors and build reputation
- Share signals to other platforms
- Personalized feed based on engagement history
- Engagement analytics and insights

### 3. **Gamification Elements**
- Points system with multipliers
- Daily/weekly challenges
- Streak bonuses for consistent engagement
- Achievement badges (Alpha Hunter, Pattern Spotter, etc.)
- Level progression system

### 4. **Data Sources with Fallback Architecture**
All data from DreamNet's Universal Data Hub API at `http://signal-screener:3203` with **graceful fallback system**:

**Engagement APIs:**
- `POST /api/engage` - Track user interactions
- `GET /api/tasks/:fid` - Personalized tasks for user
- `GET /api/leaderboard/engagement` - Top engaged users
- `GET /api/analytics/user/:fid` - User engagement stats

**Signal Content:**
- `GET /api/signals/high-signal` - High-signal content to engage with
- `GET /api/signals/trending` - Trending topics
- `GET /api/signals/authors` - Top authors to follow

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

// Live Farcaster data for engagement
const fetchEngageableContent = async (fid, limit = 50) => {
  return fetchWithFallback(
    `/api/signals/high-signal?fid=${fid}&limit=${limit}`,
    `/feed?fid=${fid}&limit=${limit}`,
    { viewer_fid: fid }
  );
};
```

### 5. **AI SEO Optimization & Viral Content Strategy**

**AI-Generated Shareable Content:**
```javascript
// AI-powered content optimization for maximum engagement
const generateViralContent = async (signal, userContext) => {
  const viralData = await fetch('/api/ai/viral-optimize', {
    method: 'POST',
    body: JSON.stringify({
      signal: signal.text,
      user_engagement_history: userContext.history,
      trending_topics: userContext.trending,
      platform: 'farcaster',
      optimization_goal: 'max_engagement'
    })
  });
  
  return {
    viral_comment: viralData.suggested_comment,
    optimal_hashtags: viralData.trending_hashtags,
    best_posting_time: viralData.optimal_timing,
    engagement_prediction: viralData.viral_score,
    share_variants: viralData.platform_variants
  };
};

// Auto-generate engagement suggestions
const getEngagementSuggestions = async (signal, userProfile) => {
  const suggestions = await generateViralContent(signal, userProfile);
  return {
    comment_templates: suggestions.viral_comment,
    hashtag_suggestions: suggestions.optimal_hashtags,
    viral_probability: suggestions.engagement_prediction,
    optimal_engagement_time: suggestions.best_posting_time
  };
};
```

**SEO-Driven Engagement Features:**
- AI-optimized comment suggestions for maximum engagement
- Viral hashtag recommendations based on trending topics
- Optimal posting time predictions
- Cross-platform content adaptation
- Engagement prediction scoring

### 6. **Geofencing & Location-Based Engagement**

**Location-Aware Gamification:**
```javascript
// Geofenced challenges and rewards
const getLocationBasedTasks = async (userLocation) => {
  const locationTasks = await fetch(`/api/tasks/location?lat=${userLocation.lat}&lng=${userLocation.lng}`);
  return {
    local_challenges: locationTasks.regional_challenges,
    nearby_builder_tasks: locationTasks.local_builder_interactions,
    location_specific_bonuses: locationTasks.geofenced_rewards,
    meetup_attendance_tasks: locationTasks.event_based_tasks
  };
};

// Location-based leaderboards
const getLocationLeaderboard = async (userLocation) => {
  const leaderboard = await fetch(`/api/leaderboard/location?lat=${userLocation.lat}&lng=${userLocation.lng}`);
  return {
    local_top_users: leaderboard.local_champions,
    regional_ranking: leaderboard.regional_leaders,
    city_specific_stats: leaderboard.city_stats,
    nearby_competitors: leaderboard.nearby_users
  };
};
```

**Geofencing Features:**
- Location-specific challenges and bonuses
- Regional leaderboards and competitions
- Local meetup and event engagement tasks
- Nearby builder interaction rewards
- Location-based achievement badges

### 7. **Competitive Intelligence - Hijacking Best Features**

**From Friendtech (Social Trading):**
- Creator token price tracking for engagement bonuses
- Social influence scoring with point multipliers
- KOL engagement tracking with special rewards
- Buy/sell signal correlation with social activity

**From Lens Protocol (Social Graph):**
- Cross-platform follower import with bonuses
- Social reputation system with tiered rewards
- Creator coin integration for engagement staking
- Decentralized identity verification bonuses

**From Uniswap (DeFi Analytics):**
- Token price correlation engagement multipliers
- Liquidity pool participation rewards
- DeFi protocol announcement engagement bonuses
- Yield farming social sharing incentives

**From Drakula (Video Social):**
- Short-form content engagement patterns
- Creator economy analytics with rewards
- Viral content prediction with point bonuses
- Cross-platform content sharing multipliers

**Strategic Feature Hijacking:**
```javascript
// Combined gamification from multiple platforms
const getAdvancedGamification = async (userProfile) => {
  return {
    // Friendtech-style social trading integration
    token_correlation_bonuses: await getTokenEngagementBonuses(userProfile),
    
    // Lens-style social graph rewards
    social_tier_rewards: await getSocialTierRewards(userProfile),
    
    // Uniswap-style DeFi engagement
    defi_engagement_multipliers: await getDeFiEngagementMultipliers(userProfile),
    
    // Drakula-style viral content rewards
    viral_content_bonuses: await getViralContentBonuses(userProfile),
    
    // Our unique DreamNet layer
    dreamnet_engagement_alpha: await getDreamNetEngagementAlpha(userProfile)
  };
};
```

### 8. **Advanced Engagement Analytics**

**AI-Powered Engagement Prediction:**
```javascript
// Predict user engagement patterns
const predictEngagementPatterns = async (userHistory, currentSignals) => {
  const predictions = {
    // Likelihood of engagement on specific content
    content_engagement: await predictContentEngagement(userHistory, currentSignals),
    
    // Optimal engagement timing
    timing_optimization: await predictOptimalEngagementTimes(userHistory),
    
    // Viral content participation prediction
    viral_participation: await predictViralContentEngagement(userHistory),
    
    // Social graph expansion opportunities
    network_growth: await predictSocialGrowthOpportunities(userHistory),
    
    // Achievement completion likelihood
    achievement_probability: await predictAchievementCompletion(userHistory)
  };
  
  return rankEngagementOpportunities(predictions);
};
```

**Predictive Gamification:**
- Personalized engagement timing optimization
- Viral content participation predictions
- Social graph expansion recommendations
- Achievement completion probability scoring
- Competitive ranking forecasting

### 5. **UI Components**

#### **User Profile Section**
- Farcaster profile integration
- Current points and level
- Engagement streak counter
- Achievement badges display
- Personal stats dashboard

#### **Task Board** (Primary Focus)
- Personalized challenges based on user behavior
- Daily tasks (like 5 signals, recast 3, comment on 2)
- Weekly challenges (engage with new authors, share content)
- Bonus tasks with point multipliers
- Task completion animations and rewards

#### **Signal Feed**
- High-signal content with engagement buttons
- Personalized based on user preferences
- Engagement metrics displayed (likes, recasts, comments)
- Author profiles with follow buttons
- Share functionality to other platforms

#### **Leaderboard**
- Top 50 engaged users
- Global and friends leaderboards
- Weekly/monthly rankings
- User position highlighting
- Rank change indicators

#### **Achievements System**
- Badge collection display
- Progress bars for incomplete achievements
- Rarity indicators (common, rare, epic, legendary)
- Achievement unlock animations
- Badge sharing functionality

### 6. **Technical Implementation**

#### **Engagement Tracking**
```javascript
// Track user engagement and award points
const trackEngagement = async (action, targetHash, targetFid) => {
  const response = await fetch('http://signal-screener:3203/api/engage', {
    method: 'POST',
    body: JSON.stringify({
      user_fid: userFid,
      action: action, // 'like', 'recast', 'comment', 'follow', 'share'
      target_hash: targetHash,
      target_fid: targetFid
    })
  });
  
  const { pointsAwarded } = await response.json();
  updateUserPoints(pointsAwarded);
  checkForAchievements();
  return pointsAwarded;
};

// Get personalized tasks for user
const getUserTasks = async () => {
  const response = await fetch(`http://signal-screener:3203/api/tasks/${userFid}`);
  const { tasks } = await response.json();
  return tasks.filter(task => !task.completed);
};

// Check for task completion
const checkTaskCompletion = async (action, targetHash) => {
  const tasks = await getUserTasks();
  for (const task of tasks) {
    if (task.type === action && !task.completed) {
      await completeTask(task.id);
      await awardTaskPoints(task.points);
      showTaskCompletionAnimation(task);
    }
  }
};
```

#### **Points and Gamification**
```javascript
// Points system with multipliers
const pointsSystem = {
  base: {
    like: 5,
    recast: 15,
    comment: 10,
    follow: 20,
    share: 50
  },
  multipliers: {
    streak: 1.5, // 1.5x for 7+ day streak
    early: 2.0, // 2x for engaging within 1 hour
    quality: 1.3, // 1.3x for high-signal content
    viral: 3.0 // 3x for viral content
  },
  calculatePoints: (action, basePoints, context) => {
    let points = basePoints;
    if (context.streak >= 7) points *= pointsSystem.multipliers.streak;
    if (context.isEarly) points *= pointsSystem.multipliers.early;
    if (context.isHighSignal) points *= pointsSystem.multipliers.quality;
    if (context.isViral) points *= pointsSystem.multipliers.viral;
    return Math.round(points);
  }
};

// Achievement system
const achievements = {
  firstLike: { name: "First Like", points: 10, rarity: "common" },
  alphaHunter: { name: "Alpha Hunter", points: 100, rarity: "rare" },
  streakMaster: { name: "Streak Master", points: 200, rarity: "epic" },
  viralSpotter: { name: "Viral Spotter", points: 500, rarity: "legendary" }
};
```

#### **Real-Time Updates**
```javascript
// WebSocket for real-time engagement updates
const engagementSocket = new WebSocket('ws://signal-screener:3203/engagement');

engagementSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'POINTS_AWARDED':
      showPointsAnimation(data.points);
      updatePointsDisplay(data.totalPoints);
      break;
    case 'TASK_COMPLETED':
      showTaskCompletion(data.task);
      updateTaskBoard();
      break;
    case 'ACHIEVEMENT_UNLOCKED':
      showAchievementUnlock(data.achievement);
      updateBadgeDisplay();
      break;
    case 'LEADERBOARD_UPDATE':
      updateLeaderboard(data.leaderboard);
      break;
  }
};
```

### 7. **UI/UX Design**

#### **Visual Hierarchy**
1. **Task Board** - Most prominent, gamification focus
2. **Signal Feed** - Interactive content engagement
3. **User Profile** - Personal stats and achievements
4. **Leaderboard** - Social competition element

#### **Color Scheme**
- **Gold/Yellow** - Points and rewards
- **Purple** - Achievements and badges
- **Green** - Completed tasks and positive actions
- **Blue** - User profile and stats
- **Orange** - Streak bonuses and multipliers

#### **Animations**
- Points awarded animations with particle effects
- Task completion celebrations
- Achievement unlock sequences
- Streak counter animations
- Leaderboard rank change indicators

### 8. **Interactive Features**

#### **Signal Engagement**
```javascript
// Like button with animation
const handleLike = async (signalHash) => {
  setIsLiking(true);
  const points = await trackEngagement('like', signalHash);
  await checkTaskCompletion('like', signalHash);
  showPointsAnimation(points, 'like');
  setIsLiking(false);
  updateSignalEngagement(signalHash, 'like');
};

// Recast with share options
const handleRecast = async (signalHash) => {
  const points = await trackEngagement('recast', signalHash);
  showShareDialog(signalHash);
  await checkTaskCompletion('recast', signalHash);
  showPointsAnimation(points, 'recast');
};

// Follow author with relationship tracking
const handleFollow = async (authorFid) => {
  const points = await trackEngagement('follow_author', null, authorFid);
  updateFollowStatus(authorFid, true);
  showPointsAnimation(points, 'follow');
  checkForFollowAchievements();
};
```

#### **Task System**
```javascript
// Task completion with progress tracking
const completeTask = async (taskId) => {
  const response = await fetch(`http://signal-screener:3203/api/tasks/${taskId}/complete`, {
    method: 'POST'
  });
  
  const { pointsAwarded, newLevel } = await response.json();
  showTaskCompletionAnimation(taskId, pointsAwarded);
  
  if (newLevel) {
    showLevelUpAnimation(newLevel);
    unlockNewFeatures(newLevel);
  }
};

// Daily task reset with streak preservation
const resetDailyTasks = async () => {
  const userStats = await getUserStats();
  if (userStats.engagedToday) {
    await incrementStreak();
  } else {
    await resetStreak();
  }
  await generateNewDailyTasks();
};
```

### 9. **Social Features**

#### **Leaderboard and Competition**
- Global leaderboard with top users
- Friends-only leaderboard
- Weekly/monthly competitions
- Rank change notifications
- Crown/medal indicators for top ranks

#### **Community Building**
- Follow/unfollow authors
- Comment threads on signals
- Share to external platforms
- Invite friends for bonus points
- Community challenges

### 10. **Performance Optimization**

- Local storage for user preferences and cache
- Debounced engagement tracking
- Lazy loading for signal feed
- Optimized animations with CSS transforms
- Background sync for offline engagement

### 11. **API Response Examples**

#### User Tasks
```json
{
  "tasks": [
    {
      "id": "daily-like-5",
      "type": "like",
      "description": "Like 5 high-signal casts",
      "points": 25,
      "progress": 3,
      "total": 5,
      "expires_at": "2024-02-18T00:00:00Z",
      "multiplier": 1.5
    }
  ]
}
```

#### Engagement Tracking
```json
{
  "success": true,
  "pointsAwarded": 15,
  "totalPoints": 1250,
  "streak": 7,
  "level": 5
}
```

#### Leaderboard
```json
{
  "leaderboard": [
    {
      "fid": 123456,
      "username": "alpha_hunter",
      "points": 5420,
      "rank": 1,
      "rankChange": 2
    }
  ]
}
```

## Success Metrics
- **Engagement Rate**: Daily active users completing tasks
- **Retention**: Streak maintenance and return visits
- **Social Interaction**: Likes, recasts, comments per user
- **Task Completion**: Daily/weekly challenge completion rates
- **Community Growth**: New user acquisition and referrals

## Technical Stack
- **Frontend**: React/Next.js with TypeScript
- **State Management**: Zustand with persistence
- **Data Fetching**: SWR with optimistic updates
- **UI**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Real-time**: WebSocket + fallback polling
- **Storage**: Local storage + IndexedDB for cache

Build this as the ultimate engagement platform - gamified, social, and addictive!
