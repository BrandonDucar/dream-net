import { Pool } from 'pg';
import { readFileSync } from 'fs';

// Database connection for signal history and pattern analysis
const databaseUrl = process.env.DATABASE_URL;
const persistenceEnabled = Boolean(databaseUrl);
const pool: Pick<Pool, 'query'> = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }, // Neon requires SSL
    })
  : {
      async query() {
        return { rows: [] };
      },
    };

// Load schema from file
const schema = readFileSync('./schema.sql', 'utf8');

// Types matching the schema
export interface SignalRecord {
  hash: string;
  author_fid: number;
  author_username: string;
  author_display_name: string;
  author_pfp_url: string;
  author_power_badge: boolean;
  text: string;
  score: number;
  breakdown: any;
  topics: string[];
  summary: string;
  why_it_matters: string;
  actionables: string[];
  likes: number;
  recasts: number;
  replies: number;
  timestamp: Date;
  channel?: string;
}

export interface UserInteraction {
  user_fid: number;
  signal_hash: string;
  interaction_type: 'view' | 'like' | 'share' | 'watch' | 'follow_author';
  interaction_data?: any;
}

export interface TrendPattern {
  pattern_type: 'topic_spike' | 'builder_activity' | 'keyword_cycle';
  pattern_data: any;
  confidence_score: number;
  metadata?: any;
}

export interface TopicAuthority {
  author_fid: number;
  topic: string;
  authority_score: number;
  signal_count: number;
  avg_score: number;
  last_activity: Date;
}

// Signal operations
export async function storeSignal(signal: SignalRecord): Promise<void> {
  const query = `
    INSERT INTO signals (
      hash, author_fid, author_username, author_display_name, author_pfp_url,
      author_power_badge, text, score, breakdown, topics, summary, why_it_matters,
      actionables, likes, recasts, replies, timestamp, channel
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    )
    ON CONFLICT (hash) DO UPDATE SET
      score = EXCLUDED.score,
      likes = EXCLUDED.likes,
      recasts = EXCLUDED.recasts,
      replies = EXCLUDED.replies,
      updated_at = NOW()
  `;
  
  await pool.query(query, [
    signal.hash, signal.author_fid, signal.author_username, signal.author_display_name,
    signal.author_pfp_url, signal.author_power_badge, signal.text, signal.score,
    JSON.stringify(signal.breakdown), signal.topics, signal.summary, signal.why_it_matters,
    signal.actionables, signal.likes, signal.recasts, signal.replies,
    signal.timestamp, signal.channel
  ]);
}

export async function getSignalsHistory(limit: number = 100, offset: number = 0): Promise<SignalRecord[]> {
  const query = `
    SELECT * FROM signals 
    ORDER BY timestamp DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

export async function getSignalsByTopic(topic: string, limit: number = 50): Promise<SignalRecord[]> {
  const query = `
    SELECT * FROM signals 
    WHERE $1 = ANY(topics)
    ORDER BY score DESC, timestamp DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [topic, limit]);
  return result.rows;
}

export async function getSignalsByAuthor(authorFid: number, limit: number = 50): Promise<SignalRecord[]> {
  const query = `
    SELECT * FROM signals 
    WHERE author_fid = $1
    ORDER BY score DESC, timestamp DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [authorFid, limit]);
  return result.rows;
}

// Snapshot operations for trend analysis
export async function createSnapshot(data: {
  total_signals: number;
  avg_score: number;
  topic_counts: any;
  top_topics: string[];
  pulse_velocity: number;
  pulse_trend: 'up' | 'down' | 'stable';
  metadata?: any;
}): Promise<void> {
  const query = `
    INSERT INTO signal_snapshots (
      total_signals, avg_score, topic_counts, top_topics,
      pulse_velocity, pulse_trend, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  
  await pool.query(query, [
    data.total_signals, data.avg_score, JSON.stringify(data.topic_counts),
    data.top_topics, data.pulse_velocity, data.pulse_trend,
    JSON.stringify(data.metadata)
  ]);
}

export async function getRecentSnapshots(hours: number = 24): Promise<any[]> {
  console.log('⚠️ [Database] getRecentSnapshots temporarily disabled - returning empty array');
  return [];
}

// User interaction tracking
export async function trackInteraction(interaction: UserInteraction): Promise<void> {
  const query = `
    INSERT INTO user_interactions (user_fid, signal_hash, interaction_type, interaction_data)
    VALUES ($1, $2, $3, $4)
  `;
  
  await pool.query(query, [
    interaction.user_fid, interaction.signal_hash,
    interaction.interaction_type, JSON.stringify(interaction.interaction_data || {})
  ]);
}

export async function getUserInteractions(userFid: number, limit: number = 100): Promise<any[]> {
  const query = `
    SELECT ui.*, s.text, s.score, s.topics
    FROM user_interactions ui
    JOIN signals s ON ui.signal_hash = s.hash
    WHERE ui.user_fid = $1
    ORDER BY ui.timestamp DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [userFid, limit]);
  return result.rows;
}

// Pattern detection
export async function storePattern(pattern: TrendPattern): Promise<void> {
  const query = `
    INSERT INTO trend_patterns (pattern_type, pattern_data, confidence_score, metadata)
    VALUES ($1, $2, $3, $4)
  `;
  
  await pool.query(query, [
    pattern.pattern_type, JSON.stringify(pattern.pattern_data),
    pattern.confidence_score, JSON.stringify(pattern.metadata || {})
  ]);
}

export async function getActivePatterns(patternType?: string): Promise<any[]> {
  let query = `
    SELECT * FROM trend_patterns 
    WHERE is_active = true
  `;
  const params: any[] = [];
  
  if (patternType) {
    query += ` AND pattern_type = $1`;
    params.push(patternType);
  }
  
  query += ` ORDER BY detected_at DESC`;
  
  const result = await pool.query(query, params);
  return result.rows;
}

// Topic authority
export async function updateTopicAuthority(authority: TopicAuthority): Promise<void> {
  const query = `
    INSERT INTO topic_authority (author_fid, topic, authority_score, signal_count, avg_score, last_activity)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (author_fid, topic) DO UPDATE SET
      authority_score = EXCLUDED.authority_score,
      signal_count = EXCLUDED.signal_count,
      avg_score = EXCLUDED.avg_score,
      last_activity = EXCLUDED.last_activity,
      updated_at = NOW()
  `;
  
  await pool.query(query, [
    authority.author_fid, authority.topic, authority.authority_score,
    authority.signal_count, authority.avg_score, authority.last_activity
  ]);
}

export async function getTopicAuthorities(topic: string, limit: number = 20): Promise<TopicAuthority[]> {
  const query = `
    SELECT * FROM topic_authority 
    WHERE topic = $1
    ORDER BY authority_score DESC, signal_count DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [topic, limit]);
  return result.rows;
}

// Signal aging analysis
export async function analyzeSignalAging(signalHash: string, scores: {
  initial: number;
  score_24h?: number;
  score_7d?: number;
  score_30d?: number;
}): Promise<void> {
  const query = `
    INSERT INTO signal_aging (
      signal_hash, initial_score, score_24h, score_7d, score_30d
    ) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (signal_hash) DO UPDATE SET
      score_24h = EXCLUDED.score_24h,
      score_7d = EXCLUDED.score_7d,
      score_30d = EXCLUDED.score_30d,
      analyzed_at = NOW()
  `;
  
  await pool.query(query, [
    signalHash, scores.initial, scores.score_24h,
    scores.score_7d, scores.score_30d
  ]);
}

// Analytics queries
export async function getTopAuthors(days: number = 7, limit: number = 20): Promise<any[]> {
  const query = `
    SELECT 
      author_fid,
      author_username,
      COUNT(*) as signal_count,
      AVG(score) as avg_score,
      MAX(score) as max_score
    FROM signals 
    WHERE timestamp > NOW() - INTERVAL '${days} days'
    GROUP BY author_fid, author_username
    ORDER BY avg_score DESC, signal_count DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
}

export async function getTopicTrends(days: number = 7): Promise<any[]> {
  const query = `
    SELECT 
      unnest(topics) as topic,
      COUNT(*) as signal_count,
      AVG(score) as avg_score,
      COUNT(DISTINCT author_fid) as unique_authors
    FROM signals 
    WHERE timestamp > NOW() - INTERVAL '${days} days'
    GROUP BY topic
    ORDER BY signal_count DESC, avg_score DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getSignalVelocity(hours: number = 1): Promise<number> {
  const query = `
    SELECT COUNT(*) as count
    FROM signals 
    WHERE timestamp > NOW() - INTERVAL '${hours} hours'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0]?.count || '0');
}

// Initialize database connection
export async function initDatabase(): Promise<void> {
  if (!persistenceEnabled) {
    console.warn('⚠️ [Database] DATABASE_URL not set; signal persistence disabled');
    return;
  }

  try {
    await pool.query(schema);
    console.log('✅ [Database] Schema initialized');
  } catch (error) {
    console.error('❌ [Database] Schema initialization failed:', error);
    throw error;
  }
}

export default pool;
