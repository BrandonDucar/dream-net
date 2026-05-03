import express from 'express';
import { Pool } from 'pg';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3400;
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || 'postgresql://localhost/dreamnet';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

console.log(`[Genealogist] Connecting to database: ${DATABASE_URL.split('@')[1] || 'localhost'}`);

// ─── Database Health Check ──────────────────────────────────────────────

async function checkDatabaseHealth() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    console.error('[Genealogist] Database health check failed:', err);
    return false;
  }
}

// ─── Endpoints ──────────────────────────────────────────────

/**
 * GET /health
 * Basic health check for Docker healthcheck
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'genealogist',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/genealogy/health
 * Genealogist-specific health with database status
 */
app.get('/api/genealogy/health', async (req, res) => {
  try {
    const dbHealthy = await checkDatabaseHealth();
    res.json({
      status: dbHealthy ? 'healthy' : 'degraded',
      service: 'Genealogist',
      database: dbHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/genealogy/metrics
 * Return family tree statistics and license information
 */
app.get('/api/genealogy/metrics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_agents,
        COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as child_agents,
        COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as root_agents,
        COUNT(DISTINCT parent_id) as distinct_parents,
        COUNT(CASE WHEN maturation->>'isMature' = 'true' THEN 1 END) as mature_agents,
        (SELECT COUNT(*) FROM agent_licenses WHERE revoked = false) as active_licenses
      FROM swarm_agents;
    `);

    const metrics = result.rows[0] || {
      total_agents: 0,
      child_agents: 0,
      root_agents: 0,
      distinct_parents: 0,
      mature_agents: 0,
      active_licenses: 0,
    };

    res.json({
      timestamp: new Date().toISOString(),
      metrics: {
        total_agents: parseInt(metrics.total_agents) || 0,
        root_agents: parseInt(metrics.root_agents) || 0,
        child_agents: parseInt(metrics.child_agents) || 0,
        distinct_parents: parseInt(metrics.distinct_parents) || 0,
        mature_agents: parseInt(metrics.mature_agents) || 0,
        active_licenses: parseInt(metrics.active_licenses) || 0,
      },
    });
  } catch (err) {
    console.error('[Genealogist] Metrics query failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/genealogy/tree/:agentId
 * Return family tree for an agent (parents and children)
 */
app.get('/api/genealogy/tree/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;

    // Get agent and its lineage using recursive CTE (up to parent, down to children)
    const result = await pool.query(
      `
      WITH RECURSIVE lineage AS (
        -- Base case: the agent itself
        SELECT id, name, parent_id, license_level, maturation, 0 as depth, CAST(id AS TEXT) as path
        FROM swarm_agents
        WHERE id = $1
        
        UNION ALL
        
        -- Recursive case: parents (going up)
        SELECT a.id, a.name, a.parent_id, a.license_level, a.maturation, l.depth - 1, CAST(l.id || ',' || a.id AS TEXT)
        FROM swarm_agents a
        INNER JOIN lineage l ON a.id = l.parent_id
        WHERE l.depth > -5  -- Limit to 5 generations up
      )
      SELECT * FROM lineage ORDER BY depth DESC;
      `,
      [agentId]
    );

    // Get direct children
    const childrenResult = await pool.query(
      `
      SELECT id, name, license_level, maturation
      FROM swarm_agents
      WHERE parent_id = $1
      ORDER BY created_at DESC;
      `,
      [agentId]
    );

    const lineage = result.rows || [];
    const children = childrenResult.rows || [];

    res.json({
      agentId,
      timestamp: new Date().toISOString(),
      lineage: lineage.map((row) => ({
        id: row.id,
        name: row.name,
        parent_id: row.parent_id,
        license_level: row.license_level,
        depth: row.depth,
        maturation: row.maturation,
      })),
      children: children.map((row) => ({
        id: row.id,
        name: row.name,
        license_level: row.license_level,
        maturation: row.maturation,
      })),
      lineageCount: lineage.length,
      childrenCount: children.length,
    });
  } catch (err) {
    console.error('[Genealogist] Tree query failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/genealogy/register
 * Register a single agent with lineage metadata (safe: no mass updates)
 */
app.post('/api/genealogy/register', async (req, res) => {
  try {
    const { agentId, parentId, guildId, workspaceId, licenseLevel, maturation } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' });
    }

    // Check if agent exists
    const checkResult = await pool.query('SELECT id FROM swarm_agents WHERE id = $1', [agentId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: `Agent ${agentId} not found` });
    }

    // Update agent (safe: only update specified agent, not bulk)
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (parentId !== undefined) {
      updates.push(`parent_id = $${paramCount++}`);
      values.push(parentId);
    }
    if (guildId !== undefined) {
      updates.push(`guild_id = $${paramCount++}`);
      values.push(guildId);
    }
    if (workspaceId !== undefined) {
      updates.push(`workspace_id = $${paramCount++}`);
      values.push(workspaceId);
    }
    if (licenseLevel !== undefined) {
      updates.push(`license_level = $${paramCount++}`);
      values.push(licenseLevel);
    }
    if (maturation !== undefined) {
      updates.push(`maturation = $${paramCount++}`);
      values.push(JSON.stringify(maturation));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(agentId);
    const query = `
      UPDATE swarm_agents
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, parent_id, license_level, maturation;
    `;

    const result = await pool.query(query, values);
    const updatedAgent = result.rows[0];

    console.log(`[Genealogist] Registered agent ${agentId} with lineage updates`);

    res.status(200).json({
      success: true,
      agent: {
        id: updatedAgent.id,
        name: updatedAgent.name,
        parent_id: updatedAgent.parent_id,
        license_level: updatedAgent.license_level,
        maturation: updatedAgent.maturation,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Genealogist] Register failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/genealogy/dry-run
 * Propose lineage/adoption batch without committing changes
 */
app.post('/api/genealogy/dry-run', async (req, res) => {
  try {
    const { batch } = req.body; // Array of { agentId, parentId, licenseLevel, ... }

    if (!Array.isArray(batch) || batch.length === 0) {
      return res.status(400).json({ error: 'batch must be a non-empty array' });
    }

    const proposals = [];
    const errors = [];

    for (const item of batch) {
      const { agentId, parentId, licenseLevel } = item;

      try {
        // Check if agent exists
        const agentResult = await pool.query(
          'SELECT id, name, parent_id, license_level FROM swarm_agents WHERE id = $1',
          [agentId]
        );

        if (agentResult.rows.length === 0) {
          errors.push({ agentId, error: 'Agent not found' });
          continue;
        }

        const agent = agentResult.rows[0];

        // Check if parent exists (if provided)
        let parentValid = true;
        if (parentId) {
          const parentResult = await pool.query('SELECT id FROM swarm_agents WHERE id = $1', [parentId]);
          parentValid = parentResult.rows.length > 0;
        }

        proposals.push({
          agentId,
          currentParentId: agent.parent_id,
          proposedParentId: parentId || agent.parent_id,
          currentLicenseLevel: agent.license_level,
          proposedLicenseLevel: licenseLevel !== undefined ? licenseLevel : agent.license_level,
          parentValid,
          canExecute: parentValid || !parentId,
        });
      } catch (err) {
        errors.push({ agentId, error: err.message });
      }
    }

    console.log(`[Genealogist] Dry-run evaluated ${batch.length} proposals`);

    res.json({
      timestamp: new Date().toISOString(),
      dryRunResults: {
        total: batch.length,
        valid: proposals.filter((p) => p.canExecute).length,
        invalid: errors.length,
        proposals,
        errors,
      },
    });
  } catch (err) {
    console.error('[Genealogist] Dry-run failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/genealogy/license
 * Issue a license to an agent
 */
app.post('/api/genealogy/license', async (req, res) => {
  try {
    const { agentId, licenseType, metadata } = req.body;

    if (!agentId || !licenseType) {
      return res.status(400).json({ error: 'agentId and licenseType are required' });
    }

    // Check if agent exists
    const checkResult = await pool.query('SELECT id FROM swarm_agents WHERE id = $1', [agentId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: `Agent ${agentId} not found` });
    }

    // Insert license
    const result = await pool.query(
      `
      INSERT INTO agent_licenses (agent_id, license_type, metadata, revoked)
      VALUES ($1, $2, $3, false)
      RETURNING id, agent_id, license_type, metadata, created_at;
      `,
      [agentId, licenseType, JSON.stringify(metadata || {})]
    );

    const license = result.rows[0];

    console.log(`[Genealogist] Issued ${licenseType} license to agent ${agentId}`);

    res.status(201).json({
      success: true,
      license: {
        id: license.id,
        agentId: license.agent_id,
        licenseType: license.license_type,
        metadata: license.metadata,
        createdAt: license.created_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Genealogist] License issuance failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /
 * Service info
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Genealogist Service',
    version: '2.0.0',
    description: 'Family tree and lineage control plane for DreamNet swarm',
    endpoints: {
      health: 'GET /health',
      genealogyHealth: 'GET /api/genealogy/health',
      metrics: 'GET /api/genealogy/metrics',
      tree: 'GET /api/genealogy/tree/:agentId',
      register: 'POST /api/genealogy/register',
      dryRun: 'POST /api/genealogy/dry-run',
      license: 'POST /api/genealogy/license',
    },
  });
});

// ─── Error Handling ──────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('[Genealogist] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Startup ──────────────────────────────────────────────

app.listen(PORT, async () => {
  console.log(`📜 [Genealogist] Service running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: GET http://localhost:${PORT}/health`);
  console.log(`   Metrics: GET http://localhost:${PORT}/api/genealogy/metrics`);
  console.log(`   Tree: GET http://localhost:${PORT}/api/genealogy/tree/:agentId`);

  // Check database connection on startup
  const dbHealthy = await checkDatabaseHealth();
  if (dbHealthy) {
    console.log(`✅ [Genealogist] Database connected successfully`);
  } else {
    console.error(`❌ [Genealogist] Failed to connect to database`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 [Genealogist] Shutting down gracefully...');
  pool.end(() => {
    console.log('Database connection pool closed');
    process.exit(0);
  });
});
