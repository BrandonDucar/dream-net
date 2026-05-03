/**
 * @dreamnet/surge-x402 — Farcaster Engagement Engine (x402 Protocol)
 *
 * Programmatically purchases Farcaster likes/recasts via Surge Markets
 * using the x402 machine-to-machine payment protocol (USDC on Base).
 *
 * Flow:
 *   1. POST to https://x402.surge.markets/buy
 *   2. Server returns 402 Payment Required with USDC payment details
 *   3. @x402/fetch SDK auto-signs payment authorization on Base
 *   4. Server verifies, settles on-chain, delivers engagement
 *
 * Env vars:
 *   PRIVATE_KEY          — MetaMask wallet private key (has USDC on Base)
 *   SURGE_API_URL        — Surge API endpoint (default: https://x402.surge.markets)
 *   SURGE_MAX_BUDGET     — Max USDC per purchase (default: 5)
 *   SURGE_MIN_SCORE      — Min quality threshold 0-1 (default: 0.7)
 */
import { createBridge } from '../../nervous/runtime-bridge-core/index.js';
const bridge = createBridge({
    agentId: 'surge-x402',
    name: 'DreamNet Surge x402 Engine',
    type: 'sidecar',
    version: '1.0.0',
    capabilities: ['farcaster-engagement', 'x402-payments', 'likes', 'recasts', 'growth-engine'],
    metadata: { organ: 'endocrine', role: 'engagement-economics' },
});
// ─── Config ───────────────────────────────────────────────────────────────
const SURGE_API = process.env.SURGE_API_URL || 'https://x402.surge.markets';
const MAX_BUDGET = Number(process.env.SURGE_MAX_BUDGET) || 5;
const MIN_SCORE = Number(process.env.SURGE_MIN_SCORE) || 0.7;
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
// ─── Purchase History ─────────────────────────────────────────────────────
const purchaseHistory = [];
const activeCampaigns = new Map();
// ─── Core Functions ───────────────────────────────────────────────────────
export async function connect() {
    return bridge.connectWithRetry(10, 5_000);
}
/**
 * Buy Farcaster engagement for a cast via x402 protocol.
 * Requires @x402/fetch and viem to be installed.
 */
export async function buyEngagement(castHash, type = 'likes', budget = MAX_BUDGET, minScore = MIN_SCORE) {
    if (!PRIVATE_KEY) {
        const result = {
            success: false,
            castHash,
            interactionType: type,
            error: 'FARCASTER_WALLET_PK not set',
            timestamp: Date.now(),
        };
        purchaseHistory.push(result);
        return result;
    }
    try {
        // Dynamic imports — these are optional deps
        const { x402Client, wrapFetchWithPayment } = await import('@x402/fetch');
        const { registerExactEvmScheme } = await import('@x402/evm/exact/client');
        const { createWalletClient, http } = await import('viem');
        const { privateKeyToAccount } = await import('viem/accounts');
        const { base } = await import('viem/chains');
        // Setup wallet
        const account = privateKeyToAccount(PRIVATE_KEY);
        const wallet = createWalletClient({
            account,
            chain: base,
            transport: http('https://mainnet.base.org'),
        });
        // Setup x402 client
        const client = new x402Client();
        registerExactEvmScheme(client, {
            signer: Object.assign(wallet, { address: account.address }),
        });
        // Create fetch wrapper that auto-handles 402 payments
        const fetchWithPayment = wrapFetchWithPayment(fetch, client);
        const purchase = {
            budget,
            minQuotientScore: minScore,
            interactionType: type,
            castHash,
        };
        // Make the purchase
        await bridge.broadcast(`[SURGE] Buying ${type} for cast ${castHash.slice(0, 12)}... (budget: $${budget} USDC)`, purchase, 'high');
        const response = await fetchWithPayment(`${SURGE_API}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(purchase),
        });
        if (!response.ok) {
            const errorText = await response.text();
            const result = {
                success: false,
                castHash,
                interactionType: type,
                error: `${response.status}: ${errorText}`,
                timestamp: Date.now(),
            };
            purchaseHistory.push(result);
            await bridge.broadcast(`[SURGE] FAILED: ${result.error}`, result, 'high');
            return result;
        }
        const data = await response.json();
        const result = {
            success: true,
            castHash,
            interactionType: type,
            engagementCount: data.count || data.engagementCount,
            usdcSpent: data.spent || data.usdcSpent || budget,
            timestamp: Date.now(),
        };
        purchaseHistory.push(result);
        await bridge.broadcast(`[SURGE] SUCCESS: ${result.engagementCount || '?'} ${type} purchased for $${result.usdcSpent} USDC`, result, 'high');
        return result;
    }
    catch (err) {
        const result = {
            success: false,
            castHash,
            interactionType: type,
            error: err.message,
            timestamp: Date.now(),
        };
        purchaseHistory.push(result);
        await bridge.broadcast(`[SURGE] ERROR: ${err.message}`, result, 'critical');
        return result;
    }
}
/**
 * Buy both likes AND recasts for a cast in one call.
 */
export async function boostCast(castHash, likeBudget = MAX_BUDGET, recastBudget = MAX_BUDGET, minScore = MIN_SCORE) {
    const likes = await buyEngagement(castHash, 'likes', likeBudget, minScore);
    const recasts = await buyEngagement(castHash, 'recasts', recastBudget, minScore);
    return { likes, recasts };
}
// ─── Campaign Management ──────────────────────────────────────────────────
export function createCampaign(config) {
    activeCampaigns.set(config.castHash, config);
    bridge.broadcast(`[SURGE] Campaign created for cast ${config.castHash.slice(0, 12)}...`, config, 'low');
}
export function getCampaign(castHash) {
    return activeCampaigns.get(castHash);
}
export function listCampaigns() {
    return Array.from(activeCampaigns.values());
}
export function cancelCampaign(castHash) {
    return activeCampaigns.delete(castHash);
}
// ─── History & Stats ──────────────────────────────────────────────────────
export function getPurchaseHistory(limit = 50) {
    return purchaseHistory.slice(-limit);
}
export function getStats() {
    const successes = purchaseHistory.filter(r => r.success);
    const likes = successes.filter(r => r.interactionType === 'likes');
    const recasts = successes.filter(r => r.interactionType === 'recasts');
    return {
        totalPurchases: purchaseHistory.length,
        successRate: purchaseHistory.length ? successes.length / purchaseHistory.length : 0,
        totalUsdcSpent: successes.reduce((sum, r) => sum + (r.usdcSpent || 0), 0),
        totalLikes: likes.reduce((sum, r) => sum + (r.engagementCount || 0), 0),
        totalRecasts: recasts.reduce((sum, r) => sum + (r.engagementCount || 0), 0),
    };
}
export { bridge };
export default {
    connect,
    buyEngagement,
    boostCast,
    createCampaign,
    getCampaign,
    listCampaigns,
    cancelCampaign,
    getPurchaseHistory,
    getStats,
    bridge,
};
