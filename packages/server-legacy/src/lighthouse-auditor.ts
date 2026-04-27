import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

export interface LighthouseAuditResult {
  url: string;
  timestamp: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    totalBlockingTime: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    savings: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  accessibility: {
    violations: Array<{
      rule: string;
      description: string;
      impact: 'critical' | 'serious' | 'moderate' | 'minor';
      nodes: number;
    }>;
    passedAudits: number;
    totalAudits: number;
  };
  seo: {
    issues: Array<{
      audit: string;
      description: string;
      recommendation: string;
    }>;
    passedChecks: number;
    totalChecks: number;
  };
  summary: {
    overallScore: number;
    primaryIssues: string[];
    quickWins: string[];
    dreamUpgradeCategory: 'Vision' | 'Tool' | 'Movement';
  };
}

export class LighthouseAuditor {
  async auditWebsite(url: string): Promise<LighthouseAuditResult> {
    console.log(`🔍 Starting Lighthouse audit for: ${url}`);
    
    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      throw new Error(`Invalid URL provided: ${url}`);
    }

    let chrome;
    try {
      // Launch Chrome
      chrome = await chromeLauncher.launch({
        chromeFlags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });

      // Run Lighthouse audit
      const options = {
        logLevel: 'info' as const,
        output: 'json' as const,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
      };

      console.log(`⚡ Running Lighthouse audit on port ${chrome.port}...`);
      const runnerResult = await lighthouse(url, options);
      
      if (!runnerResult || !runnerResult.report) {
        throw new Error('Lighthouse audit failed to generate a report');
      }

      const report = JSON.parse(runnerResult.report);
      console.log(`✅ Lighthouse audit completed successfully`);

      return this.processLighthouseReport(url, report);

    } catch (error: any) {
      console.error(`❌ Lighthouse audit failed:`, error);
      throw new Error(`Lighthouse audit failed: ${error.message}`);
    } finally {
      if (chrome) {
        await chrome.kill();
        console.log(`🔄 Chrome instance terminated`);
      }
    }
  }

  private processLighthouseReport(url: string, report: any): LighthouseAuditResult {
    const categories = report.categories;
    const audits = report.audits;

    // Extract scores (convert to 0-100 scale)
    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };

    // Extract key metrics
    const metrics = {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
    };

    // Process opportunities (performance improvements)
    const opportunities = this.extractOpportunities(audits);
    
    // Process diagnostics (general issues)
    const diagnostics = this.extractDiagnostics(audits);
    
    // Process accessibility violations
    const accessibility = this.extractAccessibilityData(audits);
    
    // Process SEO issues
    const seo = this.extractSEOData(audits);

    // Calculate overall score and categorize for dream upgrade
    const overallScore = Math.round((scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4);
    
    const summary = this.generateSummary(scores, opportunities, diagnostics, overallScore);

    return {
      url,
      timestamp: new Date().toISOString(),
      scores,
      metrics,
      opportunities,
      diagnostics,
      accessibility,
      seo,
      summary
    };
  }

  private extractOpportunities(audits: any): Array<{id: string; title: string; description: string; impact: 'high' | 'medium' | 'low'; savings: string}> {
    const opportunityIds = [
      'unused-css-rules', 'unused-javascript', 'modern-image-formats', 
      'offscreen-images', 'render-blocking-resources', 'unminified-css',
      'unminified-javascript', 'efficient-animated-content', 'duplicated-javascript'
    ];

    return opportunityIds
      .map(id => {
        const audit = audits[id];
        if (!audit || audit.score === 1) return null;

        const savings = audit.details?.overallSavingsMs 
          ? `${Math.round(audit.details.overallSavingsMs)}ms`
          : audit.details?.overallSavingsBytes 
          ? `${Math.round(audit.details.overallSavingsBytes / 1024)}KB`
          : 'Unknown';

        const impact = audit.details?.overallSavingsMs > 1000 ? 'high' 
          : audit.details?.overallSavingsMs > 500 ? 'medium' : 'low';

        return {
          id,
          title: audit.title,
          description: audit.description,
          impact,
          savings
        };
      })
      .filter(Boolean) as Array<{id: string; title: string; description: string; impact: 'high' | 'medium' | 'low'; savings: string}>;
  }

  private extractDiagnostics(audits: any): Array<{id: string; title: string; description: string; severity: 'error' | 'warning' | 'info'}> {
    const diagnosticIds = [
      'dom-size', 'critical-request-chains', 'mainthread-work-breakdown',
      'bootup-time', 'uses-long-cache-ttl', 'total-byte-weight'
    ];

    return diagnosticIds
      .map(id => {
        const audit = audits[id];
        if (!audit) return null;

        const severity = audit.score === 0 ? 'error' 
          : audit.score < 0.5 ? 'warning' : 'info';

        return {
          id,
          title: audit.title,
          description: audit.description,
          severity
        };
      })
      .filter(Boolean) as Array<{id: string; title: string; description: string; severity: 'error' | 'warning' | 'info'}>;
  }

  private extractAccessibilityData(audits: any) {
    const a11yAudits = Object.values(audits).filter((audit: any) => 
      audit.id && audit.id.includes('accessibility') || 
      ['color-contrast', 'image-alt', 'link-text', 'heading-order'].includes(audit.id)
    ) as any[];

    const violations = a11yAudits
      .filter(audit => audit.score !== null && audit.score < 1)
      .map(audit => ({
        rule: audit.id,
        description: audit.title,
        impact: audit.score === 0 ? 'critical' as const : 
               audit.score < 0.5 ? 'serious' as const :
               audit.score < 0.8 ? 'moderate' as const : 'minor' as const,
        nodes: audit.details?.items?.length || 1
      }));

    return {
      violations,
      passedAudits: a11yAudits.filter(audit => audit.score === 1).length,
      totalAudits: a11yAudits.length
    };
  }

  private extractSEOData(audits: any) {
    const seoAudits = [
      'document-title', 'meta-description', 'http-status-code',
      'link-text', 'is-crawlable', 'hreflang', 'canonical'
    ];

    const issues = seoAudits
      .map(id => {
        const audit = audits[id];
        if (!audit || audit.score === 1) return null;

        return {
          audit: audit.title,
          description: audit.description,
          recommendation: this.getSEORecommendation(id)
        };
      })
      .filter(Boolean) as Array<{audit: string; description: string; recommendation: string}>;

    return {
      issues,
      passedChecks: seoAudits.filter(id => audits[id]?.score === 1).length,
      totalChecks: seoAudits.length
    };
  }

  private getSEORecommendation(auditId: string): string {
    const recommendations: Record<string, string> = {
      'document-title': 'Add a descriptive, unique title tag to each page',
      'meta-description': 'Write compelling meta descriptions for better click-through rates',
      'link-text': 'Use descriptive anchor text instead of generic phrases like "click here"',
      'is-crawlable': 'Ensure pages are crawlable by removing blocking robots.txt rules',
      'hreflang': 'Add hreflang tags for international SEO if serving multiple languages',
      'canonical': 'Add canonical URLs to prevent duplicate content issues'
    };
    
    return recommendations[auditId] || 'Review and optimize this SEO aspect';
  }

  private generateSummary(scores: any, opportunities: any[], diagnostics: any[], overallScore: number) {
    const primaryIssues: string[] = [];
    const quickWins: string[] = [];

    // Identify primary issues
    if (scores.performance < 60) primaryIssues.push('Performance optimization needed');
    if (scores.accessibility < 80) primaryIssues.push('Accessibility improvements required');
    if (scores.seo < 80) primaryIssues.push('SEO enhancements needed');
    if (scores.bestPractices < 80) primaryIssues.push('Best practices implementation');

    // Identify quick wins
    opportunities.slice(0, 3).forEach(opp => {
      if (opp.impact === 'high') {
        quickWins.push(opp.title);
      }
    });

    // Determine dream upgrade category based on primary issues
    let dreamUpgradeCategory: 'Vision' | 'Tool' | 'Movement';
    if (scores.performance < 50 || scores.accessibility < 50) {
      dreamUpgradeCategory = 'Tool'; // Technical improvements needed
    } else if (scores.seo < 60) {
      dreamUpgradeCategory = 'Movement'; // Growth and visibility
    } else {
      dreamUpgradeCategory = 'Vision'; // Strategic enhancements
    }

    return {
      overallScore,
      primaryIssues,
      quickWins,
      dreamUpgradeCategory
    };
  }
}

export const lighthouseAuditor = new LighthouseAuditor();