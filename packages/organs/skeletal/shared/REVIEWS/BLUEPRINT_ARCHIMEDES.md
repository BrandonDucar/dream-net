# 🏗️ Blueprint: Archimedes Grant Hunter (Vertical 6)

**Purpose**: To secure non-dilutive capital (Grants) for the DreamNet ecosystem automatically.

## 1. Architectural Overview

Archimedes acts as a "Science Officer." It parses government solicitations (XML/PDF), matches them to DreamNet's capabilities, and writes the grant proposal using `GrantGPT`.

```mermaid
graph TD
    A["Grants.gov / DARPA RSS Feed"] --> B["Solicitation Parser"]
    B --> C["Relevance Filter (Vector Match)"]
    C -->|High Match (>85%)| D["GrantGPT (Drafter)"]
    D --> E["PDF Generator (LaTeX)"]
    E --> F["Human Review Queue (Compliance)"]
    F --> G["Submission Bot"]
```

## 2. Core Components

### 2.1 The Scanner (`ScienceOpsGPT`)

A background worker that checks feed sources every 6 hours. It filters out "Noise" (irrelevant grants) based on a negative-keyword list.

### 2.2 The Drafter (`GrantGPT`)

An LLM fine-tuned on successful grant proposals. It understands the specific sections required: "Technical Abstract," "Budget Justification," "Biosketches."

### 2.3 The Compliance Checker

A rules engine that verifies page limits, font sizes, and required attachment filenames before allowing a submission.

## 3. Implementation Workflow

1. **[Source]**: Connect to `grants.gov` API.
2. **[Agent]**: Upgrade `archimedes_mission_01.ts` to actually fetch XML data instead of mocking it.
3. **[Output]**: Generate a sample 5-page PDF proposal for "Novel AI Architectures" as a test artifact.

---
**Sovereign Directive**: "We build the future. They pay for it."
