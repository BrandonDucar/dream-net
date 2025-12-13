/**
 * Agent SG-1: IntentGridRouter
 * 
 * Ingests new intents, normalizes and classifies them,
 * attaches initial geo + SEO scaffold, routes to solver pools.
 */

import type { 
  Intent, 
  IntentGridRouterPayload, 
  RoutingResult,
  IntentDomain 
} from '../types';

export interface IntentGridRouterContext {
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  log: (msg: string, data?: any) => void;
  emitEvent: (type: string, payload: any) => Promise<void>;
}

export interface IntentGridRouterResult {
  ok: boolean;
  summary: string;
  data?: {
    intent: Intent;
    routingResult?: RoutingResult;
    classification?: {
      domain: IntentDomain;
      confidence: number;
      suggestedRegions?: string[];
      suggestedKeywords?: string[];
    };
  };
  warnings?: string[];
}

/**
 * Classify intent domain from title/description
 */
function classifyDomain(intent: Partial<Intent>): { domain: IntentDomain; confidence: number } {
  const text = `${intent.title || ''} ${intent.description || ''}`.toLowerCase();
  
  const domainKeywords: Record<IntentDomain, string[]> = {
    content: ['content', 'article', 'blog', 'write', 'description', 'copy'],
    ai_training: ['training', 'dataset', 'fine-tune', 'model', 'llm'],
    defi: ['defi', 'liquidity', 'yield', 'staking', 'swap', 'protocol'],
    gaming: ['game', 'nft', 'metaverse', 'play-to-earn', 'gaming'],
    nft: ['nft', 'token', 'collection', 'mint'],
    social: ['social', 'community', 'discord', 'twitter', 'engagement'],
    governance: ['governance', 'dao', 'proposal', 'vote', 'treasury'],
    infrastructure: ['infrastructure', 'node', 'validator', 'rpc', 'api'],
    other: []
  };

  let bestMatch: IntentDomain = 'other';
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const matches = keywords.filter(kw => text.includes(kw)).length;
    const score = matches / keywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = domain as IntentDomain;
    }
  }

  return {
    domain: bestMatch,
    confidence: Math.min(bestScore * 2, 1) // Scale to 0-1
  };
}

/**
 * Extract suggested regions from intent text
 */
function extractRegions(intent: Partial<Intent>): string[] {
  const text = `${intent.title || ''} ${intent.description || ''}`.toLowerCase();
  const regionMentions: Record<string, string[]> = {
    'US': ['us', 'usa', 'united states', 'america'],
    'MX': ['mexico', 'mexican', 'latam', 'latin america'],
    'AR': ['argentina', 'argentinian'],
    'BR': ['brazil', 'brazilian'],
    'ES': ['spain', 'spanish'],
    'GB': ['uk', 'united kingdom', 'britain'],
    'DE': ['germany', 'german'],
    'FR': ['france', 'french'],
    'JP': ['japan', 'japanese'],
    'CN': ['china', 'chinese'],
  };

  const found: string[] = [];
  for (const [code, keywords] of Object.entries(regionMentions)) {
    if (keywords.some(kw => text.includes(kw))) {
      found.push(code);
    }
  }

  return found;
}

/**
 * Extract suggested keywords from intent text
 */
function extractKeywords(intent: Partial<Intent>): string[] {
  const text = `${intent.title || ''} ${intent.description || ''}`;
  // Simple keyword extraction - can be enhanced with NLP
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4); // Filter short words
  
  // Get most common words (simple approach)
  const wordCounts = new Map<string, number>();
  words.forEach(w => wordCounts.set(w, (wordCounts.get(w) || 0) + 1));
  
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

export async function runIntentGridRouter(
  payload: IntentGridRouterPayload,
  ctx: IntentGridRouterContext
): Promise<IntentGridRouterResult> {
  const { intent, mode = 'route' } = payload;

  ctx.log('[IntentGridRouter] Processing intent', { intentId: intent.id, mode });

  try {
    // 1. Classify domain
    const classification = classifyDomain(intent);
    
    // Update intent domain if not set or low confidence
    if (!intent.domain || classification.confidence > 0.7) {
      intent.domain = classification.domain;
    }

    // 2. Extract suggested regions/keywords if geoSEO not fully populated
    if (!intent.geoSEO || intent.geoSEO.regions.length === 0) {
      const suggestedRegions = extractRegions(intent);
      if (suggestedRegions.length > 0 && intent.geoSEO) {
        intent.geoSEO.regions = suggestedRegions.map(code => ({
          code,
          name: code, // Can be enhanced with lookup
          language: code === 'US' || code === 'GB' ? 'en' : 
                   code === 'MX' || code === 'AR' || code === 'ES' ? 'es' : 'en'
        }));
      }
    }

    if (!intent.geoSEO || !intent.geoSEO.keywords || intent.geoSEO.keywords.primary.length === 0) {
      const suggestedKeywords = extractKeywords(intent);
      if (suggestedKeywords.length > 0 && intent.geoSEO) {
        if (!intent.geoSEO.keywords) {
          intent.geoSEO.keywords = {
            primary: [],
            longTail: [],
            questionPhrases: [],
            semanticClusters: []
          };
        }
        intent.geoSEO.keywords.primary = suggestedKeywords.slice(0, 5);
      }
    }

    // 3. Normalize intent
    intent.status = intent.status || 'pending';
    intent.createdAt = intent.createdAt || Date.now();
    intent.updatedAt = Date.now();
    intent.priority = intent.priority || 'normal';

    // 4. Store intent
    await ctx.storage.set(`signalgrid:intent:${intent.id}`, intent);
    await ctx.storage.set(`signalgrid:intents:${intent.status}`, 
      await ctx.storage.get(`signalgrid:intents:${intent.status}`).then(v => v || []).then(arr => [...arr, intent.id])
    );

    // 5. Emit event
    await ctx.emitEvent('SIGNALGRID_INTENT_CREATED', {
      intentId: intent.id,
      domain: intent.domain,
      status: intent.status
    });

    // 6. Route if mode is 'route'
    let routingResult: RoutingResult | undefined;
    if (mode === 'route') {
      // Get available solvers (this would call SolverMeshOrchestrator)
      const solvers = await ctx.storage.get('signalgrid:solvers:active') || [];
      
      // Simple routing logic - match by domain, region, language
      const matches = solvers
        .filter((solver: any) => {
          return solver.capabilities.domains.includes(intent.domain) &&
                 solver.isActive &&
                 solver.healthStatus === 'healthy';
        })
        .map((solver: any) => {
          // Calculate match score
          let score = 0.5; // Base score
          
          // Domain match
          if (solver.capabilities.domains.includes(intent.domain)) {
            score += 0.2;
          }
          
          // Region match
          const regionMatch = intent.geoSEO?.regions.some(r => 
            solver.capabilities.regions.includes(r.code)
          );
          if (regionMatch) {
            score += 0.2;
          }
          
          // Language match
          const languageMatch = intent.geoSEO?.regions.some(r =>
            solver.capabilities.languages.includes(r.language)
          );
          if (languageMatch) {
            score += 0.1;
          }
          
          return {
            solverId: solver.id,
            score: Math.min(score, 1),
            reasons: [
              `Domain match: ${intent.domain}`,
              regionMatch ? 'Region match' : '',
              languageMatch ? 'Language match' : ''
            ].filter(Boolean),
            estimatedCost: solver.basePricePerUnit,
            estimatedLatency: solver.reputation.averageLatency || 60000
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5 matches

      routingResult = {
        intentId: intent.id,
        matches,
        selectedSolvers: matches.slice(0, 3).map(m => m.solverId), // Top 3
        routingMetadata: {
          routedAt: Date.now(),
          routingStrategy: 'domain_region_language_match',
          totalCandidates: solvers.length
        }
      };

      await ctx.storage.set(`signalgrid:routing:${intent.id}`, routingResult);
      await ctx.emitEvent('SIGNALGRID_INTENT_ROUTED', routingResult);
    }

    return {
      ok: true,
      summary: `Intent ${intent.id} processed: domain=${intent.domain}, status=${intent.status}`,
      data: {
        intent,
        routingResult,
        classification: {
          domain: classification.domain,
          confidence: classification.confidence,
          suggestedRegions: intent.geoSEO?.regions.map(r => r.code),
          suggestedKeywords: intent.geoSEO?.keywords?.primary
        }
      }
    };

  } catch (error: any) {
    ctx.log('[IntentGridRouter] Error', { error: error.message });
    return {
      ok: false,
      summary: `Failed to process intent: ${error.message}`,
      warnings: [error.message]
    };
  }
}

