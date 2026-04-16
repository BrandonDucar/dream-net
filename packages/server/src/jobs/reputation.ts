import { registerRailJob } from "../magnetic-rail/scheduler";
import { recomputeScores } from "../reputation/service";

registerRailJob({
  id: "rep_recompute",
  name: "Reputation Graph Recompute",
  cronExpression: "0 * * * *", // hourly
  active: true,
  handler: async () => {
    await recomputeScores();
  },
});
