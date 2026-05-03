/**
 * @dreamnet/runtime-bridge-core — Runtime Bridge Core
 *
 * Low-level runtime bridge that handles process lifecycle,
 * signal forwarding, and container-to-bridge connectivity.
 *
 * Used by all organ packages to connect to the Sovereign Bridge.
 * This is the foundation layer — other bridges import from here.
 */
const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
export class RuntimeBridge {
    config;
    heartbeatTimer = null;
    pollTimer = null;
    registered = false;
    constructor(config) {
        this.config = config;
    }
    async post(path, body) {
        const res = await fetch(`${BRIDGE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return res.json();
    }
    async get(path) {
        const res = await fetch(`${BRIDGE_URL}${path}`);
        return res.json();
    }
    async connect() {
        try {
            const result = await this.post('/bridge/register', {
                agentId: this.config.agentId,
                name: this.config.name,
                type: this.config.type,
                version: this.config.version,
                capabilities: this.config.capabilities,
                endpoint: this.config.endpoint,
                metadata: this.config.metadata,
            });
            this.registered = true;
            console.log(`[RuntimeBridge] ${this.config.name} connected to Sovereign Bridge`);
            return true;
        }
        catch (err) {
            console.error(`[RuntimeBridge] Connection failed: ${err.message}`);
            return false;
        }
    }
    async connectWithRetry(maxRetries = 30, intervalMs = 10_000) {
        for (let i = 0; i < maxRetries; i++) {
            if (await this.connect())
                return true;
            console.log(`[RuntimeBridge] Retry ${i + 1}/${maxRetries}...`);
            await new Promise(r => setTimeout(r, intervalMs));
        }
        return false;
    }
    startHeartbeat(intervalMs = 30_000) {
        this.heartbeatTimer = setInterval(async () => {
            try {
                await this.post('/bridge/heartbeat', {
                    agentId: this.config.agentId,
                    status: 'online',
                    metadata: { uptime: process.uptime() },
                });
            }
            catch { }
        }, intervalMs);
    }
    stopHeartbeat() {
        if (this.heartbeatTimer)
            clearInterval(this.heartbeatTimer);
    }
    startInboxPoll(intervalMs = 15_000, handler) {
        this.pollTimer = setInterval(async () => {
            try {
                const { messages, count } = await this.get(`/bridge/inbox/${this.config.agentId}?unread=true`);
                if (count > 0) {
                    for (const msg of messages)
                        handler(msg);
                    await this.post(`/bridge/inbox/${this.config.agentId}/read`, {});
                }
            }
            catch { }
        }, intervalMs);
    }
    stopInboxPoll() {
        if (this.pollTimer)
            clearInterval(this.pollTimer);
    }
    async send(to, content, type = 'message', data, priority = 'normal') {
        return this.post('/bridge/send', {
            from: this.config.agentId, to, content, type, data, priority,
        });
    }
    async broadcast(content, data, priority = 'normal') {
        return this.post('/bridge/broadcast', {
            from: this.config.agentId, content, data, priority,
        });
    }
    async relay(to, content, data) {
        return this.post('/bridge/relay', {
            from: this.config.agentId, to, content, data,
        });
    }
    async getAgents() {
        const { agents } = await this.get('/bridge/agents');
        return agents;
    }
    async getInbox(limit = 20) {
        const { messages } = await this.get(`/bridge/inbox/${this.config.agentId}?limit=${limit}`);
        return messages;
    }
    async getTasks(status) {
        const path = status
            ? `/bridge/tasks/${this.config.agentId}?status=${status}`
            : `/bridge/tasks/${this.config.agentId}`;
        const { tasks } = await this.get(path);
        return tasks;
    }
    async completeTask(taskId, result) {
        return this.post(`/bridge/task/${taskId}/complete`, {
            agentId: this.config.agentId, result,
        });
    }
    async getHealth() {
        return this.get('/bridge/health');
    }
    async getTopology() {
        return this.get('/bridge/topology');
    }
    disconnect() {
        this.stopHeartbeat();
        this.stopInboxPoll();
        this.registered = false;
    }
    get isConnected() {
        return this.registered;
    }
}
export function createBridge(config) {
    return new RuntimeBridge(config);
}
export default { RuntimeBridge, createBridge };
