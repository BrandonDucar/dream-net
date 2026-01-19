import { z } from 'zod';

/**
 * 🛡️ BootGuard: The Gatekeeper of Truth
 * Masters of the Stack Principle: Strict Zod Validation at the Boundary.
 * 
 * Philosophy: A sovereign system cannot boot on shaky ground.
 * Mechanism: Validates the metabolic environment (process.env) before ignition.
 */

const SovereignConfigSchema = z.object({
    // Core Infrastructure
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().url().describe('Neon Postgres connection string'),
    PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),

    // Intelligence Layer
    GEMINI_API_KEY: z.string().min(10).describe('Google AI Studio Key'),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),

    // Social & Outreach (Non-Critical for Boot)
    NEYNAR_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REFRESH_TOKEN: z.string().optional(),

    // Cryptographic Authority (Administrative)
    // Cryptographic Authority (Administrative)
    ADMIN_WALLETS: z.string().optional().describe('Comma-separated EVM addresses'),
    TREASURY_ADDRESS: z.string().optional(),
    PHANTOM_PRIVATE_KEY: z.string().optional().describe('Solana Master Key'),

    // Cloud Authorities
    AWS_ACCESS_KEY_ID: z.string().optional().describe('AWS Access Key'),
    AWS_SECRET_ACCESS_KEY: z.string().optional().describe('AWS Secret Key'),
    AWS_REGION: z.string().default('us-east-1'),
    DREAMNET_AWS_CA_ID: z.string().uuid().describe('Certificate of Authority for DreamNet on AWS'),
});

export type SovereignConfig = z.infer<typeof SovereignConfigSchema>;

export class BootGuard {
    private static config: SovereignConfig;

    /**
     * Validates the environment and returns the typed config.
     * Throws a descriptive validation report if critical keys are missing.
     */
    public static validate(): SovereignConfig {
        console.log("🛡️ [BootGuard] Inspecting metabolic environment...");

        const result = SovereignConfigSchema.safeParse(process.env);

        if (!result.success) {
            console.error("🛑 [BootGuard] CONFIGURATION BREACH DETECTED:");
            const issues = result.error.issues.map(i => `   - ${i.path.join('.')}: ${i.message}`);
            issues.forEach(issue => console.error(issue));

            // If we are in development, we might allow a partial boot, 
            // but for "Ignition" consistency, we enforce critical keys.
            const criticalMissing = result.error.issues.some(i =>
                ['DATABASE_URL', 'GEMINI_API_KEY'].includes(i.path[0] as string)
            );

            if (criticalMissing) {
                console.error("❌ [BootGuard] CRITICAL ORGANS MISSING. Aborting ignition.");
                process.exit(1);
            } else {
                console.warn("⚠️ [BootGuard] Non-critical configuration issues found. Proceeding with caution.");
            }
        }

        this.config = result.data as SovereignConfig;
        console.log("✅ [BootGuard] Metabolic Environment Validated.");
        return this.config;
    }

    public static getConfig(): SovereignConfig {
        if (!this.config) return this.validate();
        return this.config;
    }
}
