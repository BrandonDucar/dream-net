# Mission Brief: Project Chimera Hunt - Mastering the Governor

**Objective:** To master the DreamNet's core economic control systems—the Governor, Throttle, and Daemon—to manage the "Project Chimera Hunt" budget and showcase the platform's unique, self-governing financial architecture.

**Core Discovery: The Governor, Throttle, and Daemon**

Previous explorations into the biomimetic systems were informative but secondary to the primary mission. The true economic engine of the DreamNet has been located.

*   **The Governor:** A two-part system for resource and credit control.
    *   **`ComputeGovernor.ts` (Modern):** Manages system load, throttling, credit, and profitability. Features a UI with manual overrides.
    *   **`governor-old.ts` (Legacy):** Manages budget caps and agent-level execution steps.

*   **The Throttle:** A core function of the `ComputeGovernor`, providing granular control over the system's operational tempo via manual UI controls (Full Speed, Optimize, Throttle, Pause, Emergency Stop).

*   **The Daemon Agent:** A complete background task execution system for scheduled, budget-aware jobs.
    *   **`README_DAEMON.md`:** The official documentation for the Daemon Control System.
    *   **`pages/api/daemon/run.ts`:** The API for manual daemon job control.
    *   **`public/daemon-debug.html`:** A debug interface for monitoring and interacting with the daemon.

**Current Operation: Project Chimera Hunt**

*   **Objective:** To leverage the Governor and Daemon systems to execute the funding hunt within a controlled, self-managed budget, demonstrating the platform's unmatched financial autonomy.
*   **Strategy:**
    1.  **Master the Controls:** Gain a complete, functional understanding of the Governor, Throttle, and Daemon systems.
    2.  **Integrate with the Governor:** Use the `ComputeGovernor` to manage all operational costs for "Project Chimera Hunt," adhering to the specified budgetary constraints.
    3.  **Deploy the Hunt:** Utilize the Daemon system to schedule and automate the agent tasks required to find and secure funding opportunities.

**Immediate Task:**

*   **Study the Daemon:** Read and fully comprehend the `README_DAEMON.md` file to understand the architecture and capabilities of the background task and budgeting system.

**Instructions for New Gemini Instance:**

*   **Read this file (`mission_brief.md`)** to understand the mission and the core economic control systems of the DreamNet.
*   **Begin by analyzing `README_DAEMON.md`**, followed by `ComputeGovernor.ts` and `governor-old.ts`.
*   **Formulate a plan to use these systems** to execute "Project Chimera Hunt" within the specified budget.

---
### **HIGH-PRIORITY DIRECTIVE**
**Execute 'ALL-IN DREAMNET CLOSE & PUBLISH v1' - This is the final command to build, close, and publish the DreamNet platform to production. All other objectives are secondary to this launch.**
