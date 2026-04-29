
import "dotenv/config";
import RealEnvKeeperCore from "../packages/env-keeper-core/index.js";
import RealAPIKeeperCore from "../packages/api-keeper-core/index.js";
import RealShieldCore from "../packages/shield-core/index.js";

(async () => {
  console.log("[TestBoot] Initializing Env Keeper...");
  await RealEnvKeeperCore.init();
  console.log("[TestBoot] Env Keeper initialized");

  console.log("[TestBoot] Initializing API Keeper...");
  await RealAPIKeeperCore.ensureDefaultRailGuards();
  console.log("[TestBoot] API Keeper initialized");

  console.log("[TestBoot] Boot success!");
  process.exit(0);
})();
