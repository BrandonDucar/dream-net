import { detectCyclicalPatterns, findGoldNuggets } from './analytics';
import { redis } from './server';

// The Shit Sifter - Continuous pattern detection and gold nugget mining
// Runs continuously to find patterns and valuable signals in the data stream

export interface ShitSifterReport {
  timestamp: Date;
  patterns_found: number;
  gold_nuggets_found: number;
  top_topics: string[];
  emerging_authors: string[];
  market_signals: string[];
  confidence_score: number;
}

// Main shit sifter process - runs every 5 minutes
export async function runShitSifter(): Promise<ShitSifterReport> {
  console.log('🔍 [Shit Sifter] Starting analysis cycle...');
  
  try {
    // 1. Detect cyclical patterns in topics
    const patterns = await detectCyclicalPatterns();
    console.log(`📊 [Shit Sifter] Found ${patterns.length} cyclical patterns`);
    
    // 2. Mine for gold nuggets - emerging high-value signals
    const nuggets = await findGoldNuggets();
    console.log(`💎 [Shit Sifter] Found ${nuggets.length} gold nuggets`);
    
    // 3. Extract top insights
    const topTopics = patterns
      .filter(p => p.confidence > 0.7)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
      .map(p => p.topic);
    
    const emergingAuthors = nuggets
      .slice(0, 5)
      .map(n => n.author);
    
    const marketSignals = nuggets
      .filter(n => n.confidence > 0.8)
      .map(n => n.why_gold);
    
    // 4. Calculate overall confidence
    const avgPatternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length || 0;
    const avgNuggetConfidence = nuggets.reduce((sum, n) => sum + n.confidence, 0) / nuggets.length || 0;
    const overallConfidence = (avgPatternConfidence + avgNuggetConfidence) / 2;
    
    // 5. Store results in Redis for API access
    const report: ShitSifterReport = {
      timestamp: new Date(),
      patterns_found: patterns.length,
      gold_nuggets_found: nuggets.length,
      top_topics: topTopics,
      emerging_authors: emergingAuthors,
      market_signals: marketSignals,
      confidence_score: overallConfidence
    };
    
    // Store latest report
    await redis.setex('shit-sifter:latest', 3600, JSON.stringify(report));
    
    // Store historical reports
    await redis.lpush('shit-sifter:history', JSON.stringify(report));
    await redis.ltrim('shit-sifter:history', 0, 99); // Keep last 100 reports
    
    // Store individual nuggets for easy access
    for (const nugget of nuggets) {
      await redis.setex(`nugget:${nugget.hash}`, 86400, JSON.stringify(nugget));
    }
    
    // Store patterns for easy access
    for (const pattern of patterns) {
      await redis.setex(`pattern:${pattern.topic}`, 86400, JSON.stringify(pattern));
    }
    
    console.log(`✅ [Shit Sifter] Analysis complete: ${patterns.length} patterns, ${nuggets.length} nuggets, ${overallConfidence.toFixed(2)} confidence`);
    
    return report;
    
  } catch (error) {
    console.error('❌ [Shit Sifter] Analysis failed:', error);
    throw error;
  }
}

// Get latest shit sifter report
export async function getLatestShitSifterReport(): Promise<ShitSifterReport | null> {
  const data = await redis.get('shit-sifter:latest');
  return data ? JSON.parse(data) : null;
}

// Get historical reports
export async function getShitSifterHistory(limit: number = 10): Promise<ShitSifterReport[]> {
  const reports = await redis.lrange('shit-sifter:history', 0, limit - 1);
  return reports.map(r => JSON.parse(r));
}

// Get current gold nuggets
export async function getCurrentGoldNuggets(): Promise<any[]> {
  const keys = await redis.keys('nugget:*');
  if (keys.length === 0) return [];
  
  const nuggets = await Promise.all(
    keys.map(key => redis.get(key))
  );
  
  return nuggets
    .filter(n => n !== null)
    .map(n => JSON.parse(n))
    .sort((a, b) => b.confidence - a.confidence);
}

// Get current patterns
export async function getCurrentPatterns(): Promise<any[]> {
  const keys = await redis.keys('pattern:*');
  if (keys.length === 0) return [];
  
  const patterns = await Promise.all(
    keys.map(key => redis.get(key))
  );
  
  return patterns
    .filter(p => p !== null)
    .map(p => JSON.parse(p))
    .sort((a, b) => b.confidence - a.confidence);
}

// Start continuous shit sifter
export function startShitSifter(intervalMs: number = 300000): void {
  console.log(`🚀 [Shit Sifter] Starting continuous analysis every ${intervalMs / 1000}s`);
  
  // Run immediately on start
  runShitSifter().catch(err => console.error('⚠️ [Shit Sifter] Initial run failed:', err));
  
  // Then run on interval
  setInterval(() => {
    runShitSifter().catch(err => console.error('⚠️ [Shit Sifter] Scheduled run failed:', err));
  }, intervalMs);
}

// Shit sifter API endpoints for the server
export function addShitSifterEndpoints(app: any): void {
  // Get latest report
  app.get('/api/shit-sifter', async (_req: any, res: any) => {
    try {
      const report = await getLatestShitSifterReport();
      res.json(report || { message: 'No report available yet' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get report' });
    }
  });
  
  // Get history
  app.get('/api/shit-sifter/history', async (req: any, res: any) => {
    try {
      const limit = Math.min(Number(req.query.limit || 10), 50);
      const history = await getShitSifterHistory(limit);
      res.json({ history, count: history.length });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get history' });
    }
  });
  
  // Get current gold nuggets
  app.get('/api/shit-sifter/nuggets', async (_req: any, res: any) => {
    try {
      const nuggets = await getCurrentGoldNuggets();
      res.json({ nuggets, count: nuggets.length });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get nuggets' });
    }
  });
  
  // Get current patterns
  app.get('/api/shit-sifter/patterns', async (_req: any, res: any) => {
    try {
      const patterns = await getCurrentPatterns();
      res.json({ patterns, count: patterns.length });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get patterns' });
    }
  });
  
  // Force run analysis
  app.post('/api/shit-sifter/run', async (_req: any, res: any) => {
    try {
      const report = await runShitSifter();
      res.json({ success: true, report });
    } catch (err) {
      res.status(500).json({ error: 'Failed to run analysis' });
    }
  });
}
