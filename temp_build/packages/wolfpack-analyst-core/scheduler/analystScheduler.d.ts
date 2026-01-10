import { WolfPackAnalystContext, WolfPackAnalystStatus } from "../types";
/**
 * Run the analyst cycle:
 * 1. Train on patterns from historical data
 * 2. Generate insights
 * 3. Generate predictions
 * 4. Analyze email effectiveness
 * 5. Store learnings in NeuralMesh (if available)
 */
export declare function runWolfPackAnalystCycle(ctx: WolfPackAnalystContext): WolfPackAnalystStatus;
