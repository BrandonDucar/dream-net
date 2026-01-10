import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';
import { ThermodynamicAnalyzer } from './analysis.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const analyzer = new ThermodynamicAnalyzer();
const EVENT_LOG_PATH = join(__dirname, "../store/eventLog.json");
function loadEvents() {
    if (!existsSync(EVENT_LOG_PATH)) {
        return [];
    }
    try {
        const content = readFileSync(EVENT_LOG_PATH, "utf-8");
        return JSON.parse(content).map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp),
        }));
    }
    catch {
        return [];
    }
}
function saveEvents(events) {
    const dir = join(EVENT_LOG_PATH, "..");
    if (!existsSync(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    writeFileSync(EVENT_LOG_PATH, JSON.stringify(events, null, 2), "utf-8");
}
export async function emitEvent(event) {
    const fullEvent = {
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
    // Perform thermodynamic analysis
    const thermodynamics = analyzer.analyze(fullEvent);
    fullEvent.thermodynamics = thermodynamics;
    return fullEvent;
}
export function getSystemThermodynamics() {
    return analyzer.analyze({}); // Heuristic return of current window
}
export function getRecentEvents(limit = 50) {
    return loadEvents().slice(0, limit);
}
export function getEventById(id) {
    return loadEvents().find((e) => e.id === id) ?? null;
}
export async function markEventHandled(id) {
    const events = loadEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index >= 0) {
        events[index].handled = true;
        saveEvents(events);
    }
}
//# sourceMappingURL=eventBus.js.map