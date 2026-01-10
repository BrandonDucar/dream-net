import type { PSLContext, PSLStatus } from "./types";
export declare const PredatorScavengerLoop: {
    run(context: PSLContext): PSLStatus;
    status(): PSLStatus;
};
export * from "./types";
export default PredatorScavengerLoop;
