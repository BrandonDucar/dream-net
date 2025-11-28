/**
 * Yjs TipTap Integration
 * 
 * Integrates Yjs with TipTap rich text editor for collaborative editing.
 */

import type { Doc } from 'yjs';
import type { YjsProvider } from './YjsProvider.js';

/**
 * Yjs TipTap Integration
 * Stub for now - Antigravity will implement TipTap binding
 */
export class YjsTipTap {
  private provider: YjsProvider;
  private doc: Doc;

  constructor(provider: YjsProvider) {
    this.provider = provider;
    this.doc = provider.getDocument();
  }

  /**
   * Create TipTap editor with Yjs collaboration
   * Stub - Antigravity will implement
   */
  createEditor(element: HTMLElement): any {
    throw new Error("Not implemented - Antigravity will implement TipTap integration");
  }

  /**
   * Get Yjs text for TipTap
   */
  getYjsText(name: string = 'content') {
    return this.provider.getText(name);
  }
}

