import { EventEmitter } from 'events';

class AgentBus extends EventEmitter {
    private static instance: AgentBus;

    private constructor() {
        super();
        this.setMaxListeners(100);
    }

    public static getInstance(): AgentBus {
        if (!AgentBus.instance) {
            AgentBus.instance = new AgentBus();
        }
        return AgentBus.instance;
    }

    public broadcast(type: string, message: string, metadata: any = {}) {
        const payload = {
            type,
            message,
            metadata,
            timestamp: new Date().toISOString()
        };
        this.emit('message', payload);
        this.emit(type, payload); // Also emit specific type
    }

    public thought(agent: string, message: string) {
        this.broadcast('AGENT', `[${agent}] ${message}`, { agent });
    }

    public log(system: string, message: string) {
        this.broadcast('SYSTEM', `[${system}] ${message}`, { system });
    }
}

export const agentBus = AgentBus.getInstance();
