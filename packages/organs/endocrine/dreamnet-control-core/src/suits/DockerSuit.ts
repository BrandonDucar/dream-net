import { execSync } from 'child_process';
import { swarmLog } from '../server.js';

export interface DockerContainer {
    id: string;
    image: string;
    status: string;
    name: string;
}

/**
 * DockerSuit
 * Mech Suit to interface with Docker Desktop for local orchestration.
 */
export class DockerSuit {
    constructor() {
        this.verifyDocker();
    }

    private verifyDocker() {
        try {
            execSync('docker --version', { stdio: 'ignore' });
            swarmLog('DOCKER', "🐳 [DockerSuit] Docker Desktop parity verified.");
        } catch (error) {
            swarmLog('DOCKER_ERROR', "⚠️ [DockerSuit] Docker CLI not found. Ensure Docker Desktop is running.");
        }
    }

    public listContainers(): DockerContainer[] {
        try {
            const output = execSync('docker ps --format "{{.ID}}|{{.Image}}|{{.Status}}|{{.Names}}"', { encoding: 'utf8' });
            return output.split('\n').filter(Boolean).map(line => {
                const [id, image, status, name] = line.split('|');
                return { id, image, status, name };
            });
        } catch (error) {
            swarmLog('DOCKER_ERROR', `❌ [DockerSuit] Failed to list containers: ${error}`);
            return [];
        }
    }

    public startContainer(name: string) {
        swarmLog('DOCKER', `🐳 [DockerSuit] Starting container: ${name}`);
        execSync(`docker start ${name}`);
    }

    public stopContainer(name: string) {
        swarmLog('DOCKER', `🐳 [DockerSuit] Stopping container: ${name}`);
        execSync(`docker stop ${name}`);
    }

    public restartContainer(name: string) {
        swarmLog('DOCKER', `🐳 [DockerSuit] Restarting container: ${name}`);
        execSync(`docker restart ${name}`);
    }

    public getHealth(name: string): string {
        try {
            const output = execSync(`docker inspect --format "{{.State.Status}}" ${name}`, { encoding: 'utf8' });
            return output.trim();
        } catch (error) {
            return 'unknown';
        }
    }
}
