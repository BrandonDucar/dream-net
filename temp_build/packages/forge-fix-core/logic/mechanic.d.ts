/**
 * 🛠️ FORGE FIX MECHANIC
 *
 * "The Auto-Mechanic" vs "The Code Surgeon"
 * Listens for system errors and generates patch suggestions continuously.
 */
export interface ErrorEvent {
    id: string;
    message: string;
    stack: string;
    timestamp: number;
}
export interface PatchProposal {
    errorId: string;
    suggestedFix: string;
    confidence: number;
}
export declare class ForgeMechanic {
    /**
     * Diagnoses an error using the DevstraL Small 2 Architecture (256k Context).
     *
     * DIFF FROM LEGACY:
     * - Old: Checked error string against vector DB.
     * - New: Ingests FULL file context, dependency graph, and project state.
     */
    static diagnose(error: ErrorEvent): Promise<PatchProposal>;
}
