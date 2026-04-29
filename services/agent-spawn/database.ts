import { Pool } from 'pg';
import { readFileSync } from 'fs';

// Database connection for agent lifecycle and spawn history
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }, // Neon requires SSL
    })
  : null;

function databaseDisabledMetric() {
  return {
    total_spawns: 0,
    active_agents: 0,
    paused_agents: 0,
    destroyed_agents: 0,
    avg_age_hours: 0,
    database_enabled: false,
  };
}

// Load schema from file
const schema = readFileSync('./schema.sql', 'utf8');

// Types matching the schema
export interface AgentRecord {
  agent_id: string;
  name: string;
  template_id: string;
  status: 'spawning' | 'active' | 'paused' | 'destroyed';
  spawned_at: Date;
  last_heartbeat: Date;
  container_id?: string;
  resource_allocation: any;
  metadata?: any;
}

export interface SpawnTemplate {
  template_id: string;
  name: string;
  description: string;
  image: string;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  capabilities: string[];
  config: any;
  created_at: Date;
  updated_at: Date;
}

export interface SpawnEvent {
  event_id: string;
  agent_id: string;
  event_type: 'spawn' | 'pause' | 'resume' | 'destroy' | 'error';
  timestamp: Date;
  details: any;
  operator?: string;
}

// Agent lifecycle operations
export async function recordAgentSpawn(agent: AgentRecord): Promise<void> {
  if (!pool) return;

  const query = `
    INSERT INTO agents (
      agent_id, name, template_id, status, spawned_at, last_heartbeat,
      container_id, resource_allocation, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (agent_id) DO UPDATE SET
      name = EXCLUDED.name,
      template_id = EXCLUDED.template_id,
      status = EXCLUDED.status,
      last_heartbeat = EXCLUDED.last_heartbeat,
      container_id = EXCLUDED.container_id,
      resource_allocation = EXCLUDED.resource_allocation,
      metadata = EXCLUDED.metadata
  `;
  
  await pool.query(query, [
    agent.agent_id,
    agent.name,
    agent.template_id,
    agent.status,
    agent.spawned_at,
    agent.last_heartbeat,
    agent.container_id,
    JSON.stringify(agent.resource_allocation),
    JSON.stringify(agent.metadata || {})
  ]);
}

export async function updateAgentStatus(agentId: string, status: string, details?: any): Promise<void> {
  if (!pool) return;

  const query = `
    UPDATE agents 
    SET status = $1, last_heartbeat = NOW(), metadata = 
      CASE 
        WHEN metadata IS NULL THEN $2::jsonb
        ELSE jsonb_set(COALESCE(metadata, '{}'::jsonb), '{last_update}', $2::jsonb)
      END
    WHERE agent_id = $3
  `;
  
  await pool.query(query, [status, JSON.stringify(details || {}), agentId]);
}

export async function recordSpawnEvent(event: SpawnEvent): Promise<void> {
  if (!pool) return;

  const query = `
    INSERT INTO spawn_events (
      event_id, agent_id, event_type, timestamp, details, operator
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;
  
  await pool.query(query, [
    event.event_id,
    event.agent_id,
    event.event_type,
    event.timestamp,
    JSON.stringify(event.details),
    event.operator
  ]);
}

export async function getActiveAgents(): Promise<AgentRecord[]> {
  if (!pool) return [];

  const query = `
    SELECT * FROM agents 
    WHERE status IN ('active', 'paused', 'spawning')
    ORDER BY spawned_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getAgentHistory(agentId: string, limit: number = 50): Promise<SpawnEvent[]> {
  if (!pool) return [];

  const query = `
    SELECT * FROM spawn_events 
    WHERE agent_id = $1
    ORDER BY timestamp DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [agentId, limit]);
  return result.rows;
}

export async function getSpawnMetrics(hours: number = 24): Promise<any> {
  if (!pool) return databaseDisabledMetric();

  const query = `
    SELECT 
      COUNT(*) as total_spawns,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_agents,
      COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_agents,
      COUNT(CASE WHEN status = 'destroyed' THEN 1 END) as destroyed_agents,
      AVG(EXTRACT(EPOCH FROM (NOW() - spawned_at))/3600) as avg_age_hours
    FROM agents 
    WHERE spawned_at > NOW() - INTERVAL '${hours} hours'
  `;
  const result = await pool.query(query);
  return result.rows[0];
}

// Initialize database connection
export async function initDatabase(): Promise<void> {
  if (!pool) {
    console.warn('⚠️ [Hatchling] DATABASE_URL not set; persistence disabled');
    return;
  }

  try {
    await pool.query(schema);
    console.log('✅ [Hatchling] Database schema initialized');
  } catch (error) {
    console.error('❌ [Hatchling] Database schema initialization failed:', error);
    throw error;
  }
}

export default pool;
