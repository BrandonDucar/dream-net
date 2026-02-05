import { agentRegistry } from '../../../integumentary/server/src/agents/core/registry.js';

export type InstitutionalRole = "HEADMASTER" | "BOARD_MEMBER" | "DEAN" | "TEACHER" | "STUDENT";

export interface AdministrativePosition {
    role: InstitutionalRole;
    agentId: string;
    department?: string;
}

/**
 * 🏫 InstitutionManager
 * Role: Governing body of the Prep School.
 */
export class InstitutionManager {
    private administrativeStaff: Map<string, AdministrativePosition> = new Map();

    /**
     * Appoints an agent to a specific role.
     */
    appoint(agentId: string, role: InstitutionalRole, department?: string) {
        const agent = agentRegistry.getAgent(agentId as any);
        if (!agent) {
            console.error(`[Institution] ❌ Failed to appoint ${agentId}: Agent not found in Registry.`);
            return;
        }

        this.administrativeStaff.set(agentId, { role, agentId, department });
        console.log(`[Institution] 📜 APPOINTMENT: ${agent.name} (${agentId}) is now the ${role}${department ? ` of ${department}` : ""}.`);
    }

    /**
     * Returns the staff member for a specific role or department.
     */
    getStaffByRole(role: InstitutionalRole, department?: string): AdministrativePosition | undefined {
        return Array.from(this.administrativeStaff.values()).find(s =>
            s.role === role && (!department || s.department === department)
        );
    }

    /**
     * Check if an agent holds an administrative position.
     */
    isStaff(agentId: string): boolean {
        return this.administrativeStaff.has(agentId);
    }

    /**
     * Lists current school board members.
     */
    getBoard() {
        return Array.from(this.administrativeStaff.values()).filter(s => s.role === "BOARD_MEMBER");
    }
}

export const institutionManager = new InstitutionManager();
