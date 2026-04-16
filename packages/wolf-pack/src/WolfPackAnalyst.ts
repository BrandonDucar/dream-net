import { dreamEventBus } from '../../nerve/src/spine/dreamnet-event-bus/DreamEventBus';
import { blackboardLogger } from '../../nerve/src/spine/utils/BlackboardLogger';

export type PartnerFeedback = {
  partnerId: string;
  emailHash: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'REJECTED';
  intent: 'FOLLOW_UP' | 'CALENDAR_INVITE' | 'TECHNICAL_INQUIRY' | 'SPAM';
  rawSnippet: string;
};

/**
 * 🐺 WolfPackAnalyst
 * Role: Categorizes incoming partner feedback and updates the SSoT.
 * Logic: Triggered by InboxSquared.EmailReceived.
 */
export class WolfPackAnalyst {
  constructor() {
    this.init();
  }

  private init() {
    console.log('🐺 [WolfPackAnalyst] Analyst online. Scenting incoming feedback...');

    dreamEventBus.subscribe('InboxSquared.EmailReceived', async (event) => {
      const { from, subject, snippet } = event.payload;
      console.log(`🐺 [WolfPackAnalyst] Analyzing email from: ${from} | Subject: ${subject}`);

      // LLM-based Categorization Logic (Simulated for Now)
      const feedback = this.categorize(from, snippet);

      // Update Blackboard
      await blackboardLogger.logOutreach(feedback.partnerId, `REPLY: ${feedback.intent}`, feedback.sentiment);

      // Broadcast the insight
      dreamEventBus.publish(dreamEventBus.createEnvelope(
        'WolfPack.InsightGenerated',
        'WolfPackAnalyst',
        feedback,
        { severity: feedback.sentiment === 'POSITIVE' ? 'high' : 'low' }
      ));
    });
  }

  private categorize(from: string, snippet: string): PartnerFeedback {
    const text = snippet.toLowerCase();
    let sentiment: PartnerFeedback['sentiment'] = 'NEUTRAL';
    let intent: PartnerFeedback['intent'] = 'TECHNICAL_INQUIRY';

    if (text.includes('interested') || text.includes('meeting') || text.includes('calendar')) {
      sentiment = 'POSITIVE';
      intent = 'FOLLOW_UP';
    } else if (text.includes('unsubscribe') || text.includes('remove') || text.includes('stop')) {
      sentiment = 'REJECTED';
      intent = 'SPAM';
    }

    return {
      partnerId: from,
      emailHash: '0x_hash_' + from.slice(0, 5),
      sentiment,
      intent,
      rawSnippet: snippet.slice(0, 100)
    };
  }
}
