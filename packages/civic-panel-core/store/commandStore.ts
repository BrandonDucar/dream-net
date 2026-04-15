import type { CivicCommand, CivicPanelStatus, CivicDashboardSnapshot, WidgetConfig } from "../types";

const commands: CivicCommand[] = [];
let lastRunAt: number | null = null;
let lastSnapshot: CivicDashboardSnapshot = {
  generatedAt: 0,
  widgets: [],
  recentCommands: [],
};

export const CommandStore = {
  enqueue(cmd: Omit<CivicCommand, "createdAt" | "updatedAt" | "state">): CivicCommand {
    const now = Date.now();
    const record: CivicCommand = {
      id: cmd.id,
      type: cmd.type,
      label: cmd.label,
      state: "queued",
      createdAt: now,
      updatedAt: now,
      meta: cmd.meta ?? {},
    };

    commands.unshift(record);
    return record;
  },

  updateCommandState(id: string, state: CivicCommand["state"], meta?: Record<string, any>) {
    const idx = commands.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const existing = commands[idx];
    const now = Date.now();

    commands[idx] = {
      ...existing,
      state,
      updatedAt: now,
      meta: { ...(existing.meta ?? {}), ...(meta ?? {}) },
    };
  },

  listRecentCommands(limit = 20): CivicCommand[] {
    return commands.slice(0, limit);
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  setSnapshot(snapshot: CivicDashboardSnapshot) {
    lastSnapshot = snapshot;
  },

  status(): CivicPanelStatus {
    return {
      lastRunAt,
      widgetCount: lastSnapshot.widgets.length,
      commandCount: commands.length,
      snapshot: lastSnapshot,
    };
  },
};

