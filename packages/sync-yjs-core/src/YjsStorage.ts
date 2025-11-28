/**
 * Yjs Storage - IndexedDB persistence adapter
 * 
 * Provides IndexedDB persistence for Yjs documents.
 */

import { IndexeddbPersistence } from 'y-indexeddb';
import type { Doc } from 'yjs';

/**
 * Yjs Storage - Manages IndexedDB persistence
 */
export class YjsStorage {
  private persistence: IndexeddbPersistence;

  constructor(documentId: string, doc: Doc) {
    this.persistence = new IndexeddbPersistence(documentId, doc);
  }

  /**
   * Wait for persistence to be ready
   */
  async waitForPersistence(): Promise<void> {
    return new Promise((resolve) => {
      this.persistence.on('synced', () => {
        resolve();
      });
    });
  }

  /**
   * Clear persisted data
   */
  async clear(): Promise<void> {
    // IndexeddbPersistence doesn't have a clear method
    // Would need to manually delete IndexedDB database
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Destroy persistence
   */
  destroy(): void {
    this.persistence.destroy();
  }
}

