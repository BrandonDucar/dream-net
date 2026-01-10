"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamRegistry = exports.DreamCortex = void 0;
const dreamRegistry_1 = require("./store/dreamRegistry");
Object.defineProperty(exports, "DreamRegistry", { enumerable: true, get: function () { return dreamRegistry_1.DreamRegistry; } });
const cortexScheduler_1 = require("./scheduler/cortexScheduler");
exports.DreamCortex = {
    upsertDream(dream) {
        return dreamRegistry_1.DreamRegistry.upsert(dream);
    },
    setDreamStatus(id, status) {
        return dreamRegistry_1.DreamRegistry.setStatus(id, status);
    },
    setDreamPriority(id, priority) {
        return dreamRegistry_1.DreamRegistry.setPriority(id, priority);
    },
    listDreams() {
        return dreamRegistry_1.DreamRegistry.getAll();
    },
    run(context) {
        return (0, cortexScheduler_1.runCortexCycle)(context);
    },
    status() {
        return (0, cortexScheduler_1.cortexStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamCortex;
