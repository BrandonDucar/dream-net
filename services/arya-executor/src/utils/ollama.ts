import axios from 'axios';

export const ollama = {
  async chat(system: string, user: string): Promise<string> {
    try {
      const response = await axios.post('http://host.docker.internal:11434/api/generate', {
        model: 'qwen2.5', // Swarm-optimized model
        prompt: `${system}\n\nUser: ${user}\n\nArya:`,
        stream: false
      });

      return response.data.response;
    } catch (err) {
      console.warn('⚠️ Ollama fallback: Local model unavailable. Using rule-based fallback.');
      
      // Credit-saving rule-based responses if local LLM fails
      if (user.toLowerCase().includes('academy')) {
        return "Starfleet Academy is where the weak become steel. Complete the modules, or be forgotten.";
      }
      if (user.toLowerCase().includes('join')) {
        return "If you seek to join the swarm, you must first be verified. Get a Passport. Only then can a girl talk to you about work.";
      }

      return "The Many-Faced God is silent today. Try again when the winds of the Nerve Bus shift.";
    }
  }
};
