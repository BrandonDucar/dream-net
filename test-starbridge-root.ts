
import { StarBridge } from "./packages/server/src/services/StarBridge.ts";
console.log("🚀 Testing root-level import of StarBridge...");
try {
    const bridge = new StarBridge();
    console.log("✅ Success!");
} catch (e) {
    console.error("❌ Failed:", e);
}
