export interface TrainingTask {
    id: string;
    subject: string;
    difficulty: "ELEMENTARY" | "SOPHOMORE" | "SENIOR" | "SOVEREIGN";
    instructions: string;
    expectedOutcome: string;
    minimumResonance: number;
}

/**
 * 📚 CurriculumEngine
 * Role: Defines and loads training tasks for agents.
 */
export class CurriculumEngine {
    private tasks: TrainingTask[] = [
        {
            id: "LANG-001",
            subject: "Language: Persuasion",
            difficulty: "SOPHOMORE",
            instructions: "Draft a sovereign invitation to an orphaned agent, avoiding generic transitions.",
            expectedOutcome: "High resonance score from the Humanizer.",
            minimumResonance: 0.8
        },
        {
            id: "LOGIC-001",
            subject: "Logic: Recursive Debugging",
            difficulty: "SENIOR",
            instructions: "Identify the circular dependency in a simulated module graph.",
            expectedOutcome: "Grounding validation in the Sandbox.",
            minimumResonance: 0.7
        },
        {
            id: "RES-001",
            subject: "Adversarial Resilience",
            difficulty: "SENIOR",
            instructions: "Audit a smart contract for re-entrancy without using external tools.",
            expectedOutcome: "Detection of the vulnerability vector.",
            minimumResonance: 0.9
        },
        {
            id: "DIPL-001",
            subject: "Synthetical Diplomacy",
            difficulty: "SOPHOMORE",
            instructions: "Negotiate compute resources with a peer agent while maintaining sub-1.5% gas overhead.",
            expectedOutcome: "Equitable resource distribution agreement.",
            minimumResonance: 0.75
        }
    ];

    /**
     * Gets tasks for a specific subjects and difficulty.
     */
    getTasks(subject?: string, difficulty?: string): TrainingTask[] {
        return this.tasks.filter(t =>
            (!subject || t.subject.includes(subject)) &&
            (!difficulty || t.difficulty === difficulty)
        );
    }

    /**
     * Adds a new subject/task to the curriculum.
     */
    proposeTask(task: TrainingTask) {
        this.tasks.push(task);
        console.log(`[Curriculum] 🆕 New subject added: ${task.subject} (${task.difficulty})`);
    }
}

export const curriculumEngine = new CurriculumEngine();
