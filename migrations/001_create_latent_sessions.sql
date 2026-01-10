-- Migration: Create latent_sessions table for agent collaboration
-- Purpose: Enable agents to share context asynchronously via embeddings
-- Feature: Latent Collaboration (USE_LATENT_COLLABORATION)

CREATE TABLE IF NOT EXISTS latent_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    context_summary TEXT NOT NULL,
    embedding_vector FLOAT8[] NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_latent_sessions_agent_id ON latent_sessions(agent_id);
CREATE INDEX idx_latent_sessions_created_at ON latent_sessions(created_at DESC);
CREATE INDEX idx_latent_sessions_expires_at ON latent_sessions(expires_at) WHERE expires_at IS NOT NULL;

-- GIN index for JSONB metadata queries
CREATE INDEX idx_latent_sessions_metadata ON latent_sessions USING GIN(metadata);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_latent_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trigger_update_latent_sessions_updated_at
    BEFORE UPDATE ON latent_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_latent_sessions_updated_at();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_latent_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM latent_sessions
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE latent_sessions IS 'Stores agent collaboration context encoded as embeddings';
COMMENT ON COLUMN latent_sessions.session_id IS 'Unique identifier for the collaboration session';
COMMENT ON COLUMN latent_sessions.agent_id IS 'ID of the agent that created this session';
COMMENT ON COLUMN latent_sessions.context_summary IS 'Human-readable summary of the context';
COMMENT ON COLUMN latent_sessions.embedding_vector IS 'OpenAI embedding vector for semantic search';
COMMENT ON COLUMN latent_sessions.metadata IS 'Additional metadata (tags, priority, etc.)';
COMMENT ON COLUMN latent_sessions.expires_at IS 'Optional expiration timestamp for auto-cleanup';
