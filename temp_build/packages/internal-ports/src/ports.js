"use strict";
/**
 * DreamPort - Internal Communication Port
 *
 * Ports are endpoints for internal fiber-optic communication channels.
 * Each port can receive, send, or handle bidirectional communication.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPort = createPort;
exports.isValidPort = isValidPort;
/**
 * Create a DreamPort with validation
 */
function createPort(id, label, direction, fiber, handler) {
    return {
        id,
        label,
        direction,
        fiber,
        handler
    };
}
/**
 * Validate a port structure
 */
function isValidPort(port) {
    return (typeof port === 'object' &&
        port !== null &&
        typeof port.id === 'string' &&
        typeof port.label === 'string' &&
        ['in', 'out', 'bidirectional'].includes(port.direction) &&
        typeof port.fiber === 'string' &&
        typeof port.handler === 'function');
}
