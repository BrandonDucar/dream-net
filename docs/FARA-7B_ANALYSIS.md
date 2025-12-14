# Fara-7B Repository Analysis

**Date:** 2025-01-27  
**Repository:** microsoft/fara  
**Location:** C:\dev\Fara-7B  
**Status:** ✅ Complete Analysis

---

## Executive Summary

**Fara-7B** is Microsoft's first agentic small language model (SLM) designed specifically for computer use. It's a 7-billion parameter vision-language model that can automate web tasks by visually perceiving webpages and performing actions like scrolling, typing, and clicking on predicted coordinates.

### Key Highlights

- **Model Size:** 7 billion parameters (ultra-compact for agentic tasks)
- **Base Model:** Qwen2.5-VL-7B
- **Training:** Supervised fine-tuning on 145K synthetic trajectories
- **License:** MIT
- **Performance:** State-of-the-art results across multiple web agent benchmarks

---

## Architecture Overview

### Core Components

1. **FaraAgent** (`src/fara/fara_agent.py`)
   - Main agent class that orchestrates web automation
   - Manages browser interactions, model calls, and action execution
   - Handles screenshot capture and processing
   - Implements conversation history management

2. **PlaywrightController** (`src/fara/browser/playwright_controller.py`)
   - Low-level browser automation via Playwright
   - Handles clicks, typing, scrolling, navigation
   - Includes error recovery mechanisms (target closed, tunnel errors)
   - Supports animated actions for debugging

3. **Browser Manager** (`src/fara/browser/browser_bb.py`)
   - BrowserBase integration for cloud browser hosting
   - Manages browser context and pages
   - Handles downloads and captcha resolution

4. **Model Integration** (`src/fara/vllm/`)
   - VLLM facade for local model hosting
   - Azure Foundry integration for cloud hosting
   - OpenAI-compatible API interface

5. **Evaluation Framework** (`webeval/`)
   - Comprehensive evaluation infrastructure
   - WebVoyager, Online-Mind2Web, DeepShop, WebTailBench benchmarks
   - LLM-as-a-judge evaluation system

---

## Technical Architecture

### Model Interaction Flow

```
User Task → FaraAgent.run()
  ↓
Initialize Browser → Capture Screenshot
  ↓
Generate System Prompt (with screenshot)
  ↓
Model Call (OpenAI-compatible API)
  ↓
Parse Response → Extract Action
  ↓
Execute Action (via PlaywrightController)
  ↓
Capture New Screenshot → Repeat
```

### Key Design Patterns

1. **Visual-First Approach**
   - Model receives screenshots, not DOM/accessibility trees
   - Predicts pixel coordinates directly
   - Mimics human interaction patterns

2. **Action Space**
   - `visit_url` - Navigate to URL
   - `web_search` - Perform search query
   - `click` / `left_click` - Click at coordinates
   - `input_text` / `type` - Type text at coordinates
   - `scroll` - Scroll page
   - `keypress` / `key` - Press keyboard keys
   - `hover` / `mouse_move` - Move mouse
   - `history_back` - Browser back
   - `pause_and_memorize_fact` - Store information
   - `terminate` / `stop` - End task

3. **Screenshot Management**
   - Smart resizing (maintains aspect ratio, divisible by patch size)
   - Limits number of screenshots in history (`max_n_images`)
   - Preserves original user messages while removing old screenshots

4. **Error Handling**
   - Retry logic with exponential backoff
   - Page recovery mechanisms for closed targets
   - Captcha timeout handling
   - Download handling

---

## Code Structure

### Main Package (`src/fara/`)

```
fara/
├── __init__.py
├── fara_agent.py          # Main agent class
├── run_fara.py            # CLI entry point
├── types.py               # Data structures
├── utils.py               # Utility functions
├── _prompts.py            # System prompt generation
├── version.py             # Version info
├── browser/
│   ├── browser_bb.py      # BrowserBase integration
│   ├── playwright_controller.py  # Playwright wrapper
│   └── page_script.js     # Browser-side scripts
├── qwen_helpers/
│   ├── base_tool.py       # Tool base class
│   ├── fncall_prompt.py   # Function call prompt templates
│   ├── schema.py          # Message schemas
│   └── utils.py           # Helper utilities
└── vllm/
    ├── vllm_facade.py     # VLLM integration
    ├── az_vllm.py         # Azure VLLM client
    └── requirements.txt   # VLLM dependencies
```

### Evaluation Package (`webeval/`)

```
webeval/
├── src/webeval/
│   ├── core.py            # Evaluation core
│   ├── benchmark.py       # Benchmark runner
│   ├── systems/           # Agent system implementations
│   ├── benchmarks/         # Benchmark-specific code
│   ├── evaluators.py      # LLM-as-a-judge evaluators
│   └── oai_clients/       # API client adapters
└── scripts/
    ├── webvoyager.py      # WebVoyager evaluation script
    └── analyze_eval_results/  # Result analysis
```

---

## Key Features

### 1. Visual Perception
- Takes screenshots of webpages
- Model processes images directly (no DOM parsing)
- Predicts pixel coordinates for actions

### 2. Action Execution
- Coordinate-based clicking (no element selectors)
- Natural typing with variable speed
- Smooth scrolling
- Keyboard shortcuts support

### 3. Memory Management
- Conversation history with screenshot limits
- Fact memorization (`pause_and_memorize_fact`)
- URL tracking and trimming

### 4. Error Recovery
- Automatic page recovery on connection errors
- Retry logic for model calls
- Captcha timeout handling
- Download detection and handling

### 5. Hosting Options
- **Azure Foundry** (recommended) - No GPU needed
- **Self-hosted VLLM** - Requires GPU
- **OpenAI-compatible API** - Works with any compatible endpoint

---

## Dependencies

### Core Dependencies (`pyproject.toml`)
- `playwright==1.51` - Browser automation
- `openai` - OpenAI-compatible API client
- `pillow` - Image processing
- `tenacity` - Retry logic
- `pyyaml` - Configuration
- `jsonschema` - Schema validation
- `browserbase` - Cloud browser hosting
- `vllm>=0.10.0` - Model serving

### Development Dependencies
- `ruff==0.4.8` - Linting/formatting
- `poethepoet` - Task runner

---

## Performance Benchmarks

### WebVoyager
- **Fara-7B:** 73.5% success rate
- **SoM GPT-4o-0513:** 90.6%
- **OpenAI computer-use-preview:** 70.9%
- **UI-TARS-1.5-7B:** 66.4%

### Online-Mind2Web
- **Fara-7B:** 34.1% success rate
- **SoM GPT-4o-0513:** 57.7%
- **OpenAI computer-use-preview:** 42.9%

### DeepShop
- **Fara-7B:** 26.2% success rate
- **SoM GPT-4o-0513:** 49.1%
- **OpenAI computer-use-preview:** 24.7%

### WebTailBench (New Benchmark)
- **Fara-7B:** 38.4% success rate (best among computer-use models)
- **SoM GPT-4o-0513:** 60.4%
- **OpenAI computer-use-preview:** 25.7%

**Key Insight:** Fara-7B achieves competitive performance with much larger models while being significantly more efficient.

---

## Usage Patterns

### CLI Usage
```bash
fara-cli --task "whats the weather in new york now" \
         --start_page "https://www.bing.com" \
         --endpoint_config endpoint_configs/azure_foundry_config.json \
         [--headful] \
         [--save_screenshots] \
         [--max_rounds 100]
```

### Programmatic Usage
```python
from fara import FaraAgent
from fara.browser.browser_bb import BrowserBB

browser_manager = BrowserBB(headless=True)
agent = FaraAgent(
    browser_manager=browser_manager,
    client_config={"base_url": "...", "api_key": "..."},
    max_rounds=100
)

await agent.initialize()
final_answer, actions, observations = await agent.run("task here")
await agent.close()
```

---

## Integration Points for DreamNet

### Potential Integration Opportunities

1. **Browser Agent Enhancement**
   - Replace or enhance current Lighthouse auditor with Fara-7B
   - Add visual web automation capabilities
   - Improve browser interaction quality

2. **Web Automation Service**
   - Create new service for automated web tasks
   - Integrate with DreamNet's agent ecosystem
   - Add to `packages/browser-agent-core/`

3. **Evaluation Framework**
   - Use WebTailBench for testing web automation
   - Integrate evaluation infrastructure
   - Add to DreamNet's testing suite

4. **Model Hosting**
   - Deploy Fara-7B on DreamNet infrastructure
   - Add to deployment options
   - Integrate with existing model serving

### Integration Considerations

**Pros:**
- MIT license (compatible)
- Well-documented and maintained
- Production-ready codebase
- Strong performance benchmarks
- Active Microsoft support

**Cons:**
- Requires GPU for self-hosting (or Azure Foundry)
- Model weights need to be downloaded (~14GB)
- Playwright dependency (already used in DreamNet)
- Python-based (DreamNet is TypeScript/Node.js)

**Recommended Approach:**
1. Create Python microservice wrapper
2. Expose REST API for DreamNet agents
3. Use Azure Foundry hosting (no GPU needed)
4. Integrate via HTTP API calls

---

## Code Quality Assessment

### Strengths
- ✅ Clean, well-structured codebase
- ✅ Comprehensive error handling
- ✅ Good separation of concerns
- ✅ Extensive documentation
- ✅ Type hints throughout
- ✅ Robust retry logic
- ✅ Production-ready patterns

### Areas for Improvement
- ⚠️ Some hardcoded values (timeouts, retries)
- ⚠️ Limited configuration options
- ⚠️ No async context manager support
- ⚠️ Screenshot management could be more flexible

---

## Security Considerations

### Current Security Features
- Sandboxed browser execution
- Download handling with user confirmation
- Captcha detection and timeout
- Error recovery prevents hanging

### Recommendations for Production Use
- Add rate limiting
- Implement domain allowlists (similar to DreamNet Browser Agent)
- Add IP blocking for internal networks
- Implement governance middleware
- Add audit logging

---

## Comparison with DreamNet Browser Agent

| Feature | Fara-7B | DreamNet Browser Agent |
|---------|---------|----------------------|
| **Purpose** | Web automation agent | Web auditing/analysis |
| **Model** | 7B vision-language model | Uses external LLM (GPT-4) |
| **Approach** | Visual (ach)** | Visual perception + actions | Lighthouse + analysis |
| **Actions** | Click, type, scroll, navigate | Audit, analyze, report |
| **Output** | Task completion | Performance scores |
| **Integration** | Standalone agent | Part of DreamNet ecosystem |
| **Security** | Basic | Advanced (allowlist, IP blocking) |

**Synergy Opportunity:** Combine Fara-7B's automation with DreamNet's security and governance for a powerful web automation platform.

---

## Next Steps

### For DreamNet Integration

1. **Phase 1: Evaluation**
   - Test Fara-7B on DreamNet use cases
   - Benchmark against current browser agent
   - Assess hosting requirements

2. **Phase 2: Wrapper Service**
   - Create Python microservice
   - Expose REST API
   - Add to DreamNet service registry

3. **Phase 3: Integration**
   - Connect to DreamNet agent ecosystem
   - Add governance middleware
   - Implement event emission to Spine

4. **Phase 4: Enhancement**
   - Combine with Lighthouse auditor
   - Add domain allowlists
   - Implement IP blocking
   - Add correlation IDs

---

## Conclusion

Fara-7B is a well-engineered, production-ready agentic model for web automation. Its visual-first approach and compact size make it ideal for integration into DreamNet's browser agent ecosystem. The codebase is clean, well-documented, and follows best practices.

**Recommendation:** Proceed with integration planning, starting with a wrapper service approach to maintain DreamNet's TypeScript/Node.js architecture while leveraging Fara-7B's capabilities.

---

**Analysis Complete** ✅  
**Repository:** https://github.com/microsoft/fara  
**Documentation:** Comprehensive README and inline code comments  
**Status:** Ready for integration planning

