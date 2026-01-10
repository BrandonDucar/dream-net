import type { GraftModel, GraftValidator, ValidationResult } from "../types";
export declare class UIValidator implements GraftValidator {
    validate(graft: GraftModel): Promise<ValidationResult>;
}
