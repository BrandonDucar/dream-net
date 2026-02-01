/**
 * DreamNet Shield Core
 */

export * from './logic/intentTracker.js';
export * from './logic/temporalKernel.js';
export * from './logic/deviceGuard.js';

export const ShieldCore = {
    checkRisk: () => 0,
    logAttempt: () => { },
    isBlocked: () => false,
};

export default ShieldCore;
