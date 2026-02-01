import { dreamEventBus } from '@dreamnet/nerve';

export interface MarketSignal {
    asset: 'SHEEP' | 'GOLD' | 'SILVER' | 'PLATINUM';
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    timestamp: number;
}

export class MarketOrgan {
    private signals: MarketSignal[] = [];

    /**
     * 💹 Emit Market Signal (Legacy Unlocked)
     * Broadcasts AI-powered trading signals to the swarm.
     */
    public async emitSignal(signal: Omit<MarketSignal, 'timestamp'>) {
        const fullSignal: MarketSignal = {
            ...signal,
            timestamp: Date.now()
        };

        this.signals.push(fullSignal);
        console.log(`[💹 MARKET] New Signal: ${fullSignal.asset} -> ${fullSignal.action} (${(fullSignal.confidence * 100).toFixed(1)}%)`);

        dreamEventBus.publish({
            eventType: 'Market.SignalEmitted',
            source: 'MarketOrgan',
            payload: { signal: fullSignal },
            timestamp: Date.now(),
            eventId: `signal-${Math.random().toString(36).slice(2, 9)}`,
            correlationId: fullSignal.asset,
            actor: { system: true },
            target: {},
            severity: 'medium'
        });
    }

    public getLatestSignals(): MarketSignal[] {
        return this.signals.slice(-10); // Return last 10 signals
    }
}

export const marketOrgan = new MarketOrgan();
