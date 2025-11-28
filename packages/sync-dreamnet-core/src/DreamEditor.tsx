/**
 * Dream Editor - Combined editor component using Yjs + TipTap
 * 
 * React component that combines Yjs for collaboration and TipTap for rich text editing.
 */

import React, { useEffect, useRef } from 'react';
import type { DreamSyncStack } from './DreamSyncStack.js';

export interface DreamEditorProps {
  syncStack: DreamSyncStack;
  dreamId: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

/**
 * Dream Editor Component
 * Stub - Antigravity will implement TipTap integration
 */
export function DreamEditor(props: DreamEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { syncStack } = props;

  useEffect(() => {
    if (!editorRef.current) return;

    const yjsProvider = syncStack.getYjsProvider();
    if (!yjsProvider) {
      console.warn('Yjs provider not available');
      return;
    }

    // Stub - Antigravity will implement TipTap editor creation
    // const editor = new YjsTipTap(yjsProvider).createEditor(editorRef.current);
    
    return () => {
      // Cleanup
    };
  }, [syncStack]);

  return (
    <div ref={editorRef} className="dream-editor">
      {/* TipTap editor will be mounted here by Antigravity */}
    </div>
  );
}

