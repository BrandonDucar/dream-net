import type { GraftModel, GraftValidator, ValidationResult } from "../types";
export declare class EndpointValidator implements GraftValidator {
    validate(graft: GraftModel): Promise<ValidationResult>;
}
