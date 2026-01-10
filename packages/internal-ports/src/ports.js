/**
 * DreamPort - Internal Communication Port
 *
 * Ports are endpoints for internal fiber-optic communication channels.
 * Each port can receive, send, or handle bidirectional communication.
 */
/**
 * Create a DreamPort with validation
 */
export function createPort(id, label, direction, fiber, handler) {
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
export function isValidPort(port) {
    return (typeof port === 'object' &&
        port !== null &&
        typeof port.id === 'string' &&
        typeof port.label === 'string' &&
        ['in', 'out', 'bidirectional'].includes(port.direction) &&
        typeof port.fiber === 'string' &&
        typeof port.handler === 'function');
}
//# sourceMappingURL=ports.js.map