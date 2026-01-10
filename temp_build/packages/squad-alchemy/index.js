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
exports.syncSquadBuilderSquads = exports.SquadRegistry = exports.SquadAlchemy = void 0;
const squadRegistry_1 = require("./registry/squadRegistry");
Object.defineProperty(exports, "SquadRegistry", { enumerable: true, get: function () { return squadRegistry_1.SquadRegistry; } });
const squadAlchemy_1 = require("./engine/squadAlchemy");
exports.SquadAlchemy = {
    registerSquad(squad) {
        return squadRegistry_1.SquadRegistry.upsert(squad);
    },
    getSquad(id) {
        return squadRegistry_1.SquadRegistry.get(id);
    },
    listSquads() {
        return squadRegistry_1.SquadRegistry.getAll();
    },
    run(context) {
        return (0, squadAlchemy_1.runSquadAlchemyCycle)(context);
    },
    status() {
        return squadRegistry_1.SquadRegistry.status();
    },
};
__exportStar(require("./types"), exports);
var squadBuilderBridge_1 = require("./bridge/squadBuilderBridge");
Object.defineProperty(exports, "syncSquadBuilderSquads", { enumerable: true, get: function () { return squadBuilderBridge_1.syncSquadBuilderSquads; } });
exports.default = exports.SquadAlchemy;
