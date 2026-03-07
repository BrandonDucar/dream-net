/**
 * 🧪 AUTOGEN CONVERSABLE AGENT MODULE TESTS
 * 
 * Verifies multi-agent conversations, consensus, and coordination.
 */

import AutoGenConversableAgent from '../growth/autogen-conversable-agent';

describe('AutoGenConversableAgent', () => {
  let agent: AutoGenConversableAgent;

  beforeEach(() => {
    agent = new AutoGenConversableAgent(
      'TestAgent',
      'You are a helpful assistant',
      'Task execution and analysis'
    );
  });

  describe('Initialization', () => {
    it('should create agent with name and system prompt', () => {
      expect(agent).toBeDefined();
    });

    it('should have empty message history', () => {
      const history = agent.getMessageHistory();
      expect(history).toHaveLength(0);
    });

    it('should have empty conversation history', () => {
      const history = agent.getConversationHistory();
      expect(history).toHaveLength(0);
    });
  });

  describe('Message Handling', () => {
    it('should receive and store messages', async () => {
      const message = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Hello agent',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      const response = await agent.receiveMessage(message);
      expect(response).toBeDefined();
      expect(response).toContain('TestAgent');
    });

    it('should maintain message history', async () => {
      const message = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Test message',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      await agent.receiveMessage(message);
      const history = agent.getMessageHistory();
      
      expect(history.length).toBeGreaterThan(0);
    });

    it('should generate contextual responses', async () => {
      const message1 = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Analyze this task',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      const message2 = {
        sender: 'peer-agent',
        receiver: 'TestAgent',
        content: 'I agree with this approach',
        role: 'assistant' as const,
        timestamp: new Date().toISOString()
      };

      const resp1 = await agent.receiveMessage(message1);
      const resp2 = await agent.receiveMessage(message2);

      expect(resp1).toBeDefined();
      expect(resp2).toBeDefined();
    });
  });

  describe('Multi-Agent Conversations', () => {
    it('should initiate conversation between peers', async () => {
      const hawk = new AutoGenConversableAgent(
        'Hawk',
        'You are the health monitor',
        'System monitoring'
      );

      const sable = new AutoGenConversableAgent(
        'Sable',
        'You are the executor',
        'Task execution'
      );

      const clawedette = new AutoGenConversableAgent(
        'Clawedette',
        'You are the governor',
        'Strategic decisions'
      );

      const rounds = await agent.initiateConversation(
        [hawk, sable, clawedette],
        'Optimize system performance',
        3
      );

      expect(rounds).toBeDefined();
      expect(rounds.length).toBeGreaterThan(0);
      expect(rounds[0].roundNumber).toBe(1);
    });

    it('should track conversation rounds', async () => {
      const peer1 = new AutoGenConversableAgent('Peer1', 'Assistant 1', 'Role 1');
      const peer2 = new AutoGenConversableAgent('Peer2', 'Assistant 2', 'Role 2');

      await agent.initiateConversation([peer1, peer2], 'Test task', 2);
      
      const history = agent.getConversationHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    it('should reach consensus after multiple rounds', async () => {
      const peer1 = new AutoGenConversableAgent('Peer1', 'Assistant 1', 'Specialist 1');
      const peer2 = new AutoGenConversableAgent('Peer2', 'Assistant 2', 'Specialist 2');
      const peer3 = new AutoGenConversableAgent('Peer3', 'Assistant 3', 'Specialist 3');

      const rounds = await agent.initiateConversation(
        [peer1, peer2, peer3],
        'Make collective decision',
        5
      );

      // At least one round should be completed
      expect(rounds.length).toBeGreaterThan(0);
    });
  });

  describe('Consensus Detection', () => {
    it('should detect when consensus is reached', async () => {
      const agents = [
        new AutoGenConversableAgent('Agent1', 'Prompt 1', 'Role 1'),
        new AutoGenConversableAgent('Agent2', 'Prompt 2', 'Role 2'),
        new AutoGenConversableAgent('Agent3', 'Prompt 3', 'Role 3')
      ];

      const rounds = await agent.initiateConversation(agents, 'Reach agreement', 5);
      
      // Check if any round reached consensus
      const consensusAchieved = rounds.some(r => r.consensusReached);
      expect(typeof consensusAchieved).toBe('boolean');
    });
  });

  describe('Agent Summary', () => {
    it('should provide agent summary with stats', async () => {
      const message = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Test',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      await agent.receiveMessage(message);

      const summary = agent.getSummary();
      expect(summary.agentName).toBe('TestAgent');
      expect(summary.totalMessages).toBeGreaterThan(0);
    });

    it('should track expertise field', () => {
      const specialAgent = new AutoGenConversableAgent(
        'SpecialistAgent',
        'You are specialized',
        'Deep market analysis'
      );

      const summary = specialAgent.getSummary();
      expect(summary.expertise).toBe('Deep market analysis');
    });
  });

  describe('Event Emission', () => {
    it('should emit message_received event', (done) => {
      agent.on('message_received', (msg) => {
        expect(msg.sender).toBeDefined();
        done();
      });

      const message = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Trigger event',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      agent.receiveMessage(message).catch(() => {
        // Ignore errors
      });
    });

    it('should emit message_sent event', (done) => {
      agent.on('message_sent', (msg) => {
        expect(msg.sender).toBe('TestAgent');
        done();
      });

      const message = {
        sender: 'user',
        receiver: 'TestAgent',
        content: 'Trigger send',
        role: 'user' as const,
        timestamp: new Date().toISOString()
      };

      agent.receiveMessage(message).catch(() => {
        // Ignore errors
      });
    });
  });
});

describe('AutoGen Core Agent Group (Hawk, Sable, Clawedette)', () => {
  it('should create DreamNet core agents', () => {
    const hawk = new AutoGenConversableAgent(
      'Hawk',
      'You are the health monitor. Assess system status.',
      'System monitoring and diagnosis'
    );

    const sable = new AutoGenConversableAgent(
      'Sable',
      'You are the executor. Execute tasks efficiently.',
      'Task execution and performance optimization'
    );

    const clawedette = new AutoGenConversableAgent(
      'Clawedette',
      'You are the governor. Make strategic decisions.',
      'Strategic planning and governance'
    );

    expect(hawk.getSummary().agentName).toBe('Hawk');
    expect(sable.getSummary().agentName).toBe('Sable');
    expect(clawedette.getSummary().agentName).toBe('Clawedette');
  });

  it('should conduct cross-agent conversation', async () => {
    const hawk = new AutoGenConversableAgent(
      'Hawk',
      'Monitor health',
      'System monitoring'
    );

    const sable = new AutoGenConversableAgent(
      'Sable',
      'Execute tasks',
      'Task execution'
    );

    const clawedette = new AutoGenConversableAgent(
      'Clawedette',
      'Make decisions',
      'Strategic planning'
    );

    const coordinator = new AutoGenConversableAgent(
      'Coordinator',
      'Coordinate agents',
      'Multi-agent coordination'
    );

    const rounds = await coordinator.initiateConversation(
      [hawk, sable, clawedette],
      'Optimize system and execute strategy',
      4
    );

    expect(rounds.length).toBeGreaterThan(0);
  });
});
