# Agents - Complete Documentation

**Package**: `agents` (Directory)  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Agents directory contains **domain-specific agent implementations** for DreamNet. Each agent handles specific verticals and use cases.

### Key Agents

- **CultureOps**: Cultural operations agent
- **CultureMint**: Cultural minting agent
- **CultureGuardian**: Cultural content guardian
- **CultureScore**: Cultural scoring agent
- **MarketFlow**: Market flow analysis agent
- **VisionSmith**: Vision/image generation agent
- **SoundWave**: Audio/sound generation agent
- **LoreSmith**: Lore/story generation agent
- **MemeEngineCore**: Meme generation engine
- **MemeForge**: Meme creation agent
- **PulseCaster**: Pulse/signal casting agent
- **RemixEngine**: Content remix engine

---

## Architecture

Each agent follows a consistent structure:
- **`index.ts`**: Main agent export
- **`service.ts`**: Agent service implementation
- **`types.ts`**: Agent-specific types

---

## Usage

Agents are typically used through the Agent Registry and orchestrated by the Orchestrator Core.

---

**Status**: ✅ Implemented

