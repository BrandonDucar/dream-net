import { Kafka, Producer } from 'kafkajs';
import { NerveTransport } from '../bus.js';
import { NerveEvent } from '../types.js';

/**
 * Kafka Transport - Routes Nerve Bus events to Kafka topics
 */
export class KafkaTransport implements NerveTransport {
  public name = 'KafkaTransport';
  private producer: Producer;
  private connected = false;

  constructor(brokers: string[]) {
    const kafka = new Kafka({
      clientId: 'dreamnet-nerve-bus',
      brokers: brokers,
    });
    this.producer = kafka.producer();
  }

  public async connect() {
    try {
      await this.producer.connect();
      this.connected = true;
      console.info('✅ [Nerve] Kafka Transport connected');
    } catch (err) {
      console.error('❌ [Nerve] Kafka Transport failed to connect:', err);
    }
  }

  public async send(event: NerveEvent): Promise<void> {
    if (!this.connected) return;

    try {
      await this.producer.send({
        topic: `dreamnet-telemetry-${event.channelId}`,
        messages: [
          {
            key: event.id,
            value: JSON.stringify(event),
          },
        ],
      });
    } catch (err) {
      console.error('❌ [Nerve] Failed to send event to Kafka:', err);
    }
  }

  public async disconnect() {
    await this.producer.disconnect();
    this.connected = false;
  }
}
