// packages/mcp/nemoclaw/src/index.ts
/**
 * NemoClaw: Neuromorphic Memory & Collective Consensus
 * Distributed state machine using CRDTs for multi-agent coordination
 */
import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import { Redis } from 'redis';
import { connect } from 'nats';

class NemoClaw {
  private fastify: any;
  private wss: WebSocketServer;
  private ydoc: Y.Doc;
  private ymap: Y.Map<any>;
  private redis: Redis;
  private nats: any;
  private clients: Set<any> = new Set();
  
  constructor() {
    this.ydoc = new Y.Doc();
    this.ymap = this.ydoc.getMap('dreamnet-state');
    
    this.fastify = Fastify({ logger: true });
    this.wss = new WebSocketServer({ noServer: true });
  }
  
  async initialize() {
    // Connect to Redis and NATS
    this.redis = Redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await this.redis.connect();
    
    this.nats = await connect({ servers: (process.env.NATS_URL || 'nats://localhost:4222').split(',') });
    
    // REST API
    this.setupRoutes();
    
    // WebSocket for CRDT sync
    this.fastify.server.on('upgrade', (request, socket, head) => {
      if (request.url === '/sync') {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.handleNewClient(ws);
        });
      }
    });
    
    // Listen for external state updates
    this.listenForStateUpdates();
    
    const PORT = process.env.PORT || 1234;
    await this.fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`🧠 NemoClaw running on port ${PORT}`);
    console.log(`   WebSocket Sync: ws://localhost:${PORT}/sync`);
  }
  
  private setupRoutes() {
    // Get guild state
    this.fastify.get('/api/guild/:guildId', async (request: any) => {
      const { guildId } = request.params;
      const guildState = this.ymap.get(guildId);
      
      return {
        guildId,
        state: guildState?.toJSON() || {},
        timestamp: Date.now()
      };
    });
    
    // Update guild decision (triggers consensus)
    this.fastify.post('/api/guild/:guildId/decision', async (request: any) => {
      const { guildId } = request.params;
      const { decision, voterId } = request.body as any;
      
      // Get or create guild state
      let guildState = this.ymap.get(guildId);
      if (!guildState) {
        guildState = new Y.Map();
        this.ymap.set(guildId, guildState);
      }
      
      // Initialize votes map if not present
      let votes = guildState.get('votes');
      if (!votes) {
        votes = new Y.Map();
        guildState.set('votes', votes);
      }
      
      // Add vote
      const voterVotes = votes.get(voterId) || [];
      voterVotes.push({
        decision,
        timestamp: Date.now()
      });
      votes.set(voterId, voterVotes);
      
      // Update latest decision
      guildState.set('latest_decision', decision);
      guildState.set('updated_at', Date.now());
      guildState.set('vote_count', (votes.size || 0));
      
      // Broadcast to all connected clients
      this.broadcastStateChange({
        guildId,
        type: 'decision-updated',
        decision,
        voterId,
        timestamp: Date.now()
      });
      
      return { status: 'recorded', guildId };
    });
    
    // Get consensus status
    this.fastify.get('/api/guild/:guildId/consensus', async (request: any) => {
      const { guildId } = request.params;
      const guildState = this.ymap.get(guildId);
      
      if (!guildState) {
        return { guildId, hasConsensus: false, agreement: 0 };
      }
      
      const votes = guildState.get('votes') || new Y.Map();
      const latestDecision = guildState.get('latest_decision');
      
      // Calculate agreement percentage
      let agreementCount = 0;
      votes.forEach((voterVotes: any) => {
        const lastVote = (voterVotes as any[])[(voterVotes as any[]).length - 1];
        if (lastVote.decision === latestDecision) {
          agreementCount++;
        }
      });
      
      const agreement = votes.size > 0 ? (agreementCount / votes.size) * 100 : 0;
      
      return {
        guildId,
        latestDecision,
        votes: votes.size,
        agreement: Math.round(agreement),
        hasConsensus: agreement >= 66.67 // 2/3 majority
      };
    });
    
    // Health check
    this.fastify.get('/health', async () => {
      return {
        status: 'healthy',
        service: 'nemoclaw',
        clients: this.clients.size,
        guilds: this.ymap.size,
        timestamp: Date.now()
      };
    });
  }
  
  private handleNewClient(ws: any) {
    console.log(`✨ New NemoClaw client connected (total: ${this.clients.size + 1})`);
    
    this.clients.add(ws);
    
    // Send initial state
    const state = Y.encodeStateAsUpdate(this.ydoc);
    ws.send(JSON.stringify({
      type: 'sync',
      update: Array.from(state)
    }));
    
    ws.on('message', (data: any) => {
      try {
        const msg = JSON.parse(data);
        
        if (msg.type === 'update') {
          // Apply CRDT update
          const update = new Uint8Array(msg.update);
          Y.applyUpdate(this.ydoc, update);
          
          // Broadcast to other clients
          this.broadcastToOthers(ws, {
            type: 'update',
            update: msg.update
          });
        } else if (msg.type === 'decision') {
          // Process decision update
          const { guildId, decision, voterId } = msg;
          let guildState = this.ymap.get(guildId);
          
          if (!guildState) {
            guildState = new Y.Map();
            this.ymap.set(guildId, guildState);
          }
          
          let votes = guildState.get('votes') || new Y.Map();
          const voterVotes = votes.get(voterId) || [];
          voterVotes.push({ decision, timestamp: Date.now() });
          votes.set(voterId, voterVotes);
          
          guildState.set('votes', votes);
          guildState.set('latest_decision', decision);
          guildState.set('updated_at', Date.now());
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });
    
    ws.on('close', () => {
      this.clients.delete(ws);
      console.log(`🔌 Client disconnected (total: ${this.clients.size})`);
    });
  }
  
  private broadcastStateChange(event: any) {
    this.clients.forEach((ws) => {
      ws.send(JSON.stringify({
        type: 'state-change',
        ...event
      }));
    });
  }
  
  private broadcastToOthers(originator: any, data: any) {
    this.clients.forEach((ws) => {
      if (ws !== originator) {
        ws.send(JSON.stringify(data));
      }
    });
  }
  
  private async listenForStateUpdates() {
    // Listen for external guild decision updates
    const sub = await this.nats.subscribe('guild.decision');
    
    (async () => {
      for await (const msg of sub) {
        const { guildId, decision, voterId } = JSON.parse(new TextDecoder().decode(msg.data));
        
        // Update CRDT state
        let guildState = this.ymap.get(guildId);
        if (!guildState) {
          guildState = new Y.Map();
          this.ymap.set(guildId, guildState);
        }
        
        guildState.set('latest_decision', decision);
        guildState.set('updated_at', Date.now());
        
        // Broadcast to connected clients
        this.broadcastStateChange({
          guildId,
          type: 'external-decision',
          decision,
          voterId
        });
      }
    })();
  }
}

// Initialize NemoClaw
const nemoclaw = new NemoClaw();
await nemoclaw.initialize();

process.on('SIGTERM', () => {
  console.log('Shutting down NemoClaw...');
  process.exit(0);
});
