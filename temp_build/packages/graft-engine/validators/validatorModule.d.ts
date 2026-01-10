import type { GraftModel, GraftValidator, ValidationResult } from "../types";
export declare class ModuleValidator implements GraftValidator {
    validate(graft: GraftModel): Promise<ValidationResult>;
}
