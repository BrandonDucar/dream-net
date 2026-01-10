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
exports.FieldLayer = void 0;
const fieldStore_1 = require("./store/fieldStore");
const fieldScheduler_1 = require("./scheduler/fieldScheduler");
exports.FieldLayer = {
    configure(config) {
        fieldStore_1.FieldStore.configure(config);
    },
    run(context) {
        return (0, fieldScheduler_1.runFieldCycle)(context);
    },
    status() {
        return fieldStore_1.FieldStore.status();
    },
    sample(field, point) {
        return fieldStore_1.FieldStore.getSample(field, point);
    },
    allSamples() {
        return fieldStore_1.FieldStore.getAllSamples();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.FieldLayer;
