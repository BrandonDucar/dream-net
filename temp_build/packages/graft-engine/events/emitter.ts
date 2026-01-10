import EventEmitter from "eventemitter3";
import type { GraftModel } from "../types";

type EventMap = {
  "graft:registered": [GraftModel];
  "graft:validated": [GraftModel];
  "graft:installed": [GraftModel];
  "graft:failed": [GraftModel];
};

const emitter = new EventEmitter<EventMap>();

export function on<EventName extends keyof EventMap>(
  event: EventName,
  handler: (...args: EventMap[EventName]) => void,
): void {
  emitter.on(event, handler);
}

export function off<EventName extends keyof EventMap>(
  event: EventName,
  handler: (...args: EventMap[EventName]) => void,
): void {
  emitter.off(event, handler);
}

export function emit<EventName extends keyof EventMap>(event: EventName, ...payload: EventMap[EventName]): void {
  emitter.emit(event, ...payload);
}


