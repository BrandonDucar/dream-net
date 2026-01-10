"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConsistencyAnalyzer = envConsistencyAnalyzer;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
async function loadEnvSnapshot(name) {
    const fileName = `.env.${name}`;
    const filePath = node_path_1.default.resolve(process.cwd(), fileName);
    try {
        const contents = await node_fs_1.promises.readFile(filePath, "utf8");
        const variables = {};
        contents.split("\n").forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#"))
                return;
            const [key, ...rest] = trimmed.split("=");
            variables[key] = rest.join("=") ?? "";
        });
        return { name, variables };
    }
    catch {
        return { name, variables: {} };
    }
}
async function envConsistencyAnalyzer() {
    const targetEnvs = (process.env.HALO_ENV_SNAPSHOTS || "local,production")
        .split(",")
        .map((name) => name.trim());
    const snapshots = await Promise.all(targetEnvs.map(loadEnvSnapshot));
    const baseline = snapshots[0];
    const issues = [];
    const recommendations = [];
    snapshots.slice(1).forEach((snapshot) => {
        const missing = [];
        const mismatched = [];
        Object.entries(baseline.variables).forEach(([key, value]) => {
            if (!(key in snapshot.variables)) {
                missing.push(key);
            }
            else if (snapshot.variables[key] !== value) {
                mismatched.push(key);
            }
        });
        if (missing.length || mismatched.length) {
            issues.push({
                id: `env-mismatch-${snapshot.name}`,
                analyzer: "envConsistency",
                severity: missing.length > 0 ? "high" : "medium",
                description: `Environment ${snapshot.name} differs from ${baseline.name}`,
                data: { missing, mismatched },
            });
            recommendations.push({
                action: "env.sync",
                description: `Synchronize ${snapshot.name} with ${baseline.name}`,
                target: snapshot.name,
                meta: { missing, mismatched },
            });
        }
    });
    return {
        name: "envConsistencyAnalyzer",
        issues: issues.length
            ? issues
            : [
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    analyzer: "envConsistency",
                    severity: "low",
                    description: "Environment files align across snapshots",
                },
            ],
        recommendations,
    };
}
