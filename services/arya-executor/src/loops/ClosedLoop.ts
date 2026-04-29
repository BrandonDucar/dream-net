import { connect, NatsConnection, StringCodec } from 'nats';
import { swarmLog } from '../server.js';

export class ClosedLoop {
  private nats: NatsConnection | null = null;
  private sc = StringCodec();

  constructor() {
    console.log('🔒 Closed Loop: Monitoring direct mentions...');
  }

  public async start(natsConn: NatsConnection) {
    this.nats = natsConn;
    
    // Subscribe to direct mentions forwarded by Hawk
    const sub = this.nats.subscribe('farcaster.mentions');
    console.log('🔒 Closed Loop: Subscribed to farcaster.mentions');

    for await (const m of sub) {
      const data = JSON.parse(this.sc.decode(m.data));
      await this.handleMention(data);
    }
  }

  private async handleMention(data: any) {
    const { author, text, hash } = data;
    console.log(`🔒 Closed Loop: Processing mention from ${author}: "${text}"`);
    
    // ARYA LOGIC: Roasting or Replying based on emotion
    // This is where the actual LLM call or rule-based logic would go
    // For now, we simulate a response
    
    const response = `Arya's steel is cold today, ${author}. But I have heard your message.`;
    console.log(`🗡️ Arya replies: ${response}`);
    
    // Publish response back to bus for social-poster to pick up
    if (this.nats) {
      this.nats.publish('social.post', this.sc.encode(JSON.stringify({
        target: 'farcaster',
        replyTo: hash,
        text: response
      })));
    }
  }
}
