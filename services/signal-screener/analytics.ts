import { getRecentSnapshots, getActivePatterns, getTopAuthors, getTopicTrends, getUserInteractions, storePattern, trackInteraction, getSignalsByAuthor } from './database';
import { redis } from './server';

// Advanced analytics engine for pattern detection and trend analysis

export interface TrendAnalysis {
  topic: string;
  current_velocity: number;
  historical_avg: number;
  trend_direction: 'rising' | 'falling' | 'stable';
  confidence: number;
  cycle_detected: boolean;
  cycle_period_days?: number;
  next_peak_prediction?: Date;
}

export interface NuggetSignal {
  hash: string;
  text: string;
  author: string;
  score: number;
  why_gold: string;
  pattern_type: string;
  confidence: number;
  actionable_insights: string[];
}

export interface UserTask {
  id: string;
  type: 'like' | 'recast' | 'comment' | 'follow' | 'share';
  description: string;
  target_hash?: string;
  target_fid?: number;
  points: number;
  completed: boolean;
  expires_at?: Date;
}

// Detect cyclical patterns in topic activity
export async function detectCyclicalPatterns(): Promise<TrendAnalysis[]> {
  const snapshots = await getRecentSnapshots(168); // Last 7 days
  const analyses: TrendAnalysis[] = [];
  
  // Group by topic
  const topicData: Record<string, number[]> = {};
  snapshots.forEach(snapshot => {
    if (snapshot.topic_counts) {
      const counts = snapshot.topic_counts as Record<string, number>;
      Object.entries(counts).forEach(([topic, count]) => {
        if (!topicData[topic]) topicData[topic] = [];
        topicData[topic].push(count);
      });
    }
  });
  
  // Analyze each topic for patterns
  for (const [topic, counts] of Object.entries(topicData)) {
    if (counts.length < 3) continue;
    
    const current = counts[counts.length - 1];
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const trend = current > avg * 1.2 ? 'rising' : current < avg * 0.8 ? 'falling' : 'stable';
    
    // Simple cycle detection (look for peaks every ~2-7 days)
    const peaks = findPeaks(counts);
    const cycle_detected = peaks.length >= 2;
    let cycle_period_days: number | undefined;
    let next_peak_prediction: Date | undefined;
    
    if (cycle_detected && peaks.length >= 2) {
      const intervals = [];
      for (let i = 1; i < peaks.length; i++) {
        intervals.push(peaks[i] - peaks[i-1]);
      }
      cycle_period_days = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
      const lastPeak = peaks[peaks.length - 1];
      next_peak_prediction = new Date(Date.now() + cycle_period_days * 24 * 60 * 60 * 1000);
    }
    
    analyses.push({
      topic,
      current_velocity: current,
      historical_avg: avg,
      trend_direction: trend,
      confidence: Math.min(0.9, counts.length / 10),
      cycle_detected,
      cycle_period_days,
      next_peak_prediction
    });
  }
  
  // Store detected patterns
  for (const analysis of analyses) {
    if (analysis.cycle_detected) {
      await storePattern({
        pattern_type: 'keyword_cycle', // Use existing type
        pattern_data: analysis,
        confidence_score: analysis.confidence,
        metadata: { detected_at: new Date() }
      });
    }
  }
  
  return analyses;
}

// Find gold nuggets - signals that indicate emerging trends
export async function findGoldNuggets(): Promise<NuggetSignal[]> {
  const nuggets: NuggetSignal[] = [];
  const patterns = await getActivePatterns('topic_spike');
  const topAuthors = await getTopAuthors(3, 20);
  
  // Look for signals from emerging authors on trending topics
  for (const author of topAuthors) {
    // Get their recent signals
    const recentSignals: any[] = await getSignalsByAuthor(author.fid, 20);
    
    for (const signal of recentSignals) {
      // Check if signal matches any active patterns
      const matchingPatterns = patterns.filter(p => 
        signal.topics.includes(p.pattern_data.topic)
      );
      
      if (matchingPatterns.length > 0 && signal.score > 70) {
        nuggets.push({
          hash: signal.hash,
          text: signal.text,
          author: signal.author_username,
          score: signal.score,
          why_gold: `Emerging author on ${matchingPatterns.map(p => p.pattern_data.topic).join(', ')}`,
          pattern_type: 'emerging_author_trend',
          confidence: matchingPatterns[0].confidence_score,
          actionable_insights: [
            `Watch ${signal.author_username} for more signals`,
            `Monitor ${matchingPatterns[0].pattern_data.topic} for continued activity`,
            `Consider engaging with this author`
          ]
        });
      }
    }
  }
  
  return nuggets.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

// Generate personalized tasks for users based on engagement gaps
export async function generateUserTasks(userFid: number): Promise<UserTask[]> {
  const tasks: UserTask[] = [];
  const interactions = await getUserInteractions(userFid, 50);
  
  // Analyze user behavior patterns
  const interactionCounts = {
    likes: interactions.filter(i => i.interaction_type === 'like').length,
    recasts: interactions.filter(i => i.interaction_type === 'recast').length,
    comments: interactions.filter(i => i.interaction_type === 'comment').length,
    follows: interactions.filter(i => i.interaction_type === 'follow_author').length
  };
  
  // Generate tasks based on gaps
  if (interactionCounts.likes < 5) {
    tasks.push({
      id: `like-${Date.now()}`,
      type: 'like',
      description: 'Like 5 high-quality signals to improve your feed',
      points: 10,
      completed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }
  
  if (interactionCounts.recasts < 3) {
    tasks.push({
      id: `recast-${Date.now()}`,
      type: 'recast',
      description: 'Recast 3 signals to share alpha with your network',
      points: 25,
      completed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }
  
  if (interactionCounts.comments < 2) {
    tasks.push({
      id: `comment-${Date.now()}`,
      type: 'comment',
      description: 'Comment on a signal to start a discussion',
      points: 15,
      completed: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }
  
  // Add engagement tasks
  tasks.push({
    id: `engage-${Date.now()}`,
    type: 'share',
    description: 'Share the Signal Screener to grow the community',
    points: 50,
    completed: false,
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000)
  });
  
  return tasks;
}

// Track user engagement and award points
export async function trackUserEngagement(userFid: number, action: string, targetHash?: string, targetFid?: number): Promise<number> {
  // Track the interaction
  await trackInteraction({
    user_fid: userFid,
    signal_hash: targetHash || '',
    interaction_type: action as any,
    interaction_data: { timestamp: new Date() }
  });
  
  // Award points based on action
  const points = {
    'like': 5,
    'recast': 15,
    'comment': 10,
    'follow_author': 20,
    'share': 50
  }[action] || 0;
  
  // Update user points in Redis
  await redis.zincrby('leaderboard:engagement', points, userFid.toString());
  
  // Check for task completion
  const tasks = await generateUserTasks(userFid);
  for (const task of tasks) {
    if (task.type === action && !task.completed) {
      // Mark task as completed
      await redis.hset(`tasks:${userFid}`, task.id, JSON.stringify({ ...task, completed: true }));
      await redis.zincrby('leaderboard:engagement', task.points, userFid.toString());
    }
  }
  
  return points;
}

// Get user engagement stats
export async function getUserEngagementStats(userFid: number) {
  const totalPoints = await redis.zscore('leaderboard:engagement', userFid.toString()) || 0;
  const rank = await redis.zrevrank('leaderboard:engagement', userFid.toString());
  const interactions = await getUserInteractions(userFid, 100);
  
  return {
    total_points: Math.round(totalPoints),
    rank: rank !== null ? rank + 1 : null,
    total_interactions: interactions.length,
    interaction_breakdown: {
      likes: interactions.filter(i => i.interaction_type === 'like').length,
      recasts: interactions.filter(i => i.interaction_type === 'recast').length,
      comments: interactions.filter(i => i.interaction_type === 'comment').length,
      follows: interactions.filter(i => i.interaction_type === 'follow_author').length
    },
    streak: await calculateEngagementStreak(userFid)
  };
}

// Calculate engagement streak (consecutive days with activity)
async function calculateEngagementStreak(userFid: number): Promise<number> {
  const interactions = await getUserInteractions(userFid, 100);
  const dates = new Set(interactions.map(i => new Date(i.timestamp).toDateString()));
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (dates.has(date.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

// Helper function to find peaks in data
function findPeaks(data: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i-1] && data[i] > data[i+1]) {
      peaks.push(i);
    }
  }
  return peaks;
}
