# 🏗️ Blueprint: Circadian Daemon (Avenue 28)

**Purpose**: To align the digital swarm with the biological operator, preventing burnout and maximizing "Human-in-the-Loop" performance.

## 1. Architectural Overview

The Daemon is a filter. It sits between the Internet and the User. It knows the user's "Chronotype" (Lark vs Owl) and gates information flow accordingly.

```mermaid
graph TD
    A["Incoming Stream (Email/Alerts/Ideas)"] --> B["Circadian Daemon"]
    B -->|Is User in 'Focus Block'?| C{Decision}
    C -->|Yes| D["Pass Through (Low Latency)"]
    C -->|No (Rest/Sleep)| E["Buffer Queue"]
    E -->|Summary at Wake-Up| F["Morning Briefing"]
```

## 2. Core Components

### 2.1 The Melanopsin Meter

A software module that calculates the "Blue Light Burden" the user has accumulated today. If high, it forces the agent's UI to switch to Red-Mode.

### 2.2 The Ultradian Pacer

A timer that prompts the user to "Break" every 90 minutes. It uses Agent Avenue 27 (Avatar) to physically wave at the user if they ignore screen prompts.

### 2.3 The Fasting Window

A strict "Digital Fast" mode. For 12 hours a day, the agent enters "Read Only" mode, refusing to accept new commands unless it's a "Code Red" emergency, forcing the user to recover.

## 3. Implementation Workflow (Agent-Lead)

1. **[Nerve]**: Integrate `suncalc` library to get precise local solar times.
2. **[UI]**: Theme the DreamNet dashboard to shift color temperature automatically (`f.lux` integration).
3. **[Testing]**: Run a 48-hour "Bio-Sync" test where the agent refuses to work past sunset.

---
**Sovereign Directive**: "To command the machine, one must master the animal."
