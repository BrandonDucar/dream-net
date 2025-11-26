/**
 * Fitness Evaluation System
 *
 * Evaluates system on reliability, cost, and latency metrics
 * Based on ALife system-fitness principles
 */
export class FitnessEvaluator {
    dreamMemory;
    agentFitness = new Map();
    constructor(dreamMemory) {
        this.dreamMemory = dreamMemory;
    }
    /**
     * Evaluate fitness for an agent
     */
    async evaluateAgentFitness(agentId, agentName, metrics) {
        // Calculate reliability (uptime, error rates, recovery time)
        const uptimeScore = metrics.uptime || 0.95; // Default 95% uptime
        const errorScore = 1 - (metrics.errorRate || 0.05); // Lower error rate = higher score
        const recoveryScore = metrics.recoveryTime
            ? Math.max(0, 1 - (metrics.recoveryTime / 60000)) // Normalize to 1 minute
            : 0.8; // Default recovery score
        const reliability = (uptimeScore * 0.5 + errorScore * 0.3 + recoveryScore * 0.2);
        // Calculate cost (normalized, lower is better)
        // Normalize cost to 0-1 (assuming max $100/day per agent)
        const costNormalized = Math.min(1, (metrics.cost || 0) / 100);
        const cost = 1 - costNormalized; // Invert so lower cost = higher score
        // Calculate latency (normalized, lower is better)
        const responseTimeScore = metrics.responseTime
            ? Math.max(0, 1 - (metrics.responseTime / 5000)) // Normalize to 5 seconds
            : 0.8;
        const detectionSpeedScore = metrics.detectionSpeed
            ? Math.max(0, 1 - (metrics.detectionSpeed / 10000)) // Normalize to 10 seconds
            : 0.7;
        const remediationTimeScore = metrics.remediationTime
            ? Math.max(0, 1 - (metrics.remediationTime / 300000)) // Normalize to 5 minutes
            : 0.7;
        const latency = (responseTimeScore * 0.4 + detectionSpeedScore * 0.3 + remediationTimeScore * 0.3);
        // Overall fitness (weighted average)
        const overall = (reliability * 0.5 + cost * 0.2 + latency * 0.3);
        const fitnessMetrics = {
            reliability,
            cost,
            latency,
            overall,
        };
        // Get or create agent fitness record
        let agentFitness = this.agentFitness.get(agentId);
        if (!agentFitness) {
            agentFitness = {
                agentId,
                agentName,
                metrics: fitnessMetrics,
                timestamp: new Date().toISOString(),
                history: [],
            };
        }
        else {
            // Update metrics
            agentFitness.metrics = fitnessMetrics;
            agentFitness.timestamp = new Date().toISOString();
            // Add to history (keep last 100)
            agentFitness.history.push(fitnessMetrics);
            if (agentFitness.history.length > 100) {
                agentFitness.history = agentFitness.history.slice(-100);
            }
        }
        this.agentFitness.set(agentId, agentFitness);
        // Store in DreamMemory
        await this.dreamMemory.store("ops", `fitness:${agentId}`, agentFitness, {
            type: "agent_fitness",
            agentId,
            overall: overall,
        });
        return agentFitness;
    }
    /**
     * Evaluate system-wide fitness
     */
    async evaluateSystemFitness() {
        const agents = Array.from(this.agentFitness.values());
        if (agents.length === 0) {
            // Default system fitness if no agents
            return {
                overall: {
                    reliability: 0.9,
                    cost: 0.8,
                    latency: 0.8,
                    overall: 0.85,
                },
                agents: [],
                timestamp: new Date().toISOString(),
                trends: {
                    reliability: "stable",
                    cost: "stable",
                    latency: "stable",
                },
            };
        }
        // Aggregate agent metrics
        const avgReliability = agents.reduce((sum, a) => sum + a.metrics.reliability, 0) / agents.length;
        const avgCost = agents.reduce((sum, a) => sum + a.metrics.cost, 0) / agents.length;
        const avgLatency = agents.reduce((sum, a) => sum + a.metrics.latency, 0) / agents.length;
        const avgOverall = agents.reduce((sum, a) => sum + a.metrics.overall, 0) / agents.length;
        const overall = {
            reliability: avgReliability,
            cost: avgCost,
            latency: avgLatency,
            overall: avgOverall,
        };
        // Calculate trends
        const trends = this.calculateTrends(agents);
        const systemFitness = {
            overall,
            agents,
            timestamp: new Date().toISOString(),
            trends,
        };
        // Store in DreamMemory
        await this.dreamMemory.store("ops", "system-fitness", systemFitness, {
            type: "system_fitness",
            overall: overall.overall,
        });
        return systemFitness;
    }
    /**
     * Calculate trends from agent history
     */
    calculateTrends(agents) {
        let reliabilityImproving = 0;
        let reliabilityDegrading = 0;
        let costImproving = 0;
        let costDegrading = 0;
        let latencyImproving = 0;
        let latencyDegrading = 0;
        for (const agent of agents) {
            if (agent.history.length < 2) {
                continue;
            }
            const recent = agent.history.slice(-10); // Last 10 measurements
            const older = agent.history.slice(-20, -10); // Previous 10
            if (older.length === 0) {
                continue;
            }
            const recentAvg = {
                reliability: recent.reduce((sum, m) => sum + m.reliability, 0) / recent.length,
                cost: recent.reduce((sum, m) => sum + m.cost, 0) / recent.length,
                latency: recent.reduce((sum, m) => sum + m.latency, 0) / recent.length,
            };
            const olderAvg = {
                reliability: older.reduce((sum, m) => sum + m.reliability, 0) / older.length,
                cost: older.reduce((sum, m) => sum + m.cost, 0) / older.length,
                latency: older.reduce((sum, m) => sum + m.latency, 0) / older.length,
            };
            // Compare
            if (recentAvg.reliability > olderAvg.reliability)
                reliabilityImproving++;
            else if (recentAvg.reliability < olderAvg.reliability)
                reliabilityDegrading++;
            if (recentAvg.cost > olderAvg.cost)
                costImproving++;
            else if (recentAvg.cost < olderAvg.cost)
                costDegrading++;
            if (recentAvg.latency > olderAvg.latency)
                latencyImproving++;
            else if (recentAvg.latency < olderAvg.latency)
                latencyDegrading++;
        }
        const determineTrend = (improving, degrading) => {
            if (improving > degrading * 1.5)
                return "improving";
            if (degrading > improving * 1.5)
                return "degrading";
            return "stable";
        };
        return {
            reliability: determineTrend(reliabilityImproving, reliabilityDegrading),
            cost: determineTrend(costImproving, costDegrading),
            latency: determineTrend(latencyImproving, latencyDegrading),
        };
    }
    /**
     * Get agent fitness by ID
     */
    getAgentFitness(agentId) {
        return this.agentFitness.get(agentId);
    }
    /**
     * Get all agent fitness records
     */
    getAllAgentFitness() {
        return Array.from(this.agentFitness.values());
    }
    /**
     * Get top performing agents
     */
    getTopAgents(limit = 10) {
        return Array.from(this.agentFitness.values())
            .sort((a, b) => b.metrics.overall - a.metrics.overall)
            .slice(0, limit);
    }
}
export default FitnessEvaluator;
