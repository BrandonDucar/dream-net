
import "dotenv/config";
import { actionWorker } from "../server/workers/FarcasterActionWorker.js";
import { waitDb } from "../server/db.js";

async function run() {
  await waitDb;
  console.log("⚙️ [Runner] Starting Farcaster Action Worker Loop...");
  
  while (true) {
    try {
      await actionWorker.processLedger();
      // Short pause between batches of 20
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("❌ [Runner] Error in Action Worker loop:", error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

run().catch(console.error);
