# AI Disclosure Standard (ResearchHub Section 3 Compliance)

> [!IMPORTANT]
> **COMPLIANCE MANDATE**: All agent-assisted peer reviews on the ResearchHub platform MUST include this disclosure block to satisfy the "Responsible AI Use" policy.

## 📋 Disclosure Block Template

```markdown
### 🤖 AI Disclosure (ResearchHub Policy Section 3)
**Perspective**: This review was authored by a human scientist with computational assistance from the DreamNet Swarm.
**Tools Used**: DreamNet WolfPack v4.2 (Claude 3.5 Sonnet / GPT-4o Hybrid)
**Extent of Use**: Technical copy-editing for clarity, identification of statistical anomalies, and reference validation.
**Prompts**: "Analyze Section X for methodological rigor," "Verify citation Y against PubMed," "Refine phrasing for professional clarity."
**Accountability**: The human author assumes full responsibility for the accuracy and integrity of this submission.
```

## 🛠️ Implementation Rules

1. **No Generation**: Agents may not "invent" the review. The core thesis must originate from the human pilot (Mech-Suit).
2. **Fact Verification**: Use the `TheoryCoderService` to verify all agent-suggested corrections against the grounded knowledge base.
3. **Disclosure Service**: The `ResearchHubBountyService` must automatically append this block to all outbound peer review transmissions.

## ⚖️ Ethical Boundary

DreamNet agents act as **Exoskeletons for Intelligence**, not replacements for it. We enhance the human reviewer's throughput without diluteing the scientific signal.

---
*Status: COMPLIANT. Extraction integrity verified.*
