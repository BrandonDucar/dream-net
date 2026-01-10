/**
 * ConnectorBot Agent v1 - Intelligent Task Routing and Bot Orchestration
 * Routes tasks and dreams through the multi-bot architecture based on goals and context
 */

interface RoutingDecision {
  routedTo: string;
  reasoning: string;
  confidence: number;
  nextSteps: string[];
  fallbackChain: string[];
  estimatedDuration: string;
  processing_time: number;
}

interface TaskContext {
  currentState: string;
  goal: string;
  availableBots?: string[];
  walletData?: any;
  dreamData?: any;
  urgency?: 'low' | 'medium' | 'high';
  complexity?: 'simple' | 'moderate' | 'complex';
}

export class ConnectorBotV1 {
  private version = '1.0.0';
  private botCapabilities = {
    'WebsitePrepBot': {
      specialties: ['frontend', 'ui', 'design', 'user_experience'],
      trustRequired: 60,
      complexity: ['simple', 'moderate', 'complex']
    },
    'BackendPrepBot': {
      specialties: ['api', 'database', 'server', 'infrastructure'],
      trustRequired: 70,
      complexity: ['moderate', 'complex']
    },
    'AdminDashboardAgent': {
      specialties: ['admin', 'management', 'analytics', 'oversight'],
      trustRequired: 80,
      complexity: ['complex']
    },
    'DreamIntakeBot': {
      specialties: ['dreams', 'processing', 'analysis', 'intake'],
      trustRequired: 60,
      complexity: ['simple', 'moderate']
    },
    'SocialOpsBot': {
      specialties: ['social', 'community', 'engagement', 'marketing'],
      trustRequired: 75,
      complexity: ['moderate', 'complex']
    },
    'ConnectorBot': {
      specialties: ['routing', 'orchestration', 'coordination', 'meta'],
      trustRequired: 50,
      complexity: ['simple', 'moderate', 'complex']
    }
  };

  private routingPatterns = [
    {
      triggers: ['dream', 'submit', 'analyze', 'process'],
      preferredBot: 'DreamIntakeBot',
      fallback: ['WebsitePrepBot', 'ConnectorBot']
    },
    {
      triggers: ['website', 'frontend', 'ui', 'design', 'user'],
      preferredBot: 'WebsitePrepBot',
      fallback: ['BackendPrepBot', 'ConnectorBot']
    },
    {
      triggers: ['backend', 'api', 'database', 'server', 'data'],
      preferredBot: 'BackendPrepBot',
      fallback: ['WebsitePrepBot', 'ConnectorBot']
    },
    {
      triggers: ['admin', 'manage', 'dashboard', 'analytics', 'oversight'],
      preferredBot: 'AdminDashboardAgent',
      fallback: ['BackendPrepBot', 'ConnectorBot']
    },
    {
      triggers: ['social', 'community', 'marketing', 'engagement'],
      preferredBot: 'SocialOpsBot',
      fallback: ['WebsitePrepBot', 'ConnectorBot']
    }
  ];

  async routeTask(context: TaskContext): Promise<RoutingDecision> {
    const startTime = Date.now();
    console.log(`🤖 [CONNECTOR-v${this.version}] Analyzing routing context...`);

    const { currentState, goal, availableBots = [], walletData } = context;
    
    // Determine task complexity and urgency
    const complexity = this.assessComplexity(context);
    const urgency = this.assessUrgency(context);
    
    // Analyze content for routing patterns
    const contentAnalysis = this.analyzeContent(currentState + ' ' + goal);
    
    // Filter available bots by trust level if wallet data provided
    const eligibleBots = this.filterBotsByTrust(availableBots, walletData);
    
    // Find best bot match
    const routingChoice = this.selectOptimalBot(
      contentAnalysis, 
      eligibleBots, 
      complexity, 
      urgency
    );
    
    // Generate fallback chain
    const fallbackChain = this.generateFallbackChain(
      routingChoice.primary, 
      eligibleBots, 
      contentAnalysis
    );
    
    // Estimate duration
    const estimatedDuration = this.estimateTaskDuration(complexity, routingChoice.primary);
    
    // Generate next steps
    const nextSteps = this.generateNextSteps(routingChoice.primary, context);

    const processing_time = (Date.now() - startTime) / 1000;

    const decision: RoutingDecision = {
      routedTo: routingChoice.primary,
      reasoning: routingChoice.reasoning,
      confidence: routingChoice.confidence,
      nextSteps,
      fallbackChain,
      estimatedDuration,
      processing_time
    };

    console.log(`✅ [CONNECTOR-v${this.version}] Routed to ${decision.routedTo} (${decision.confidence}% confidence)`);
    
    return decision;
  }

  private assessComplexity(context: TaskContext): 'simple' | 'moderate' | 'complex' {
    const { currentState, goal } = context;
    const combinedText = (currentState + ' ' + goal).toLowerCase();
    
    let complexityScore = 0;
    
    // Simple indicators
    if (combinedText.includes('simple') || combinedText.includes('basic') || 
        combinedText.includes('quick')) {
      complexityScore -= 2;
    }
    
    // Complex indicators
    const complexWords = ['integrate', 'orchestrate', 'coordinate', 'manage', 'analyze'];
    complexWords.forEach(word => {
      if (combinedText.includes(word)) complexityScore += 1;
    });
    
    // Multi-step indicators
    if (combinedText.includes('and') || combinedText.includes('then') || 
        combinedText.includes('after')) {
      complexityScore += 1;
    }
    
    // Technical depth indicators
    const technicalWords = ['database', 'api', 'architecture', 'system', 'infrastructure'];
    technicalWords.forEach(word => {
      if (combinedText.includes(word)) complexityScore += 1;
    });
    
    if (complexityScore >= 3) return 'complex';
    if (complexityScore >= 1) return 'moderate';
    return 'simple';
  }

  private assessUrgency(context: TaskContext): 'low' | 'medium' | 'high' {
    const { currentState, goal } = context;
    const combinedText = (currentState + ' ' + goal).toLowerCase();
    
    // High urgency indicators
    if (combinedText.includes('urgent') || combinedText.includes('immediate') || 
        combinedText.includes('asap') || combinedText.includes('critical')) {
      return 'high';
    }
    
    // Medium urgency indicators
    if (combinedText.includes('soon') || combinedText.includes('priority') || 
        combinedText.includes('important')) {
      return 'medium';
    }
    
    return 'low';
  }

  private analyzeContent(content: string): {
    primaryMatch: any;
    allMatches: any[];
    contentLength: number;
    wordCount: number;
  } {
    const lowerContent = content.toLowerCase();
    const matchedPatterns: any[] = [];
    
    this.routingPatterns.forEach(pattern => {
      const matches = pattern.triggers.filter(trigger => 
        lowerContent.includes(trigger)).length;
      
      if (matches > 0) {
        matchedPatterns.push({
          pattern,
          score: matches,
          confidence: (matches / pattern.triggers.length) * 100
        });
      }
    });
    
    // Sort by score and confidence
    matchedPatterns.sort((a, b) => b.score - a.score || b.confidence - a.confidence);
    
    return {
      primaryMatch: matchedPatterns[0] || null,
      allMatches: matchedPatterns,
      contentLength: content.length,
      wordCount: content.split(' ').length
    };
  }

  private filterBotsByTrust(availableBots: string[], walletData?: any): string[] {
    if (!walletData || !walletData.trustScore) {
      return availableBots;
    }
    
    const trustScore = walletData.trustScore;
    
    return availableBots.filter(bot => {
      const botInfo = (this.botCapabilities as any)[bot];
      return botInfo && trustScore >= botInfo.trustRequired;
    });
  }

  private selectOptimalBot(
    contentAnalysis: any, 
    eligibleBots: string[], 
    complexity: string, 
    urgency: string
  ): {
    primary: string;
    reasoning: string;
    confidence: number;
  } {
    
    // If we have a clear content match
    if (contentAnalysis.primaryMatch) {
      const preferredBot = contentAnalysis.primaryMatch.pattern.preferredBot;
      
      if (eligibleBots.includes(preferredBot)) {
        const botInfo = (this.botCapabilities as any)[preferredBot];
        if (botInfo && botInfo.complexity.includes(complexity)) {
          return {
            primary: preferredBot,
            reasoning: `Content analysis matched ${contentAnalysis.primaryMatch.pattern.triggers.join(', ')} patterns`,
            confidence: Math.min(95, contentAnalysis.primaryMatch.confidence + 20)
          };
        }
      }
    }
    
    // Fallback to complexity-based selection
    const complexityCompatibleBots = eligibleBots.filter(bot => {
      const botInfo = (this.botCapabilities as any)[bot];
      return botInfo && botInfo.complexity.includes(complexity);
    });
    
    if (complexityCompatibleBots.length > 0) {
      // For high urgency, prefer specialized bots
      if (urgency === 'high' && complexityCompatibleBots.includes('AdminDashboardAgent')) {
        return {
          primary: 'AdminDashboardAgent',
          reasoning: 'High urgency task routed to admin specialist',
          confidence: 80
        };
      }
      
      // Default to first available complexity-compatible bot
      const selectedBot = complexityCompatibleBots[0];
      return {
        primary: selectedBot,
        reasoning: `Selected based on complexity compatibility (${complexity})`,
        confidence: 70
      };
    }
    
    // Ultimate fallback to ConnectorBot
    return {
      primary: 'ConnectorBot',
      reasoning: 'No specialized bot available, routing to ConnectorBot for coordination',
      confidence: 50
    };
  }

  private generateFallbackChain(
    primaryBot: string, 
    eligibleBots: string[], 
    contentAnalysis: any
  ): string[] {
    const fallbackChain: string[] = [];
    
    // Add pattern-based fallbacks
    if (contentAnalysis.primaryMatch) {
      contentAnalysis.primaryMatch.pattern.fallback.forEach((bot: string) => {
        if (eligibleBots.includes(bot) && bot !== primaryBot) {
          fallbackChain.push(bot);
        }
      });
    }
    
    // Add general fallbacks
    const generalFallbacks = ['WebsitePrepBot', 'BackendPrepBot', 'ConnectorBot'];
    generalFallbacks.forEach(bot => {
      if (eligibleBots.includes(bot) && 
          bot !== primaryBot && 
          !fallbackChain.includes(bot)) {
        fallbackChain.push(bot);
      }
    });
    
    return fallbackChain.slice(0, 3); // Limit to 3 fallbacks
  }

  private estimateTaskDuration(complexity: string, botType: string): string {
    const baseDurations = {
      'simple': { min: 5, max: 15 },
      'moderate': { min: 15, max: 45 },
      'complex': { min: 30, max: 120 }
    };
    
    const botModifiers = {
      'AdminDashboardAgent': 1.2, // Slower but more thorough
      'BackendPrepBot': 1.1,      // Technical complexity
      'WebsitePrepBot': 0.9,      // Frontend generally faster
      'DreamIntakeBot': 0.8,      // Streamlined process
      'SocialOpsBot': 1.0,        // Standard
      'ConnectorBot': 0.7         // Coordination is quick
    };
    
    const duration = (baseDurations as any)[complexity];
    const modifier = (botModifiers as any)[botType] || 1.0;
    
    const estimatedMin = Math.round(duration.min * modifier);
    const estimatedMax = Math.round(duration.max * modifier);
    
    return `${estimatedMin}-${estimatedMax} minutes`;
  }

  private generateNextSteps(botType: string, context: TaskContext): string[] {
    const baseSteps = [
      `Initialize ${botType} for task execution`,
      'Analyze task requirements and constraints',
      'Execute primary task objectives'
    ];
    
    const botSpecificSteps = {
      'WebsitePrepBot': [
        'Review UI/UX requirements',
        'Prepare frontend components',
        'Test user interface elements'
      ],
      'BackendPrepBot': [
        'Analyze data requirements',
        'Set up API endpoints',
        'Configure database connections'
      ],
      'AdminDashboardAgent': [
        'Review admin privileges',
        'Set up monitoring systems',
        'Configure management interfaces'
      ],
      'DreamIntakeBot': [
        'Validate dream content',
        'Process through analysis pipeline',
        'Route to appropriate core spawning'
      ],
      'SocialOpsBot': [
        'Analyze community engagement',
        'Prepare social content',
        'Schedule community interactions'
      ],
      'ConnectorBot': [
        'Coordinate with other bots',
        'Monitor task progress',
        'Handle fallback routing if needed'
      ]
    };
    
    const specificSteps = (botSpecificSteps as any)[botType] || [];
    return [...baseSteps, ...specificSteps];
  }

  getVersion(): string {
    return this.version;
  }

  getCapabilities(): string[] {
    return [
      'intelligent_task_routing',
      'bot_orchestration',
      'trust_level_filtering',
      'complexity_assessment',
      'urgency_evaluation',
      'fallback_chain_generation',
      'duration_estimation',
      'next_steps_planning'
    ];
  }

  getBotCapabilities(): any {
    return this.botCapabilities;
  }

  getRoutingPatterns(): any {
    return this.routingPatterns;
  }
}

// Export singleton instance
export const connectorBotV1 = new ConnectorBotV1();