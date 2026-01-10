import type { GraftModel } from "../types";
type EventMap = {
    "graft:registered": [GraftModel];
    "graft:validated": [GraftModel];
    "graft:installed": [GraftModel];
    "graft:failed": [GraftModel];
};
export declare function on<EventName extends keyof EventMap>(event: EventName, handler: (...args: EventMap[EventName]) => void): void;
export declare function off<EventName extends keyof EventMap>(event: EventName, handler: (...args: EventMap[EventName]) => void): void;
export declare function emit<EventName extends keyof EventMap>(event: EventName, ...payload: EventMap[EventName]): void;
export {};
