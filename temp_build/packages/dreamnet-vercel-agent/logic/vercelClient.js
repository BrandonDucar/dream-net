"use strict";
/**
 * Vercel API Client
 * Uses API Keeper to discover Vercel token automatically
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeVercel = initializeVercel;
exports.listProjects = listProjects;
exports.getProject = getProject;
exports.listDeployments = listDeployments;
exports.deleteDeployment = deleteDeployment;
exports.deleteProject = deleteProject;
exports.getProjectDomains = getProjectDomains;
exports.addDomain = addDomain;
exports.removeDomain = removeDomain;
exports.getConfig = getConfig;
const api_keeper_core_1 = require("../../api-keeper-core");
let config = null;
const VERCEL_API_BASE = "https://api.vercel.com";
/**
 * Initialize Vercel client using API Keeper discovered credentials
 */
async function initializeVercel() {
    try {
        // Get Vercel token from API Keeper or env
        const vercelKeys = api_keeper_core_1.APIKeeperCore.listKeys("vercel");
        const token = vercelKeys.find(k => k.name.includes("TOKEN") || k.name.includes("API"))?.key ||
            process.env.VERCEL_TOKEN ||
            process.env.VERCEL_API_TOKEN;
        if (!token) {
            console.warn("[VercelAgent] No Vercel token found. Set VERCEL_TOKEN env var or add via API Keeper");
            return false;
        }
        config = {
            token,
            teamId: process.env.VERCEL_TEAM_ID,
        };
        console.log(`✅ [VercelAgent] Initialized with token`);
        return true;
    }
    catch (error) {
        console.error("[VercelAgent] Failed to initialize:", error.message);
        return false;
    }
}
/**
 * Make authenticated Vercel API request
 */
async function vercelRequest(endpoint, options = {}) {
    if (!config) {
        throw new Error("Vercel client not initialized");
    }
    const url = `${VERCEL_API_BASE}${endpoint}`;
    const headers = {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (config.teamId) {
        const urlObj = new URL(url);
        urlObj.searchParams.set("teamId", config.teamId);
        const response = await fetch(urlObj.toString(), { ...options, headers });
        if (!response.ok) {
            throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * List all projects
 */
async function listProjects() {
    const data = await vercelRequest("/v9/projects");
    return data.projects;
}
/**
 * Get project by name
 */
async function getProject(name) {
    try {
        const projects = await listProjects();
        return projects.find(p => p.name === name) || null;
    }
    catch (error) {
        return null;
    }
}
/**
 * List deployments for a project
 */
async function listDeployments(projectId, limit = 100) {
    const data = await vercelRequest(`/v6/deployments?projectId=${projectId}&limit=${limit}`);
    return data.deployments;
}
/**
 * Delete a deployment
 */
async function deleteDeployment(deploymentId) {
    try {
        await vercelRequest(`/v13/deployments/${deploymentId}`, { method: "DELETE" });
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Delete a project
 */
async function deleteProject(projectId) {
    try {
        await vercelRequest(`/v9/projects/${projectId}`, { method: "DELETE" });
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Get project domains
 */
async function getProjectDomains(projectId) {
    try {
        const data = await vercelRequest(`/v9/projects/${projectId}/domains`);
        return data.domains.map(d => d.name);
    }
    catch (error) {
        return [];
    }
}
/**
 * Add domain to project
 */
async function addDomain(projectId, domain) {
    try {
        await vercelRequest(`/v9/projects/${projectId}/domains`, {
            method: "POST",
            body: JSON.stringify({ name: domain }),
        });
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Remove domain from project
 */
async function removeDomain(projectId, domain) {
    try {
        await vercelRequest(`/v9/projects/${projectId}/domains/${domain}`, {
            method: "DELETE",
        });
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Get current config
 */
function getConfig() {
    return config;
}
