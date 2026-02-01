export type GraftType = "agent" | "endpoint" | "ui" | "module" | "task" | "config";
export type GraftStatus = "pending" | "validated" | "installed" | "failed";
export interface GraftModel {
    id: string;
    type: GraftType;
    name: string;
    path: string;
    metadata: Record<string, unknown>;
    createdAt: string;
    status: GraftStatus;
    error?: string | null;
    logs?: string[];
}
export interface ValidationResult {
    ok: boolean;
    issues: string[];
}
export interface InstallResult {
    ok: boolean;
    message?: string;
    logs?: string[];
}
export interface GraftValidator {
    validate(graft: GraftModel): Promise<ValidationResult>;
}
export interface GraftProcessor {
    install(graft: GraftModel): Promise<InstallResult>;
}
//# sourceMappingURL=types.d.ts.map