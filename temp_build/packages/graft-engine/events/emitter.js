"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = on;
exports.off = off;
exports.emit = emit;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const emitter = new eventemitter3_1.default();
function on(event, handler) {
    emitter.on(event, handler);
}
function off(event, handler) {
    emitter.off(event, handler);
}
function emit(event, ...payload) {
    emitter.emit(event, ...payload);
}
