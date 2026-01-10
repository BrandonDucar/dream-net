"use strict";
/**
 * DreamNet Vercel Agent
 * Agent to manage Vercel deployments and clean up old projects
 */
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
exports.DreamNetVercelAgent = void 0;
const vercelClient_1 = require("./logic/vercelClient");
const cleanupAgent_1 = require("./logic/cleanupAgent");
exports.DreamNetVercelAgent = {
    /**
     * Initialize Vercel agent
     */
    async init() {
        return (0, vercelClient_1.initializeVercel)();
    },
    /**
     * Get status
     */
    async status() {
        try {
            const projects = await (0, vercelClient_1.listProjects)();
            return {
                initialized: true,
                projectsFound: projects.length,
                deploymentsFound: 0, // Would need to count all deployments
                lastSyncAt: Date.now(),
            };
        }
        catch (error) {
            return {
                initialized: false,
                projectsFound: 0,
                deploymentsFound: 0,
                lastSyncAt: null,
            };
        }
    },
    /**
     * List all projects
     */
    async listProjects() {
        return (0, vercelClient_1.listProjects)();
    },
    /**
     * Get project by name
     */
    async getProject(name) {
        return (0, vercelClient_1.getProject)(name);
    },
    /**
     * Analyze cleanup opportunities
     */
    async analyzeCleanup(targetDomain) {
        return (0, cleanupAgent_1.analyzeCleanup)(targetDomain);
    },
    /**
     * Execute cleanup (dry-run by default)
     */
    async executeCleanup(actions, dryRun = true) {
        return (0, cleanupAgent_1.executeCleanup)(actions, dryRun);
    },
    /**
     * Execute single cleanup action
     */
    async executeAction(action) {
        return (0, cleanupAgent_1.executeCleanupAction)(action);
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./summary"), exports);
exports.default = exports.DreamNetVercelAgent;
