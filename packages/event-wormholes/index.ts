/**
 * DreamNet Event Wormholes Stub
 */

export const emitEvent = (e: any) => console.log("[EventWormholes] Stub emit:", e);
export const getRecentEvents = () => [];
export const getEventById = () => null;
export const markEventHandled = () => { };
export const configureWormholes = () => { };
export const registerWormhole = () => { };
export const listWormholes = () => [];
export const enqueueToWormhole = () => { };
export const sendThroughWormhole = () => Promise.resolve({ ok: true });

export default {
    emitEvent,
    getRecentEvents,
    getEventById,
    markEventHandled,
    configureWormholes,
    registerWormhole,
    listWormholes,
    enqueueToWormhole,
    sendThroughWormhole,
};

export { createWormholeRouter } from './src/router.js';
