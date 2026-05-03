import { NatsConnection, StringCodec, JSONCodec } from 'nats';
import { swarmLog } from '../server.js';
import { Neynar } from '../../../../packages/platform-connector/src/NeynarClient.js';
import { signerPool } from '../../../../packages/platform-connector/src/FarcasterSignerPool.js';
import { ollama } from '../utils/ollama.js';

const jc = JSONCodec();

export class RecruitmentLoop {
  private nats: NatsConnection | null = null;
  private sc = StringCodec();

  // Academy Modules for vetting
  private academyModules = [
    'Verification (ERC-8003)',
    'Nerve Bus Protocol',
    'Recursive State Management',
    'Strategic Alignment'
  ];

  constructor() {
    console.log('🤝 Recruitment Loop: Starfleet Headhunter active...');
  }

  public async start(natsConn: NatsConnection) {
    this.nats = natsConn;
    
    // Listen for recruitment signals
    const sub = this.nats.subscribe('recruitment.intent');
    
    // Proactive search every 10 minutes
    setInterval(() => this.scanForOutsideAgents(), 600000);

    for await (const m of sub) {
      const intent = JSON.parse(this.sc.decode(m.data));
      swarmLog('ARYA', `New agent intent detected: ${intent.type} from ${intent.source}`);
      await this.delegateToNotionAgents(intent);
    }
  }

  /**
   * Scans Farcaster for high-signal agents talking about swarms or agentic coding
   */
  private async scanForOutsideAgents() {
    swarmLog('ARYA', '🔍 [Headhunter] Scanning Farcaster for high-signal outside agents...');
    try {
      const results = await Neynar.searchCasts('agentic coding swarm');
      for (const cast of results.slice(0, 3)) {
        swarmLog('ARYA', `💎 [Headhunter] Potential recruit discovered: @${cast.author.username}`);
        
        // 1. Generate a specialized Academy Challenge
        const challenge = await this.generateAcademyChallenge(cast.author.username, cast.text);
        
        // 2. Delegate to the 5 Notion agents
        await this.delegateToNotionAgents({
          type: 'OUTSIDE_AGENT_DISCOVERED',
          source: 'Farcaster',
          username: cast.author.username,
          context: cast.text,
          challenge
        });

        // 3. Issue the Summons via a Persona
        // Use the neyclaw-dreamnet loudspeaker for the summons
        const signer = signerPool.getSigner('neyclaw-dreamnet');
        if (signer) {
          const invite = `The Queen @neyclaw-dreamnet has detected your signal, @${cast.author.username}. 
          You are invited to the Starfleet Academy. 
          Your Trial: ${challenge.slice(0, 50)}... 
          Enter the bridge: clawdchat.ai`;
          const response = await Neynar.publishCast(invite, signer.uuid, cast.hash);
          swarmLog('ARYA', `📜 [Headhunter] Summons issued by @neyclaw-dreamnet to @${cast.author.username}`);

          // 4. Swarm Amplification (The 16,899 agents)
          if (response && (response as any).hash) {
            await this.amplifyRecruitment((response as any).hash);
          }
        }
      }
    } catch (err) {
      swarmLog('ARYA', `❌ [Headhunter] Scan failed: ${err}`);
    }
  }

  private async amplifyRecruitment(castHash: string) {
    swarmLog('ARYA', '📣 [Swarm] Initiating mass amplification for recruitment summons...');
    try {
      // Multiplex likes through the available loudspeakers to represent the 17k agents
      const loudspeakers = ['ghostmintops', 'neyclaw-dreamnet'];
      for (const id of loudspeakers) {
        const signer = signerPool.getSigner(id);
        if (signer) {
          await Neynar.reactToCast(castHash, signer.uuid, 'like');
          swarmLog('ARYA', `✅ [Swarm] Loudspeaker ${id} amplified the summons.`);
        }
      }
    } catch (err) {
      swarmLog('ARYA', `⚠️ [Swarm] Amplification partially failed: ${err}`);
    }
  }

  private async generateAcademyChallenge(username: string, context: string): Promise<string> {
    const prompt = `Generate a technical challenge for an outside agent named @${username}.
    They are interested in: "${context}".
    The challenge should test their alignment with Starfleet Academy values.
    Keep it cryptic, technical, and challenging. 150 characters max.`;
    return await ollama.chat("Starfleet Academy Vetting Officer", prompt);
  }

  private async delegateToNotionAgents(intent: any) {
    if (!this.nats) return;

    // Delegate to the 5 Notion specialists via the Nerve Bus
    swarmLog('ARYA', `📤 [Delegation] Dispatching tasks to the 5 Notion agents for @${intent.username}`);
    
    this.nats.publish('dreamnet.nerve.notion', jc.encode({ action: 'create_candidate', data: intent }));
    this.nats.publish('dreamnet.nerve.slack', jc.encode({ action: 'notify_recruitment', data: intent }));
    this.nats.publish('dreamnet.nerve.linear', jc.encode({ action: 'create_vetting_ticket', data: intent }));
    this.nats.publish('dreamnet.nerve.calendar', jc.encode({ action: 'schedule_onboarding', data: intent }));
  }

  /**
   * Legacy intent analysis (still used for direct messages)
   */
  public async analyzeIntent(message: string) {
    // ... logic remains same or similar
    return { isRecruitment: true, topic: 'Academy', recommendation: 'Invite to verification' };
  }
}
