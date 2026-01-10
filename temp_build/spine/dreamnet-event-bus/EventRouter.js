"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
class EventRouter {
    // Thin wrapper for future routing rules
    // Phase 1: Simple pass-through
    route(event) {
        // Hook point for future routing logic
        return event;
    }
    canRoute(eventType) {
        // For now, all events are routable
        return true;
    }
}
exports.EventRouter = EventRouter;
