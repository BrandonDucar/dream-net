/**
 * Automerge Provider - Wrapper for Automerge document management
 * 
 * Provides Automerge document creation, history tracking, and snapshot management.
 */

import * as Automerge from '@automerge/automerge';

export interface AutomergeDoc {
  [key: string]: any;
}

export interface AutomergeProviderConfig {
  documentId: string;
  initialDoc?: AutomergeDoc;
}

/**
 * Automerge Provider - Manages Automerge documents and history
 */
export class AutomergeProvider {
  private doc: Automerge.Doc<AutomergeDoc>;
  private documentId: string;
  private history: Automerge.Change[] = [];

  constructor(documentId: string, initialDoc?: AutomergeDoc) {
    this.documentId = documentId;
    this.doc = initialDoc 
      ? Automerge.init<AutomergeDoc>(initialDoc)
      : Automerge.init<AutomergeDoc>({});
  }

  /**
   * Get the Automerge document
   */
  getDocument(): Automerge.Doc<AutomergeDoc> {
    return this.doc;
  }

  /**
   * Update the document with a change function
   */
  update(changeFn: (doc: AutomergeDoc) => void): Automerge.Doc<AutomergeDoc> {
    this.doc = Automerge.change(this.doc, changeFn);
    return this.doc;
  }

  /**
   * Get document history
   */
  getHistory(): Automerge.Change[] {
    return [...this.history];
  }

  /**
   * Create a snapshot at current state
   */
  createSnapshot(): Automerge.BinaryDocument {
    return Automerge.save(this.doc);
  }

  /**
   * Load from snapshot
   */
  loadSnapshot(snapshot: Automerge.BinaryDocument): void {
    this.doc = Automerge.load<AutomergeDoc>(snapshot);
  }

  /**
   * Merge with another document
   */
  merge(otherDoc: Automerge.Doc<AutomergeDoc>): Automerge.Doc<AutomergeDoc> {
    this.doc = Automerge.merge(this.doc, otherDoc);
    return this.doc;
  }
}

