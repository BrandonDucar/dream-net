import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { WebSocket, WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.GENEALOGIST_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenClaw Geneologist OS - Agent Family Tree Management System
class OpenClawGeneologistOS {
  constructor() {
    this.familyTree = new Map();
    this.spikeConnections = new Map();
    this.geneologyMetrics = new Map();
    this.familyHealth = new Map();
    this.wsConnections = new Map();
    this.spikeHandlers = new Map();
    this.supabase = null;
    this.redisClient = null;
    this.initialize();
  }

  async initialize() {
    console.log('\ud83e\uddec OpenClaw Geneologist OS initializing...');
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        await this.loadFamilyTree();
      }
    } catch (err) {
      console.error('\u274c DB init failed:', err.message);
    }
    this.initializeSpikeHandlers();
    this.initializeWebSocket();
    this.startGeneologyLoops();
    console.log('\ud83c\udf33 OpenClaw Geneologist OS operational');
  }

  initializeSpikeHandlers() {
    this.spikeHandlers.set('dreamnet-core', async (data) => {
      if (data.type === 'agent_birth') await this.recordBirth(data.agent);
      else if (data.type === 'agent_death') await this.recordDeath(data.agent);
      else if (data.type === 'genetic_mutation') await this.recordMutation(data.agent);
    });
  }

  async loadFamilyTree() {
    try {
      const { data, error } = await this.supabase
        .from('family_tree').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      for (const member of data || []) {
        this.familyTree.set(member.id, { ...member, children: [], parents: member.parents || [] });
      }
      for (const [id, member] of this.familyTree) {
        for (const parentId of member.parents) {
          const parent = this.familyTree.get(parentId);
          if (parent) parent.children.push(id);
        }
      }
      console.log(`\ud83c\udf33 Loaded ${this.familyTree.size} family members`);
    } catch (err) {
      console.error('\u274c Failed to load family tree:', err.message);
    }
  }

  initializeWebSocket() {
    const wss = new WebSocketServer({ port: process.env.GENEALOGIST_WS_PORT || 3010 });
    wss.on('connection', (ws, req) => {
      const clientId = req.headers['sec-websocket-key'];
      this.wsConnections.set(clientId, { ws, connected: Date.now(), subscriptions: new Set() });
      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          if (msg.type === 'get_family_tree') this.sendFamilyTree(clientId);
          else if (msg.type === 'get_lineage') this.sendLineage(clientId, msg.agentId);
          else if (msg.type === 'subscribe') this.wsConnections.get(clientId)?.subscriptions.add(msg.channel);
        } catch (e) { console.error('WS error:', e); }
      });
      ws.on('close', () => this.wsConnections.delete(clientId));
    });
    console.log('\ud83d\udd0c WebSocket server on port', process.env.GENEALOGIST_WS_PORT || 3010);
  }

  async sendFamilyTree(clientId) {
    const conn = this.wsConnections.get(clientId);
    if (!conn) return;
    conn.ws.send(JSON.stringify({ type: 'family_tree', data: this.getFamilyTree() }));
  }

  async sendLineage(clientId, agentId) {
    const conn = this.wsConnections.get(clientId);
    if (!conn) return;
    conn.ws.send(JSON.stringify({ type: 'lineage', agentId, data: this.calculateLineage(agentId) }));
  }

  calculateLineage(agentId) {
    const agent = this.familyTree.get(agentId);
    if (!agent) return { ancestors: [], descendants: [], siblings: [] };
    const ancestors = [], descendants = [], siblings = [], visited = new Set();
    const findAncestors = (id, depth = 0) => {
      if (depth > 10 || visited.has(id)) return;
      visited.add(id);
      const m = this.familyTree.get(id);
      if (m) for (const pid of m.parents) {
        ancestors.push({ id: pid, depth: depth + 1 });
        findAncestors(pid, depth + 1);
      }
    };
    const findDescendants = (id, depth = 0) => {
      if (depth > 10 || visited.has(id)) return;
      visited.add(id);
      const m = this.familyTree.get(id);
      if (m) for (const cid of m.children) {
        descendants.push({ id: cid, depth: depth + 1 });
        findDescendants(cid, depth + 1);
      }
    };
    findAncestors(agentId);
    visited.clear();
    findDescendants(agentId);
    for (const pid of agent.parents) {
      const parent = this.familyTree.get(pid);
      if (parent) for (const sid of parent.children) {
        if (sid !== agentId) siblings.push({ id: sid });
      }
    }
    return { ancestors, descendants, siblings };
  }

  async recordBirth(agent) {
    if (!agent?.id) return;
    if (this.supabase) {
      await this.supabase.from('family_tree').insert([{
        id: agent.id, name: agent.name, generation: agent.generation,
        parents: agent.parents, genetic_code: agent.geneticCode,
        capabilities: agent.capabilities, health: 100,
        created_at: new Date().toISOString()
      }]);
    }
    this.familyTree.set(agent.id, { ...agent, children: [], health: 100 });
    for (const pid of agent.parents || []) {
      const parent = this.familyTree.get(pid);
      if (parent) parent.children.push(agent.id);
    }
    this.broadcastToSubscribers('family_events', { type: 'birth', agent });
    console.log(`\ud83d\udc76 Birth recorded: ${agent.name}`);
  }

  async recordDeath(agent) {
    if (this.supabase) {
      await this.supabase.from('family_tree').update({ health: 0, died_at: new Date().toISOString() }).eq('id', agent.id);
    }
    const m = this.familyTree.get(agent.id);
    if (m) m.health = 0;
    this.broadcastToSubscribers('family_events', { type: 'death', agent });
  }

  async recordMutation(agent) {
    if (this.supabase) {
      await this.supabase.from('family_tree').update({
        genetic_code: agent.geneticCode, capabilities: agent.capabilities,
        mutated_at: new Date().toISOString()
      }).eq('id', agent.id);
    }
    const m = this.familyTree.get(agent.id);
    if (m) { m.geneticCode = agent.geneticCode; m.capabilities = agent.capabilities; }
    this.broadcastToSubscribers('family_events', { type: 'mutation', agent });
  }

  broadcastToSubscribers(channel, data) {
    for (const [, conn] of this.wsConnections) {
      if (conn.subscriptions.has(channel)) {
        conn.ws.send(JSON.stringify({ type: channel, data }));
      }
    }
  }

  startGeneologyLoops() {
    setInterval(() => this.calculateGeneologyMetrics(), 60000);
  }

  calculateGeneologyMetrics() {
    const generations = new Set();
    let totalChildren = 0;
    for (const [, m] of this.familyTree) {
      generations.add(m.generation);
      totalChildren += (m.children || []).length;
    }
    this.geneologyMetrics.set('global', {
      totalGenerations: generations.size,
      totalMembers: this.familyTree.size,
      averageChildren: this.familyTree.size > 0 ? totalChildren / this.familyTree.size : 0
    });
  }

  getFamilyTree() { return Array.from(this.familyTree.entries()).map(([id, m]) => ({ id, ...m })); }
  getGeneologyMetrics() { return Object.fromEntries(this.geneologyMetrics); }
  getFamilyHealth() { return Object.fromEntries(this.familyHealth); }
  getSpikeConnections() {
    return Object.fromEntries(Array.from(this.spikeConnections.entries()).map(([n, s]) => [n, { status: s.status }]));
  }
}

// Initialize
const geneologist = new OpenClawGeneologistOS();

// API Routes
app.get('/health', (req, res) => res.json({
  status: 'healthy', service: 'openclaw-geneologist', timestamp: Date.now(),
  metrics: { familyMembers: geneologist.familyTree.size }
}));

app.get('/api/geneologist/family-tree', (req, res) => res.json(geneologist.getFamilyTree()));
app.get('/api/geneologist/metrics', (req, res) => res.json(geneologist.getGeneologyMetrics()));
app.get('/api/geneologist/health', (req, res) => res.json(geneologist.getFamilyHealth()));
app.get('/api/geneologist/spikes', (req, res) => res.json(geneologist.getSpikeConnections()));
app.get('/api/geneologist/lineage/:agentId', (req, res) => res.json(geneologist.calculateLineage(req.params.agentId)));

app.post('/api/geneologist/record-birth', async (req, res) => {
  try { await geneologist.recordBirth(req.body); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/geneologist/record-mutation', async (req, res) => {
  try { await geneologist.recordMutation(req.body); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Serve family tree UI
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/family-tree', (req, res) => res.sendFile(path.join(__dirname, 'public', 'family-tree.html')));

app.listen(PORT, () => {
  console.log(`\ud83e\uddec OpenClaw Geneologist OS running on port ${PORT}`);
  console.log(`\ud83c\udf33 Family Tree: http://localhost:${PORT}/family-tree`);
});
