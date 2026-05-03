import { connect, type NatsConnection } from 'nats';

export class NatsService {
    public connection: NatsConnection | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            const server = process.env.NATS_URL || 'localhost:4222';
            this.connection = await connect({ servers: server });
            console.log(`📡 [NatsService] Connected to NATS at ${server}`);
        } catch (err) {
            console.error(`❌ [NatsService] Connection failed:`, err);
        }
    }

    public async publish(subject: string, data: any) {
        if (!this.connection) return;
        const sc = new TextEncoder();
        this.connection.publish(subject, sc.encode(JSON.stringify(data)));
    }
}

export const natsService = new NatsService();
