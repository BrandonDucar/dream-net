import {
  WhalePackContext,
  WhaleProduct,
  WhaleAudience,
  WhaleContentPlan,
  HookStyle,
} from '../types.js';
import { WhaleStore } from '../store/whaleStore.js';

let planCounter = 0;
function nextPlanId() {
  planCounter += 1;
  return `whale:plan:${Date.now()}:${planCounter}`;
}

export function ensureSeedProductsAndAudiences() {
  // Only seed if empty
  if (WhaleStore.listProducts().length === 0) {
    const now = Date.now();
    WhaleStore.upsertProduct({
      id: "product:ai-dad-gadget",
      name: "AI Dad Gadget (Example)",
      tikTokSku: "SKU_AI_DAD_EXAMPLE",
      marginEstimate: 0.6,
      tags: ["ai", "dad", "gadget"],
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    WhaleStore.upsertProduct({
      id: "product:travel-hack",
      name: "Travel Hack Kit (Example)",
      tikTokSku: "SKU_TRAVEL_HACK_EXAMPLE",
      marginEstimate: 0.5,
      tags: ["travel", "hack", "utility"],
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (WhaleStore.listAudiences().length === 0) {
    const now = Date.now();
    WhaleStore.upsertAudience({
      id: "aud:us-fl-dads",
      name: "AI-curious dads in Florida",
      geo: "US-FL",
      tags: ["dads", "ai", "crypto"],
      createdAt: now,
      updatedAt: now,
    });

    WhaleStore.upsertAudience({
      id: "aud:us-travel-hustle",
      name: "US travel hustle crowd",
      geo: "US",
      tags: ["travel", "hustle"],
      createdAt: now,
      updatedAt: now,
    });
  }
}

export function generateNewContentPlans(ctx: WhalePackContext, desiredCount = 5): WhaleContentPlan[] {
  const products = WhaleStore.listProducts().filter((p) => p.active);
  const audiences = WhaleStore.listAudiences();
  const existingPlans = WhaleStore.listPlans();
  const ideasToGenerate = Math.max(0, desiredCount - existingPlans.length);

  const newPlans: WhaleContentPlan[] = [];
  const now = Date.now();

  if (products.length === 0 || audiences.length === 0 || ideasToGenerate <= 0) {
    return [];
  }

  for (let i = 0; i < ideasToGenerate; i++) {
    const product = products[i % products.length];
    const audience = audiences[i % audiences.length];

    const hookStyle = pickHookStyleFor(product, audience);
    const hookLine = buildHookLine(product, audience, hookStyle);
    const script = buildScript(product, audience, hookStyle);
    const caption = buildCaption(product, audience);
    const hashtags = buildHashtags(product, audience);
    const soundHint = pickSoundHint(product, audience);

    const plan: WhaleContentPlan = {
      id: nextPlanId(),
      channel: "tiktok",
      status: "planned",
      productId: product.id,
      audienceId: audience.id,
      hookStyle,
      hookLine,
      script,
      caption,
      hashtags,
      soundHint,
      createdAt: now,
      updatedAt: now,
    };

    WhaleStore.upsertPlan(plan);
    newPlans.push(plan);

    console.log("[WhaleSignalCore] Generated plan:", {
      planId: plan.id,
      product: product.name,
      audience: audience.name,
      hookStyle,
    });
  }

  return newPlans;
}

function pickHookStyleFor(product: WhaleProduct, audience: WhaleAudience): HookStyle {
  const tags = new Set([...(product.tags ?? []), ...(audience.tags ?? [])]);
  if (tags.has("tactical") || tags.has("military")) return "storytime";
  if (tags.has("travel")) return "tutorial";
  if (tags.has("ai")) return "pattern-interrupt";
  return "flex";
}

function buildHookLine(product: WhaleProduct, audience: WhaleAudience, style: HookStyle): string {
  switch (style) {
    case "pattern-interrupt":
      return `You’re not supposed to use AI like this, but every ${audience.name} will.`;
    case "storytime":
      return `Quick story about how this ${product.name} saved me from a stupid mistake.`;
    case "tutorial":
      return `If you ${audience.tags?.includes("travel") ? "travel" : "live"} in ${audience.geo ?? "the US"}, you need this trick.`;
    case "pain-point":
      return `If you’re tired of X, this ${product.name} is the fix.`;
    case "flex":
    default:
      return `I built a digital organism and this is what it told me to sell.`;
  }
}

function buildScript(product: WhaleProduct, audience: WhaleAudience, style: HookStyle): string {
  return [
    "HOOK: " + buildHookLine(product, audience, style),
    "",
    "BODY:",
    "- Show the product in use.",
    "- Explain who it's for: " + audience.name,
    "- Explain what problem it solves.",
    "- Tie it back to DreamNet / AI / ops if relevant.",
    "",
    "CTA:",
    "- 'Link in bio' or in-app TikTok Shop CTA.",
  ].join("\n");
}

function buildCaption(product: WhaleProduct, audience: WhaleAudience): string {
  return `Built for ${audience.name}, powered by DreamNet. ${product.name} is part of the mission.`;
}

function buildHashtags(product: WhaleProduct, audience: WhaleAudience): string[] {
  const tags = new Set<string>();
  (product.tags ?? []).forEach((t) => tags.add(t));
  (audience.tags ?? []).forEach((t) => tags.add(t));
  const base = ["dreamnet", "tiktokshop", "ai", "sidehustle"];
  base.forEach((b) => tags.add(b));
  if (audience.geo) tags.add(audience.geo.toLowerCase());
  return Array.from(tags).slice(0, 8);
}

function pickSoundHint(product: WhaleProduct, audience: WhaleAudience): string | undefined {
  // For now just label generically; later, tie into trend scraper
  return "use a trending audio in your niche (AI / travel / dad content)";
}


