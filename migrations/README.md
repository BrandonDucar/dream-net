# Database Migrations

## Running Migrations

### Prerequisites

- PostgreSQL database configured
- Database connection string in `.env` as `DATABASE_URL`

### Apply Migration

```bash
# Using psql
psql $DATABASE_URL -f migrations/001_create_latent_sessions.sql

# Or using a migration tool (e.g., node-pg-migrate, Prisma)
npm run migrate:up
```

### Rollback Migration

```bash
# Using psql
psql $DATABASE_URL -f migrations/001_create_latent_sessions_down.sql

# Or using a migration tool
npm run migrate:down
```

## Migration: 001_create_latent_sessions

**Purpose:** Enable Latent Collaboration between agents

**What it creates:**

- `latent_sessions` table with embedding vectors
- Indexes for performance (agent_id, created_at, expires_at, metadata)
- Auto-update trigger for `updated_at`
- Cleanup function for expired sessions

**Schema:**

```sql
latent_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    context_summary TEXT NOT NULL,
    embedding_vector FLOAT8[] NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
)
```

**Usage Example:**

```typescript
// Agent creates a latent session
await db.query(`
    INSERT INTO latent_sessions (session_id, agent_id, context_summary, embedding_vector, metadata)
    VALUES ($1, $2, $3, $4, $5)
`, [sessionId, 'wolfpack', 'Found $2M grant opportunity', embeddingVector, { priority: 'high' }]);

// Another agent reads latent sessions
const sessions = await db.query(`
    SELECT * FROM latent_sessions
    WHERE agent_id != $1
    ORDER BY created_at DESC
    LIMIT 10
`, ['coinsensei']);
```

**Cleanup:**

```sql
-- Run periodically (e.g., via cron job)
SELECT cleanup_expired_latent_sessions();
```
