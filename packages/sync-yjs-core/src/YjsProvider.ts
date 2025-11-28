/**
 * Yjs Provider - Wrapper for Yjs document management
 * 
 * Provides Yjs document creation, synchronization, and persistence.
 */

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

export interface YjsProviderConfig {
  documentId: string;
  roomName?: string;
  enablePersistence?: boolean;
}

/**
 * Yjs Provider - Manages Yjs documents and synchronization
 */
export class YjsProvider {
  private doc: Y.Doc;
  private persistence: IndexeddbPersistence | null = null;
  private documentId: string;

  constructor(config: YjsProviderConfig) {
    this.documentId = config.documentId;
    this.doc = new Y.Doc();

    if (config.enablePersistence !== false) {
      this.persistence = new IndexeddbPersistence(config.documentId, this.doc);
    }
  }

  /**
   * Get the Yjs document
   */
  getDocument(): Y.Doc {
    return this.doc;
  }

  /**
   * Get a Yjs text type
   */
  getText(name: string): Y.Text {
    return this.doc.getText(name);
  }

  /**
   * Get a Yjs map type
   */
  getMap(name: string): Y.Map<any> {
    return this.doc.getMap(name);
  }

  /**
   * Get a Yjs array type
   */
  getArray(name: string): Y.Array<any> {
    return this.doc.getArray(name);
  }

  /**
   * Connect to a provider (WebSocket, etc.)
   * Stub for now - Antigravity will implement
   */
  connect(providerUrl: string): void {
    throw new Error("Not implemented - Antigravity will implement WebSocket provider");
  }

  /**
   * Disconnect from provider
   */
  disconnect(): void {
    // Cleanup will be implemented by Antigravity
  }

  /**
   * Destroy the provider and clean up
   */
  destroy(): void {
    if (this.persistence) {
      this.persistence.destroy();
    }
    this.doc.destroy();
  }
}

