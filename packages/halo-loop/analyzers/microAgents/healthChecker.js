export const healthChecker = {
    id: "swarm-health-002",
    name: "Health Endpoint Check",
    async check() {
        const endpoints = [
            { url: "https://api.dreamnet.ink/api/health", name: "API Health" },
            // Add more health endpoints
        ];
        const failures = [];
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint.url, {
                    method: "GET",
                    signal: AbortSignal.timeout(5000),
                });
                if (!response.ok) {
                    failures.push({
                        name: endpoint.name,
                        url: endpoint.url,
                        error: `HTTP ${response.status}`,
                    });
                }
            }
            catch (error) {
                failures.push({
                    name: endpoint.name,
                    url: endpoint.url,
                    error: error.message || "Connection failed",
                });
            }
        }
        if (failures.length === 0) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "green",
                message: "All health endpoints responding",
            };
        }
        else if (failures.length < endpoints.length) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: `Partial health check failures: ${failures.map((f) => f.name).join(", ")}`,
                metadata: { failures },
            };
        }
        else {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "red",
                message: `All health checks failed`,
                metadata: { failures },
            };
        }
    },
};
