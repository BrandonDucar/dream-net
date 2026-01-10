// Guardian Framework - Lightweight implementation for minimal server
// Layer 1: Personal Drones (one per agent)
// Layer 2: Guardian Swarm (coordination)
// Layer 3: Guardian Command (oversight)

class GuardianDrone {
    constructor(agentId, agentName) {
        this.id = `drone-${agentId}`;
        this.agentId = agentId;
        this.agentName = agentName;
        this.status = 'active';
        this.healthChecks = 0;
        this.anomalies = [];
        this.lastCheck = Date.now();
    }

    monitor() {
        this.healthChecks++;
        this.lastCheck = Date.now();
        return {
            droneId: this.id,
            agentId: this.agentId,
            status: this.status,
            healthChecks: this.healthChecks,
            anomalies: this.anomalies.length
        };
    }

    detectAnomaly(type, details) {
        this.anomalies.push({
            type,
            details,
            timestamp: Date.now()
        });

        // Keep only last 10 anomalies
        if (this.anomalies.length > 10) {
            this.anomalies.shift();
        }
    }

    getHealth() {
        const timeSinceCheck = Date.now() - this.lastCheck;
        const isHealthy = timeSinceCheck < 60000; // 1 minute threshold

        return {
            healthy: isHealthy,
            lastCheck: this.lastCheck,
            anomalyCount: this.anomalies.length,
            status: this.status
        };
    }
}

class GuardianSwarm {
    constructor() {
        this.drones = new Map();
        this.threatLevel = 'low';
        this.totalAnomalies = 0;
    }

    spawnDrone(agentId, agentName) {
        const drone = new GuardianDrone(agentId, agentName);
        this.drones.set(agentId, drone);
        return drone;
    }

    getDrone(agentId) {
        return this.drones.get(agentId);
    }

    monitorAll() {
        const reports = [];
        let totalAnomalies = 0;

        for (const [agentId, drone] of this.drones) {
            const report = drone.monitor();
            reports.push(report);
            totalAnomalies += report.anomalies;
        }

        this.totalAnomalies = totalAnomalies;
        this.updateThreatLevel();

        return {
            totalDrones: this.drones.size,
            reports,
            threatLevel: this.threatLevel,
            totalAnomalies
        };
    }

    updateThreatLevel() {
        if (this.totalAnomalies > 10) {
            this.threatLevel = 'high';
        } else if (this.totalAnomalies > 5) {
            this.threatLevel = 'medium';
        } else {
            this.threatLevel = 'low';
        }
    }

    getStatus() {
        return {
            activeDrones: this.drones.size,
            threatLevel: this.threatLevel,
            totalAnomalies: this.totalAnomalies
        };
    }
}

class GuardianCommand {
    constructor() {
        this.swarm = new GuardianSwarm();
        this.policies = {
            maxAnomaliesPerAgent: 5,
            healthCheckInterval: 30000, // 30 seconds
            autoEscalate: true
        };
        this.alerts = [];
    }

    initializeAgents(agents) {
        agents.forEach((agent, index) => {
            this.swarm.spawnDrone(index, agent.name);
        });
        return {
            initialized: this.swarm.drones.size,
            agents: agents.length
        };
    }

    monitorAgent(agentId) {
        const drone = this.swarm.getDrone(agentId);
        if (drone) {
            return drone.monitor();
        }
        return null;
    }

    reportAnomaly(agentId, type, details) {
        const drone = this.swarm.getDrone(agentId);
        if (drone) {
            drone.detectAnomaly(type, details);

            if (this.policies.autoEscalate && drone.anomalies.length > this.policies.maxAnomaliesPerAgent) {
                this.escalate(agentId, drone);
            }
        }
    }

    escalate(agentId, drone) {
        const alert = {
            level: 'critical',
            agentId,
            agentName: drone.agentName,
            anomalyCount: drone.anomalies.length,
            timestamp: Date.now()
        };

        this.alerts.push(alert);

        // Keep only last 20 alerts
        if (this.alerts.length > 20) {
            this.alerts.shift();
        }
    }

    getSystemStatus() {
        const swarmStatus = this.swarm.getStatus();
        return {
            ...swarmStatus,
            alerts: this.alerts.length,
            policies: this.policies,
            recentAlerts: this.alerts.slice(-5)
        };
    }

    getAllDrones() {
        const drones = [];
        for (const [agentId, drone] of this.swarm.drones) {
            drones.push({
                agentId,
                agentName: drone.agentName,
                ...drone.getHealth()
            });
        }
        return drones;
    }
}

module.exports = { GuardianCommand, GuardianSwarm, GuardianDrone };
