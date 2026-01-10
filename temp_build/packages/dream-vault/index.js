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
exports.DreamVault = void 0;
const vaultStore_1 = require("./store/vaultStore");
const vaultScheduler_1 = require("./scheduler/vaultScheduler");
const vaultSearch_1 = require("./logic/vaultSearch");
exports.DreamVault = {
    upsertItem(item) {
        return vaultStore_1.VaultStore.upsert(item);
    },
    getItem(id) {
        return vaultStore_1.VaultStore.get(id);
    },
    listAll() {
        return vaultStore_1.VaultStore.listAll();
    },
    search(query) {
        return (0, vaultSearch_1.searchVault)(query);
    },
    run(context) {
        return (0, vaultScheduler_1.runVaultCycle)(context);
    },
    status() {
        return (0, vaultScheduler_1.vaultStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamVault;
