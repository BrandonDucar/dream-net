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
exports.listMemoryRecords = exports.getMemoryRecord = exports.getRecentInsights = exports.saveResonanceInsights = exports.computeResonanceSnapshot = exports.listAllRecords = exports.deriveChildMemory = exports.updateTraitsFromTaskResult = exports.updateTraitsFromEvent = void 0;
exports.runLibrarianCheck = runLibrarianCheck;
// 🐙 OCTOPUS SENTINEL: The Librarian
// Filters incoming memories.
function runLibrarianCheck(content, metadata) {
    if (!content || content.length < 5)
        return false;
    if (metadata?.spam === true)
        return false;
    return true;
}
var dnaEngine_1 = require("./dnaEngine");
Object.defineProperty(exports, "updateTraitsFromEvent", { enumerable: true, get: function () { return dnaEngine_1.updateTraitsFromEvent; } });
Object.defineProperty(exports, "updateTraitsFromTaskResult", { enumerable: true, get: function () { return dnaEngine_1.updateTraitsFromTaskResult; } });
Object.defineProperty(exports, "deriveChildMemory", { enumerable: true, get: function () { return dnaEngine_1.deriveChildMemory; } });
Object.defineProperty(exports, "listAllRecords", { enumerable: true, get: function () { return dnaEngine_1.listAllRecords; } });
var resonanceEngine_1 = require("./resonanceEngine");
Object.defineProperty(exports, "computeResonanceSnapshot", { enumerable: true, get: function () { return resonanceEngine_1.computeResonanceSnapshot; } });
Object.defineProperty(exports, "saveResonanceInsights", { enumerable: true, get: function () { return resonanceEngine_1.saveResonanceInsights; } });
Object.defineProperty(exports, "getRecentInsights", { enumerable: true, get: function () { return resonanceEngine_1.getRecentInsights; } });
var dnaStore_1 = require("./dnaStore");
Object.defineProperty(exports, "getMemoryRecord", { enumerable: true, get: function () { return dnaStore_1.getMemoryRecord; } });
Object.defineProperty(exports, "listMemoryRecords", { enumerable: true, get: function () { return dnaStore_1.listMemoryRecords; } });
__exportStar(require("./store/VectorStore"), exports);
__exportStar(require("./logic/remSleep"), exports);
__exportStar(require("./logic/honeycomb"), exports);
__exportStar(require("./logic/pulsar"), exports);
