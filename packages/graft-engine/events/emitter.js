import EventEmitter from "eventemitter3";
const emitter = new EventEmitter();
export function on(event, handler) {
    emitter.on(event, handler);
}
export function off(event, handler) {
    emitter.off(event, handler);
}
export function emit(event, ...payload) {
    emitter.emit(event, ...payload);
}
//# sourceMappingURL=emitter.js.map