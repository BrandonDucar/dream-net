/**
 * GPT Memory Bridge
 * 
 * Integrates GPTs with DreamNet's memory systems (DreamVault).
 * Enables GPTs to store outputs, query memory, and track their contributions.
 */

import { gptAgentRegistry } from "./GPTAgentRegistry";
import { cleanGPTId } from "./mappers";
import type { CustomGPT } from "./types";

export interface GPTMemoryEntry {
  id: string;
  gptId: string;
  gptName: string;
  dreamId: string;
  type: "output" | "query" | "workflow" | "analysis" | "other";
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface GPTMemoryQuery {
  gptId?: string;
  type?: GPTMemoryEntry["type"];
  since?: string;
  limit?: number;
  tags?: string[];
}

export interface GPTMemoryStats {
  gptId: string;
  gptName: string;
  totalEntries: number;
  byType: Record<GPTMemoryEntry["type"], number>;
  lastEntryAt?: string;
  dreamIds: string[];
}

class GPTMemoryBridge {
  private memoryEntries: Map<string, GPTMemoryEntry> = new Map(); // Keyed by entry ID
  private gptMemoryIndex: Map<string, string[]> = new Map(); // GPT ID -> Entry IDs
  private dreamToEntryIndex: Map<string, string> = new Map(); // Dream ID -> Entry ID

  /**
   * Store GPT output as a dream in DreamVault
   */
  async storeGPTOutput(
    gptId: string,
    output: {
      title: string;
      content: string;
      description?: string;
      type?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<{ success: boolean; dreamId?: string; entryId?: string; error?: string }> {
    try {
      // Resolve GPT
      const gpt = gptAgentRegistry.getAllGPTs().find(
        (g) => g.name === gptId || cleanGPTId(g.name) === cleanGPTId(gptId)
      );

      if (!gpt) {
        return { success: false, error: `GPT not found: ${gptId}` };
      }

      // Check registration
      const status = gptAgentRegistry.getStatus(gpt.name);
      if (!status?.isRegistered) {
        return { success: false, error: `GPT not registered: ${gptId}` };
      }

      const agentId = `gpt:${cleanGPTId(gpt.name)}`;
      const dreamId = `dream-gpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const entryId = `entry-${dreamId}`;

      // Create dream via DreamVault API
      // Using the /api/my-dreams endpoint
      try {
        const dreamData = {
          wallet: `0x${agentId}`, // GPT wallet address
          title: output.title,
          description: output.description || output.content.substring(0, 200),
          type: output.type || "gpt_output",
          tags: [
            "gpt",
            "agent",
            cleanGPTId(gpt.name),
            ...(output.tags || []),
            output.type || "output",
          ],
          createdByAgent: agentId,
          lineage: [agentId],
          content: output.content, // Store full content
          metadata: {
            ...output.metadata,
            gptId: agentId,
            gptName: gpt.name,
            gptCategory: gpt.category,
            storedAt: new Date().toISOString(),
          },
        };

        // Store dream (in a real implementation, this would call the storage API)
        // For now, we'll create a memory entry that references the dream
        const memoryEntry: GPTMemoryEntry = {
          id: entryId,
          gptId: agentId,
          gptName: gpt.name,
          dreamId,
          type: (output.type as GPTMemoryEntry["type"]) || "output",
          content: output.content,
          metadata: {
            ...output.metadata,
            title: output.title,
            description: output.description,
            tags: output.tags,
            dreamData,
          },
          createdAt: new Date().toISOString(),
        };

        // Index the entry
        this.memoryEntries.set(entryId, memoryEntry);
        if (!this.gptMemoryIndex.has(agentId)) {
          this.gptMemoryIndex.set(agentId, []);
        }
        this.gptMemoryIndex.get(agentId)!.push(entryId);
        this.dreamToEntryIndex.set(dreamId, entryId);

        // In a real implementation, we'd call the DreamVault API here:
        // const response = await fetch('/api/my-dreams', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dreamData)
        // });
        // const result = await response.json();

        console.log(`[GPT Memory] Stored output from ${gpt.name} as dream ${dreamId}`);

        // Emit event
        try {
          const { gptEventStream } = await import("./GPTEventStream");
          await gptEventStream.emitGPTEvent(gpt.name, "gpt.memory.stored", {
            dreamId,
            entryId,
            type: memoryEntry.type,
            title: output.title,
          });
        } catch (error: any) {
          // Event emission failed, continue
          console.warn("[GPT Memory] Failed to emit event:", error.message);
        }

        return {
          success: true,
          dreamId,
          entryId,
        };
      } catch (error: any) {
        console.error(`[GPT Memory] Failed to store dream:`, error);
        return {
          success: false,
          error: `Failed to store dream: ${error.message}`,
        };
      }
    } catch (error: any) {
      console.error(`[GPT Memory] Failed to store GPT output:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Query GPT memory entries
   */
  queryGPTMemory(query: GPTMemoryQuery): GPTMemoryEntry[] {
    let entries = Array.from(this.memoryEntries.values());

    // Filter by GPT ID
    if (query.gptId) {
      const gptIdClean = cleanGPTId(query.gptId);
      entries = entries.filter(
        (e) => cleanGPTId(e.gptId) === gptIdClean || cleanGPTId(e.gptName) === gptIdClean
      );
    }

    // Filter by type
    if (query.type) {
      entries = entries.filter((e) => e.type === query.type);
    }

    // Filter by tags (if metadata contains tags)
    if (query.tags && query.tags.length > 0) {
      entries = entries.filter((e) => {
        const entryTags = e.metadata?.tags || [];
        return query.tags!.some((tag) => entryTags.includes(tag));
      });
    }

    // Filter by date
    if (query.since) {
      const sinceDate = new Date(query.since);
      entries = entries.filter((e) => new Date(e.createdAt) >= sinceDate);
    }

    // Sort by creation date (newest first)
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply limit
    if (query.limit) {
      entries = entries.slice(0, query.limit);
    }

    return entries;
  }

  /**
   * Get memory statistics for a GPT
   */
  getGPTMemoryStats(gptId: string): GPTMemoryStats | null {
    const gptIdClean = cleanGPTId(gptId);
    const agentId = `gpt:${gptIdClean}`;

    // Find GPT
    const gpt = gptAgentRegistry.getAllGPTs().find(
      (g) => cleanGPTId(g.name) === gptIdClean || `gpt:${cleanGPTId(g.name)}` === agentId
    );

    if (!gpt) {
      return null;
    }

    const entryIds = this.gptMemoryIndex.get(agentId) || [];
    const entries = entryIds.map((id) => this.memoryEntries.get(id)).filter(Boolean) as GPTMemoryEntry[];

    const byType: Record<GPTMemoryEntry["type"], number> = {
      output: 0,
      query: 0,
      workflow: 0,
      analysis: 0,
      other: 0,
    };

    let lastEntryAt: string | undefined;
    const dreamIds: string[] = [];

    for (const entry of entries) {
      byType[entry.type]++;
      if (!lastEntryAt || entry.createdAt > lastEntryAt) {
        lastEntryAt = entry.createdAt;
      }
      if (entry.dreamId) {
        dreamIds.push(entry.dreamId);
      }
    }

    return {
      gptId: agentId,
      gptName: gpt.name,
      totalEntries: entries.length,
      byType,
      lastEntryAt,
      dreamIds,
    };
  }

  /**
   * Get all memory entries for a GPT
   */
  getGPTMemory(gptId: string, limit?: number): GPTMemoryEntry[] {
    return this.queryGPTMemory({ gptId, limit });
  }

  /**
   * Get dream ID for a memory entry
   */
  getDreamIdForEntry(entryId: string): string | null {
    const entry = this.memoryEntries.get(entryId);
    return entry?.dreamId || null;
  }

  /**
   * Get memory entry for a dream
   */
  getEntryForDream(dreamId: string): GPTMemoryEntry | null {
    const entryId = this.dreamToEntryIndex.get(dreamId);
    if (!entryId) {
      return null;
    }
    return this.memoryEntries.get(entryId) || null;
  }

  /**
   * Get all GPTs that have memory entries
   */
  getGPTsWithMemory(): Array<{ gptId: string; gptName: string; entryCount: number }> {
    const gpts: Array<{ gptId: string; gptName: string; entryCount: number }> = [];

    for (const [agentId, entryIds] of this.gptMemoryIndex.entries()) {
      const entries = entryIds.map((id) => this.memoryEntries.get(id)).filter(Boolean) as GPTMemoryEntry[];
      if (entries.length > 0) {
        gpts.push({
          gptId: agentId,
          gptName: entries[0].gptName,
          entryCount: entries.length,
        });
      }
    }

    return gpts.sort((a, b) => b.entryCount - a.entryCount);
  }

  /**
   * Search memory entries by content
   */
  searchMemory(searchText: string, options?: { gptId?: string; limit?: number }): GPTMemoryEntry[] {
    const searchLower = searchText.toLowerCase();
    let entries = Array.from(this.memoryEntries.values());

    // Filter by GPT if specified
    if (options?.gptId) {
      const gptIdClean = cleanGPTId(options.gptId);
      entries = entries.filter(
        (e) => cleanGPTId(e.gptId) === gptIdClean || cleanGPTId(e.gptName) === gptIdClean
      );
    }

    // Search in content, title, and metadata
    entries = entries.filter((e) => {
      const contentMatch = e.content.toLowerCase().includes(searchLower);
      const titleMatch = e.metadata?.title?.toLowerCase().includes(searchLower);
      const descriptionMatch = e.metadata?.description?.toLowerCase().includes(searchLower);
      return contentMatch || titleMatch || descriptionMatch;
    });

    // Sort by relevance (simple: entries with matches in title/description rank higher)
    entries.sort((a, b) => {
      const aScore =
        (a.metadata?.title?.toLowerCase().includes(searchLower) ? 2 : 0) +
        (a.metadata?.description?.toLowerCase().includes(searchLower) ? 1 : 0) +
        (a.content.toLowerCase().includes(searchLower) ? 1 : 0);
      const bScore =
        (b.metadata?.title?.toLowerCase().includes(searchLower) ? 2 : 0) +
        (b.metadata?.description?.toLowerCase().includes(searchLower) ? 1 : 0) +
        (b.content.toLowerCase().includes(searchLower) ? 1 : 0);
      return bScore - aScore;
    });

    // Apply limit
    if (options?.limit) {
      entries = entries.slice(0, options.limit);
    }

    return entries;
  }
}

// Singleton instance
export const gptMemoryBridge = new GPTMemoryBridge();

