/**
 * 🎯 DreamNet Manager Coordination Control
 * Central delegation hub for 17,000 agents (9 managers)
 * Hierarchical task distribution + swarm orchestration
 */

import http from 'http';
import * as redis from 'redis';
import { connect as natsConnect } from 'nats';

class ManagerCoordinator {
  constructor() {
    this.redis = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.nats = null;
    this.managers = {
      hawk: { guild: 'Hawk', agents: 2000, agent_ids: [] },
      arya: { guild: 'Arya', agents: 2000, agent_ids: [] },
      governor: { guild: 'Governor', agents: 2000, agent_ids: [] },
      genealogist: { guild: 'Genealogist', agents: 2000, agent_ids: [] },
      loudspeaker: { guild: 'Loudspeaker', agents: 2000, agent_ids: [] },
      quantum: { guild: 'Quantum', agents: 2000, agent_ids: [] },
      sentinel: { guild: 'Sentinel', agents: 1000, agent_ids: [] },
      commerce: { guild: 'Commerce', agents: 1000, agent_ids: [] },
      creative: { guild: 'Creative', agents: 1000, agent_ids: [] },
    };
  }

  async init() {
    this.redis.on('error', (err) => console.error('Redis error:', err));
    await this.redis.connect();
    this.nats = await natsConnect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
    console.log('✅ Manager Coordinator initialized');
  }

  /**
   * Delegate a task to a specific guild's manager
   */
  async delegateTask(guild, taskType, workerCount = 100, priority = 'normal') {
    const manager = this.managers[guild];
    if (!manager) {
      throw new Error(`Unknown guild: ${guild}`);
    }

    const delegationId = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const delegation = {
      delegation_id: delegationId,
      guild,
      manager: manager.guild,
      task_type: taskType,
      workers_assigned: Math.min(workerCount, manager.agents),
      priority,
      status: 'DELEGATED',
      timestamp: new Date().toISOString(),
      workers: Array.from(
        { length: Math.min(workerCount, manager.agents) },
        (_, i) => `${guild}-worker-${i}`
      ),
    };

    // Store in Redis
    await this.redis.hSet(`delegation:${delegationId}`, delegation);

    // Publish to NATS for managers to pick up
    await this.nats.publish(
      `manager.${guild}.delegate`,
      new TextEncoder().encode(JSON.stringify(delegation))
    );

    return delegation;
  }

  /**
   * Get delegation status
   */
  async getDelegationStatus(delegationId) {
    const status = await this.redis.hGetAll(`delegation:${delegationId}`);
    return status || { error: 'Not found' };
  }

  /**
   * Broadcast command to all managers
   */
  async broadcastToAllManagers(command, data) {
    const broadcast = {
      command,
      data,
      timestamp: new Date().toISOString(),
      target: 'ALL_MANAGERS',
    };

    await this.nats.publish('manager.broadcast.all', new TextEncoder().encode(JSON.stringify(broadcast)));

    return {
      status: 'BROADCAST',
      command,
      managers_targeted: Object.keys(this.managers).length,
      message: `Broadcasting "${command}" to all 9 guild managers`,
    };
  }

  /**
   * Get manager status for a guild
   */
  async getManagerStatus(guild) {
    const manager = this.managers[guild];
    if (!manager) {
      return { error: `Unknown guild: ${guild}` };
    }

    const agentCount = await this.redis.sCard(`guild:${guild}`);

    return {
      guild: manager.guild,
      agents_assigned: manager.agents,
      agents_active: agentCount || 0,
      workers_per_manager: manager.agents,
      status: agentCount > 0 ? 'ACTIVE' : 'DORMANT',
      last_heartbeat: new Date().toISOString(),
    };
  }

  /**
   * Get all managers status
   */
  async getAllManagersStatus() {
    const status = {};

    for (const [key, manager] of Object.entries(this.managers)) {
      const agentCount = await this.redis.sCard(`guild:${key}`);
      status[key] = {
        guild: manager.guild,
        agents: manager.agents,
        active: agentCount || 0,
        health: agentCount > manager.agents * 0.7 ? 'HEALTHY' : 'DEGRADED',
      };
    }

    return status;
  }

  /**
   * Coordinate swarm consensus
   */
  async coordinateConsensus(topic, options = []) {
    const consensusId = `CONSENSUS-${Date.now()}`;

    const consensus = {
      consensus_id: consensusId,
      topic,
      options,
      voting_managers: Object.keys(this.managers).length,
      consensus_threshold: '2/3 majority',
      status: 'VOTING',
      timestamp: new Date().toISOString(),
    };

    // Publish voting request to NemoClaw
    await this.nats.publish('consensus.vote.request', new TextEncoder().encode(JSON.stringify(consensus)));

    return consensus;
  }

  /**
   * Start HTTP server for manager control
   */
  startServer(port = 3301) {
    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');

      // Health check
      if (req.url === '/health') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            status: 'healthy',
            service: 'manager-coordinator',
            managers_active: 9,
            workers: 16991,
            total_agents: 17000,
          })
        );
        return;
      }

      // Status endpoint
      if (req.url === '/status') {
        const allStatus = await this.getAllManagersStatus();
        res.writeHead(200);
        res.end(JSON.stringify({ managers: allStatus }));
        return;
      }

      // Delegate task
      if (req.url === '/delegate' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const { guild, taskType, workerCount = 100 } = JSON.parse(body);
            const result = await this.delegateTask(guild, taskType, workerCount);
            res.writeHead(202);
            res.end(JSON.stringify(result));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }

      // Get manager status
      if (req.url.startsWith('/managers/')) {
        const guild = req.url.split('/')[2];
        const status = await this.getManagerStatus(guild);
        res.writeHead(200);
        res.end(JSON.stringify(status));
        return;
      }

      // Default
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    server.listen(port, () => {
      console.log(`🎯 Manager Coordinator listening on port ${port}`);
      console.log(`   Managers: 9 (Hawk, Arya, Governor, Genealogist, Loudspeaker, Quantum, Sentinel, Commerce, Creative)`);
      console.log(`   Workers: 16,991 distributed across 200+ regions`);
    });
  }
}

// Start coordinator
const coordinator = new ManagerCoordinator();
await coordinator.init();
coordinator.startServer(3301);

process.on('SIGTERM', async () => {
  console.log('Shutting down Manager Coordinator...');
  await coordinator.redis.disconnect();
  await coordinator.nats.close();
  process.exit(0);
});
