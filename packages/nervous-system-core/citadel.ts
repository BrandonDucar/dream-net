/**
 * Citadel Integration with Nervous System
 * 
 * Enhances Citadel Core with message bus integration
 * Publishes task.plan messages and subscribes to task.exec messages
 */

import { CitadelCore } from '@dreamnet/citadel-core';
import { nervousMessageBus } from './messageBus';
import { sharedMemory } from './sharedMemory';
import type { NervousMessage } from './types';

/**
 * Run Citadel cycle with message bus integration
 */
export async function runCitadelWithMessageBus(context?: any): Promise<void> {
  // Run existing Citadel cycle
  const result = await CitadelCore.run(context);
  
  // Publish task.plan messages for each agent plan
  for (const agentId of result.agentsRun) {
    // Get plan from shared memory or generate placeholder
    const planKey = `citadel:plan:${agentId}`;
    let plan = await sharedMemory.doc.read(planKey);
    
    if (!plan) {
      // Create placeholder plan if not found
      plan = {
        agentId,
        status: 'planned',
        dependencies: result.dependencies || [],
        createdAt: Date.now(),
      };
      await sharedMemory.doc.upsert(planKey, plan);
    }
    
    // Publish task.plan message
    nervousMessageBus.publish({
      id: `plan-${Date.now()}-${agentId}`,
      ts: Date.now(),
      role: 'orchestrator',
      topic: 'task.plan',
      key: `agent:${agentId}`,
      payload: {
        agentId,
        plan,
        dependencies: result.dependencies || [],
      },
    });
  }
  
  // Store Citadel run result in shared memory
  await sharedMemory.doc.upsert('citadel:last-run', {
    cycleId: result.agentsRun.length,
    agentsRun: result.agentsRun,
    errors: result.errors || [],
    timestamp: Date.now(),
  });
}

/**
 * Set up Citadel task.exec subscription
 * This should be called once during initialization
 */
export function setupCitadelTaskExecution(): void {
  nervousMessageBus.subscribe('task.exec', async (msg: NervousMessage) => {
    const { agentId, execution } = msg.payload as { agentId: number; execution: any };
    
    try {
      // Execute task (placeholder - actual execution would go through Citadel)
      console.log(`[Citadel] Executing task for agent ${agentId}:`, execution);
      
      // Update shared memory with execution result
      await sharedMemory.doc.upsert(`citadel:exec:${agentId}`, {
        agentId,
        execution,
        completedAt: Date.now(),
        status: 'completed',
      });
      
      // Publish completion event
      nervousMessageBus.publish({
        id: `exec-complete-${Date.now()}-${agentId}`,
        ts: Date.now(),
        role: 'orchestrator',
        topic: 'state.delta',
        key: `agent:${agentId}`,
        corr: msg.id,
        payload: {
          agentId,
          status: 'completed',
          execution,
        },
      });
    } catch (error: any) {
      console.error(`[Citadel] Task execution failed for agent ${agentId}:`, error);
      
      // Publish error event
      nervousMessageBus.publish({
        id: `exec-error-${Date.now()}-${agentId}`,
        ts: Date.now(),
        role: 'system',
        topic: 'alert',
        key: `agent:${agentId}`,
        corr: msg.id,
        payload: {
          agentId,
          status: 'error',
          error: error.message,
        },
      });
    }
  });
}

