import { WhalePackContext, WhaleInsight } from '../types.js';
import { WhaleStore } from '../store/whaleStore.js';

let insightCounter = 0;
function nextInsightId() {
  insightCounter += 1;
  return `whale:insight:${Date.now()}:${insightCounter}`;
}

export function runWhaleAnalysis(ctx: WhalePackContext): WhaleInsight[] {
  const plans = WhaleStore.listPlans();
  const products = WhaleStore.listProducts();
  const insights: WhaleInsight[] = [];

  // Example: if multiple plans exist for a product, recommend doubling down
  const planCountsByProduct: Record<string, number> = {};
  for (const plan of plans) {
    planCountsByProduct[plan.productId] = (planCountsByProduct[plan.productId] ?? 0) + 1;
  }

  for (const [productId, count] of Object.entries(planCountsByProduct)) {
    if (count >= 3) {
      const product = products.find((p) => p.id === productId);
      const title = `Product "${product?.name ?? productId}" is heavily targeted`;
      const description = `You have ${count} TikTok plans focused on ${product?.name ?? productId}. Consider executing and measuring performance before generating more.`;

      const insight: WhaleInsight = {
        id: nextInsightId(),
        type: "recommendation",
        title,
        description,
        createdAt: Date.now(),
        meta: { productId, planCount: count },
      };

      WhaleStore.addInsight(insight);
      insights.push(insight);
    }
  }

  // Optional: send summary to NeuralMesh
  if (ctx.neuralMesh?.remember && insights.length > 0) {
    ctx.neuralMesh.remember({
      source: "WhaleAnalystCore",
      insightsCount: insights.length,
      timestamp: Date.now(),
    });
  }

  return insights;
}


