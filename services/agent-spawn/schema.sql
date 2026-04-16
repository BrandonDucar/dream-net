-- Agent Spawn Database Schema for Hatchling
-- Stores agent lifecycle, templates, and spawn events

-- Store individual agents with full metadata
CREATE TABLE IF NOT EXISTS agents (
    agent_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('spawning', 'active', 'paused', 'destroyed')),
    spawned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    container_id VARCHAR(255),
    resource_allocation JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store agent templates for spawning
CREATE TABLE IF NOT EXISTS spawn_templates (
    template_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255) NOT NULL,
    resources JSONB NOT NULL,
    capabilities TEXT[],
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store spawn events for audit trail
CREATE TABLE IF NOT EXISTS spawn_events (
    event_id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('spawn', 'pause', 'resume', 'destroy', 'error')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB,
    operator VARCHAR(255),
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE
);

-- Store resource pools and allocation
CREATE TABLE IF NOT EXISTS resource_pools (
    pool_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_cpu DECIMAL(10,2) NOT NULL,
    total_memory DECIMAL(10,2) NOT NULL,
    total_storage DECIMAL(10,2) NOT NULL,
    allocated_cpu DECIMAL(10,2) DEFAULT 0,
    allocated_memory DECIMAL(10,2) DEFAULT 0,
    allocated_storage DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store batch spawn operations
CREATE TABLE IF NOT EXISTS batch_spawns (
    batch_id VARCHAR(255) PRIMARY KEY,
    template_id VARCHAR(255) NOT NULL,
    count INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'spawning', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    details JSONB,
    FOREIGN KEY (template_id) REFERENCES spawn_templates(template_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_template ON agents(template_id);
CREATE INDEX IF NOT EXISTS idx_agents_spawned_at ON agents(spawned_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_heartbeat ON agents(last_heartbeat DESC);

CREATE INDEX IF NOT EXISTS idx_spawn_events_agent ON spawn_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_spawn_events_timestamp ON spawn_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_spawn_events_type ON spawn_events(event_type);

CREATE INDEX IF NOT EXISTS idx_spawn_templates_updated ON spawn_templates(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_spawns_status ON batch_spawns(status);
CREATE INDEX IF NOT EXISTS idx_batch_spawns_started ON batch_spawns(started_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spawn_templates_updated_at BEFORE UPDATE ON spawn_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_pools_updated_at BEFORE UPDATE ON resource_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
