/**
 * Latent Collaboration Core
 * Orchestrator integration for latent collaboration system
 */

import { sendLatentThought } from '../latent-collaboration/src/agentBridge';

export class LatentCollaborationCore {
  /**
   * Extract agent thoughts from Citadel snapshot
   */
  private extractAgentThoughts(citadelSnapshot?: any): Array<{ agentId: string; text: string }> {
    if (!citadelSnapshot) {
      return [];
    }

    const thoughts: Array<{ agentId: string; text: string }> = [];

    // Extract thoughts from various Citadel outputs
    if (citadelSnapshot.snapshot) {
      thoughts.push({
        agentId: 'Citadel',
        text: JSON.stringify(citadelSnapshot.snapshot),
      });
    }

    if (citadelSnapshot.dome?.report) {
      thoughts.push({
        agentId: 'DroneDome',
        text: JSON.stringify(citadelSnapshot.dome.report),
      });
    }

    if (citadelSnapshot.dreamkeeper?.spec) {
      thoughts.push({
        agentId: 'DreamKeeper',
        text: JSON.stringify(citadelSnapshot.dreamkeeper.spec),
      });
    }

    if (citadelSnapshot.deploykeeper?.blueprint) {
      thoughts.push({
        agentId: 'DeployKeeper',
        text: JSON.stringify(citadelSnapshot.deploykeeper.blueprint),
      });
    }

    // Add more agent extractions as needed
    return thoughts;
  }

  /**
   * Run latent collaboration step in orchestrator cycle
   */
  async run(context: {
    citadelSnapshot?: any;
    agents?: any[];
    neuralMesh?: any;
    agentWalletManager?: any;
  }): Promise<void> {
    try {
      // Check if latent collaboration is enabled
      const enabled = process.env.USE_LATENT_COLLABORATION === 'true';
      if (!enabled) {
        return; // Skip if not enabled
      }

      // 1. Collect agent thoughts from Citadel snapshot
      const agentThoughts = this.extractAgentThoughts(context.citadelSnapshot);
      
      if (agentThoughts.length === 0) {
        return; // No thoughts to process
      }

      // 2. Encode to latent representations
      const latentThoughts = await Promise.all(
        agentThoughts.map(async (thought) => {
          try {
            return await sendLatentThought(
              thought.agentId,
              thought.text,
              undefined, // targetAgents - let all agents see it
              { task: 'citadel_planning' }
            );
          } catch (error) {
            console.warn(`[LatentCollaboration] Failed to encode thought for ${thought.agentId}:`, error);
            return null;
          }
        })
      );

      // Filter out nulls
      const validThoughts = latentThoughts.filter((t) => t !== null) as any[];

      // 3. Store in Neural Mesh
      if (context.neuralMesh && validThoughts.length > 0) {
        await Promise.all(
          validThoughts.map(async (latent, idx) => {
            const originalThought = agentThoughts[idx];
            if (!originalThought) return;

            try {
              await context.neuralMesh.storeLatent(
                originalThought.agentId,
                latent.latentVector.vector,
                originalThought.text,
                { task: 'citadel_planning' }
              );
            } catch (error) {
              console.warn(`[LatentCollaboration] Failed to store latent for ${originalThought.agentId}:`, error);
            }
          })
        );
      }

      // 4. Enable agents to retrieve and collaborate
      // (Agents will retrieve during their individual runs)
    } catch (error) {
      // Don't break orchestrator cycle if latent collaboration fails
      console.error('[LatentCollaboration] Error in latent collaboration step:', error);
    }
  }

