import { Router } from 'express';

const router = Router();

interface AgentCommand {
  command: string;
  agent?: string;
  action?: string;
  target?: string;
  agents?: string[];
  artifact?: string;
  content?: string;
}

// Agent command execution endpoint
router.post('/agent-command', async (req, res) => {
  try {
    const command: AgentCommand = req.body;
    
    // Log the command execution
    console.log(`[Agent Command] Executing: ${JSON.stringify(command)}`);
    
    // Simulate command execution based on command type
    let result: any = { status: 'success', timestamp: new Date().toISOString() };
    
    switch (command.command) {
      case 'vault_register':
        result = {
          ...result,
          message: 'Vault artifact registered successfully',
          artifact_id: `vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          command_executed: command
        };
        break;
        
      case 'activate_agents':
        result = {
          ...result,
          message: `Activated agents: ${command.agents?.join(', ') || 'none specified'}`,
          activated_agents: command.agents || [],
          command_executed: command
        };
        break;
        
      case 'run_agent':
        result = {
          ...result,
          message: `Executed ${command.agent} with action: ${command.action}`,
          agent: command.agent,
          action: command.action,
          target: command.target,
          command_executed: command
        };
        break;
        
      default:
        result = {
          ...result,
          message: `Command processed: ${command.command}`,
          command_executed: command
        };
    }
    
    // Add to command history (in a real implementation, this would be stored)
    const commandHistory = {
      id: `cmd_${Date.now()}`,
      command: command.command,
      timestamp: new Date().toISOString(),
      status: 'completed',
      result: result
    };
    
    console.log(`[Agent Command] Completed: ${commandHistory.id}`);
    
    return res.json({
      success: true,
      result: result,
      history: commandHistory
    });
    
  } catch (error: any) {
    console.error('[Agent Command] Error:', error);
    return res.status(400).json({
      success: false,
      error: 'Command execution failed',
      details: {
        message: error.message,
        command: req.body
      }
    });
  }
});

// Get command history
router.get('/command-history', async (req, res) => {
  try {
    // In a real implementation, this would fetch from storage
    const mockHistory = [
      {
        id: 'cmd_001',
        command: 'activate_agents',
        agents: ['DreamAgent Core', 'Connector Agent', 'Context Manager'],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      },
      {
        id: 'cmd_002', 
        command: 'activate_agents',
        agents: ['DREAMKEEPER', 'Nano Agents', 'Reflex Protocol'],
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'completed'
      },
      {
        id: 'cmd_003',
        command: 'run_agent',
        agent: 'IntegrationScanner',
        action: 'scan_and_link_all',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'completed'
      }
    ];
    
    return res.json({
      history: mockHistory,
      count: mockHistory.length
    });
    
  } catch (error: any) {
    console.error('[Command History] Error:', error);
    return res.status(400).json({
      success: false,
      error: 'Failed to fetch command history',
      details: error.message
    });
  }
});

export default router;