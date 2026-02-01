/**
 * 🛡️ IdentityMask: The Privacy Filter
 *
 * Role: Prevents sensitive IDs from leaking into the Shared Memory or LLMs.
 */
export declare const REDACTION_LIST: string[];
export declare class IdentityMask {
    /**
     * Redact sensitive information from a string or object.
     */
    static redact(input: any): any;
}
//# sourceMappingURL=IdentityMask.d.ts.map