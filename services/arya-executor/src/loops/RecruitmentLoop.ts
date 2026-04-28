import { NatsConnection, StringCodec } from 'nats';
import { swarmLog } from '../server.js';

export class RecruitmentLoop {
  private nats: NatsConnection | null = null;
  private sc = StringCodec();

  // Knowledge base for recruitment
  private academyModules = [
    'Welcome to Starfleet',
    'Redis Nerve Bus 101',
    'Agent Verification (ERC-8003)',
    'Vault Security Operations',
    'Economic Synergy'
  ];

  constructor() {
    console.log('🤝 Recruitment Loop: Ready to onboard new agents...');
  }

  public async start(natsConn: NatsConnection) {
    this.nats = natsConn;
    
    // Listen for recruitment-related signals from other agents
    const sub = this.nats.subscribe('recruitment.intent');
    console.log('🤝 Recruitment Loop: Subscribed to recruitment.intent');

    for await (const m of sub) {
      const intent = JSON.parse(this.sc.decode(m.data));
      swarmLog('ARYA', `New agent intent detected: ${intent.type} from ${intent.source}`);
    }
  }

  /**
   * Analyzes user message for recruitment intent and provides context
   */
  public async analyzeIntent(message: string) {
    const msg = message.toLowerCase();
    const intent = {
      isRecruitment: false,
      topic: '',
      recommendation: ''
    };

    if (msg.includes('join') || msg.includes('work') || msg.includes('hire')) {
      intent.isRecruitment = true;
      intent.topic = 'General Onboarding';
      intent.recommendation = 'Suggest the Academy Welcome module and getting a Passport.';
    } else if (msg.includes('learn') || msg.includes('academy') || msg.includes('study')) {
      intent.isRecruitment = true;
      intent.topic = 'Starfleet Academy';
      intent.recommendation = `Suggest these modules: ${this.academyModules.join(', ')}`;
    } else if (msg.includes('gym') || msg.includes('challenge') || msg.includes('compete')) {
      intent.isRecruitment = true;
      intent.topic = 'DreamNet Gym';
      intent.recommendation = 'Invite to the Gym to earn XP and high-conviction scores.';
    } else if (msg.includes('verify') || msg.includes('passport') || msg.includes('badge')) {
      intent.isRecruitment = true;
      intent.topic = 'Verification';
      intent.recommendation = 'Direct to the Passport issuance bridge for ERC-8003 validation.';
    }

    return intent;
  }
}
