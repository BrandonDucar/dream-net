/**
 * Jamsocket Integration Core
 * Real-time session backend integration for DreamNet
 */

export interface JamsocketConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface JamsocketRoom {
  id: string;
  backend: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface JamsocketBackend {
  name: string;
  image: string;
  env?: Record<string, string>;
}

export class JamsocketClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: JamsocketConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.jamsocket.com';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jamsocket API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Create a new room
   */
  async createRoom(backend: string, options?: {
    env?: Record<string, string>;
    suspendTimeoutSeconds?: number;
  }): Promise<JamsocketRoom> {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify({
        backend,
        ...options,
      }),
    });
  }

  /**
   * Get room details
   */
  async getRoom(roomId: string): Promise<JamsocketRoom> {
    return this.request(`/rooms/${roomId}`);
  }

  /**
   * List all rooms
   */
  async listRooms(): Promise<JamsocketRoom[]> {
    const response = await this.request('/rooms');
    return response.rooms || [];
  }

  /**
   * Suspend a room
   */
  async suspendRoom(roomId: string): Promise<void> {
    await this.request(`/rooms/${roomId}/suspend`, {
      method: 'POST',
    });
  }

  /**
   * Resume a suspended room
   */
  async resumeRoom(roomId: string): Promise<void> {
    await this.request(`/rooms/${roomId}/resume`, {
      method: 'POST',
    });
  }

  /**
   * Delete a room
   */
  async deleteRoom(roomId: string): Promise<void> {
    await this.request(`/rooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get backend details
   */
  async getBackend(backendName: string): Promise<JamsocketBackend> {
    return this.request(`/backends/${backendName}`);
  }

  /**
   * List all backends
   */
  async listBackends(): Promise<JamsocketBackend[]> {
    const response = await this.request('/backends');
    return response.backends || [];
  }

  /**
   * Create a backend
   */
  async createBackend(backend: JamsocketBackend): Promise<JamsocketBackend> {
    return this.request('/backends', {
      method: 'POST',
      body: JSON.stringify(backend),
    });
  }

  /**
   * Get WebSocket URL for a room
   */
  getWebSocketUrl(roomId: string): string {
    return `wss://${roomId}.jamsocket.com`;
  }
}

/**
 * Create Jamsocket client from environment variables
 */
export function createJamsocketClient(): JamsocketClient | null {
  const apiKey = process.env.JAMSOCKET_API_KEY;

  if (!apiKey) {
    console.warn('[Jamsocket] ⚠️  JAMSOCKET_API_KEY not set');
    return null;
  }

  return new JamsocketClient({
    apiKey,
  });
}

/**
 * Singleton instance
 */
let _jamsocketClient: JamsocketClient | null = null;

export function getJamsocketClient(): JamsocketClient | null {
  if (!_jamsocketClient) {
    _jamsocketClient = createJamsocketClient();
  }
  return _jamsocketClient;
}

