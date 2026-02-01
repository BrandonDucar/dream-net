import { ThreadTemplate, SignalThread, SpiderNodeRef, ExecutionPlan, ExecutionStep } from '../types.js';
import { SpiderStore } from '../store/spiderStore.js';

/**
 * Ensure default thread templates exist
 */
export function ensureDefaultTemplates(): ThreadTemplate[] {
  const existing = SpiderStore.listTemplates();
  if (existing.length > 0) return existing;

  const now = Date.now();
  const templates: ThreadTemplate[] = [];

  // Wolf Win Story Template
  templates.push({
    id: "template:wolf-win-story",
    name: "Wolf Win Story",
    description: "Convert Wolf Pack funding win into Orca post and Narrative entry",
    kind: "wolf-win-story",
    sourcePattern: { kind: "wolf", id: "wolf:funding" },
    targetPattern: [
      { kind: "orca", id: "orca:social" },
      { kind: "narrative", id: "narrative:main" },
    ],
    executionPlan: {
      steps: [
        {
          id: "step:create-orca-post",
          action: "create-orca-post",
          target: { kind: "orca", id: "orca:social" },
          params: {
            title: "Wolf Pack secured funding lead",
            body: "Our AI wolf pack just identified and qualified a hot funding lead. The hunt continues.",
            tags: ["wolfpack", "funding"],
          },
          order: 1,
        },
        {
          id: "step:update-narrative",
          action: "update-narrative",
          target: { kind: "narrative", id: "narrative:main" },
          params: {
            title: "Wolf Pack Funding Win",
            summary: "Wolf Pack identified and qualified a hot funding lead",
            severity: "info",
            domain: "funding",
            tags: ["wolfpack", "funding"],
          },
          order: 2,
        },
      ],
    },
    priority: "high",
    usageCount: 0,
    successRate: 0.8,
    createdAt: now,
    updatedAt: now,
  });

  // Whale Hook Crosspost Template
  templates.push({
    id: "template:whale-hook-crosspost",
    name: "Whale Hook Crosspost",
    description: "Cross-post Whale Pack TikTok hook to Orca Pack social channels",
    kind: "whale-hook-crosspost",
    sourcePattern: { kind: "whale", id: "whale:tiktok" },
    targetPattern: [{ kind: "orca", id: "orca:social" }],
    executionPlan: {
      steps: [
        {
          id: "step:create-orca-post",
          action: "create-orca-post",
          target: { kind: "orca", id: "orca:social" },
          params: {
            title: "Whale Pack TikTok Hook",
            body: "Check out our latest TikTok content strategy from Whale Pack",
            tags: ["whalepack", "tiktok"],
          },
          order: 1,
        },
      ],
    },
    priority: "medium",
    usageCount: 0,
    successRate: 0.7,
    createdAt: now,
    updatedAt: now,
  });

  // Message Response Template
  templates.push({
    id: "template:message-response",
    name: "Message Response",
    description: "Respond to caught message fly via Orca Pack",
    kind: "message-response",
    sourcePattern: { kind: "other", id: "fly:message" },
    targetPattern: [{ kind: "orca", id: "orca:social" }],
    executionPlan: {
      steps: [
        {
          id: "step:create-orca-post",
          action: "create-orca-post",
          target: { kind: "orca", id: "orca:social" },
          params: {
            title: "Response to message",
            body: "Thank you for reaching out. We'll get back to you soon.",
            tags: ["response"],
          },
          order: 1,
        },
      ],
    },
    priority: "medium",
    usageCount: 0,
    successRate: 0.6,
    createdAt: now,
    updatedAt: now,
  });

  for (const template of templates) {
    SpiderStore.addTemplate(template);
  }

  return templates;
}

/**
 * Find matching template for a thread
 */
export function findMatchingTemplate(thread: SignalThread): ThreadTemplate | undefined {
  const templates = SpiderStore.listTemplates();
  
  // Find template that matches thread kind and source/target patterns
  return templates.find((t) => {
    if (t.kind !== thread.kind) return false;
    
    // Check source pattern
    if (t.sourcePattern.kind !== thread.source.kind) return false;
    
    // Check target patterns (at least one match)
    const targetMatch = t.targetPattern.some((tp) =>
      thread.targets.some((tt) => tp.kind === tt.kind)
    );
    
    return targetMatch;
  });
}

/**
 * Apply template to thread (add execution plan)
 */
export function applyTemplateToThread(thread: SignalThread, template: ThreadTemplate): SignalThread {
  if (template.executionPlan) {
    thread.executionPlan = template.executionPlan;
    thread.executable = true;
    thread.templateId = template.id;
    thread.priority = template.priority;
  }
  
  return thread;
}

