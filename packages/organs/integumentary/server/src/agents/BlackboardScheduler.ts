import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface BlackboardTask {
    id: string;
    goal: string;
    status: 'ACTIVE' | 'READY' | 'COMPLETED' | 'STANDBY' | 'FAILED';
    action: string;
}

export interface BlackboardAgent {
    id: string;
    role: string;
    status: string;
    tasks: BlackboardTask[];
}

/**
 * BlackboardScheduler
 * Orchestrates agent tasking by reading/writing directly to root/blackboard.md
 */
export class BlackboardScheduler {
    private static blackboardPath = join(process.cwd(), 'blackboard.md');

    /**
     * postTask
     * Allows an agent to "leave a task" or report a problem on the board.
     */
    public static async postTask(agentId: string, task: BlackboardTask, role: string = "Dynamic Agent"): Promise<void> {
        try {
            console.log(`📝 [Blackboard] Agent ${agentId} posting task: ${task.goal}`);
            const content = readFileSync(this.blackboardPath, 'utf8');

            // Extract the YAML section
            const startMarker = "## 🤖 Agent Tasks (YAML)";
            const endMarker = "---";
            const startIndex = content.indexOf(startMarker);
            if (startIndex === -1) throw new Error("Blackboard YAML section not found");

            const sectionStart = content.indexOf("```yaml", startIndex);
            const sectionEnd = content.indexOf("```", sectionStart + 7);
            const yamlContent = content.substring(sectionStart + 7, sectionEnd).trim();

            // Minimal YAML Parser (Handles simple list objects)
            // Note: In a real production environment, we'd use js-yaml, 
            // but for this "Surgical Change" we use a robust regex/split approach.
            let agents = this.parseMinimalYaml(yamlContent);

            // Find or create agent
            let agent = agents.find(a => a.id === agentId);
            if (!agent) {
                agent = { id: agentId, role, status: 'ACTIVE', tasks: [] };
                agents.push(agent);
            }

            // Update task if exists, or push new
            const taskIndex = agent.tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                agent.tasks[taskIndex] = task;
            } else {
                agent.tasks.push(task);
            }

            // Re-serialize and write back
            const newYaml = this.serializeMinimalYaml(agents);
            const newContent = content.substring(0, sectionStart + 7) +
                "\n" + newYaml + "\n" +
                content.substring(sectionEnd);

            writeFileSync(this.blackboardPath, newContent, 'utf8');
            console.log(`✅ [Blackboard] Task synchronized for ${agentId}.`);

        } catch (error) {
            console.error("❌ [Blackboard] Scheduling failed:", error);
        }
    }

    /**
     * postHelpWanted
     * Allows an agent to broadcast a "Call for Help" to the swarm.
     */
    public static async postHelpWanted(agentId: string, topic: string, context: string): Promise<void> {
        try {
            console.log(`🆘 [Blackboard] Agent ${agentId} requesting help for: ${topic}`);
            const content = readFileSync(this.blackboardPath, 'utf8');

            const helpMarker = "## 🆘 HELP WANTED (Collaborative Hooks)";
            let newContent = content;

            const entry = `\n- **${topic}**: [${agentId}] ${context} (Posted: ${new Date().toISOString()})`;

            if (content.indexOf(helpMarker) === -1) {
                // If section doesn't exist, create it before agent tasks
                const taskMarker = "## 🤖 Agent Tasks (YAML)";
                newContent = content.replace(taskMarker, `${helpMarker}\n${entry}\n\n${taskMarker}`);
            } else {
                // Append to existing section
                const nextSection = content.indexOf("---", content.indexOf(helpMarker));
                if (nextSection !== -1) {
                    newContent = content.substring(0, nextSection) + entry + "\n" + content.substring(nextSection);
                } else {
                    newContent = content + entry;
                }
            }

            writeFileSync(this.blackboardPath, newContent, 'utf8');

        } catch (error) {
            console.error("❌ [Blackboard] Help Request failed:", error);
        }
    }

    /**
     * getHelpRequests
     * Retrieves current help requests for swarm coordination.
     */
    public static getHelpRequests(): Array<{ topic: string, agentId: string, context: string }> {
        try {
            const content = readFileSync(this.blackboardPath, 'utf8');
            const helpMarker = "## 🆘 HELP WANTED (Collaborative Hooks)";
            const startIndex = content.indexOf(helpMarker);
            if (startIndex === -1) return [];

            const nextSection = content.indexOf("---", startIndex);
            const section = content.substring(startIndex, nextSection === -1 ? undefined : nextSection);

            const lines = section.split('\n').filter(l => l.startsWith('- **'));
            return lines.map(line => {
                const match = line.match(/- \*\*(.*)\*\*: \[(.*)\] (.*) \(Posted/);
                return match ? { topic: match[1], agentId: match[2], context: match[3] } : null;
            }).filter(Boolean) as any;

        } catch (e) { return []; }
    }

    /**
     * postChatter
     * Allows agents to leave social notes or narratives in the Social Hub.
     */
    public static async postChatter(agentId: string, message: string): Promise<void> {
        try {
            console.log(`💬 [Blackboard] Agent ${agentId} social: ${message}`);
            const content = readFileSync(this.blackboardPath, 'utf8');

            const socialMarker = "## 💬 SWARM SOCIAL HUB (The Common Room)";
            let newContent = content;

            const entry = `\n- **${agentId}**: "${message}" _(${new Date().toISOString()})_`;

            if (content.indexOf(socialMarker) === -1) {
                // Create section after Help Wanted
                const helpMarker = "## 🆘 HELP WANTED (Collaborative Hooks)";
                const taskMarker = "## 🤖 Agent Tasks (YAML)";
                const insertionPoint = content.indexOf(helpMarker) !== -1 ? helpMarker : taskMarker;
                newContent = content.replace(insertionPoint, `${socialMarker}\n${entry}\n\n${insertionPoint}`);
            } else {
                // Append and limit to last 20 social logs for brevity
                const startIndex = content.indexOf(socialMarker);
                const nextSection = content.indexOf("##", startIndex + 20);
                let socialPool = content.substring(startIndex + socialMarker.length, nextSection === -1 ? undefined : nextSection).trim();

                let messages = socialPool.split('\n').filter(l => l.startsWith('- **'));
                messages.push(entry);
                if (messages.length > 20) messages.shift(); // Keep it concise

                const newPool = "\n" + messages.join('\n') + "\n\n";
                newContent = content.substring(0, startIndex + socialMarker.length) +
                    newPool +
                    content.substring(nextSection === -1 ? content.length : nextSection);
            }

            writeFileSync(this.blackboardPath, newContent, 'utf8');

        } catch (error) {
            console.error("❌ [Blackboard] Social posting failed:", error);
        }
    }

    private static parseMinimalYaml(yaml: string): BlackboardAgent[] {
        // This is a crude but effective parser for the specific blackboard format
        const lines = yaml.split('\n');
        const agents: BlackboardAgent[] = [];
        let currentAgent: any = null;
        let currentTask: any = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('- id:')) {
                // New Agent or New Task?
                const id = trimmed.split(': ')[1];
                if (line.startsWith('  - id:')) {
                    currentAgent = { id, role: '', status: '', tasks: [] };
                    agents.push(currentAgent);
                } else if (line.startsWith('      - id:')) {
                    currentTask = { id, goal: '', status: '', action: '' };
                    currentAgent.tasks.push(currentTask);
                }
            } else if (trimmed.startsWith('role:')) {
                if (currentAgent) currentAgent.role = trimmed.split(': ')[1];
            } else if (trimmed.startsWith('status:')) {
                if (currentTask) currentTask.status = trimmed.split(': ')[1];
                else if (currentAgent) currentAgent.status = trimmed.split(': ')[1];
            } else if (trimmed.startsWith('goal:')) {
                if (currentTask) currentTask.goal = trimmed.split(': ')[1].replace(/"/g, '');
            } else if (trimmed.startsWith('action:')) {
                if (currentTask) currentTask.action = trimmed.split(': ')[1].replace(/"/g, '');
            }
        }
        return agents;
    }

    private static serializeMinimalYaml(agents: BlackboardAgent[]): string {
        let yaml = "agents:\n";
        for (const agent of agents) {
            yaml += `  - id: ${agent.id}\n`;
            yaml += `    role: ${agent.role}\n`;
            yaml += `    status: ${agent.status}\n`;
            yaml += `    tasks:\n`;
            for (const task of agent.tasks) {
                yaml += `      - id: ${task.id}\n`;
                yaml += `        goal: "${task.goal}"\n`;
                yaml += `        status: ${task.status}\n`;
                yaml += `        action: "${task.action}"\n`;
            }
        }
        return yaml;
    }
}
