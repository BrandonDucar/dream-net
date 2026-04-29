import { NatsConnection, StringCodec } from 'nats';
import { swarmLog } from '../server.js';

export class SynergyLoop {
  private nats: NatsConnection | null = null;
  private sc = StringCodec();

  constructor() {
    console.log('🤝 Synergy Loop: Ready to coordinate with Hawk...');
  }

  public async start(natsConn: NatsConnection) {
    this.nats = natsConn;
    
    // Subscribe to raw signals from Hawk
    const sub = this.nats.subscribe('hawk.signals.raw');
    console.log('🤝 Synergy Loop: Subscribed to hawk.signals.raw');

    for await (const m of sub) {
      const signal = JSON.parse(this.sc.decode(m.data));
      await this.processSynergy(signal);
    }
  }

  private async processSynergy(signal: any) {
    const { type, score, data } = signal;
    
    // ARYA LOGIC: If Hawk finds a high-conviction signal, Arya might execute a "Protect" or "Slay" action
    if (score > 0.8) {
      swarmLog('ARYA', `Hawk found a high-value target (${type}). Analyzing for execution...`);
      
      // Coordinate with Agent Wallet Manager for possible on-chain action
      // Or trigger a social roast if it's a "bad actor" pattern
    }
  }
}
