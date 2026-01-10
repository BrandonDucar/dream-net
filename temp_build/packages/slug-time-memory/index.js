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
exports.SlugTimeMemory = void 0;
const slugMemoryStore_1 = require("./store/slugMemoryStore");
const slugScheduler_1 = require("./scheduler/slugScheduler");
exports.SlugTimeMemory = {
    configure(config) {
        slugMemoryStore_1.SlugMemoryStore.configure(config);
    },
    addSample(sample) {
        slugMemoryStore_1.SlugMemoryStore.addSample(sample);
    },
    run(context) {
        return (0, slugScheduler_1.runSlugTimeCycle)(context);
    },
    status() {
        return (0, slugScheduler_1.slugTimeStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.SlugTimeMemory;
