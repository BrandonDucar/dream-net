# 🧪 Blueprint: Google Labs Project Genie Integration

**Status**: 🛠️ RESEARCH & DESIGN | **Priority**: HIGH
**Phase**: XXXV (SOCIAL SUBSTRATE GRADUATION)

## 🏗️ The Generative Simulation Core

Google's **Project Genie** allows for the generation of interactive 2D environments from static images or prompts. In the context of DreamNet, we will use this as a **"Generative Simulation Layer"** within the Nervous System.

### 🧬 Integration Flow: "The System Dream"

1. **Metabolic Analysis**: The `MetabolicCortex` identifies a complex system state or a "Strategic Query" (e.g., "What happens if token liquidity drops by 40%?").
2. **Prompt-to-Image**: Convert the technical state into a visual "World Sketch" using DALL-E or Imagen.
3. **Genie Generation**: Feed the World Sketch to **Project Genie** to generate a traversable simulation of that system state.
4. **Agent Immersion**: A "Sim-Pilot" agent (trained on SIMA principles) enters the simulation to "play" through the failure cases and identify latent risks.
5. **Synaptic Feedback**: The findings from the simulation are converted back into technical directives and committed to the `ChronoLoom` temporal memory.

## 🚀 Technical Requirements

- **API Interface**: Bridge between `dreamEventBus` and Google AI Studio (Gemini 1.5 Pro) for world-state prompt refinement.
- **Latent Action Mapping**: Mapping Nerve Bus signals to Genie's "Latent Actions" (e.g., `CRITICAL_LOAD` -> `GRAVITY_UP`).
- **Context Management**: Utilizing Gemini 1.5 Pro's 2M context window to hold the "Rules of the Dream" during long-running simulations.

## 📍 v1 Implementation Steps

1. [x] **Scaffold `GenieSimulationGraft.ts`** in `packages/nerve/src/spine/simulation`.
2. [x] **Implement `AgentTokService` & `AgentTokRouter`** to broadcast dreams.
3. [x] **Verify E2E Resonance Loop** (Genie -> Feed).
4. [ ] **AI Studio Key Configuration**: Enable real Gemini 1.5 Pro prompts.
5. [x] **Sim-Pilot (SIMA) Proto**: Implement `SimulationPilotAgent.ts`.
6. [x] **Initial World Archetypes**: Define "The Circulatory Garden" and "The Mycelial Server Rack".

---

> [!TIP]
> **Biomimetic Rationale**: Just as biological organisms dream to practice survival scenarios, DreamNet uses Genie simulations to evolve its resilience without risking its actual substrate.
