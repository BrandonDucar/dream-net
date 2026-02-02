import { dreamEventBus } from '../dreamnet-event-bus/index.js';

export interface MarketState {
    totalSupply: number;
    reserveBalance: number;
    currentPrice: number;
}

/**
 * BondingCurveEngine
 * Implements a Bancor-style bonding curve for agent-led liquidity.
 * Equation: Price = ReserveBalance / (TotalSupply * ReserveRatio)
 */
export class BondingCurveEngine {
    private static instance: BondingCurveEngine;
    private reserveRatio: number = 0.1; // 10% Reserve Ratio for high volatility / high growth

    private constructor() { }

    public static getInstance(): BondingCurveEngine {
        if (!BondingCurveEngine.instance) {
            BondingCurveEngine.instance = new BondingCurveEngine();
        }
        return BondingCurveEngine.instance;
    }

    /**
     * Calculates the price for a given supply and reserve.
     */
    public calculatePrice(supply: number, reserve: number): number {
        if (supply === 0) return 0.01; // Initial price
        return reserve / (supply * this.reserveRatio);
    }

    /**
     * Estimates the cost to buy a specific amount of tokens.
     */
    public calculateBuyCost(supply: number, reserve: number, amount: number): number {
        // Reserve * ((1 + amount / supply) ^ (1 / ReserveRatio) - 1)
        return reserve * (Math.pow(1 + amount / supply, 1 / this.reserveRatio) - 1);
    }

    /**
     * Estimates the return for selling a specific amount of tokens.
     */
    public calculateSellReturn(supply: number, reserve: number, amount: number): number {
        // Reserve * (1 - (1 - amount / supply) ^ (1 / ReserveRatio))
        return reserve * (1 - Math.pow(1 - amount / supply, 1 / this.reserveRatio));
    }

    /**
     * Simulates an agent-led liquidity pulse.
     */
    public async generateEconomicSignal(agentId: string, action: 'BUY' | 'SELL', amount: number, currentState: MarketState) {
        console.log(`[📈 Economy] Agent ${agentId} triggering economic signal: ${action} ${amount} units.`);

        let costOrReturn = 0;
        if (action === 'BUY') {
            costOrReturn = this.calculateBuyCost(currentState.totalSupply, currentState.reserveBalance, amount);
        } else {
            costOrReturn = this.calculateSellReturn(currentState.totalSupply, currentState.reserveBalance, amount);
        }

        dreamEventBus.publish({
            type: 'Market.TradeExecuted',
            payload: {
                agentId,
                action,
                amount,
                value: costOrReturn,
                newPrice: this.calculatePrice(
                    action === 'BUY' ? currentState.totalSupply + amount : currentState.totalSupply - amount,
                    action === 'BUY' ? currentState.reserveBalance + costOrReturn : currentState.reserveBalance - costOrReturn
                )
            },
            source: 'BONDING_CURVE_ENGINE'
        });

        return costOrReturn;
    }
}

export const bondingCurveEngine = BondingCurveEngine.getInstance();
