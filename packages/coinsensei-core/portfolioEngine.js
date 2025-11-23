/**
 * Portfolio Analytics Engine
 * Computes WAC/FIFO, PnL, allocation, rankings
 *
 * SECURITY: READ_ONLY = true
 * - Only processes public wallet addresses and transaction data
 * - NEVER touches private keys, seeds, or mnemonics
 * - Returns analytics only - no transaction capabilities
 */
import { PriceProvider } from './priceProvider';
export class PortfolioEngine {
    config;
    priceProvider;
    constructor(config) {
        this.config = {
            quote_currency: config?.quote_currency || 'USD',
            cost_basis_method: config?.cost_basis_method || 'WAC',
            concentration_warn_threshold: config?.concentration_warn_threshold || 25,
            geo_default: config?.geo_default || 'Maryland',
            read_only: config?.read_only !== false,
            price_sources: config?.price_sources || ['coingecko'],
        };
        this.priceProvider = new PriceProvider();
    }
    async computePortfolio(manualEntries, cexTransactions = [], userPrices) {
        // Combine all trades
        const allTrades = this.combineTrades(manualEntries, cexTransactions);
        // Group by token
        const tokenGroups = this.groupByToken(allTrades);
        // Fetch prices
        const tokenIds = Array.from(tokenGroups.keys()).map(symbol => PriceProvider.getCoinGeckoId(symbol));
        const prices = await this.priceProvider.getPrices(tokenIds);
        // Compute positions
        const positions = [];
        let totalValue = 0;
        let totalCostBasis = 0;
        let totalPnLUnrealized = 0;
        let totalPnLRealized = 0;
        for (const [token, trades] of tokenGroups.entries()) {
            const tokenId = PriceProvider.getCoinGeckoId(token);
            const priceData = prices.get(tokenId);
            const currentPrice = userPrices?.get(token) || priceData?.price || 0;
            if (currentPrice === 0)
                continue;
            const position = this.computePosition(token, trades, currentPrice, priceData?.source || 'user');
            positions.push(position);
            totalValue += position.total_value;
            totalCostBasis += position.cost_basis;
            totalPnLUnrealized += position.pnl_unrealized;
            totalPnLRealized += position.pnl_realized;
        }
        // Calculate allocations
        positions.forEach(pos => {
            pos.allocation_pct = (pos.total_value / totalValue) * 100;
        });
        // Generate summary
        const summary = this.generateSummary(positions, totalValue, totalCostBasis, totalPnLUnrealized, totalPnLRealized);
        return { positions, summary };
    }
    combineTrades(manualEntries, cexTransactions) {
        const trades = [];
        // Add manual entries as buys
        for (const entry of manualEntries) {
            trades.push({
                date: typeof entry.buy_date === 'string' ? new Date(entry.buy_date) : entry.buy_date,
                type: 'buy',
                amount: entry.amount,
                price: entry.buy_price,
            });
        }
        // Add CEX transactions
        for (const tx of cexTransactions) {
            if (tx.type === 'buy' || tx.type === 'sell') {
                trades.push({
                    date: typeof tx.date === 'string' ? new Date(tx.date) : tx.date,
                    type: tx.type,
                    amount: tx.amount,
                    price: tx.price || 0,
                });
            }
        }
        // Sort by date
        return trades.sort((a, b) => {
            const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
            const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
            return dateA.getTime() - dateB.getTime();
        });
    }
    groupByToken(trades) {
        const groups = new Map();
        // Note: In real implementation, you'd need token symbol from the trade
        // For now, assuming trades have token info
        for (const trade of trades) {
            const token = trade.token || 'UNKNOWN';
            if (!groups.has(token)) {
                groups.set(token, []);
            }
            groups.get(token).push(trade);
        }
        return groups;
    }
    computePosition(token, trades, currentPrice, priceSource) {
        let amount = 0;
        let costBasis = 0;
        let realizedPnL = 0;
        const buyTrades = [];
        const sellTrades = [];
        // Process trades
        for (const trade of trades) {
            if (trade.type === 'buy') {
                amount += trade.amount;
                costBasis += trade.amount * trade.price;
                buyTrades.push(trade);
            }
            else if (trade.type === 'sell') {
                const sellValue = trade.amount * trade.price;
                const avgCost = costBasis / amount;
                const pnl = (trade.price - avgCost) * trade.amount;
                realizedPnL += pnl;
                costBasis -= avgCost * trade.amount;
                amount -= trade.amount;
                sellTrades.push({ ...trade, pnl });
            }
        }
        const avgCostWAC = amount > 0 ? costBasis / amount : 0;
        const avgCostFIFO = this.computeFIFO(buyTrades, sellTrades);
        const totalValue = amount * currentPrice;
        const unrealizedPnL = totalValue - costBasis;
        const winLossRatio = this.computeWinLossRatio(buyTrades, sellTrades);
        return {
            token,
            symbol: token,
            amount,
            avg_cost_wac: avgCostWAC,
            avg_cost_fifo: avgCostFIFO,
            current_price: currentPrice,
            price_source: priceSource,
            total_value: totalValue,
            cost_basis: costBasis,
            pnl_unrealized: unrealizedPnL,
            pnl_realized: realizedPnL,
            allocation_pct: 0, // Set later
            win_loss_ratio: winLossRatio,
            first_buy_date: buyTrades[0]?.date,
            last_trade_date: trades[trades.length - 1]?.date,
            trades: [...buyTrades, ...sellTrades],
        };
    }
    computeFIFO(buyTrades, sellTrades) {
        // Simplified FIFO - in production, track individual lots
        let remainingBuys = [...buyTrades];
        let totalCost = 0;
        let totalAmount = 0;
        for (const sell of sellTrades) {
            let sellAmount = sell.amount;
            while (sellAmount > 0 && remainingBuys.length > 0) {
                const buy = remainingBuys[0];
                if (buy.amount <= sellAmount) {
                    totalCost += buy.amount * buy.price;
                    totalAmount += buy.amount;
                    sellAmount -= buy.amount;
                    remainingBuys.shift();
                }
                else {
                    totalCost += sellAmount * buy.price;
                    totalAmount += sellAmount;
                    buy.amount -= sellAmount;
                    sellAmount = 0;
                }
            }
        }
        // Add remaining buys
        for (const buy of remainingBuys) {
            totalCost += buy.amount * buy.price;
            totalAmount += buy.amount;
        }
        return totalAmount > 0 ? totalCost / totalAmount : 0;
    }
    computeWinLossRatio(buyTrades, sellTrades) {
        if (sellTrades.length === 0)
            return 0;
        let wins = 0;
        let losses = 0;
        const avgBuyPrice = buyTrades.reduce((sum, t) => sum + t.price, 0) / buyTrades.length;
        for (const sell of sellTrades) {
            if (sell.price > avgBuyPrice) {
                wins++;
            }
            else {
                losses++;
            }
        }
        return losses > 0 ? wins / losses : wins;
    }
    generateSummary(positions, totalValue, totalCostBasis, totalPnLUnrealized, totalPnLRealized) {
        const totalPnL = totalPnLUnrealized + totalPnLRealized;
        const roiPct = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
        // Rank positions
        const sortedByValue = [...positions].sort((a, b) => b.total_value - a.total_value);
        const sortedByROI = [...positions].sort((a, b) => {
            const roiA = a.cost_basis > 0 ? (a.pnl_unrealized / a.cost_basis) * 100 : 0;
            const roiB = b.cost_basis > 0 ? (b.pnl_unrealized / b.cost_basis) * 100 : 0;
            return roiB - roiA;
        });
        const topHoldings = sortedByValue.slice(0, 5);
        const bestPerformers = sortedByROI.slice(0, 3);
        const worstPerformers = sortedByROI.slice(-3).reverse();
        const concentrationWarnings = positions.filter(p => p.allocation_pct >= this.config.concentration_warn_threshold);
        const summaryText = this.generateSummaryText(totalValue, totalPnL, roiPct, positions.length, topHoldings);
        return {
            total_value: totalValue,
            total_cost_basis: totalCostBasis,
            total_pnl_unrealized: totalPnLUnrealized,
            total_pnl_realized: totalPnLRealized,
            total_pnl: totalPnL,
            roi_pct: roiPct,
            token_count: positions.length,
            top_holdings: topHoldings,
            worst_performers: worstPerformers,
            best_performers: bestPerformers,
            concentration_warnings: concentrationWarnings,
            summary_text: summaryText,
        };
    }
    generateSummaryText(totalValue, totalPnL, roiPct, tokenCount, topHoldings) {
        const pnlSign = totalPnL >= 0 ? '+' : '';
        const topTokens = topHoldings.map(p => p.symbol).join(', ');
        return `Portfolio valued at $${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with ${pnlSign}$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pnlSign}${roiPct.toFixed(2)}%) total P&L across ${tokenCount} tokens. Top holdings: ${topTokens}.`;
    }
}
