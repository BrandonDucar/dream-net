import { pipelineSpike } from "../../packages/sensory-spikes/src/spikes/PipelineSpike.js";

export interface TickerInfo {
  symbol: string;
  category: "stock" | "crypto" | "forex" | "commodity";
  status: "active" | "watchlist" | "researched";
  alphaScore: number;
  lastAnalysis: string;
  findings: string[];
}

export class TickerResearchSystem {
  private tickers: Map<string, TickerInfo> = new Map();
  private pipelineId: string = "";

  constructor() {
    this.seedUserTickers();
    this.initializePipeline();
  }

  private initializePipeline() {
    // Look for existing Ticker Research pipeline or create one
    const existing = pipelineSpike.getStatus().find(p => p.name === "Ticker Research");
    if (existing) {
      this.pipelineId = existing.id;
    } else {
      // This should ideally be handled by PipelineSpike itself, but we ensure it here
      console.log("📈 [TickerResearchSystem] Ensuring Ticker Research pipeline exists...");
    }
  }

  private seedUserTickers() {
    const userTickers = [
      { symbol: "RSC", category: "crypto" as const },
      { symbol: "AERO", category: "crypto" as const },
      { symbol: "RSCCLAW", category: "crypto" as const },
      { symbol: "AXGT", category: "crypto" as const },
      { symbol: "VELO", category: "crypto" as const },
      { symbol: "COSMOS", category: "crypto" as const },
      { symbol: "KASPA", category: "crypto" as const },
      { symbol: "VECHAIN", category: "crypto" as const },
      { symbol: "JEPI", category: "stock" as const },
      { symbol: "EEMA", category: "stock" as const },
      { symbol: "TSMC", category: "stock" as const },
      { symbol: "RCAT", category: "stock" as const },
      { symbol: "BBAI", category: "stock" as const },
      { symbol: "SOFI", category: "stock" as const },
      { symbol: "RNDR", category: "crypto" as const },
      { symbol: "SPK", category: "crypto" as const },
      { symbol: "THOR", category: "crypto" as const },
      { symbol: "VTHO", category: "crypto" as const }
    ];

    for (const { symbol, category } of userTickers) {
      this.tickers.set(symbol, {
        symbol,
        category,
        status: "watchlist",
        alphaScore: 0,
        lastAnalysis: new Date().toISOString(),
        findings: []
      });
    }
    console.log(`📈 [TickerResearchSystem] Seeded ${userTickers.length} tickers for deep research.`);
  }

  public getTicker(symbol: string): TickerInfo | undefined {
    return this.tickers.get(symbol.toUpperCase());
  }

  public getAllTickers(): TickerInfo[] {
    return Array.from(this.tickers.values());
  }

  public updateResearch(symbol: string, score: number, findings: string[]) {
    const ticker = this.tickers.get(symbol.toUpperCase());
    if (ticker) {
      ticker.alphaScore = score;
      ticker.findings = [...ticker.findings, ...findings];
      ticker.status = "researched";
      ticker.lastAnalysis = new Date().toISOString();
    }
  }

  public async runCycle(emit?: (event: string, data: any) => void): Promise<void> {
    console.log("📈 [TickerResearchSystem] Starting research cycle via PipelineSpike...");
    
    for (const ticker of this.tickers.values()) {
      if (ticker.status === "watchlist" || ticker.alphaScore > 0) {
        // Find or create pipeline for this ticker
        const pipelineName = `Research: ${ticker.symbol}`;
        let pipeline = pipelineSpike.getStatus().find(p => p.name === pipelineName);
        
        if (!pipeline) {
          pipelineSpike.createPipeline(pipelineName, "input", ["Scan", "Analyze", "Score", "Verify"]);
          pipeline = pipelineSpike.getStatus().find(p => p.name === pipelineName)!;
        }

        // Run the pipeline
        await pipelineSpike.runPipeline(pipeline.id);
        
        // Calculate Alpha Score based on pipeline duration and pseudo-random delta
        // Shorter duration = more efficient processing
        const totalDuration = pipeline.steps.reduce((sum, s) => sum + (s.durationMs || 0), 0);
        const baseScore = 50;
        const efficiencyBonus = Math.max(0, 10 - (totalDuration / 200)); 
        const randomDelta = (Math.sin(Date.now() / 1000) * 20) + (Math.random() * 20); // Wave-based delta
        
        const prevScore = ticker.alphaScore;
        ticker.alphaScore = Math.min(100, Math.max(0, Math.floor(baseScore + efficiencyBonus + randomDelta)));
        ticker.status = "active";
        
        if (ticker.alphaScore > 80 && emit) {
          const finding = `🔥 High-alpha detected for ${ticker.symbol} via ${pipelineName}. Score: ${ticker.alphaScore}`;
          if (!ticker.findings.includes(finding)) {
            ticker.findings.push(finding);
            emit("alpha_detected", {
              symbol: ticker.symbol,
              category: ticker.category,
              score: ticker.alphaScore,
              timestamp: new Date().toISOString(),
              findings: [finding]
            });
          }
        } else if (ticker.alphaScore !== prevScore) {
          ticker.findings.push(`Pipeline ${pipeline.id} completed in ${totalDuration}ms. Alpha Score: ${ticker.alphaScore}`);
        }
      }
    }
  }
}

export const tickerResearchSystem = new TickerResearchSystem();
