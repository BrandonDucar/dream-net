import { redis } from './server';
import pool from './database';

// Universal Data Hub - Central ingestion point for ALL DreamNet data
// Every message, event, and metric flows through here before storage

export interface UniversalDataEvent {
  id: string;
  source: string; // 'lmc', 'sable', 'hawk', 'clawedette', 'agent-xxx', 'message-bus', etc.
  event_type: string; // 'cast', 'message', 'metric', 'alert', 'task', 'heartbeat', etc.
  timestamp: Date;
  data: any; // Raw event data
  metadata?: {
    agent_fid?: number;
    channel?: string;
    topic?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    tags?: string[];
    agent_name?: string;
    platform?: string;
    related_entities?: any;
    spike_type?: string;
  };
}

// Create universal tables for all data types
const universalSchema = `
-- Universal event storage for ALL DreamNet data
CREATE TABLE IF NOT EXISTS universal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB NOT NULL,
    metadata JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent activity tracking
CREATE TABLE IF NOT EXISTS agent_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(255) NOT NULL,
    agent_name VARCHAR(255),
    agent_type VARCHAR(100), -- 'bot', 'service', 'container', 'logical'
    activity_type VARCHAR(100), -- 'spawn', 'task', 'heartbeat', 'message', 'error'
    status VARCHAR(50), -- 'active', 'idle', 'error', 'paused', 'destroyed'
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-platform message tracking
CREATE TABLE IF NOT EXISTS cross_platform_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL, -- 'farcaster', 'telegram', 'discord', 'twitter'
    message_id VARCHAR(255), -- Platform-specific message ID
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    content TEXT,
    engagement JSONB, -- likes, shares, comments, etc.
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System metrics and spikes
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    source VARCHAR(100),
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Specialized spikes (alpha, signals, anomalies)
CREATE TABLE IF NOT EXISTS specialized_spikes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spike_type VARCHAR(100) NOT NULL, -- 'alpha', 'signal', 'anomaly', 'volume', 'sentiment'
    severity DECIMAL(3,2), -- 0.00 to 1.00
    description TEXT,
    source VARCHAR(100),
    related_entities JSONB, -- FIDs, channels, topics
    context JSONB,
    confidence DECIMAL(3,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_universal_events_source ON universal_events(source);
CREATE INDEX IF NOT EXISTS idx_universal_events_timestamp ON universal_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_universal_events_type ON universal_events(event_type);
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent ON agent_activity(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_timestamp ON agent_activity(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cross_platform_platform ON cross_platform_messages(platform);
CREATE INDEX IF NOT EXISTS idx_cross_platform_timestamp ON cross_platform_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_specialized_spikes_type ON specialized_spikes(spike_type);
CREATE INDEX IF NOT EXISTS idx_specialized_spikes_timestamp ON specialized_spikes(timestamp DESC);
`;

// Initialize the universal schema
export async function initializeUniversalSchema(): Promise<void> {
  console.log('⚠️ [Universal Hub] Database temporarily disabled - using Redis only');
  return;
}

// Universal data ingestion - single entry point for ALL data
export async function ingestUniversalData(event: UniversalDataEvent): Promise<void> {
  try {
    // Store in Redis for now (database disabled)
    await redis.set(`universal:${event.id}`, JSON.stringify(event));
    console.log(`✅ [Universal Hub] Stored event ${event.id} in Redis`);
    
    // Skip database storage for now
    return;
  } catch (error) {
    console.error('❌ [Universal Hub] Failed to ingest event:', error);
    throw error;
  }
}

// Agent activity tracking
export async function trackActivity(source: string, event_type: string, data: any, metadata?: any): Promise<void> {
  const event: UniversalDataEvent = {
    id: `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source,
    event_type,
    timestamp: new Date(),
    data,
    metadata
  };
  
  await ingestUniversalData(event);
}

// Route events to specialized tables
async function routeEventToSpecializedTable(event: UniversalDataEvent): Promise<void> {
  const { source, event_type, data, metadata } = event;

  // Agent activity
  if (source.startsWith('agent-') || source === 'hawk' || source === 'clawedette' || source === 'sable' || source === 'lmc') {
    await pool.query(
      `INSERT INTO agent_activity (agent_id, agent_name, agent_type, activity_type, status, details, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        source,
        metadata?.agent_name || source,
        determineAgentType(source),
        event_type,
        data.status || 'active',
        JSON.stringify(data),
        event.timestamp
      ]
    );
  }

  // Cross-platform messages
  if (event_type === 'message' || event_type === 'cast' || event_type === 'post') {
    await pool.query(
      `INSERT INTO cross_platform_messages (platform, message_id, author_id, author_name, content, engagement, metadata, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT DO NOTHING`,
      [
        metadata?.platform || determinePlatform(source),
        data.hash || data.id,
        metadata?.agent_fid?.toString() || data.author_fid?.toString(),
        data.author_username || data.author_name,
        data.text || data.content,
        JSON.stringify(data.reactions || data.engagement || {}),
        JSON.stringify(metadata || {}),
        event.timestamp
      ]
    );
  }

  // System metrics
  if (event_type === 'metric' || event_type === 'heartbeat' || event_type === 'performance') {
    await pool.query(
      `INSERT INTO system_metrics (metric_name, metric_value, metric_unit, source, tags, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [
        data.metric_name || event_type,
        parseFloat(data.value || data.metric_value || 0),
        data.unit || 'count',
        source,
        JSON.stringify(metadata?.tags || {}),
        event.timestamp
      ]
    );
  }

  // Specialized spikes
  if (event_type === 'spike' || event_type === 'alpha' || event_type === 'anomaly' || event_type === 'signal') {
    await pool.query(
      `INSERT INTO specialized_spikes (spike_type, severity, description, source, related_entities, context, confidence, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT DO NOTHING`,
      [
        event_type,
        parseFloat(data.severity || data.confidence || 0.5),
        data.description || data.text || '',
        source,
        JSON.stringify(data.related_entities || metadata?.related_entities || {}),
        JSON.stringify(data.context || {}),
        parseFloat(data.confidence || 0.5),
        event.timestamp
      ]
    );
  }
}

// Helper functions
function determineAgentType(source: string): string {
  if (source === 'hawk' || source === 'clawedette' || source === 'sable' || source === 'lmc') return 'bot';
  if (source.startsWith('agent-')) return 'logical';
  if (source.includes('service') || source.includes('screener')) return 'service';
  return 'container';
}

function determinePlatform(source: string): string {
  if (source === 'hawk') return 'farcaster';
  if (source === 'clawedette' || source === 'sable' || source === 'lmc') return 'telegram';
  if (source.includes('discord')) return 'discord';
  return 'unknown';
}

// Query functions for the universal hub
export async function getUniversalEvents(source?: string, eventType?: string, limit: number = 100): Promise<any[]> {
  let query = `SELECT * FROM universal_events WHERE 1=1`;
  const params: any[] = [];
  let paramIndex = 1;

  if (source) {
    query += ` AND source = $${paramIndex++}`;
    params.push(source);
  }

  if (eventType) {
    query += ` AND event_type = $${paramIndex++}`;
    params.push(eventType);
  }

  query += ` ORDER BY timestamp DESC LIMIT $${paramIndex}`;
  params.push(limit);

  const result = await pool.query(query, params);
  return result.rows;
}

export async function getAgentActivity(agentId?: string, limit: number = 50): Promise<any[]> {
  let query = `SELECT * FROM agent_activity`;
  const params: any[] = [];

  if (agentId) {
    query += ` WHERE agent_id = $1`;
    params.push(agentId);
    query += ` ORDER BY timestamp DESC LIMIT $2`;
    params.push(limit);
  } else {
    query += ` ORDER BY timestamp DESC LIMIT $1`;
    params.push(limit);
  }

  const result = await pool.query(query, params);
  return result.rows;
}

export async function getSpecializedSpikes(spikeType?: string, hours: number = 24): Promise<any[]> {
  const query = spikeType 
    ? `SELECT * FROM specialized_spikes WHERE spike_type = $1 AND timestamp > NOW() - INTERVAL '${hours} hours' ORDER BY timestamp DESC`
    : `SELECT * FROM specialized_spikes WHERE timestamp > NOW() - INTERVAL '${hours} hours' ORDER BY timestamp DESC`;
  
  const params = spikeType ? [spikeType] : [];
  const result = await pool.query(query, params);
  return result.rows;
}

// Bridge function to connect existing services
export function createUniversalIngestionBridge(source: string) {
  return {
    // For agent activity
    trackActivity: async (activityType: string, data: any, metadata?: any) => {
      await ingestUniversalData({
        id: `${source}-${Date.now()}-${Math.random()}`,
        source,
        event_type: activityType,
        timestamp: new Date(),
        data,
        metadata
      });
    },

    // For messages/casts
    trackMessage: async (message: any, platform?: string) => {
      await ingestUniversalData({
        id: message.hash || message.id || `${source}-${Date.now()}`,
        source,
        event_type: 'message',
        timestamp: new Date(message.timestamp || Date.now()),
        data: message,
        metadata: { platform, ...message.metadata }
      });
    },

    // For metrics
    trackMetric: async (metricName: string, value: number, unit?: string, tags?: any) => {
      await ingestUniversalData({
        id: `${source}-${metricName}-${Date.now()}`,
        source,
        event_type: 'metric',
        timestamp: new Date(),
        data: { metric_name: metricName, value, unit },
        metadata: { tags }
      });
    },

    // For spikes/anomalies
    trackSpike: async (spikeType: string, data: any) => {
      await ingestUniversalData({
        id: `${source}-spike-${Date.now()}`,
        source,
        event_type: 'spike',
        timestamp: new Date(),
        data,
        metadata: { spike_type: spikeType }
      });
    }
  };
}

// Initialize on startup
initializeUniversalSchema().catch(console.error);
