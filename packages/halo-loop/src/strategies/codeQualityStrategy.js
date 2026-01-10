export function codeQualityStrategy(issue) {
    if (issue.analyzer !== "repoIntegrity")
        return null;
    if (issue.id === "repo-typecheck-failed" || issue.id === "repo-lint-failed") {
        return {
            type: issue.id === "repo-typecheck-failed" ? "build.fix-imports" : "build.relint",
            payload: {
                description: issue.description,
                output: issue.data?.output,
            },
            priority: "normal",
            targetAgents: ["buildkeeper"],
        };
    }
    return null;
}
//# sourceMappingURL=codeQualityStrategy.js.map