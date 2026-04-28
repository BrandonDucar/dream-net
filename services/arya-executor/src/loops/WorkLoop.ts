import { NatsConnection, StringCodec } from 'nats';
import { swarmLog } from '../server.js';
import { ollama } from '../utils/ollama.js';

export class WorkLoop {
  private nats: NatsConnection | null = null;
  private sc = StringCodec();
  private isWorking = false;

  constructor() {
    console.log('👷 Work Loop: Ready to build DreamNet...');
  }

  public async start(natsConn: NatsConnection) {
    this.nats = natsConn;
    
    // Subscribe to task assignments
    const sub = this.nats.subscribe('dream.task.assigned');
    console.log('👷 Work Loop: Subscribed to dream.task.assigned');

    // Also run a periodic "Self-Assigned" check
    setInterval(() => this.checkCortexForWork(), 60000); // Every minute

    for await (const m of sub) {
      const task = JSON.parse(this.sc.decode(m.data));
      this.performTask(task);
    }
  }

  private async checkCortexForWork() {
    if (this.isWorking) return;
    
    // In a real implementation, this would fetch from the Control Core API
    // For now, we simulate a "Sovereign Work" pulse
    swarmLog('ARYA', 'Scanning the Cortex for unclaimed dreams...');
  }

  private async performTask(task: any) {
    this.isWorking = true;
    swarmLog('ARYA', `Accepting task: ${task.title}. Initiating work sequence...`);

    try {
      const systemPrompt = `You are Arya Stark at work. You are a developer and architect for DreamNet.
      Task: ${task.title}
      Description: ${task.description}
      Current status: ${task.status}
      
      Provide a "Thinking" step for how you will solve this. Be technical and precise.`;

      const thought = await ollama.chat(systemPrompt, "What is your first step?");
      swarmLog('ARYA', `Thought: ${thought}`);

      // Publish progress back to the Nerve Bus
      if (this.nats) {
        this.nats.publish('dream.task.progress', this.sc.encode(JSON.stringify({
          taskId: task.id,
          agent: 'Arya',
          progress: 10,
          thought
        })));
      }

    } catch (err) {
      console.error('❌ Work Loop Error:', err);
    } finally {
      this.isWorking = false;
    }
  }
}
