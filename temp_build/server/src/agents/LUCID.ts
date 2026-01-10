/**
 * LUCID Agent v1 - Dream Analysis and Validation
 * Performs initial dream structure analysis, clarity assessment, and lucidity detection
 */

interface LucidAnalysis {
  clarity: number;
  coherence: number;
  symbolism: number;
  emotional_intensity: number;
  narrative_structure: 'simple' | 'complex' | 'fragmented';
  lucid_elements: boolean;
  processing_time: number;
  dream_categories: string[];
  validation_score: number;
}

interface DreamInput {
  content: string;
  metadata?: {
    timestamp?: string;
    user_id?: string;
    context?: string;
  };
}

export type LucidInput = {
  currentState: string;
  goal: string;
  lastFailure?: string;
  availableAgents: string[];
};

export type LucidOutput = {
  nextAgent: string;
  instructions: string;
  fallbackOptions: string[];
};

export class LucidV1 {
  private version = '1.0.0';
  private analysisWeights = {
    clarity: 0.25,
    coherence: 0.20,
    symbolism: 0.15,
    emotional_intensity: 0.20,
    narrative_structure: 0.10,
    lucid_elements: 0.10
  };

  async analyzeDream(dreamInput: DreamInput): Promise<LucidAnalysis> {
    const startTime = Date.now();
    console.log(`🌟 [LUCID-v${this.version}] Starting dream analysis...`);

    const { content } = dreamInput;
    
    // Clarity Analysis - How clear and detailed is the dream
    const clarity = this.assessClarity(content);
    
    // Coherence Analysis - Logical flow and consistency
    const coherence = this.assessCoherence(content);
    
    // Symbolism Detection - Metaphorical and symbolic content
    const symbolism = this.detectSymbolism(content);
    
    // Emotional Intensity - Emotional charge and depth
    const emotional_intensity = this.assessEmotionalIntensity(content);
    
    // Narrative Structure - Story organization
    const narrative_structure = this.analyzeNarrativeStructure(content);
    
    // Lucid Elements - Awareness indicators
    const lucid_elements = this.detectLucidElements(content);
    
    // Dream Categories - Thematic classification
    const dream_categories = this.categorizeDream(content);
    
    // Overall Validation Score
    const validation_score = this.calculateValidationScore({
      clarity,
      coherence,
      symbolism,
      emotional_intensity,
      narrative_structure,
      lucid_elements
    });

    const processing_time = (Date.now() - startTime) / 1000;

    const analysis: LucidAnalysis = {
      clarity,
      coherence,
      symbolism,
      emotional_intensity,
      narrative_structure,
      lucid_elements,
      processing_time,
      dream_categories,
      validation_score
    };

    console.log(`✅ [LUCID-v${this.version}] Analysis complete - Validation: ${validation_score}%`);
    
    return analysis;
  }

  private assessClarity(content: string): number {
    let score = 60; // Base score
    
    // Length indicates detail level
    if (content.length > 200) score += 15;
    if (content.length > 500) score += 10;
    
    // Descriptive words indicate clarity
    const descriptiveWords = ['vivid', 'clear', 'bright', 'detailed', 'sharp', 'focused'];
    const descriptiveCount = descriptiveWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score += descriptiveCount * 3;
    
    // Sensory details
    const sensoryWords = ['see', 'hear', 'feel', 'smell', 'taste', 'touch'];
    const sensoryCount = sensoryWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score += sensoryCount * 2;
    
    return Math.min(100, score);
  }

  private assessCoherence(content: string): number {
    let score = 70; // Base score
    
    // Sentence structure indicates coherence
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 3) score += 10;
    
    // Transition words indicate logical flow
    const transitionWords = ['then', 'next', 'after', 'before', 'while', 'during', 'suddenly'];
    const transitionCount = transitionWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score += transitionCount * 3;
    
    // Inconsistency markers reduce coherence
    const inconsistencyWords = ['confused', 'strange', 'weird', 'impossible', 'nonsense'];
    const inconsistencyCount = inconsistencyWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score -= inconsistencyCount * 5;
    
    return Math.max(30, Math.min(100, score));
  }

  private detectSymbolism(content: string): number {
    let score = 50; // Base score
    
    // Common dream symbols
    const symbols = [
      'water', 'fire', 'flying', 'falling', 'door', 'stairs', 'mirror', 'animal',
      'house', 'car', 'bridge', 'tunnel', 'light', 'dark', 'chase', 'death',
      'birth', 'wedding', 'school', 'test', 'lost', 'found'
    ];
    
    const symbolCount = symbols.reduce((count, symbol) => 
      count + (content.toLowerCase().includes(symbol) ? 1 : 0), 0);
    score += symbolCount * 4;
    
    // Metaphorical language
    const metaphorWords = ['like', 'as if', 'seemed', 'appeared', 'transformed', 'became'];
    const metaphorCount = metaphorWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score += metaphorCount * 3;
    
    return Math.min(100, score);
  }

  private assessEmotionalIntensity(content: string): number {
    let score = 40; // Base score
    
    // Emotional words
    const emotions = [
      'afraid', 'scared', 'happy', 'sad', 'angry', 'excited', 'anxious',
      'peaceful', 'confused', 'amazed', 'shocked', 'delighted', 'terrified',
      'joyful', 'overwhelmed', 'calm', 'frustrated', 'content'
    ];
    
    const emotionCount = emotions.reduce((count, emotion) => 
      count + (content.toLowerCase().includes(emotion) ? 1 : 0), 0);
    score += emotionCount * 5;
    
    // Intensity indicators
    const intensityWords = ['extremely', 'very', 'incredibly', 'absolutely', 'completely'];
    const intensityCount = intensityWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    score += intensityCount * 3;
    
    return Math.min(100, score);
  }

  private analyzeNarrativeStructure(content: string): 'simple' | 'complex' | 'fragmented' {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = content.length / sentences.length;
    
    if (sentences.length < 3 || avgSentenceLength < 20) {
      return 'simple';
    } else if (sentences.length > 8 && avgSentenceLength > 50) {
      return 'complex';
    } else if (content.includes('...') || content.includes('--')) {
      return 'fragmented';
    }
    
    return content.length > 200 ? 'complex' : 'simple';
  }

  private detectLucidElements(content: string): boolean {
    const lucidIndicators = [
      'lucid', 'aware', 'realized', 'knew it was a dream', 'dream sign',
      'reality check', 'conscious', 'control', 'chose to', 'decided to'
    ];
    
    return lucidIndicators.some(indicator => 
      content.toLowerCase().includes(indicator));
  }

  private categorizeDream(content: string): string[] {
    const categories: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Adventure themes
    if (lowerContent.includes('journey') || lowerContent.includes('adventure') || 
        lowerContent.includes('explore') || lowerContent.includes('quest')) {
      categories.push('adventure');
    }
    
    // Transformation themes
    if (lowerContent.includes('change') || lowerContent.includes('transform') || 
        lowerContent.includes('become') || lowerContent.includes('evolve')) {
      categories.push('transformation');
    }
    
    // Relationship themes
    if (lowerContent.includes('friend') || lowerContent.includes('family') || 
        lowerContent.includes('love') || lowerContent.includes('relationship')) {
      categories.push('relationships');
    }
    
    // Fear/anxiety themes
    if (lowerContent.includes('chase') || lowerContent.includes('escape') || 
        lowerContent.includes('afraid') || lowerContent.includes('nightmare')) {
      categories.push('fear_anxiety');
    }
    
    // Spiritual/mystical themes
    if (lowerContent.includes('light') || lowerContent.includes('spirit') || 
        lowerContent.includes('divine') || lowerContent.includes('mystical')) {
      categories.push('spiritual');
    }
    
    return categories.length > 0 ? categories : ['general'];
  }

  private calculateValidationScore(analysis: any): number {
    const {
      clarity,
      coherence,
      symbolism,
      emotional_intensity,
      narrative_structure,
      lucid_elements
    } = analysis;
    
    let score = 0;
    score += clarity * this.analysisWeights.clarity;
    score += coherence * this.analysisWeights.coherence;
    score += symbolism * this.analysisWeights.symbolism;
    score += emotional_intensity * this.analysisWeights.emotional_intensity;
    
    // Narrative structure bonus
    const structureBonus = narrative_structure === 'complex' ? 10 : 
                          narrative_structure === 'simple' ? 5 : 0;
    score += structureBonus * this.analysisWeights.narrative_structure;
    
    // Lucid elements bonus
    const lucidBonus = lucid_elements ? 15 : 0;
    score += lucidBonus * this.analysisWeights.lucid_elements;
    
    return Math.round(score);
  }

  getVersion(): string {
    return this.version;
  }

  getCapabilities(): string[] {
    return [
      'dream_clarity_assessment',
      'narrative_coherence_analysis',
      'symbolic_content_detection',
      'emotional_intensity_measurement',
      'lucidity_indicator_recognition',
      'thematic_categorization',
      'validation_scoring'
    ];
  }
}

// Export singleton instance
export const lucidV1Instance = new LucidV1();

export function lucidV1(input: LucidInput): LucidOutput {
  const { currentState, goal, lastFailure, availableAgents } = input;

  // Specific fallback: Database failure
  if (lastFailure?.toLowerCase().includes("db")) {
    return {
      nextAgent: "ROOT",
      instructions: "Rebuild the backend schema and validate DB connection.",
      fallbackOptions: ["LUCID", "CANVAS"]
    };
  }

  // Frontend priority
  if (goal.toLowerCase().includes("frontend") && availableAgents.includes("CANVAS")) {
    return {
      nextAgent: "CANVAS",
      instructions: "Render visual frontend and deploy interface layer.",
      fallbackOptions: ["SEED", "LUCID"]
    };
  }

  // Admin task priority
  if (goal.toLowerCase().includes("admin") && availableAgents.includes("ROOT")) {
    return {
      nextAgent: "ROOT",
      instructions: "Configure admin route, wallet gating, and ENV secrets.",
      fallbackOptions: ["CANVAS", "LUCID"]
    };
  }

  // Wallet/authentication tasks
  if (goal.toLowerCase().includes("wallet") && availableAgents.includes("ECHO")) {
    return {
      nextAgent: "ECHO",
      instructions: "Analyze wallet address and determine trust score for access gating.",
      fallbackOptions: ["ROOT", "LUCID"]
    };
  }

  // Backend/infrastructure tasks
  if (goal.toLowerCase().includes("backend") && availableAgents.includes("ROOT")) {
    return {
      nextAgent: "ROOT",
      instructions: "Set up backend infrastructure, database schema, and API endpoints.",
      fallbackOptions: ["CANVAS", "LUCID"]
    };
  }

  // Visual/UI tasks
  if ((goal.toLowerCase().includes("visual") || goal.toLowerCase().includes("ui")) && availableAgents.includes("CANVAS")) {
    return {
      nextAgent: "CANVAS",
      instructions: "Process visual elements and create UI components.",
      fallbackOptions: ["ROOT", "LUCID"]
    };
  }

  // Catch-all fallback
  return {
    nextAgent: "LUCID",
    instructions: "Analyze current state and determine optimal routing strategy.",
    fallbackOptions: availableAgents.filter(agent => agent !== "LUCID").slice(0, 2)
  };
}

// Additional exports as requested  
export { lucidV1Instance as connectorBotV1 };