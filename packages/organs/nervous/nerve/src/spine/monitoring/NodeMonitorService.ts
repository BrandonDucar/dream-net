import { EventEmitter } from 'events';

export interface NodeStatus {
    id: string;
    type: 'lava' | 'pocket' | 'custom';
    status: 'online' | 'offline' | 'degrading';
    uptimeSec: number;
    earnings: number;
    lastHeartbeat: number;
}

export class NodeMonitorService extends EventEmitter {
    private nodes: Map<string, NodeStatus> = new Map();

    constructor() {
        super();
        // Pre-populate with some mock nodes for the dashboard
        this.nodes.set('lava-001', {
            id: 'lava-001',
            type: 'lava',
            status: 'online',
            uptimeSec: 86400 * 7.2, // 7.2 days
            earnings: 124.5,
            lastHeartbeat: Date.now() / 1000
        });
        this.nodes.set('pocket-001', {
            id: 'pocket-001',
            type: 'pocket',
            status: 'online',
            uptimeSec: 86400 * 3.5,
            earnings: 42.8,
            lastHeartbeat: Date.now() / 1000
        });
    }

    public getAllNodes(): NodeStatus[] {
        return Array.from(this.nodes.values());
    }

    public registerNode(id: string, type: 'lava' | 'pocket' | 'custom') {
        this.nodes.set(id, {
            id,
            type,
            status: 'online',
            uptimeSec: 0,
            earnings: 0,
            lastHeartbeat: Date.now() / 1000
        });
        this.emit('node_registered', id);
    }

    public updateHeartbeat(id: string, earningsInc: number = 0) {
        const node = this.nodes.get(id);
        if (node) {
            node.status = 'online';
            node.lastHeartbeat = Date.now() / 1000;
            node.earnings += earningsInc;
            node.uptimeSec += 60; // Assuming 1 min intervals
        }
    }
}

export const nodeMonitorService = new NodeMonitorService();
