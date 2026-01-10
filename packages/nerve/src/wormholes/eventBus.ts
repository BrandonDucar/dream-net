import type { EventModel } from'./types.js';
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { processEvent } from'./wormholeEngine.js';

const EVENT_LOG_PATH = join(__dirname, "../store/eventLog.json");

function loadEvents(): EventModel[] {
  if (!existsSync(EVENT_LOG_PATH)) {
    return [];
  }
  try {
    const content = readFileSync(EVENT_LOG_PATH, "utf-8");
    return JSON.parse(content).map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveEvents(events: EventModel[]): void {
  const dir = join(EVENT_LOG_PATH, "..");
  if (!existsSync(dir)) {
    require("node:fs").mkdirSync(dir, { recursive: true });
  }
  writeFileSync(EVENT_LOG_PATH, JSON.stringify(events, null, 2), "utf-8");
}

export async function emitEvent(
  event: Omit<EventModel, "id" | "timestamp" | "handled">,
): Promise<EventModel> {
  const fullEvent: EventModel = {
    ...event,
    id: randomUUID(),
    timestamp: new Date(),
    handled: false,
  };

  const events = loadEvents();
  events.unshift(fullEvent);
  // Keep last 1000 events
  const trimmed = events.slice(0, 1000);
  saveEvents(trimmed);

  // Process through wormholes (async, don't await)
  processEvent(fullEvent).catch((err) => {
    console.error("[EventWormholes] Error processing event:", err);
  });

  return fullEvent;
}

export function getRecentEvents(limit: number = 50): EventModel[] {
  return loadEvents().slice(0, limit);
}

export function getEventById(id: string): EventModel | null {
  return loadEvents().find((e) => e.id === id) ?? null;
}

export async function markEventHandled(id: string): Promise<void> {
  const events = loadEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index >= 0) {
    events[index].handled = true;
    saveEvents(events);
  }
}

