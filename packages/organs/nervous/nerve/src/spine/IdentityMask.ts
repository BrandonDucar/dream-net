/**
 * 🛡️ IdentityMask: The Privacy Filter
 * 
 * Role: Prevents sensitive IDs from leaking into the Shared Memory or LLMs.
 */

export const REDACTION_LIST = [
    "BrandonDucar",
    "brandducar",
    "DUCAR",
    "@brand",
    "0x123...", // Add real wallet if provided
    // Add other sensitive handles here
];

export class IdentityMask {
    /**
     * Redact sensitive information from a string or object.
     */
    public static redact(input: any): any {
        let content = JSON.stringify(input);

        for (const target of REDACTION_LIST) {
            const regex = new RegExp(target, 'gi');
            content = content.replace(regex, "[REDACTED_COMMANDER]");
        }

        return JSON.parse(content);
    }
}
