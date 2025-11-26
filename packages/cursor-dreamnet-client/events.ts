/**
 * Cursor DreamNet Event Stream
 * 
 * Server-Sent Events (SSE) client for real-time DreamNet events
 * Connects to /api/starbridge/stream endpoint
 * 
 * Works in both Node.js and browser environments
 */

import { CursorDreamNetClient } from "./index.js";
import { createParser, type ParsedEvent, type ReconnectInterval, type ParseEvent } from "eventsource-parser";

// ============================================================================
// Types
// ============================================================================

export enum StarbridgeTopic {
  Governor = "Governor",
  Deploy = "Deploy",
  System = "System",
  Economy = "Economy",
  Vault = "Vault",
}

export enum StarbridgeSource {
  Runtime = "Runtime",
  ComputeGovernor = "ComputeGovernor",
  DeployKeeper = "DeployKeeper",
  DreamKeeper = "DreamKeeper",
  RelayBot = "RelayBot",
  External = "External",
}

export interface StarbridgeEvent<T = any> {
  id: string;
  topic: StarbridgeTopic;
  source: StarbridgeSource;
  type: string;
  ts: Date;
  payload?: T;
  replayed?: boolean;
}

export type EventHandler<T = any> = (event: StarbridgeEvent<T>) => void;

export interface EventStreamOptions {
  topics?: StarbridgeTopic[];
  limit?: number;
  since?: Date;
  replay?: boolean;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface EventStreamStatus {
  connected: boolean;
  topics: StarbridgeTopic[];
  reconnectAttempts: number;
  lastEvent?: Date;
  error?: string;
}

// ============================================================================
// Event Stream Class
// ============================================================================

export class CursorEventStream {
  private client: CursorDreamNetClient;
  private options: Required<EventStreamOptions>;
  private abortController: AbortController | null = null;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private status: EventStreamStatus;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;

  constructor(
    client: CursorDreamNetClient,
    options: EventStreamOptions = {}
  ) {
    this.client = client;
    this.options = {
      topics: options.topics || Object.values(StarbridgeTopic),
      limit: options.limit ?? 100,
      since: options.since || undefined,
      replay: options.replay ?? true,
      autoReconnect: options.autoReconnect ?? true,
      reconnectDelay: options.reconnectDelay ?? 5000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
    } as Required<EventStreamOptions>;

    this.status = {
      connected: false,
      topics: this.options.topics,
      reconnectAttempts: 0,
    };
  }

  // ============================================================================
  // Connection Management
  // ============================================================================

  /**
   * Connect to the event stream
   */
  async connect(): Promise<void> {
    if (this.isConnecting || this.status.connected) {
      if (this.status.connected) {
        console.warn("[EventStream] Already connected");
      }
      return;
    }

    this.isConnecting = true;

    // Get API key from client
    const apiKey = (this.client as any).apiKey;
    if (!apiKey) {
      this.isConnecting = false;
      throw new Error("API key required for event stream");
    }

    // Build stream URL
    const baseUrl = (this.client.getAgent() as any).baseUrl || "https://dreamnet.world";
    const url = this.buildStreamUrl(baseUrl, apiKey);

    // Create abort controller for cleanup
    this.abortController = new AbortController();

    try {
      // Fetch the stream
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "text/event-stream",
        },
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Set up parser
      const parser = createParser((event: ParseEvent) => {
        if (event.type === "event") {
          const parsedEvent = event as ParsedEvent;
          if (parsedEvent.data === ": connected") {
            this.status.connected = true;
            this.status.reconnectAttempts = 0;
            this.reconnectAttempts = 0;
            this.isConnecting = false;
            this.emit("connected", {} as StarbridgeEvent);
            return;
          }
          if (parsedEvent.data === ": ping") {
            // Heartbeat, ignore
            return;
          }
          try {
            const data = JSON.parse(parsedEvent.data);
            this.handleEvent(data);
          } catch (error) {
            console.error("[EventStream] Failed to parse event:", error);
          }
        } else if (event.type === "reconnect-interval") {
          // Reconnect interval, ignore for now
        }
      });

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      this.status.connected = true;
      this.isConnecting = false;

      // Start reading
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            parser.feed(chunk);
          }
        } catch (error: any) {
          if (error.name === "AbortError") {
            // Expected on disconnect
            return;
          }
          throw error;
        } finally {
          this.status.connected = false;
          this.emit("disconnected", {} as StarbridgeEvent);
          
          // Auto-reconnect if enabled
          if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        }
      })();
    } catch (error: any) {
      this.isConnecting = false;
      this.status.connected = false;
      
      if (error.name === "AbortError") {
        // Expected on disconnect
        return;
      }

      // Auto-reconnect if enabled
      if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        throw error;
      }
    }
  }

  /**
   * Disconnect from the event stream
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.status.connected = false;
    this.isConnecting = false;
  }

  /**
   * Build the SSE stream URL
   */
  private buildStreamUrl(baseUrl: string, apiKey: string): string {
    const url = new URL(`${baseUrl}/api/starbridge/stream`);
    
    // Add topics
    if (this.options.topics.length > 0) {
      url.searchParams.set("topics", this.options.topics.join(","));
    }

    // Add limit
    if (this.options.limit) {
      url.searchParams.set("limit", String(this.options.limit));
    }

    // Add since
    if (this.options.since) {
      url.searchParams.set("since", this.options.since.toISOString());
    }

    // Add replay
    url.searchParams.set("replay", String(this.options.replay));

    return url.toString();
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    this.status.reconnectAttempts = this.reconnectAttempts;

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.connect();
      } catch (error) {
        console.error("[EventStream] Reconnection failed:", error);
      }
    }, this.options.reconnectDelay);
  }

  // ============================================================================
  // Event Handling
  // ============================================================================

  /**
   * Handle incoming event
   */
  private handleEvent(data: any): void {
    try {
      const event: StarbridgeEvent = {
        id: data.id,
        topic: data.topic as StarbridgeTopic,
        source: data.source as StarbridgeSource,
        type: data.type,
        ts: new Date(data.ts),
        payload: data.payload,
        replayed: data.replayed,
      };

      this.status.lastEvent = event.ts;

      // Emit to topic-specific handlers
      this.emit(event.topic, event);
      this.emit(event.type, event);

      // Emit to all handlers
      this.emit("*", event);
    } catch (error) {
      console.error("[EventStream] Failed to handle event:", error);
    }
  }

  /**
   * Subscribe to events
   */
  on(eventType: string | StarbridgeTopic, handler: EventHandler): () => void {
    const key = eventType;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(key);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(key);
        }
      }
    };
  }

  /**
   * Subscribe to specific topic
   */
  onTopic(topic: StarbridgeTopic, handler: EventHandler): () => void {
    return this.on(topic, handler);
  }

  /**
   * Subscribe to specific event type
   */
  onType(type: string, handler: EventHandler): () => void {
    return this.on(type, handler);
  }

  /**
   * Subscribe to all events
   */
  onAll(handler: EventHandler): () => void {
    return this.on("*", handler);
  }

  /**
   * Emit event to handlers
   */
  private emit(key: string, event: StarbridgeEvent): void {
    const handlers = this.handlers.get(key);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventStream] Handler error for ${key}:`, error);
        }
      }
    }
  }

  // ============================================================================
  // Status & Info
  // ============================================================================

  /**
   * Get current status
   */
  getStatus(): EventStreamStatus {
    return { ...this.status };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.status.connected;
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Create an event stream from a client
 */
export function createEventStream(
  client: CursorDreamNetClient,
  options?: EventStreamOptions
): CursorEventStream {
  return new CursorEventStream(client, options);
}

