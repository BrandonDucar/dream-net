/**
 * 👥 AUTOGEN CONVERSABLE AGENT MODULE
 * 
 * Implements AutoGen-style multi-agent conversations.
 * Agents communicate, coordinate, and reach consensus on decisions.
 * 
 * Inspired by Microsoft's AutoGen framework, adapted for DreamNet.
 */

import { EventEmitter } from 'events';

interface Message {
  sender: string;
  receiver: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
}

interface ConversationRound {
  roundNumber: number;
  messages: Message[];
  consensusReached: boolean;
}

class AutoGenConversableAgent extends EventEmitter {
  private agentName: string;
  private systemPrompt: string;
  private messageHistory: Message[] = [];
  private conversationRounds: ConversationRound[] = [];
  private personality = {
    role: 'assistant',
    expertise: '',
    decisionStyle: 'collaborative'
  };

  constructor(agentName: string, systemPrompt: string, expertise: string = '') {
    super();
    this.agentName = agentName;
    this.systemPrompt = systemPrompt;
    this.personality.expertise = expertise;
  }

  /**
   * Receive a message from another agent
   */
  async receiveMessage(message: Message): Promise<string> {
    // Add to history
    this.messageHistory.push(message);
    this.emit('message_received', message);

    // Generate response using agent's personality
    const response = await this.generateResponse(message);

    return response;
  }

  /**
   * Generate a response to a message
   */
  private async generateResponse(incomingMessage: Message): Promise<string> {
    // Simulated LLM response (in production: calls OpenAI with LangChain)
    let response = '';

    if (incomingMessage.role === 'user') {
      response = `[${this.agentName}]: Analyzing your request. Expertise: ${this.personality.expertise}. Let me provide analysis...`;
    } else if (incomingMessage.role === 'assistant') {
      // Evaluate if we agree or have suggestions
      if (Math.random() > 0.3) {
        response = `[${this.agentName}]: I agree with this approach. AGREEMENT.`;
      } else {
        response = `[${this.agentName}]: I would suggest an alternative. Let's discuss further.`;
      }
    } else {
      response = `[${this.agentName}]: Acknowledged. Ready for next step.`;
    }

    // Add response to history
    const responseMessage: Message = {
      sender: this.agentName,
      receiver: incomingMessage.sender,
      content: response,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

    this.messageHistory.push(responseMessage);
    this.emit('message_sent', responseMessage);

    return response;
  }

  /**
   * Initiate a conversation between multiple agents
   * Similar to AutoGen's group chat
   */
  async initiateConversation(peers: AutoGenConversableAgent[], task: string, maxRounds: number = 5): Promise<ConversationRound[]> {
    const rounds: ConversationRound[] = [];

    console.log(`
      🤖 Initiating conversation between agents
      Initiator: ${this.agentName}
      Peers: ${peers.map(p => p.agentName).join(', ')}
      Task: ${task}
    `);

    for (let round = 1; round <= maxRounds; round++) {
      const roundMessages: Message[] = [];

      // On first round, initiator sends task
      if (round === 1) {
        const initialMessage: Message = {
          sender: this.agentName,
          receiver: 'group',
          content: `Task: ${task}`,
          role: 'user',
          timestamp: new Date().toISOString()
        };

        roundMessages.push(initialMessage);

        // All peers respond
        for (const peer of peers) {
          const response = await peer.receiveMessage(initialMessage);
          roundMessages.push({
            sender: peer.agentName,
            receiver: this.agentName,
            content: response,
            role: 'assistant',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        // Subsequent rounds: agents respond to each other
        for (const peer of peers) {
          // Get previous response from another peer
          const previousMessage = roundMessages[roundMessages.length - 1];
          const response = await peer.receiveMessage(previousMessage);
          roundMessages.push({
            sender: peer.agentName,
            receiver: previousMessage.sender,
            content: response,
            role: 'assistant',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Check for consensus
      const consensus = this.checkConsensus(roundMessages);

      const roundData: ConversationRound = {
        roundNumber: round,
        messages: roundMessages,
        consensusReached: consensus
      };

      rounds.push(roundData);
      this.conversationRounds.push(roundData);

      console.log(`  Round ${round} complete. Consensus: ${consensus ? 'YES' : 'NO'}`);

      if (consensus) {
        console.log(`  ✅ Consensus reached in round ${round}`);
        break;
      }
    }

    return rounds;
  }

  /**
   * Check if agents have reached consensus
   */
  private checkConsensus(messages: Message[]): boolean {
    // Simple consensus: if 80%+ of agents mentioned "AGREEMENT" or similar
    const agreementCount = messages.filter(m =>
      m.content.includes('AGREE') || m.content.includes('Yes') || m.content.includes('approve')
    ).length;

    const consensusThreshold = messages.length * 0.8;
    return agreementCount >= consensusThreshold;
  }

  /**
   * Get agent's message history
   */
  getMessageHistory(limit: number = 50): Message[] {
    return this.messageHistory.slice(-limit);
  }

  /**
   * Get conversation history
   */
  getConversationHistory(limit: number = 10): ConversationRound[] {
    return this.conversationRounds.slice(-limit);
  }

  /**
   * Get agent summary
   */
  getSummary() {
    return {
      agentName: this.agentName,
      expertise: this.personality.expertise,
      totalMessages: this.messageHistory.length,
      totalConversations: this.conversationRounds.length,
      messageHistory: this.getMessageHistory(5),
      conversationHistory: this.getConversationHistory(3)
    };
  }
}

export default AutoGenConversableAgent;
