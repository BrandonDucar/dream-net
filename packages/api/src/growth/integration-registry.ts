/**
 * 📋 INTEGRATION REGISTRY
 * 
 * Central registry for all open source integrations.
 * Manages activation, deactivation, and coordination of all modules.
 */

import LangChainGraduate from './langchain-graduation';
import SolanaExecutor from './solana-executor';
import AutoGenConversableAgent from './autogen-conversable-agent';

interface IntegrationStatus {
  name: string;
  active: boolean;
  activatedAt?: string;
  instances: number;
  stats?: any;
}

class IntegrationRegistry {
  private langchainInstances: Map<string, LangChainGraduate> = new Map();
  private solanaInstances: Map<string, SolanaExecutor> = new Map();
  private autogenInstances: Map<string, AutoGenConversableAgent> = new Map();

  private statusLog: IntegrationStatus[] = [];

  /**
   * Activate LangChain integration
   */
  activateLangChain(batchSize: number = 50): void {
    console.log(`🚀 Activating LangChain integration... (${batchSize} agents)`);

    for (let i = 1; i <= batchSize; i++) {
      const agentId = `langchain-agent-${i}`;
      const agent = new LangChainGraduate(agentId, {
        modelName: 'gpt-4',
        temperature: 0.7
      });

      this.langchainInstances.set(agentId, agent);
    }

    this.logStatus('LangChain', true);
    console.log(`✅ LangChain activated: ${batchSize} agents ready`);
  }

  /**
   * Activate Solana integration
   */
  activateSolana(): void {
    console.log(`🌊 Activating Solana integration...`);

    const executor = new SolanaExecutor(
      'solana-executor-1',
      'https://api.mainnet-beta.solana.com'
    );

    this.solanaInstances.set('solana-executor-1', executor);

    this.logStatus('Solana', true);
    console.log(`✅ Solana activated: ready for transaction execution`);
  }

  /**
   * Activate AutoGen integration
   */
  activateAutoGen(): void {
    console.log(`👥 Activating AutoGen integration...`);

    // Create three main agents: Hawk, Sable, Clawedette
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

    this.autogenInstances.set('hawk', hawk);
    this.autogenInstances.set('sable', sable);
    this.autogenInstances.set('clawedette', clawedette);

    this.logStatus('AutoGen', true);
    console.log(`✅ AutoGen activated: 3 main agents (Hawk, Sable, Clawedette)`);
  }

  /**
   * Get all instances of a specific integration
   */
  getInstances(integration: 'langchain' | 'solana' | 'autogen') {
    switch (integration) {
      case 'langchain':
        return Array.from(this.langchainInstances.values());
      case 'solana':
        return Array.from(this.solanaInstances.values());
      case 'autogen':
        return Array.from(this.autogenInstances.values());
      default:
        return [];
    }
  }

  /**
   * Get instance count for each integration
   */
  getInstanceCounts() {
    return {
      langchain: this.langchainInstances.size,
      solana: this.solanaInstances.size,
      autogen: this.autogenInstances.size,
      total: this.langchainInstances.size + this.solanaInstances.size + this.autogenInstances.size
    };
  }

  /**
   * Log integration status
   */
  private logStatus(integration: string, active: boolean): void {
    const status: IntegrationStatus = {
      name: integration,
      active,
      activatedAt: active ? new Date().toISOString() : undefined,
      instances: this.getInstanceCount(integration)
    };

    this.statusLog.push(status);
  }

  /**
   * Get instance count for a specific integration
   */
  private getInstanceCount(integration: string): number {
    switch (integration) {
      case 'LangChain':
        return this.langchainInstances.size;
      case 'Solana':
        return this.solanaInstances.size;
      case 'AutoGen':
        return this.autogenInstances.size;
      default:
        return 0;
    }
  }

  /**
   * Get full status report
   */
  getStatusReport() {
    return {
      timestamp: new Date().toISOString(),
      integrations: {
        langchain: {
          active: this.langchainInstances.size > 0,
          instances: this.langchainInstances.size,
          agents: Array.from(this.langchainInstances.keys())
        },
        solana: {
          active: this.solanaInstances.size > 0,
          instances: this.solanaInstances.size,
          executors: Array.from(this.solanaInstances.keys())
        },
        autogen: {
          active: this.autogenInstances.size > 0,
          instances: this.autogenInstances.size,
          agents: Array.from(this.autogenInstances.keys())
        }
      },
      totalInstances: this.langchainInstances.size + this.solanaInstances.size + this.autogenInstances.size,
      statusLog: this.statusLog
    };
  }
}

export default IntegrationRegistry;
