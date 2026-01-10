import { registerRailJob } from "../magnetic-rail/scheduler";
import { runWatchdogSnapshot } from "../watchdog/service";

registerRailJob({
  id: "watchdog_snapshot",
  name: "Autonomous Watchdog Snapshot",
  cronExpression: "0 4 * * *", // nightly at 04:00 UTC
  active: true,
  handler: async () => {
    await runWatchdogSnapshot();
  },
});
