"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointHealthAnalyzer = endpointHealthAnalyzer;
const node_crypto_1 = require("node:crypto");
const node_perf_hooks_1 = require("node:perf_hooks");
const DEFAULT_ENDPOINTS = [
    "/api/mesh/status",
    "/api/forge/collections",
    "/api/squad",
    "/api/halo/status",
];
async function probeEndpoint(path) {
    const base = process.env.DREAMNET_API_BASE ?? "http://127.0.0.1:5000";
    const url = `${base}${path}`;
    const start = node_perf_hooks_1.performance.now();
    try {
        const response = await fetch(url, { method: "GET" });
        const duration = node_perf_hooks_1.performance.now() - start;
        return { status: response.status, duration };
    }
    catch {
        const duration = node_perf_hooks_1.performance.now() - start;
        return { status: 0, duration };
    }
}
async function endpointHealthAnalyzer() {
    const paths = process.env.HALO_ENDPOINTS
        ? process.env.HALO_ENDPOINTS.split(",")
        : DEFAULT_ENDPOINTS;
    const probes = await Promise.all(paths.map(async (path) => ({ path, ...(await probeEndpoint(path.trim())) })));
    const issues = [];
    const recommendations = [];
    probes.forEach((probe) => {
        if (probe.status === 0 || probe.status >= 500) {
            issues.push({
                id: `endpoint-down-${probe.path}`,
                analyzer: "endpointHealth",
                severity: "critical",
                description: `Endpoint ${probe.path} is unreachable or returned ${probe.status}`,
                data: probe,
            });
            recommendations.push({
                action: "repair.api.endpoint",
                description: `Repair endpoint ${probe.path}`,
                target: probe.path,
                meta: probe,
            });
        }
        else if (probe.duration > 2_500) {
            issues.push({
                id: `endpoint-slow-${probe.path}`,
                analyzer: "endpointHealth",
                severity: "high",
                description: `Endpoint ${probe.path} responded slowly (${probe.duration.toFixed(0)}ms)`,
                data: probe,
            });
            recommendations.push({
                action: "repair.api.endpoint",
                description: `Investigate performance for ${probe.path}`,
                target: probe.path,
                meta: probe,
            });
        }
    });
    return {
        name: "endpointHealthAnalyzer",
        issues: issues.length
            ? issues
            : [
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    analyzer: "endpointHealth",
                    severity: "low",
                    description: "All monitored endpoints responsive",
                },
            ],
        recommendations,
    };
}
