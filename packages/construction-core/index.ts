export class DriftDetector {
    constructor(public plan: any, public reality: any) { }

    calculateDrift() {
        // [Plan] - [Reality] = [Drift]
        return "3 Days";
    }
}
