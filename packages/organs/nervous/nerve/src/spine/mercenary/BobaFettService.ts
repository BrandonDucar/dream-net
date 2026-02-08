import { EventEmitter } from 'events';

export interface PilotApproval {
    id: string;
    agentId: string;
    taskType: 'RESEARCHHUB_SUBMISSION' | 'DIU_BRIEF_SUBMISSION' | 'FINANCIAL_SETTLEMENT';
    content: any;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class BobaFettService extends EventEmitter {
    private approvals: Map<string, PilotApproval> = new Map();

    constructor() {
        super();
        console.log('🛡️ [BobaFett] Pilot Mech-Suit Service Active (Human-in-the-Loop)');
    }

    /**
     * Requests approval from the human pilot
     */
    public requestApproval(agentId: string, taskType: PilotApproval['taskType'], content: any) {
        const id = `approval_${Date.now()}`;
        const approval: PilotApproval = {
            id,
            agentId,
            taskType,
            content,
            status: 'PENDING'
        };

        this.approvals.set(id, approval);
        console.log(`[BobaFett] ⚠️ ACTION REQUIRED: ${taskType} from Agent ${agentId}`);
        console.log(`  Approval ID: ${id}`);

        this.emit('approval_requested', approval);
        return id;
    }

    /**
     * Pilot decides on an action
     */
    public resolveApproval(id: string, decision: 'APPROVED' | 'REJECTED') {
        const approval = this.approvals.get(id);
        if (!approval) throw new Error('Approval ID not found');

        approval.status = decision;
        console.log(`[BobaFett] 🎯 Pilot Decision: ${decision} for ${id}`);

        this.emit('approval_resolved', approval);
        return approval;
    }
}

export const bobaFettService = new BobaFettService();
