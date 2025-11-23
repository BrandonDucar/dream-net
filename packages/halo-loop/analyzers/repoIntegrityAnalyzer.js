import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
const execAsync = promisify(exec);
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
export async function repoIntegrityAnalyzer() {
    const issues = [];
    const recommendations = [];
    if (process.env.HALO_SKIP_REPO_CHECKS === "true") {
        return {
            name: "repoIntegrityAnalyzer",
            issues: [
                {
                    id: randomUUID(),
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
                    id: randomUUID(),
                    analyzer: "repoIntegrity",
                    severity: "low",
                    description: "Repository integrity verified",
                },
            ],
        recommendations,
    };
}
