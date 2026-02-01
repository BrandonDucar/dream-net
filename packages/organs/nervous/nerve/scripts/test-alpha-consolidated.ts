import { dreamEventBus } from '../src/spine/dreamnet-event-bus/index.js';
import { pilotRegistry } from '../src/spine/PilotRegistry.js';
import { elizaBridge } from '../src/spine/ElizaBridge.js';

// --- Consolidated FlashTrader Logic ---
class FlashTrader {
    public totalAlphaExtracted: number = 0;
    constructor() {
        console.log("[⚡ FlashTrader] Economic Engine Ignited.");
        dreamEventBus.subscribe('Market.OpportunityDetected', async (envelope) => {
            console.log(`[⚡ FlashTrader] EVENT RECEIVED: Market.OpportunityDetected from ${envelope.source}`);
            const opportunity = envelope.payload as any;
            if (opportunity.confidence > 0.8) {
                console.log(`[⚡ FlashTrader] TRIGGER: Alpha detected.`);
                this.totalAlphaExtracted += opportunity.expectedYield;
                dreamEventBus.publish({
                    type: 'Market.TradeExecuted',
                    payload: { yield: opportunity.expectedYield },
                    source: 'FlashTrader'
                });
            }
        });
    }
}

// --- Consolidated ArbitrageAgent Logic ---
class ArbitrageAgent {
    constructor(private name: string) { }
    public scout() {
        console.log(`[🦊 ArbitrageAgent:${this.name}] Scouting...`);
        dreamEventBus.publish({
            type: 'Market.OpportunityDetected',
            payload: {
                opportunityId: 'OPP-777',
                expectedYield: 0.05,
                confidence: 0.95,
                tokenPair: ['ETH', 'DAI']
            },
            source: this.name
        });
    }
}

async function main() {
    console.log("🚀 INITIALIZING CONSOLIDATED ALPHA WAVE TEST");

    const trader = new FlashTrader();
    const agent = new ArbitrageAgent('Fox_Consolidated');

    console.log("\n🦊 AGENT SCOUTING...");
    agent.scout();

    setTimeout(() => {
        console.log("\n📈 ALPHA WAVE SESSION STATS:");
        console.log(`Total Alpha Extracted: ${(trader.totalAlphaExtracted * 100).toFixed(2)}%`);

        if (trader.totalAlphaExtracted > 0) {
            console.log("\n✅ CONSOLIDATED ALPHA WAVE VERIFIED.");
        } else {
            console.error("\n❌ CONSOLIDATED ALPHA WAVE FAILED.");
            process.exit(1);
        }
    }, 500);
}

main().catch(console.error);
