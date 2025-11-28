/**
 * Yjs Canvas Integration
 * 
 * Integrates Yjs with Perfect-Freehand for collaborative canvas/sketch editing.
 */

import type { YjsProvider } from './YjsProvider.js';

/**
 * Yjs Canvas Integration
 * Stub for now - Antigravity will implement Perfect-Freehand binding
 */
export class YjsCanvas {
  private provider: YjsProvider;

  constructor(provider: YjsProvider) {
    this.provider = provider;
  }

  /**
   * Create canvas with Yjs collaboration
   * Stub - Antigravity will implement
   */
  createCanvas(element: HTMLCanvasElement): any {
    throw new Error("Not implemented - Antigravity will implement Perfect-Freehand integration");
  }

  /**
   * Get Yjs array for strokes
   */
  getStrokesArray() {
    return this.provider.getArray('strokes');
  }
}

