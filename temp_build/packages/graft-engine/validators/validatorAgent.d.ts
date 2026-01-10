import type { GraftModel, GraftValidator, ValidationResult } from "../types";
export declare class AgentValidator implements GraftValidator {
    validate(graft: GraftModel): Promise<ValidationResult>;
}
