
import { AuthorityToken, IntegationContract, AuthorityLevel } from './types.js';

/**
 * ⚖️ ARBITER: The Authority Gate
 * 
 * "Arbiter doesn't automate actions. It decides when automation is allowed to act."
 */
export class Arbiter {

    /**
     * The Gatekeeper function.
     * Decides if an action is allowed based on Authority and Context.
     */
    static canExecute(
        token: AuthorityToken,
        action: string,
        contract: IntegationContract
    ): boolean {
        // 1. Check Expiry
        if (Date.now() > token.expiresAt) {
            console.warn(`🛑 [Arbiter] Token Expired for ${token.bearer}`);
            return false;
        }

        // 2. Check Blast Radius vs Authority
        if (contract.blastRadius === 'NUCLEAR' && token.level !== 'ABSOLUTE') {
            console.warn(`🛑 [Arbiter] NUCLEAR action requested by non-ABSOLUTE authority (${token.bearer})`);
            return false;
        }

        // 3. Check Rollver
        if (!contract.rollbackAvailable && token.level === 'LOW') {
            console.warn(`🛑 [Arbiter] Irreversible action requested by LOW authority.`);
            return false;
        }

        console.log(`✅ [Arbiter] ACCESS GRANTED: ${action} by ${token.bearer}`);
        return true;
    }

    /**
     * Mints a fresh Authority Token (Simulated for Phase 1)
     */
    static mintToken(bearer: string, level: AuthorityLevel): AuthorityToken {
        return {
            id: crypto.randomUUID(),
            issuer: 'KEYSTONE_KERNEL',
            bearer,
            level,
            scopes: ['DATA_MUTATION', 'COMMUNICATION'], // Default scopes
            issuedAt: Date.now(),
            expiresAt: Date.now() + (1000 * 60 * 60), // 1 Hour
            signature: 'simulated_sig_v1'
        };
    }
}
