"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repoIntegrityAnalyzer = repoIntegrityAnalyzer;
const node_child_process_1 = require("node:child_process");
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
async function runCommand(command) {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });
        const output = [stdout, stderr].filter(Boolean).join("\n");
        return { ok: true, output };
    }
    catch (error) {
        return { ok: false, output: error.stdout ?? error.stderr ?? String(error) };
    }
}
async function repoIntegrityAnalyzer() {
    const issues = [];
    const recommendations = [];
    if (process.env.HALO_SKIP_REPO_CHECKS === "true") {
        return {
            name: "repoIntegrityAnalyzer",
            issues: [
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    analyzer: "repoIntegrity",
                    severity: "low",
                    description: "Repo integrity checks skipped via HALO_SKIP_REPO_CHECKS",
                },
            ],
            recommendations,
        };
    }
    const typecheck = await runCommand("pnpm -w typecheck --reporter ndjson");
    if (!typecheck.ok) {
        issues.push({
            id: "repo-typecheck-failed",
            analyzer: "repoIntegrity",
            severity: "high",
            description: "TypeScript typecheck failed",
            data: { output: typecheck.output.slice(-2_000) },
        });
        recommendations.push({
            action: "build.relint",
            description: "Run typecheck and fix TypeScript errors",
            meta: { output: typecheck.output.slice(-1_000) },
        });
    }
    const lint = await runCommand("pnpm lint");
    if (!lint.ok) {
        issues.push({
            id: "repo-lint-failed",
            analyzer: "repoIntegrity",
            severity: "medium",
            description: "Linting failed",
            data: { output: lint.output.slice(-2_000) },
        });
        recommendations.push({
            action: "build.relint",
            description: "Fix lint issues detected by pnpm lint",
            meta: { output: lint.output.slice(-1_000) },
        });
    }
    if (!issues.length) {
        recommendations.push({
            action: "observe",
            description: "Repository passes integrity checks",
        });
    }
    return {
        name: "repoIntegrityAnalyzer",
        issues: issues.length
            ? issues
            : [
                {
                    id: (0, node_crypto_1.randomUUID)(),
                    analyzer: "repoIntegrity",
                    severity: "low",
                    description: "Repository integrity verified",
                },
            ],
        recommendations,
    };
}
