import { SpiderStore } from "../store/spiderStore";
let flyCounter = 0;
function nextFlyId() {
    flyCounter += 1;
    return `fly:${Date.now()}:${flyCounter}`;
}
/**
 * Determine if a fly should stick to the web
 */
export function shouldFlyStick(fly) {
    // Critical flies always stick
    if (fly.priority === "critical")
        return true;
    // High priority flies usually stick
    if (fly.priority === "high")
        return fly.sticky || Math.random() > 0.2;
    // Medium priority flies stick if marked sticky
    if (fly.priority === "medium")
        return fly.sticky || Math.random() > 0.5;
    // Low priority flies rarely stick unless explicitly sticky
    if (fly.priority === "low")
        return fly.sticky;
    return false;
}
/**
 * Classify a fly and determine what thread it should create
 */
export function classifyFly(fly) {
    // Message flies → Orca Pack (respond)
    if (fly.type === "message") {
        return {
            threadKind: "message-response",
            priority: fly.priority === "critical" ? "critical" : fly.priority === "high" ? "high" : "medium",
            targets: [{ kind: "orca", id: "orca:social", label: "Orca Pack" }],
        };
    }
    // Mention flies → Orca Pack (engage)
    if (fly.type === "mention") {
        return {
            threadKind: "fly-caught",
            priority: "medium",
            targets: [{ kind: "orca", id: "orca:social", label: "Orca Pack" }],
        };
    }
    // Transaction flies → Economic Engine
    if (fly.type === "transaction") {
        return {
            threadKind: "revenue-event",
            priority: "high",
            targets: [{ kind: "economic-engine", id: "economic:core", label: "Economic Engine" }],
        };
    }
    // Webhook flies → route based on payload
    if (fly.type === "webhook") {
        const webhookType = fly.payload.type || "unknown";
        if (webhookType === "funding") {
            return {
                threadKind: "wolf-win-story",
                priority: "high",
                targets: [
                    { kind: "wolf", id: "wolf:funding", label: "Wolf Pack" },
                    { kind: "orca", id: "orca:social", label: "Orca Pack" },
                ],
            };
        }
        return {
            threadKind: "data-ingest",
            priority: "medium",
            targets: [{ kind: "data-vault", id: "datavault:core", label: "DataVault" }],
        };
    }
    // Alert flies → high priority, multiple targets
    if (fly.type === "alert") {
        return {
            threadKind: "status-broadcast",
            priority: "critical",
            targets: [
                { kind: "os", id: "os:core", label: "DreamNet OS" },
                { kind: "narrative", id: "narrative:main", label: "NarrativeField" },
            ],
        };
    }
    // Default: data ingest
    return {
        threadKind: "data-ingest",
        priority: "low",
        targets: [{ kind: "data-vault", id: "datavault:core", label: "DataVault" }],
    };
}
/**
 * Catch a fly and create a thread from it
 */
export function catchFly(fly) {
    // Check if fly should stick
    if (!shouldFlyStick(fly)) {
        console.log(`[FlyCatcher] Fly ${fly.id} bounced off web (not sticky)`);
        return null;
    }
    // Store fly
    SpiderStore.catchFly(fly);
    // Classify fly
    const classification = classifyFly(fly);
    // Create thread from fly
    const now = Date.now();
    const threadId = `thread:fly:${fly.id}:${now}`;
    const thread = {
        id: threadId,
        source: { kind: "other", id: `fly:${fly.source}`, label: `Fly from ${fly.source}` },
        targets: classification.targets,
        kind: classification.threadKind,
        payload: {
            flyId: fly.id,
            flyType: fly.type,
            flySource: fly.source,
            ...fly.payload,
        },
        status: "pending",
        priority: classification.priority,
        createdAt: now,
        updatedAt: now,
        executable: true,
    };
    // Link fly to thread
    fly.threadId = threadId;
    SpiderStore.markFlyProcessed(fly.id, threadId);
    console.log(`[FlyCatcher] Caught fly ${fly.id} → created thread ${threadId} (${classification.threadKind})`);
    return thread;
}
/**
 * Create a fly from external event
 */
export function createFly(type, source, payload, priority = "medium", sticky = false) {
    const now = Date.now();
    const id = nextFlyId();
    return {
        id,
        type,
        source,
        payload,
        caughtAt: now,
        priority,
        sticky,
        processed: false,
    };
}
