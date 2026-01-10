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
exports.InitRitualCore = void 0;
const initStore_1 = require("./store/initStore");
const ritualEngine_1 = require("./logic/ritualEngine");
const initScheduler_1 = require("./scheduler/initScheduler");
exports.InitRitualCore = {
    // Templates
    ensureDefaultTemplateSeeded() {
        (0, ritualEngine_1.ensureDefaultTemplateSeeded)();
    },
    upsertTemplate(template) {
        return initStore_1.InitStore.upsertTemplate(template);
    },
    listTemplates() {
        return initStore_1.InitStore.listTemplates();
    },
    // Identity state
    getOrCreateIdentityState(identityId, templateId = "default-user-init") {
        return initStore_1.InitStore.getOrCreateIdentityState(identityId, templateId);
    },
    getIdentityState(identityId) {
        return initStore_1.InitStore.getIdentityState(identityId);
    },
    // Flow control
    advanceIdentity(context, identityId, templateId = "default-user-init") {
        return (0, ritualEngine_1.advanceIdentityInit)(context, identityId, templateId);
    },
    completeStep(identityId, stepId) {
        return (0, ritualEngine_1.completeInitStepForIdentity)(identityId, stepId);
    },
    // Orchestration
    run(context) {
        return (0, initScheduler_1.runInitRitualCycle)(context);
    },
    status() {
        return initStore_1.InitStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.InitRitualCore;
