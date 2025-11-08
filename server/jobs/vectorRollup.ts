import { registerRailJob } from "../magnetic-rail/scheduler";
import { runVectorRollup } from "../vector-ledger/service";

registerRailJob({
  id: "vector_rollup",
  name: "Vector Proof Ledger Rollup",
  cronExpression: "0 3 * * *", // 03:00 UTC daily
  active: true,
  handler: async () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    await runVectorRollup(yesterday);
  },
});
