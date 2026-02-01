
/**
 * 🏛️ KEYSTONE: The Authority Layer
 * 
 * "Other platforms connect systems. AntiGravity governs integration itself."
 */

export type AuthorityLevel =
    | 'ABSOLUTE'   // Human Owner (Sol)
    | 'HIGH'       // Trusted Agents (WolfPack)
    | 'MEDIUM'     // Standard Automations
    | 'LOW'        // External webhooks / Unverified
    | 'NONE';      // Blocked

export type ResponsibilityScope =
    | 'FINANCIAL'      // Spending money
    | 'DEPLOYMENT'     // Changing code/infra
    | 'COMMUNICATION'  // Talking to humans
    | 'DATA_MUTATION'; // Deleting/Overwriting data

export interface AuthorityToken {
    id: string;
    issuer: string; // Who authorized this?
    bearer: string; // Who is holding this?
    level: AuthorityLevel;
    scopes: ResponsibilityScope[];
    issuedAt: number;
    expiresAt: number;
    signature: string; // Cryptographic proof (optional for now)
}

export interface IntegationContract {
    target: string; // e.g., "Zapier", "Stripe"
    role: 'EXECUTOR' | 'ADVISOR'; // Incumbents are EXECUTORS.
    blastRadius: 'NUCLEAR' | 'KINETIC' | 'SILENT';
    rollbackAvailable: boolean;
}
