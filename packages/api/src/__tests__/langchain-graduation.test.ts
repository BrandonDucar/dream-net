/**
 * 🧪 LANGCHAIN GRADUATION MODULE TESTS
 * 
 * Verifies LangChain agent initialization, task execution, and tool use.
 */

import LangChainGraduate from '../growth/langchain-graduation';

describe('LangChainGraduate', () => {
  let agent: LangChainGraduate;

  beforeEach(() => {
    agent = new LangChainGraduate('test-agent-1', {
      modelName: 'gpt-4',
      temperature: 0.7
    });
  });

  describe('Initialization', () => {
    it('should create agent with proper configuration', () => {
      expect(agent).toBeDefined();
    });

    it('should have all required tools available', () => {
      const tools = agent.getAvailableTools();
      expect(tools).toContain('query_blockchain');
      expect(tools).toContain('claim_powk_reward');
      expect(tools).toContain('coordinate_with_agents');
      expect(tools).toContain('execute_contract');
      expect(tools).toContain('analyze_patterns');
    });
  });

  describe('Task Execution', () => {
    it('should execute a task successfully', async () => {
      const result = await agent.executeTask('Analyze market and execute strategy');
      expect(result).toBeDefined();
      expect(result).toContain('Task execution complete');
    });

    it('should track performance statistics', async () => {
      await agent.executeTask('Test task 1');
      await agent.executeTask('Test task 2');
      
      const stats = agent.getStats();
      expect(stats.tasksCompleted).toBe(2);
      expect(stats.successRate).toBe(1.0);
    });

    it('should update average latency', async () => {
      const startStats = agent.getStats();
      await agent.executeTask('Performance test task');
      const endStats = agent.getStats();
      
      expect(endStats.averageLatency).toBeGreaterThan(0);
    });
  });

  describe('Tool Management', () => {
    it('should execute blockchain queries', async () => {
      const result = await agent.executeTask('Query blockchain for liquidity');
      expect(result).toContain('query_blockchain');
    });

    it('should claim P.O.W.K. rewards after tasks', async () => {
      // Complete 5 tasks to trigger auto-reward
      for (let i = 0; i < 5; i++) {
        await agent.executeTask(`Task ${i}`);
      }
      
      const stats = agent.getStats();
      expect(stats.rewardsClaimed).toBeGreaterThan(0);
    });

    it('should maintain tool availability after execution', async () => {
      await agent.executeTask('Test task');
      const tools = agent.getAvailableTools();
      expect(tools.length).toBe(5);
    });
  });

  describe('Event Emission', () => {
    it('should emit events during task execution', (done) => {
      let eventCount = 0;
      
      agent.on('task_executed', () => {
        eventCount++;
        if (eventCount >= 1) {
          done();
        }
      });

      agent.executeTask('Event test task').catch(() => {
        // Ignore errors for event testing
      });
    });
  });
});

describe('LangChainGraduate Batch Operations', () => {
  it('should handle multiple agents in parallel', async () => {
    const agents = [
      new LangChainGraduate('agent-1', { modelName: 'gpt-4', temperature: 0.7 }),
      new LangChainGraduate('agent-2', { modelName: 'gpt-4', temperature: 0.7 }),
      new LangChainGraduate('agent-3', { modelName: 'gpt-4', temperature: 0.7 })
    ];

    const results = await Promise.all(
      agents.map(agent => agent.executeTask('Parallel test task'))
    );

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result).toBeDefined();
      expect(result).toContain('Task execution complete');
    });
  });

  it('should support 50-agent cohort graduation', async () => {
    const cohort: LangChainGraduate[] = [];
    
    for (let i = 1; i <= 50; i++) {
      cohort.push(
        new LangChainGraduate(`langchain-agent-${i}`, {
          modelName: 'gpt-4',
          temperature: 0.7
        })
      );
    }

    expect(cohort).toHaveLength(50);
    expect(cohort[0].getAvailableTools()).toHaveLength(5);
    expect(cohort[49].getAvailableTools()).toHaveLength(5);
  });
});
