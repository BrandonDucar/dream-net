import { connect, type NatsConnection, JSONCodec, type JetStreamClient } from 'nats';
import { NERVE_BUS } from '@dreamnet/nerve';
import type { NerveEvent, NerveTransport } from '@dreamnet/nerve';

const jc = JSONCodec();

export class NatsService {
  private static instance: NatsService;
  private connection: NatsConnection | null = null;
  private js: JetStreamClient | null = null;

  private constructor() {}

  public static getInstance(): NatsService {
    if (!NatsService.instance) {
      NatsService.instance = new NatsService();
    }
    return NatsService.instance;
  }

  /**
   * Initialize NATS and JetStream
   */
  public async initialize(url: string = process.env.NATS_URL || 'nats://localhost:4222'): Promise<void> {
    try {
      console.log(`📡 [NATS] Connecting to ${url}...`);
      this.connection = await connect({ servers: url });
      this.js = this.connection.jetstream();
      
      console.log('✅ [NATS] Connected and JetStream initialized');

      // Register NATS as a transport for the Nerve Bus
      this.registerAsNerveTransport();
      
      // Setup default streams
      await this.ensureStreams();

    } catch (err) {
      console.error('❌ [NATS] Connection failed:', err);
      throw err;
    }
  }

  /**
   * Ensure core DreamNet streams exist
   */
  private async ensureStreams(): Promise<void> {
    if (!this.connection) return;
    const jsm = await this.connection.jetstreamManager();
    
    const streams = [
      { name: 'NERVE_EVENTS', subjects: ['dreamnet.nerve.>'] },
      { name: 'SYSTEM_METRICS', subjects: ['dreamnet.metrics.>'] },
      { name: 'AGENT_LOGS', subjects: ['dreamnet.agents.>'] },
      { name: 'MEMORY_SYNC', subjects: ['dreamnet.memory.>'] }
    ];

    for (const stream of streams) {
      try {
        await jsm.streams.add({ name: stream.name, subjects: stream.subjects });
        console.log(`📦 [NATS] Stream ${stream.name} ensured`);
      } catch (err: any) {
        if (err.message.includes('stream name already in use')) {
          // Already exists, ignore
        } else {
          console.warn(`⚠️ [NATS] Failed to create stream ${stream.name}:`, err.message);
        }
      }
    }
  }

  /**
   * Register NATS as a transport for the Nerve Bus
   */
  private registerAsNerveTransport(): void {
    const transport: NerveTransport = {
      name: 'nats-jetstream',
      send: async (event: NerveEvent) => {
        await this.publish(`dreamnet.nerve.${event.channelId}`, event);
      }
    };

    NERVE_BUS.registerTransport(transport);
    console.log('🧠 [NerveBus] NATS Transport registered');
  }

  /**
   * Publish a message to NATS
   */
  public async publish(subject: string, data: any): Promise<void> {
    if (!this.connection) return;
    this.connection.publish(subject, jc.encode(data));
  }

  /**
   * Subscribe to a NATS subject
   */
  public async subscribe(subject: string, callback: (data: any) => void): Promise<void> {
    if (!this.connection) {
      console.warn(`⚠️ [NATS] Cannot subscribe to ${subject}: Not connected`);
      return;
    }
    const sub = this.connection.subscribe(subject);
    (async () => {
      for await (const m of sub) {
        callback(jc.decode(m.data));
      }
    })();
  }

  /**
   * Shutdown NATS connection
   */
  public async shutdown(): Promise<void> {
    if (this.connection) {
      await this.connection.drain();
      this.connection = null;
      console.log('🔌 [NATS] Connection drained and closed');
    }
  }
}

export const natsService = NatsService.getInstance();
