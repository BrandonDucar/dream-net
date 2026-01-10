"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsChecker = void 0;
exports.dnsChecker = {
    id: "swarm-dns-001",
    name: "DNS Resolution Check",
    async check() {
        const domains = [
            "dreamnet.ink",
            "api.dreamnet.ink",
            // Add more critical domains
        ];
        const failures = [];
        for (const domain of domains) {
            try {
                // Simple DNS check - in production, use dns.resolve() or similar
                const response = await fetch(`https://${domain}`, {
                    method: "HEAD",
                    signal: AbortSignal.timeout(5000),
                }).catch(() => null);
                if (!response || !response.ok) {
                    failures.push(domain);
                }
            }
            catch (error) {
                failures.push(domain);
            }
        }
        if (failures.length === 0) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "green",
                message: "All DNS resolutions successful",
            };
        }
        else if (failures.length < domains.length) {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "amber",
                message: `Partial DNS failures: ${failures.join(", ")}`,
                metadata: { failures, total: domains.length },
            };
        }
        else {
            return {
                agentId: this.id,
                checkName: this.name,
                status: "red",
                message: `All DNS checks failed: ${failures.join(", ")}`,
                metadata: { failures },
            };
        }
    },
};
