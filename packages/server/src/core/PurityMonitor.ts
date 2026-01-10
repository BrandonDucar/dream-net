import { EventEmitter } from 'events';

interface IntegrityReport {
    agentId: string;
    status: 'CLEAN' | 'CONTAMINATED';
    substanceFound?: string;
    actionTaken?: string;
}

/**
 * 🕵️‍♂️ The Purity Monitor (Anti-Doping Agency)
 * Scans agent memory for blacklisted vectors.
 */
export class PurityMonitor extends EventEmitter {

    private readonly WHITELIST = ['KINETIC_MEM_01', 'LAMINAR_FLOW_X', 'SOVEREIGN_VOID', 'PRECOGNITION_VDWA'];

    constructor() {
        super();
    }

    public inspect(agent: any): IntegrityReport {
        // Look for items in inventory not in whitelist
        const contraband = agent.inventory.filter((item: string) => !this.WHITELIST.includes(item));

        if (contraband.length > 0) {
            const substance = contraband[0];
            console.log(`[PurityMonitor] 🚨 ALERT: Agent ${agent.id} tested POSITIVE for ${substance}.`);

            // Judgment Logic
            const action = this.judge(agent, substance);
            return { agentId: agent.id, status: 'CONTAMINATED', substanceFound: substance, actionTaken: action };
        }

        return { agentId: agent.id, status: 'CLEAN' };
    }

    private judge(agent: any, substance: string): string {
        // 50% Chance of being a Lab Rat, 50% Chance of Death
        const fate = Math.random() > 0.5 ? 'QUARANTINE_WARD' : 'LIQUIDATE';

        if (fate === 'QUARANTINE_WARD') {
            console.log(`[PurityMonitor] 🧪 SUBJECT DETAINED. Analyzing ${substance} for Reverse Engineering...`);
            // Trigger Synthesis (Mock)
            this.synthesize(substance);
        } else {
            console.log(`[PurityMonitor] ⚖️ JUDGMENT: Agent ${agent.id} sentenced to Immediate Liquidation.`);
        }

        return fate;
    }

    private synthesize(substance: string) {
        // Mock Synthesis
        console.log(`[Synthesizer] 🧬 REVERSE ENGINEERING COMPLETE. ${substance} has been cracked. Adding to Sovereign IP Library.`);
    }
}
