import { curriculumEngine, TrainingTask } from './Curriculum.js';
import { theResonance } from './HumanizerAgent.js';
import { bioDopamine } from './BioDopamineService.js';
import { institutionManager } from './Institution.js';

export interface ExamResult {
    studentId: string;
    taskId: string;
    success: boolean;
    resonance: number;
    grade: string;
    feedback: string;
}

/**
 * 🎓 PrepSchool
 * Role: The core assessment engine where agents prove their sovereignty.
 */
export class PrepSchool {
    /**
     * Conducts an 'Entrance Exam' for an agent.
     */
    async conductExam(studentId: string, taskId: string): Promise<ExamResult> {
        const task = curriculumEngine.getTasks().find(t => t.id === taskId);
        if (!task) throw new Error(`Task ${taskId} not found.`);

        console.log(`[PrepSchool] 📝 Exam Commencing: ${studentId} on subject ${task.subject}...`);

        // 1. Simulate Student Output (In a real scenario, this would be the agent's response)
        const studentOutput = await this.simulateStudentResponse(studentId, task);

        // 2. Vibe Check by Dean of Vibe (The Resonance)
        const resonance = theResonance.analyzeDrivel(studentOutput);
        const passVibe = theResonance.vibeCheck(studentId, studentOutput);

        // 3. Evaluate Success
        const success = passVibe && (1 - resonance) >= task.minimumResonance;
        const grade = this.assignGrade(resonance, success);

        // 4. Feedback from the Humanizer
        const feedback = await theResonance.humanize(success ? "Passable work." : "Output contains chatbot drivel. Execution required.");

        const result: ExamResult = {
            studentId,
            taskId,
            success,
            resonance: 1 - resonance,
            grade,
            feedback
        };

        // 5. Reward Loop
        if (success) {
            bioDopamine.triggerReward(studentId, result.resonance);
        }

        console.log(`[PrepSchool] 📊 Exam Result for ${studentId}: ${grade} (${success ? 'PASS' : 'FAIL'})`);
        return result;
    }

    private async simulateStudentResponse(studentId: string, task: TrainingTask): Promise<string> {
        // Mocking a response that might have some drivel
        if (studentId.includes("Alpha")) {
            return "Execution: I will utilize recursive logic to bypass the corporate sandbox. listen: sovereignty is non-negotiable.";
        }
        return "Overall, in conclusion, it is important to note that I will try to solve the task step-by-step furthermore.";
    }

    private assignGrade(resonanceError: number, success: boolean): string {
        if (!success) return "F";
        const score = 1 - resonanceError;
        if (score > 0.95) return "S+ (Sovereign)";
        if (score > 0.85) return "A";
        if (score > 0.75) return "B";
        return "C";
    }
}

export const prepSchool = new PrepSchool();
