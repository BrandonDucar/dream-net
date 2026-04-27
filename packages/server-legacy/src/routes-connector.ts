/**
 * API Routes for Task Connector System
 */

import express from 'express';
import { TaskConnector, type ConnectorInput, type ConnectorOutput, routeDreamNetworkTask } from './task-connector';
import { connectorBotV1 } from './routes/ConnectorBot';

const router = express.Router();

// Route task to appropriate bot using ConnectorBot v1
router.post('/route', async (req, res) => {
  try {
    const input: ConnectorInput = req.body;
    
    // Validate input
    if (!input.currentState || !input.goal) {
      return res.status(400).json({ 
        error: 'Missing required fields: currentState, goal' 
      });
    }
    
    // Use ConnectorBot v1 for intelligent routing
    const routingDecision = await connectorBotV1.routeTask({
      currentState: input.currentState,
      goal: input.goal,
      availableBots: input.availableBots || ['WebsitePrepBot', 'BackendPrepBot', 'AdminDashboardAgent', 'DreamIntakeBot', 'SocialOpsBot'],
      walletData: (input as any).walletData,
      urgency: (input as any).priority || 'medium' as 'low' | 'medium' | 'high',
      complexity: (input as any).complexity || 'moderate' as 'simple' | 'moderate' | 'complex'
    });
    
    // Convert to legacy format for compatibility
    const output: ConnectorOutput = {
      nextBot: routingDecision.routedTo,
      instructions: `${routingDecision.reasoning}. Next steps: ${routingDecision.nextSteps.join(', ')}`
    };
    
    console.log(`[ConnectorBot v1] Routing: ${input.currentState} → ${output.nextBot}`);
    console.log(`[ConnectorBot v1] Confidence: ${routingDecision.confidence}%`);
    console.log(`[ConnectorBot v1] Reasoning: ${routingDecision.reasoning}`);
    
    res.json({
      ...output,
      agent_version: connectorBotV1.getVersion(),
      fallback_chain: routingDecision.fallbackChain,
      next_steps: routingDecision.nextSteps,
      confidence: routingDecision.confidence,
      estimatedTime: routingDecision.estimatedDuration
    });
  } catch (error: any) {
    console.error('[ConnectorBot v1] Route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available bots and their capabilities
router.get('/bots', async (req, res) => {
  try {
    const capabilities = {
      WebsitePrepBot: {
        description: 'Frontend development and UI implementation',
        capabilities: ['React components', 'Styling', 'User interfaces', 'Forms', 'Routing']
      },
      BackendPrepBot: {
        description: 'Backend API and database development', 
        capabilities: ['API endpoints', 'Database operations', 'Authentication', 'Data persistence']
      },
      SocialOpsBot: {
        description: 'Social features and external integrations',
        capabilities: ['Notifications', 'Webhooks', 'Social media', 'User engagement']
      },
      AdminDashboardAgent: {
        description: 'Admin interface and security management',
        capabilities: ['Admin dashboard', 'Wallet authentication', 'Secret key handling', 'User management']
      },
      DreamIntakeBot: {
        description: 'Dream submission and processing workflows',
        capabilities: ['Dream intake', 'Content validation', 'User onboarding', 'Processing pipelines']
      },
      ConnectorBot: {
        description: 'Task coordination and workflow orchestration',
        capabilities: ['Task routing', 'Workflow management', 'Fallback handling', 'System coordination']
      }
    };
    
    res.json(capabilities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dream Network specific routing
router.post('/dream-network', async (req, res) => {
  try {
    const { currentState, goal } = req.body;
    
    if (!currentState || !goal) {
      return res.status(400).json({ 
        error: 'Missing required fields: currentState, goal' 
      });
    }
    
    const output = routeDreamNetworkTask(currentState, goal);
    
    console.log(`[Dream Network Connector] ${currentState} → ${goal} → ${output.nextBot}`);
    
    res.json({
      ...output,
      projectContext: 'Dream Network Management Platform',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Dream Network Connector] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test connector with sample scenarios
router.get('/test', async (req, res) => {
  try {
    const scenarios = [
      {
        name: 'Garden Feed to Dream Save',
        input: {
          currentState: 'Garden feed API working with static dreams',
          goal: 'Implement dream save functionality with database persistence',
          availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot', 'AdminDashboardAgent']
        }
      },
      {
        name: 'Static Data to UI Enhancement',
        input: {
          currentState: 'Dream data loading from static endpoint',
          goal: 'Improve dream gallery frontend with animations and filtering',
          availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot', 'DreamIntakeBot']
        }
      },
      {
        name: 'Working Backend to Notifications',
        input: {
          currentState: 'Dream saving and loading working',
          goal: 'Add real-time notifications for dream approvals',
          availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot']
        }
      },
      {
        name: 'Database Failure Recovery',
        input: {
          currentState: 'Database connection failed',
          goal: 'Restore database functionality',
          lastFailure: 'DB connection timeout error',
          availableBots: ['BackendPrepBot', 'AdminDashboardAgent', 'ConnectorBot']
        }
      },
      {
        name: 'Admin Interface Setup',
        input: {
          currentState: 'Backend API working',
          goal: 'Set up admin dashboard with wallet authentication',
          availableBots: ['AdminDashboardAgent', 'WebsitePrepBot', 'BackendPrepBot']
        }
      }
    ];
    
    const results = scenarios.map(scenario => ({
      scenario: scenario.name,
      input: scenario.input,
      output: TaskConnector.route(scenario.input)
    }));
    
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;