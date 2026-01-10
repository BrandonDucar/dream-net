/**
 * Task Connector System - Routes development tasks to specialized bots
 */

export type ConnectorInput = {
  currentState: string;         // e.g., "Dream garden route loaded"
  goal: string;                 // e.g., "Get working backend with dream save"
  lastFailure?: string;         // optional fallback handler
  availableBots: string[];      // ["WebsitePrepBot", "BackendPrepBot", "SocialOpsBot"]
};

export type ConnectorOutput = {
  nextBot: string;              // which bot to call next
  instructions: string;         // exact task to perform
  fallbackOptions: string[];    // if nextBot fails, try these
};

export class TaskConnector {
  private static botCapabilities = {
    WebsitePrepBot: [
      'frontend development',
      'ui components', 
      'react implementation',
      'user interface',
      'styling',
      'routing',
      'forms'
    ],
    BackendPrepBot: [
      'api development',
      'database setup',
      'authentication',
      'data persistence',
      'server logic',
      'endpoints',
      'middleware'
    ],
    SocialOpsBot: [
      'social media integration',
      'notifications',
      'webhooks',
      'external apis',
      'user engagement',
      'community features'
    ],
    AdminDashboardAgent: [
      'admin interface',
      'wallet authentication',
      'secret key handling',
      'admin dashboard',
      'user management',
      'security'
    ],
    DreamIntakeBot: [
      'dream submission',
      'dream processing',
      'content validation',
      'intake workflows',
      'user onboarding'
    ],
    ConnectorBot: [
      'task routing',
      'workflow coordination',
      'fallback handling',
      'system orchestration'
    ]
  };

  static route(input: ConnectorInput): ConnectorOutput {
    // First try the enhanced connector logic
    const enhancedResult = this.connectorBotV1(input);
    if (enhancedResult.nextBot !== 'ConnectorBot') {
      return enhancedResult;
    }

    // Fall back to original algorithm if enhanced logic returns ConnectorBot
    const { currentState, goal, lastFailure, availableBots } = input;
    
    // Analyze goal to determine primary bot
    const primaryBot = this.selectPrimaryBot(goal, availableBots);
    
    // Generate specific instructions
    const instructions = this.generateInstructions(currentState, goal, primaryBot);
    
    // Create fallback chain
    const fallbackOptions = this.createFallbackChain(primaryBot, availableBots, lastFailure);
    
    return {
      nextBot: primaryBot,
      instructions,
      fallbackOptions
    };
  }

  // Enhanced connector logic with specific fallback handling
  static connectorBotV1(input: ConnectorInput): ConnectorOutput {
    const { currentState, goal, lastFailure, availableBots } = input;

    if (lastFailure?.includes("DB")) {
      return {
        nextBot: "BackendPrepBot",
        instructions: "Repair the database schema and reconfigure connection settings.",
        fallbackOptions: ["ConnectorBot", "AdminDashboardAgent"]
      };
    }

    if (goal.includes("frontend") && availableBots.includes("WebsitePrepBot")) {
      return {
        nextBot: "WebsitePrepBot",
        instructions: "Scaffold and deploy frontend for current Dream Core.",
        fallbackOptions: ["DreamIntakeBot", "ConnectorBot"]
      };
    }

    if (goal.includes("admin") && availableBots.includes("AdminDashboardAgent")) {
      return {
        nextBot: "AdminDashboardAgent",
        instructions: "Set up wallet-based admin interface and secret key handling.",
        fallbackOptions: ["BackendPrepBot", "ConnectorBot"]
      };
    }

    return {
      nextBot: "ConnectorBot",
      instructions: "Unable to determine next step. Ask user for more detail or reattempt with different fallback.",
      fallbackOptions: ["WebsitePrepBot", "BackendPrepBot"]
    };
  }

  private static selectPrimaryBot(goal: string, availableBots: string[]): string {
    const goalLower = goal.toLowerCase();
    
    // Score each bot based on goal keywords
    const scores = availableBots.map(bot => {
      if (!this.botCapabilities[bot as keyof typeof this.botCapabilities]) {
        return { bot, score: 0 };
      }
      
      const capabilities = this.botCapabilities[bot as keyof typeof this.botCapabilities];
      const score = capabilities.reduce((acc, capability) => {
        return acc + (goalLower.includes(capability) ? 1 : 0);
      }, 0);
      
      return { bot, score };
    });
    
    // Return bot with highest score
    const bestBot = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return bestBot.bot;
  }

  private static generateInstructions(currentState: string, goal: string, selectedBot: string): string {
    const context = `Current state: ${currentState}`;
    const objective = `Goal: ${goal}`;
    
    switch (selectedBot) {
      case 'WebsitePrepBot':
        return `${context}\n${objective}\n\nImplement frontend components and user interface elements. Focus on React components, styling, and user interactions. Ensure responsive design and proper state management.`;
        
      case 'BackendPrepBot':
        return `${context}\n${objective}\n\nImplement backend API endpoints, database operations, and server logic. Set up proper authentication, data validation, and error handling. Ensure data persistence and API reliability.`;
        
      case 'SocialOpsBot':
        return `${context}\n${objective}\n\nImplement social features, notifications, and external integrations. Set up webhooks, user engagement systems, and community features. Focus on real-time updates and user communication.`;
        
      case 'AdminDashboardAgent':
        return `${context}\n${objective}\n\nImplement admin dashboard with wallet-based authentication and secure key management. Focus on admin controls, user management, and security features.`;
        
      case 'DreamIntakeBot':
        return `${context}\n${objective}\n\nImplement dream submission and intake workflow. Focus on content validation, user onboarding, and dream processing pipelines.`;
        
      case 'ConnectorBot':
        return `${context}\n${objective}\n\nCoordinate task routing and workflow management. Analyze current state and determine next steps for project progression.`;
        
      default:
        return `${context}\n${objective}\n\nImplement the requested functionality using appropriate development practices.`;
    }
  }

  private static createFallbackChain(primaryBot: string, availableBots: string[], lastFailure?: string): string[] {
    const fallbacks = availableBots.filter(bot => bot !== primaryBot);
    
    // If there was a last failure, deprioritize that bot
    if (lastFailure) {
      return fallbacks.filter(bot => bot !== lastFailure).concat(
        fallbacks.filter(bot => bot === lastFailure)
      );
    }
    
    return fallbacks;
  }

  // Common routing scenarios for Dream Network project
  static dreamNetworkRoutes = {
    'garden_feed_loaded': {
      'save_dreams': () => ({
        nextBot: 'BackendPrepBot',
        instructions: 'Implement dream save functionality with database persistence. Create POST endpoint for dream submission and update storage layer.',
        fallbackOptions: ['WebsitePrepBot', 'SocialOpsBot']
      }),
      'improve_ui': () => ({
        nextBot: 'WebsitePrepBot', 
        instructions: 'Enhance dream gallery UI with better styling, animations, and user interactions. Implement dream filtering and search.',
        fallbackOptions: ['BackendPrepBot', 'SocialOpsBot']
      }),
      'add_notifications': () => ({
        nextBot: 'SocialOpsBot',
        instructions: 'Implement real-time notifications for dream approvals, cocoon updates, and contributor activities.',
        fallbackOptions: ['BackendPrepBot', 'WebsitePrepBot']
      })
    }
  };
}

// Example usage for Dream Network project
export function routeDreamNetworkTask(currentState: string, goal: string): ConnectorOutput {
  const input: ConnectorInput = {
    currentState,
    goal,
    availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot']
  };
  
  return TaskConnector.route(input);
}