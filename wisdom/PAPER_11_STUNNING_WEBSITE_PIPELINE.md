# PAPER 11: THE STUNNING WEBSITE PIPELINE

This guide outlines the three-stage process for creating fully functional, visually stunning websites across the DreamNet domain swarm.

## Stage 1: The Visual Organ (Figma AI)

1. **Prompt the Soul**: Use the **Carcinization** aesthetic prompt provided in the previous briefing.
2. **Generate Assets**: Export high-poly agent cards (Fox, Ant, Octopus) and chitinous background textures.
3. **Variable Mapping**: Set colors to native DreamNet tokens:
    - `primary`: #00FFFF (Electric Cyan)
    - `secondary`: #E6D5AC (Soft Gold)
    - `background`: #0A0A0A (Pure Night)

## Stage 2: The Integumentary Layer (Svelte + Tailwind)

1. **Component Forge**: Drop Figma-derived Tailwind code into `packages/organs/integumentary/client/src/components`.
2. **Dynamic Skin**: Use the `Syncope` script to push design variables into `index.css`.
3. **Functional Glue**: Connect UI buttons to the **Nerve Bus** for real-time telemetry updates.

## Stage 3: The Global Swarm (Vercel + Cloud Run)

1. **Clean Vercel Build**:
    - The `vercel.json` is now optimized for the organ-based monorepo.
    - Build Command: `cd packages/organs/integumentary/client && pnpm run build`.
2. **Multi-Domain Routing**:
    - **Primary Hub**: `dreamnet.ink`
    - **DeSci/Bio-Daemon**: `aethersafe.pro`
    - **Protocol Labs**: `dadfi.org`
3. **Rapid Deployment**:
    - Use `pnpm deploy:now` for immediate feedback on test verticals before merging into the main hub.

---

> [!TIP]
> **Pro Tip**: Use the `gpt5:site` script to generate a functional shell *before* you even open Figma. This provides a "wireframe-as-code" that you can then style to perfection.
