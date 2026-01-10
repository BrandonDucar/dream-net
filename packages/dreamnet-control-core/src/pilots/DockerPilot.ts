
import { DockerSuit } from '../suits/DockerSuit.js';

/**
 * DockerPilot
 * Autonomous pilot that orchestrates the local Docker infrastructure.
 */
export class DockerPilot {
    private suit: DockerSuit;
    private name: string = "DOCKER-ORCHESTRATOR";

    constructor() {
        this.suit = new DockerSuit();
    }

    public async wake() {
        console.log(`🤖 [${this.name}] Starting local orchestration pulse...`);
        this.monitorInfrastructure();
    }

    private monitorInfrastructure() {
        // Run monitoring cycle every 30 seconds
        setInterval(() => {
            this.runPulse();
        }, 30000);
        this.runPulse();
    }

    private runPulse() {
        const containers = this.suit.listContainers();
        console.log(`🤖 [${this.name}] Active Containers: ${containers.length}`);

        // Logic to ensure critical containers are healthy
        const criticalImages = ['redis', 'postgres', 'portainer/portainer-ce'];

        for (const image of criticalImages) {
            const running = containers.find(c => c.image.includes(image));
            if (!running) {
                console.warn(`🤖 [${this.name}] CRITICAL INFRASTRUCTURE MISSING: ${image}`);
                // In a real scenario, we might try to start it if we have the compose config
            } else {
                const health = this.suit.getHealth(running.name);
                if (health !== 'running') {
                    console.log(`🤖 [${this.name}] Container ${running.name} is ${health}. Restarting...`);
                    this.suit.restartContainer(running.name);
                }
            }
        }
    }
}
