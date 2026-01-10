-- Rollback migration for latent_sessions table

DROP TRIGGER IF EXISTS trigger_update_latent_sessions_updated_at ON latent_sessions;
DROP FUNCTION IF EXISTS update_latent_sessions_updated_at();
DROP FUNCTION IF EXISTS cleanup_expired_latent_sessions();
DROP INDEX IF EXISTS idx_latent_sessions_metadata;
DROP INDEX IF EXISTS idx_latent_sessions_expires_at;
DROP INDEX IF EXISTS idx_latent_sessions_created_at;
DROP INDEX IF EXISTS idx_latent_sessions_agent_id;
DROP TABLE IF EXISTS latent_sessions;
