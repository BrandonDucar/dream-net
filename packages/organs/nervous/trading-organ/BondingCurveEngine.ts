import { EventEmitter } from 'events';
import { treasuryAuditService } from './../../nervous-subsystem/TreasuryAuditService.js';

export interface BondingCurveState {
    supply: number;
    reserve: number;
    price: number;
    slope: number;
}

 * Uses a linear bonding curve model: Price = Slope * Supply.
 */
export const SHEEP_TOKEN_ADDRESS = '0x2896BdB9455e8e5C4a72634E27990ff7532CbC07';

export class BondingCurveEngine extends EventEmitter {
    private static instance: BondingCurveEngine;
    private curves: Map<string, BondingCurveState> = new Map();

    private constructor() {
        super();
        this.initializeCurve('SHEEP', 0.0001); // Initial slope for $SHEEP
        console.log("📈 [BondingCurveEngine] Initialized logic for Agentic Economics and $SHEEP curve.");
    }

    public static getInstance(): BondingCurveEngine {
        if (!BondingCurveEngine.instance) {
            BondingCurveEngine.instance = new BondingCurveEngine();
        }
        return BondingCurveEngine.instance;
    }

    /**
     * initializeCurve
     * Sets up a new bonding curve for an agent-led token.
     */
    public initializeCurve(tokenId: string, slope: number = 0.001) {
        this.curves.set(tokenId, {
            supply: 0,
            reserve: 0,
            price: 0,
            slope
        });
        console.log(`[📈 BONDING] Initialized curve for ${tokenId} with slope ${slope}`);
    }

    /**
     * calculatePurchaseReturn
     * How many tokens do I get for X amount of reserve currency?
     */
    public calculatePurchaseReturn(tokenId: string, amount: number): number {
        const curve = this.curves.get(tokenId);
        if (!curve) return 0;

        // Integral of P = m * S is Area = 0.5 * m * S^2
        // We want to find Delta S such that Area(S+Delta S) - Area(S) = Amount
        // 0.5 * m * (S_new^2 - S_old^2) = amount
        // S_new = sqrt(2 * amount / m + S_old^2)
        const newSupply = Math.sqrt(2 * amount / curve.slope + Math.pow(curve.supply, 2));
        return newSupply - curve.supply;
    }

    /**
     * buy
     * Execute a purchase against the curve.
     */
    public buy(tokenId: string, amount: number, agentId: string): number {
        const curve = this.curves.get(tokenId);
        if (!curve) return 0;

        const tokensMinted = this.calculatePurchaseReturn(tokenId, amount);
        curve.supply += tokensMinted;
        curve.reserve += amount;
        curve.price = curve.slope * curve.supply;

        console.log(`[💰 BUY] ${agentId} bought ${tokensMinted.toFixed(4)} ${tokenId} for ${amount} reserve.`);

        treasuryAuditService.logTransaction({
            agentId,
            chain: 'Base',
            action: 'BONDING_BUY',
            params: { tokenId, amount, tokensMinted },
            status: 'SUCCESS'
        });

        this.emit('BOND_BOUGHT', { tokenId, agentId, tokensMinted, price: curve.price });
        return tokensMinted;
    }

    /**
     * sell
     * Execute a burned sale against the curve.
     */
    public sell(tokenId: string, tokens: number, agentId: string): number {
        const curve = this.curves.get(tokenId);
        if (!curve || curve.supply < tokens) return 0;

        // Area released = Area(S_old) - Area(S_new)
        // 0.5 * m * (S_old^2 - S_new^2)
        const newSupply = curve.supply - tokens;
        const reserveReleased = 0.5 * curve.slope * (Math.pow(curve.supply, 2) - Math.pow(newSupply, 2));

        curve.supply = newSupply;
        curve.reserve -= reserveReleased;
        curve.price = curve.slope * curve.supply;

        console.log(`[💸 SELL] ${agentId} sold ${tokens.toFixed(4)} ${tokenId} for ${reserveReleased.toFixed(4)} reserve.`);

        treasuryAuditService.logTransaction({
            agentId,
            chain: 'Base',
            action: 'BONDING_SELL',
            params: { tokenId, tokens, reserveReleased },
            status: 'SUCCESS'
        });

        this.emit('BOND_SOLD', { tokenId, agentId, reserveReleased, price: curve.price });
        return reserveReleased;
    }

    public getState(tokenId: string): BondingCurveState | undefined {
        return this.curves.get(tokenId);
    }
}

export const bondingCurveEngine = BondingCurveEngine.getInstance();
