
// Simple in-memory event bus simulation for the Nervous System.

type Callback = (data: any) => void;

class NervousSystem {
    private subscribers: Record<string, Callback[]> = {};

    subscribe(channel: string, callback: Callback) {
        if (!this.subscribers[channel]) this.subscribers[channel] = [];
        this.subscribers[channel].push(callback);
    }

    publish(channel: string, data: any) {
        if (this.subscribers[channel]) {
            this.subscribers[channel].forEach(cb => cb(data));
        }
    }
}

const nerveCenter = new NervousSystem();

export class NeuralLink {

    constructor(private agentId: string) { }

    /**
     * Broadcasts a signal to the entire organism.
     */
    broadcast(signal: string, payload: any) {
        console.log(`⚡ [OmniSync] ${this.agentId} firing signal: ${signal}`);
        nerveCenter.publish(signal, { sender: this.agentId, payload });
    }

    /**
     * Listens for signals from the organism.
     */
    onSignal(signal: string, callback: (data: any) => void) {
        nerveCenter.subscribe(signal, callback);
        console.log(`👂 [OmniSync] ${this.agentId} listening for: ${signal}`);
    }
}
