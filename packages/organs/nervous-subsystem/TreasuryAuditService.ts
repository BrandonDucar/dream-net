import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

/**
 * TreasuryAuditService
 * Provides an immutable audit trail for all agent transactions.
 * Enforces SPARK protection and logs multi-chain activities.
 */
export class TreasuryAuditService extends EventEmitter {
    private auditLogPath: string;

    constructor() {
        super();
        this.auditLogPath = path.resolve(process.cwd(), 'audit_logs/treasury_audit.log');
        this.ensureAuditDir();
    }

    private ensureAuditDir() {
        const dir = path.dirname(this.auditLogPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Log a transaction with high-fidelity metadata
     */
    public async logTransaction(data: {
        agentId: string;
        chain: string;
        action: string;
        params: any;
        status: 'SUCCESS' | 'FAILED';
        txHash?: string;
    }) {
        const entry = {
            timestamp: new Date().toISOString(),
            ...data
        };

        const logLine = JSON.stringify(entry) + '\n';
        fs.appendFileSync(this.auditLogPath, logLine);

        console.log(`[🏦 TREASURY] Audit Logged: ${data.agentId} | ${data.action} | ${data.status}`);

        if (data.status === 'SUCCESS') {
            this.emit('TRANSACTION_VERIFIED', entry);
        } else {
            this.emit('TRANSACTION_ALERT', entry);
        }
    }

    /**
     * Verify if a transaction adheres to SPARK protection rules
     */
    public verifySovereignty(tx: any): boolean {
        // Rule 1: No un-staking of SPARK on Base via autonomous agents
        if (tx.token === 'SPARK' && tx.chain === 'Base' && tx.action === 'UNSTAKE') {
            console.warn(`[⚠️ SECURITY] Blocked unauthorized SPARK unstake by ${tx.agentId}`);
            return false;
        }
        return true;
    }

    public getAuditTrail() {
        if (!fs.existsSync(this.auditLogPath)) return [];
        return fs.readFileSync(this.auditLogPath, 'utf8')
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
    }
}

export const treasuryAudit = new TreasuryAuditService();
