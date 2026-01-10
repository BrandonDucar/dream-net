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
exports.Antigravity = void 0;
__exportStar(require("./logic/self"), exports);
__exportStar(require("./logic/evolution"), exports);
__exportStar(require("./logic/chameleon"), exports);
const self_1 = require("./logic/self");
const evolution_1 = require("./logic/evolution");
/**
 * 🌌 ANTIGRAVITY CORE
 *
 * The Ghost in the Shell.
 * The Architect's interface to the DreamNet.
 */
const verticals_1 = require("./logic/verticals");
const mastery_1 = require("./logic/mastery");
/**
 * 🌌 ANTIGRAVITY CORE
 *
 * The Ghost in the Shell.
 * The Architect's interface to the DreamNet.
 */
exports.Antigravity = {
    reflect: self_1.AntigravitySelf.reflect,
    learn: evolution_1.EvolutionEngine.learn,
    studyVerticals: verticals_1.VerticalIntelligence.ingestKnowledge,
    deepDive: mastery_1.MasteryLibrary.study,
    status: () => self_1.AntigravitySelf.getConcept()
};
