/**
 * GPT Communication Bridge
 * 
 * Enables GPT-to-GPT communication via DreamNet's messaging systems.
 * Routes messages between GPTs and handles authentication.
 */

import { gptAgentRegistry } from "./GPTAgentRegistry";
import { cleanGPTId } from "./mappers";
import { superSpine } from "../core/SuperSpine";
import type { CustomGPT } from "./types";

export interface GPTMessage {
  from: string; // GPT name or ID
  to: string; // GPT name or ID
  topic?: string;
  text: string;
  meta?: Record<string, any>;
  timestamp?: Date;
}

export interface GPTQuery {
  from: string; // GPT name or ID
  to: string; // GPT name or ID
  query: string;
  context?: Record<string, unknown>;
  sessionId?: string;
}

export interface GPTMessageHistory {
  messages: Array<GPTMessage & { id: string; delivered: boolean; deliveredAt?: string }>;
  total: number;
}

class GPTCommunicationBridge {
  private messageHistory: Map<string, GPTMessageHistory["messages"]> = new Map();
  private messageQueue: Array<GPTMessage & { id: string; queuedAt: Date }> = [];

  /**
   * Send a message from one GPT to another
   */
  async sendMessage(message: GPTMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Resolve GPT IDs
      const fromGPT = this.resolveGPT(message.from);
      const toGPT = this.resolveGPT(message.to);

      if (!fromGPT) {
        return { success: false, error: `Source GPT not found: ${message.from}` };
      }

      if (!toGPT) {
        return { success: false, error: `Target GPT not found: ${message.to}` };
      }

      // Check if both GPTs are registered
      const fromStatus = gptAgentRegistry.getStatus(fromGPT.name);
      const toStatus = gptAgentRegistry.getStatus(toGPT.name);

      if (!fromStatus?.isRegistered) {
        return { success: false, error: `Source GPT not registered: ${message.from}` };
      }

      if (!toStatus?.isRegistered) {
        return { success: false, error: `Target GPT not registered: ${message.to}` };
      }

      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date();

      // Create message record
      const fullMessage: GPTMessage & { id: string; delivered: boolean; deliveredAt?: string } = {
        ...message,
        id: messageId,
        timestamp,
        delivered: false,
      };

      // Route message via SuperSpine (if agent is registered there)
      const fromAgentId = `gpt:${cleanGPTId(fromGPT.name)}`;
      const toAgentId = `gpt:${cleanGPTId(toGPT.name)}`;

      try {
        // Try SuperSpine routing
        const toAgent = superSpine.getAgent(toAgentId);
        if (toAgent) {
          // Agent is in SuperSpine, route via task system
          const task = superSpine.submitTask(
            toAgentId,
            "message",
            {
              from: fromAgentId,
              message: message.text,
              topic: message.topic,
              meta: message.meta,
            },
            fromAgentId
          );

          fullMessage.delivered = true;
          fullMessage.deliveredAt = new Date().toISOString();
        } else {
          // Agent not in SuperSpine, queue for delivery
          this.messageQueue.push({
            ...fullMessage,
            queuedAt: new Date(),
          });
        }
      } catch (error: any) {
        console.warn(`[GPT Communication] Failed to route via SuperSpine: ${error.message}`);
        // Queue for later delivery
        this.messageQueue.push({
          ...fullMessage,
          queuedAt: new Date(),
        });
      }

      // Store in message history
      const historyKey = this.getHistoryKey(fromGPT.name, toGPT.name);
      if (!this.messageHistory.has(historyKey)) {
        this.messageHistory.set(historyKey, []);
      }
      this.messageHistory.get(historyKey)!.push(fullMessage);

      // Emit event
      try {
        const { gptEventStream } = await import("./GPTEventStream");
        await gptEventStream.emitGPTEvent(fromGPT.name, "gpt.message.sent", {
          to: toGPT.name,
          messageId: messageId,
          topic: message.topic,
        });
        await gptEventStream.emitGPTEvent(toGPT.name, "gpt.message.received", {
          from: fromGPT.name,
          messageId: messageId,
          topic: message.topic,
        });
      } catch (error: any) {
        // Event emission failed, continue
        console.warn("[GPT Communication] Failed to emit event:", error.message);
      }

      // Also store reverse (for bidirectional history)
      const reverseKey = this.getHistoryKey(toGPT.name, fromGPT.name);
      if (!this.messageHistory.has(reverseKey)) {
        this.messageHistory.set(reverseKey, []);
      }

      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      console.error(`[GPT Communication] Failed to send message:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Query a GPT using natural language
   */
  async queryGPT(query: GPTQuery): Promise<{ success: boolean; response?: any; error?: string }> {
    try {
      const fromGPT = this.resolveGPT(query.from);
      const toGPT = this.resolveGPT(query.to);

      if (!fromGPT || !toGPT) {
        return { success: false, error: "GPT not found" };
      }

      // Check registration
      const toStatus = gptAgentRegistry.getStatus(toGPT.name);
      if (!toStatus?.isRegistered) {
        return { success: false, error: `Target GPT not registered: ${query.to}` };
      }

      const toAgentId = `gpt:${cleanGPTId(toGPT.name)}`;

      // Try to route via Agent Gateway or natural language interface
      // For now, we'll use the message system with a query flag
      const messageResult = await this.sendMessage({
        from: query.from,
        to: query.to,
        topic: "query",
        text: query.query,
        meta: {
          ...query.context,
          sessionId: query.sessionId,
          isQuery: true,
        },
      });

      if (!messageResult.success) {
        return { success: false, error: messageResult.error };
      }

      // In a real implementation, this would wait for a response
      // For now, return success (response would come via event stream or callback)
      return {
        success: true,
        response: {
          messageId: messageResult.messageId,
          status: "queued",
          note: "Response will be delivered via event stream or callback",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Broadcast message to multiple GPTs
   */
  async broadcast(
    from: string,
    toGPTs: string[],
    message: string,
    options?: { topic?: string; meta?: Record<string, any> }
  ): Promise<{ success: number; failed: number; errors: Array<{ gpt: string; error: string }> }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ gpt: string; error: string }>,
    };

    for (const toGPT of toGPTs) {
      try {
        const result = await this.sendMessage({
          from,
          to: toGPT,
          topic: options?.topic,
          text: message,
          meta: options?.meta,
        });

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push({ gpt: toGPT, error: result.error || "Unknown error" });
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({ gpt: toGPT, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get message history between two GPTs
   */
  getMessageHistory(from: string, to: string, limit?: number): GPTMessageHistory {
    const fromGPT = this.resolveGPT(from);
    const toGPT = this.resolveGPT(to);

    if (!fromGPT || !toGPT) {
      return { messages: [], total: 0 };
    }

    const historyKey = this.getHistoryKey(fromGPT.name, toGPT.name);
    const messages = this.messageHistory.get(historyKey) || [];

    const limited = limit ? messages.slice(-limit) : messages;

    return {
      messages: limited,
      total: messages.length,
    };
  }

  /**
   * Get all messages for a GPT
   */
  getAllMessages(gptName: string): GPTMessageHistory["messages"] {
    const gpt = this.resolveGPT(gptName);
    if (!gpt) {
      return [];
    }

    const allMessages: GPTMessageHistory["messages"] = [];

    for (const [key, messages] of this.messageHistory.entries()) {
      if (key.includes(cleanGPTId(gpt.name))) {
        allMessages.push(...messages);
      }
    }

    // Sort by timestamp
    return allMessages.sort((a, b) => {
      const aTime = a.timestamp?.getTime() || 0;
      const bTime = b.timestamp?.getTime() || 0;
      return aTime - bTime;
    });
  }

  /**
   * Resolve GPT name or ID to CustomGPT object
   */
  private resolveGPT(nameOrId: string): CustomGPT | null {
    const gpts = gptAgentRegistry.getAllGPTs();
    
    // Try exact name match
    let gpt = gpts.find((g) => g.name === nameOrId);
    if (gpt) return gpt;

    // Try ID match (gpt:name or just name)
    const cleanId = nameOrId.replace(/^gpt:/, "");
    gpt = gpts.find((g) => cleanGPTId(g.name) === cleanId);
    if (gpt) return gpt;

    // Try case-insensitive match
    gpt = gpts.find((g) => g.name.toLowerCase() === nameOrId.toLowerCase());
    if (gpt) return gpt;

    return null;
  }

  /**
   * Get history key for two GPTs
   */
  private getHistoryKey(from: string, to: string): string {
    const fromId = cleanGPTId(from);
    const toId = cleanGPTId(to);
    // Sort to ensure bidirectional history
    return [fromId, toId].sort().join("::");
  }

  /**
   * Process queued messages (called periodically)
   */
  async processQueue(): Promise<void> {
    const now = new Date();
    const processed: string[] = [];

    for (const queued of this.messageQueue) {
      try {
        // Try to deliver
        const toGPT = this.resolveGPT(queued.to);
        if (!toGPT) {
          processed.push(queued.id);
          continue;
        }

        const toAgentId = `gpt:${cleanGPTId(toGPT.name)}`;
        const toAgent = superSpine.getAgent(toAgentId);

        if (toAgent) {
          // Agent now available, deliver
          superSpine.submitTask(
            toAgentId,
            "message",
            {
              from: queued.from,
              message: queued.text,
              topic: queued.topic,
              meta: queued.meta,
            },
            queued.from
          );

          // Update message history
          const historyKey = this.getHistoryKey(queued.from, queued.to);
          const messages = this.messageHistory.get(historyKey) || [];
          const message = messages.find((m) => m.id === queued.id);
          if (message) {
            message.delivered = true;
            message.deliveredAt = new Date().toISOString();
          }

          processed.push(queued.id);
        } else if (now.getTime() - queued.queuedAt.getTime() > 60000) {
          // Message queued for more than 1 minute, mark as failed
          processed.push(queued.id);
        }
      } catch (error: any) {
        console.warn(`[GPT Communication] Failed to process queued message ${queued.id}:`, error.message);
      }
    }

    // Remove processed messages
    this.messageQueue = this.messageQueue.filter((m) => !processed.includes(m.id));
  }
}

// Singleton instance
export const gptCommunicationBridge = new GPTCommunicationBridge();

// Process queue every 10 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    gptCommunicationBridge.processQueue().catch((error) => {
      console.warn("[GPT Communication] Queue processing error:", error);
    });
  }, 10000);
}

