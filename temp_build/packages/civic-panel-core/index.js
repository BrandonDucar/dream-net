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
exports.CivicPanelCore = void 0;
const commandStore_1 = require("./store/commandStore");
const panelScheduler_1 = require("./scheduler/panelScheduler");
const commandHandler_1 = require("./logic/commandHandler");
exports.CivicPanelCore = {
    // Main orchestration
    async run(context) {
        return (0, panelScheduler_1.runCivicPanelCycle)(context);
    },
    status() {
        return commandStore_1.CommandStore.status();
    },
    getDashboardSnapshot() {
        return commandStore_1.CommandStore.status().snapshot;
    },
    // Commands
    enqueueCommand(type, label, meta) {
        return (0, commandHandler_1.enqueueCommand)(type, label, meta);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.CivicPanelCore;
