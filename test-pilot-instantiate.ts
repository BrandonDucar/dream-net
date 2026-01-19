import { GenomePilotAgent } from "./packages/agents/src/specialized/GenomePilotAgent";
const pilot = new GenomePilotAgent({ name: "Test", thinkingBudget: 1 });
console.log("✅ Pilot instantiated");
pilot.ignite().then(() => console.log("✅ Pilot ignited")).catch(console.error);
