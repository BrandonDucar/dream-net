import { Router } from 'express';
import { nodeRegistry } from '../../dreamnodes/registry/NodeRegistry';

const router = Router();

interface CommandResult {
  success: boolean;
  command: string;
  result?: any;
  error?: string;
  timestamp: string;
}

// Command registry for ecosystem operations
const commands = {
  remix: async (params: string[], walletAddress: string): Promise<CommandResult> => {
    const [target] = params;
    if (!target) {
      return {
        success: false,
        command: 'remix',
        error: 'Target required for remix operation',
        timestamp: new Date().toISOString()
      };
    }

    // Parse target (e.g., "infected:7b3d")
    const [type, id] = target.split(':');
    
    if (type === 'infected' && id) {
      // Enhanced remix operation for infected dreams
      const remixScore = Math.floor(Math.random() * 40) + 60; // 60-99 range
      const bountyBonus = id === '7b3d' ? 250 : Math.floor(Math.random() * 200) + 100;
      
      return {
        success: true,
        command: 'remix',
        result: {
          action: 'Dream successfully remixed and purified',
          dreamId: id,
          originalStatus: 'infected',
          newStatus: 'purified',
          remixScore: remixScore,
          trustRestored: remixScore,
          quarantineLifted: true,
          bountyAwarded: {
            token: 'SHEEP',
            amount: bountyBonus,
            recipient: walletAddress
          },
          newDreamId: `remix-${id}-${Date.now().toString(36)}`,
          claimedBy: walletAddress,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      command: 'remix',
      error: `Unknown remix target: ${target}. Use format: infected:DREAM_ID`,
      timestamp: new Date().toISOString()
    };
  },

  unlock: async (params: string[], walletAddress: string): Promise<CommandResult> => {
    const agentParam = params.find(p => p.startsWith('agent:'));
    const walletParam = params.find(p => p.startsWith('wallet:'));
    
    if (!agentParam || !walletParam) {
      return {
        success: false,
        command: 'unlock',
        error: 'Both agent and wallet parameters required',
        timestamp: new Date().toISOString()
      };
    }

    const agent = agentParam.split(':')[1];
    const targetWallet = walletParam.split(':')[1];

    // Check if requester has permission
    // Use environment variable for operator wallets instead of hardcoded values
    const operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
    const isOperator = walletAddress && operatorWallets.includes(walletAddress.toLowerCase());
    
    if (!isOperator) {
      return {
        success: false,
        command: 'unlock',
        error: 'Insufficient privileges for agent unlock',
        timestamp: new Date().toISOString()
      };
    }

    // Simulate agent unlock
    return {
      success: true,
      command: 'unlock',
      result: {
        action: 'Agent unlocked successfully',
        agent: agent.toUpperCase(),
        unlockedFor: targetWallet,
        accessLevel: 'Full',
        capabilities: ['messaging', 'token-operations', 'system-access']
      },
      timestamp: new Date().toISOString()
    };
  },

  inject: async (params: string[], walletAddress: string): Promise<CommandResult> => {
    const sheepParam = params.find(p => p.startsWith('sheep:'));
    const walletParam = params.find(p => p.startsWith('wallet:'));
    
    if (!sheepParam || !walletParam) {
      return {
        success: false,
        command: 'inject',
        error: 'Both sheep amount and wallet parameters required',
        timestamp: new Date().toISOString()
      };
    }

    const amount = parseInt(sheepParam.split(':')[1]);
    const targetWallet = walletParam.split(':')[1];

    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        command: 'inject',
        error: 'Invalid sheep amount',
        timestamp: new Date().toISOString()
      };
    }

    // Simulate token injection
    return {
      success: true,
      command: 'inject',
      result: {
        action: 'Sheep tokens injected',
        amount,
        recipient: targetWallet,
        tokenType: 'SHEEP',
        transactionId: `sheep-${Date.now()}`,
        newBalance: amount + Math.floor(Math.random() * 10000)
      },
      timestamp: new Date().toISOString()
    };
  }
};

// POST /api/ecosystem/command - Execute ecosystem commands
router.post('/command', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const { commandLine } = req.body;

    if (!commandLine || typeof commandLine !== 'string') {
      return res.status(400).json({
        error: 'Command line required',
        format: 'Expected: "command param1 param2..."'
      });
    }

    // Parse command line
    const parts = commandLine.trim().split(/\s+/);
    const [command, ...params] = parts;

    if (!command || !commands[command as keyof typeof commands]) {
      return res.status(400).json({
        error: 'Unknown command',
        available: Object.keys(commands),
        received: command
      });
    }

    // Execute command
    const result = await commands[command as keyof typeof commands](params, walletAddress);
    
    res.json({
      success: true,
      execution: result,
      commandLine,
      executedBy: walletAddress
    });

  } catch (error) {
    res.status(500).json({
      error: 'Command execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/ecosystem/commands - List available commands
router.get('/commands', async (req, res) => {
  const walletAddress = req.headers['x-wallet-address'] as string;
  // Use environment variable for operator wallets instead of hardcoded values
  const operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
  const isOperator = Boolean(walletAddress && operatorWallets.includes(walletAddress.toLowerCase()));

  const availableCommands = {
    remix: {
      description: 'Remix and purify infected entities',
      format: 'remix infected:ID',
      example: 'remix infected:7b3d',
      requiresAuth: false
    },
    unlock: {
      description: 'Unlock agents for specific wallets',
      format: 'unlock agent:AGENT_ID wallet:WALLET_ADDRESS',
      example: 'unlock agent:wing wallet:0xABC',
      requiresAuth: true
    },
    inject: {
      description: 'Inject tokens into wallet',
      format: 'inject sheep:AMOUNT wallet:WALLET_ADDRESS',
      example: 'inject sheep:5000 wallet:0xDEF',
      requiresAuth: isOperator
    }
  };

  res.json({
    success: true,
    commands: availableCommands,
    operatorAccess: isOperator,
    wallet: walletAddress
  });
});

export default router;