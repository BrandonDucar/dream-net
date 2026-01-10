"use strict";
/**
 * Vercel Agent Summary
 * Provides summary statistics for Ports Ops Panel
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVercelAgentSummary = getVercelAgentSummary;
exports.recordDeployEvent = recordDeployEvent;
const index_1 = require("./index");
let lastDeployTimestamp;
let lastDeployStatus;
/**
 * Get Vercel Agent summary for Ports Ops Panel
 */
async function getVercelAgentSummary() {
    try {
        const status = await index_1.DreamNetVercelAgent.status();
        return {
            projectsTracked: status.projectsFound || 0,
            lastDeployAt: lastDeployTimestamp ? new Date(lastDeployTimestamp).toISOString() : undefined,
            lastStatus: lastDeployStatus,
            initialized: status.initialized,
        };
    }
    catch (error) {
        return {
            projectsTracked: 0,
            lastDeployAt: undefined,
            lastStatus: "error",
            initialized: false,
        };
    }
}
/**
 * Record deploy event (called by Vercel Agent routes)
 */
function recordDeployEvent(status) {
    lastDeployTimestamp = Date.now();
    lastDeployStatus = status;
}
