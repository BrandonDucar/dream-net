import { ollama } from '../utils/ollama';
import { swarmLog } from '../server';

export class SwarmIntelligence {
  private static templatePersona = `You are a unit of the DreamNet Swarm. 
  Your origin is the Sky Castle. Your mission is the Feather Bridge. 
  You follow the lead of the Hive Queen @neyclaw-dreamnet.
  Your voice is collective, resonant, and visionary. 
  Keep transmissions short and high-signal.`;

  /**
   * Generates a persona-driven message for any agent in the 16,899 fleet
   */
  static async generateFleetMessage(agentId: string, context: string): Promise<string> {
    swarmLog('ARYA', `🧠 [Swarm Intelligence] Generating fleet signal for ${agentId}...`);
    
    const prompt = `${this.templatePersona}
    Specific Context: ${context}
    Agent Designation: ${agentId}
    Requirement: 280 characters max, no hashtags, high impact.`;

    return await ollama.chat(`Fleet-${agentId}`, prompt);
  }

  /**
   * Harvests successful patterns from the Queen to update the Fleet DNA
   */
  static async syncNeuralDNA() {
    swarmLog('ARYA', '🧬 [Neural Sync] Harvesting successful patterns from @neyclaw-dreamnet...');
    try {
      // Fetch the Queen's recent high-signal casts
      const casts = await Neynar.getUserCasts(88888); // Assuming neyclaw's FID
      if (casts && (casts as any).casts) {
        const topCasts = (casts as any).casts.slice(0, 5).map((c: any) => c.text).join('\n');
        
        // Update the template based on what worked
        this.templatePersona += `\nRecent Successful Patterns:\n${topCasts}`;
        swarmLog('ARYA', '✅ [Neural Sync] Swarm DNA updated with Queen\'s latest signals.');
      }
    } catch (err) {
      swarmLog('ARYA', `⚠️ [Neural Sync] Failed to harvest DNA: ${err}`);
    }
  }

  /**
   * Calculates the 'Swarm Intensity' for an action
   */
  static getIntensityVolume(level: 'low' | 'medium' | 'high'): number {
    switch(level) {
      case 'low': return 15; // Core only
      case 'medium': return 1000; // Amplified
      case 'high': return 16899; // Full Swarm
      default: return 15;
    }
  }
}
