import { NERVE_BUS } from '@dreamnet/nerve';
import { memoryDNA } from './core/MemoryDNA.js';
import { artifactRegistry } from './core/ArtifactRegistry.js';
import { mechanisticInterpretability } from './core/MechanisticInterpretabilityService.js';
import { orbitalSling } from './core/OrbitalSlingClient.js';
import { aetherFactory } from './core/AetherFactoryGovernor.js';
import { laminarHarbor } from './core/LaminarHarborService.js';
import { crewGraph } from './core/CrewGraphExecutor.js';
import { vectorMesh } from './core/VectorMeshConsolidator.js';
import { ssiPassport } from './core/SSIPassportService.js';

async function testNeuralSubstrate() {
    console.log("🚀 [Test] Starting FULL Neural Substrate Verification...");
    laminarHarbor.activate();

    // 1. Test Skill Atom Recording
    console.log("🧬 [Test] Recording Skill Atom...");
    await memoryDNA.recordSuccess({
        task: "Phase XVIII Strategic Expansion",
        context: { research: "2026-2030 Tech report" },
        tools: ["replace_file_content", "write_to_file", "task_boundary"],
        outcome: "Substrate expanded with Sodium-ion and Interpretability anchors.",
        agentId: "Antigravity"
    });

    // 2. Test Artifact Registration
    console.log("🏺 [Test] Registering Artifact...");
    await artifactRegistry.register({
        type: 'report',
        owner: 'Antigravity',
        payload: { title: "2026-2030 Emerging Tech Analysis", anchors: ["Sodium-ion", "Mechanistic Interpretability"] },
        schemaVersion: "1.0.0",
        metadata: { sourceAgent: "Antigravity", avenue: "58" }
    });

    // 3. Test Interpretability Audit
    console.log("🔍 [Test] Triggering Mechanistic Interpretability Audit...");
    await mechanisticInterpretability.auditCircuit("Antigravity", {
        prompt: "How can DreamNet leverage Sodium-ion batteries?",
        completion: "By integrating them into the Sodium Forge (Avenue 38) for off-grid node resilience..."
    });

    // 4. Test Orbital Sling (Kinetic Link)
    console.log("🛰️ [Test] Triggering Orbital Sling Launch Transient...");
    NERVE_BUS.publishLegacy({
        id: "launch-test-001",
        channelId: "LAUNCH_TRANSIENT",
        kind: "TELEMETRY",
        priority: 5,
        payload: {
            windowId: "SLING-X1",
            currentG: 8.5,
            rpm: 1200,
            status: "RELEASE_IMMINENT"
        }
    });

    // 5. Test Aether Factory (Energy Loop)
    console.log("⚡ [Test] Sending Energy Pulse (Low SOC)...");
    NERVE_BUS.publishLegacy({
        id: "energy-test-001",
        channelId: "ENERGY_PULSE",
        kind: "TELEMETRY",
        priority: 4,
        payload: {
            batterySoc: 15,
            methaneOutput: 2.5,
            thermalLoad: 45
        }
    });

    // 6. Test Neural Plasticity (Trauma Reaction)
    console.log("🛑 [Test] Triggering mock SYSTEM trauma...");
    NERVE_BUS.publishLegacy({
        id: "trauma-test-002",
        channelId: "SYSTEM",
        kind: "ERROR",
        priority: 5,
        payload: {
            message: "MOCK_TRAUMA: Circuit failure in MechanisticInterpretabilityService.ts",
            stack: "Error: CIRCUIT_SAG\n  at MechanisticInterpretabilityService.auditCircuit (C:\\Users\\brand\\OneDrive\\Documents\\GitHub\\dream-net\\packages\\server\\src\\core\\MechanisticInterpretabilityService.ts:32:1)"
        }
    });

    // 7. Test CrewGraph (Orchestration DAG)
    console.log("🛠️ [Test] Executing CrewGraph DAG Workflow...");
    await crewGraph.executeWorkflow("ECOSYSTEM_SYNC", [
        { id: "T1", agentId: "Antigravity", action: "FETCH_REPORTS", params: {}, dependencies: [], status: "pending" },
        { id: "T2", agentId: "Thread_A", action: "MAP_VECTORS", params: {}, dependencies: ["T1"], status: "pending" },
        { id: "T3", agentId: "Thread_B", action: "SIGN_CREDENTIALS", params: {}, dependencies: ["T2"], status: "pending" }
    ]);

    // 8. Test Vector Mesh (Memory Unification)
    console.log("🗺️ [Test] Ingesting into Vector Mesh...");
    await vectorMesh.ingest({
        vector: [0.1, 0.2, 0.3],
        metadata: {
            agentId: "Antigravity",
            timestamp: Date.now(),
            content: "DreamNet 2026 Ecosystem Roadmap validated."
        }
    });

    // 9. Test SSI Passport (Decentralized Identity)
    console.log("🛂 [Test] Issuing SSI Credential...");
    const vc = await ssiPassport.issueCredential("did:dreamnet:antigravity", { role: "Orchestrator" });
    const isValid = await ssiPassport.verifyCredential(vc);
    console.log(`🛂 [Test] VC Verified: ${isValid}`);

    console.log("✅ [Test] ALL Verification signals sent. Monitor console/Starbridge.");
}

testNeuralSubstrate().catch(console.error);
