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
exports.NarrativeField = void 0;
const narrativeStore_1 = require("./store/narrativeStore");
const narrativeScheduler_1 = require("./scheduler/narrativeScheduler");
exports.NarrativeField = {
    add(entry) {
        narrativeStore_1.NarrativeStore.add(entry);
    },
    list(filter) {
        return narrativeStore_1.NarrativeStore.list(filter);
    },
    run(context) {
        return (0, narrativeScheduler_1.runNarrativeCycle)(context);
    },
    status() {
        return (0, narrativeScheduler_1.narrativeStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.NarrativeField;
