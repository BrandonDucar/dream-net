/**
 * 🧪 INTEGRATION REGISTRY MODULE TESTS
 * 
 * Verifies all three integrations work together: LangChain + Solana + AutoGen
 */

import IntegrationRegistry from '../growth/integration-registry';

describe('IntegrationRegistry', () => {
  let registry: IntegrationRegistry;

  beforeEach(() => {
    registry = new IntegrationRegistry();
  });

  describe('Initialization', () => {
    it('should create registry', () => {
      expect(registry).toBeDefined();
    });

    it('should start with zero instances', () => {
      const counts = registry.getInstanceCounts();
      expect(counts.langchain).toBe(0);
      expect(counts.solana).toBe(0);
      expect(counts.autogen).toBe(0);
      expect(counts.total).toBe(0);
    });
  });

  describe('LangChain Integration', () => {
    it('should activate LangChain integration', () => {
      registry.activateLangChain(10);
      const counts = registry.getInstanceCounts();
      expect(counts.langchain).toBe(10);
    });

    it('should create 50 agents on full activation', () => {
      registry.activateLangChain(50);
      const counts = registry.getInstanceCounts();
      expect(counts.langchain).toBe(50);
    });

    it('should return LangChain instances', () => {
      registry.activateLangChain(5);
      const instances = registry.getInstances('langchain');
      expect(instances).toHaveLength(5);
    });
  });

  describe('Solana Integration', () => {
    it('should activate Solana integration', () => {
      registry.activateSolana();
      const counts = registry.getInstanceCounts();
      expect(counts.solana).toBe(1);
    });

    it('should return Solana executor', () => {
      registry.activateSolana();
      const instances = registry.getInstances('solana');
      expect(instances).toHaveLength(1);
    });
  });

  describe('AutoGen Integration', () => {
    it('should activate AutoGen integration', () => {
      registry.activateAutoGen();
      const counts = registry.getInstanceCounts();
      expect(counts.autogen).toBe(3); // Hawk, Sable, Clawedette
    });

    it('should create core agents', () => {
      registry.activateAutoGen();
      const instances = registry.getInstances('autogen');
      
      expect(instances).toHaveLength(3);
      // Verify names match core agents
      const names = instances.map((a: any) => a.getSummary().agentName);
      expect(names).toContain('Hawk');
      expect(names).toContain('Sable');
      expect(names).toContain('Clawedette');
    });
  });

  describe('Combined Activation', () => {
    it('should activate all integrations', () => {
      registry.activateLangChain(50);
      registry.activateSolana();
      registry.activateAutoGen();

      const counts = registry.getInstanceCounts();
      expect(counts.langchain).toBe(50);
      expect(counts.solana).toBe(1);
      expect(counts.autogen).toBe(3);
      expect(counts.total).toBe(54);
    });
  });

  describe('Status Reporting', () => {
    it('should generate status report', () => {
      registry.activateLangChain(50);
      registry.activateSolana();
      registry.activateAutoGen();

      const report = registry.getStatusReport();
      
      expect(report.timestamp).toBeDefined();
      expect(report.integrations).toBeDefined();
      expect(report.totalInstances).toBe(54);
    });

    it('should track integration activation status', () => {
      registry.activateLangChain(50);
      const report1 = registry.getStatusReport();
      expect(report1.integrations.langchain.active).toBe(true);
      expect(report1.integrations.solana.active).toBe(false);
      expect(report1.integrations.autogen.active).toBe(false);

      registry.activateSolana();
      const report2 = registry.getStatusReport();
      expect(report2.integrations.langchain.active).toBe(true);
      expect(report2.integrations.solana.active).toBe(true);
      expect(report2.integrations.autogen.active).toBe(false);
    });

    it('should list all agent IDs', () => {
      registry.activateLangChain(5);
      const report = registry.getStatusReport();
      
      expect(report.integrations.langchain.agents).toBeDefined();
      expect(report.integrations.langchain.agents.length).toBe(5);
    });
  });

  describe('Lifecycle', () => {
    it('should support multiple activation cycles', () => {
      registry.activateLangChain(10);
      let counts = registry.getInstanceCounts();
      expect(counts.total).toBe(10);

      registry.activateSolana();
      counts = registry.getInstanceCounts();
      expect(counts.total).toBe(11);

      registry.activateAutoGen();
      counts = registry.getInstanceCounts();
      expect(counts.total).toBe(14);
    });
  });
});

describe('Full DreamNet Integration Scenario', () => {
  it('should activate complete integration suite', () => {
    const registry = new IntegrationRegistry();

    // Activate all three integrations
    registry.activateLangChain(50);
    registry.activateSolana();
    registry.activateAutoGen();

    // Verify all are running
    const report = registry.getStatusReport();
    expect(report.integrations.langchain.active).toBe(true);
    expect(report.integrations.solana.active).toBe(true);
    expect(report.integrations.autogen.active).toBe(true);

    // Get instances
    const langchainAgents = registry.getInstances('langchain');
    const solanaExecutor = registry.getInstances('solana');
    const autoGenAgents = registry.getInstances('autogen');

    expect(langchainAgents).toHaveLength(50);
    expect(solanaExecutor).toHaveLength(1);
    expect(autoGenAgents).toHaveLength(3);

    // Verify counts
    const counts = registry.getInstanceCounts();
    expect(counts.total).toBe(54);

    console.log('✅ Full integration suite activated:');
    console.log(`   - 50 LangChain agents (advanced reasoning)`);
    console.log(`   - 1 Solana executor (blockchain transactions)`);
    console.log(`   - 3 AutoGen agents (Hawk, Sable, Clawedette)`);
    console.log(`   - Total instances: ${counts.total}`);
  });

  it('should support cross-integration workflows', async () => {
    const registry = new IntegrationRegistry();

    registry.activateLangChain(5);
    registry.activateSolana();
    registry.activateAutoGen();

    // Get instances from each integration
    const langchainAgents = registry.getInstances('langchain');
    const autoGenAgents = registry.getInstances('autogen');

    // Simulate cross-integration: LangChain agent reasoning → AutoGen coordination → Solana execution
    expect(langchainAgents).toBeDefined();
    expect(autoGenAgents).toBeDefined();

    // In production:
    // 1. LangChain agent generates execution plan
    // 2. AutoGen agents coordinate on plan
    // 3. Solana executor processes transactions
  });
});
