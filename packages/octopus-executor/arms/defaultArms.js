import { ArmRegistry } from "./armRegistry";
function createNoopHandler(name) {
    return async (task, ctx) => {
        // Placeholder: future implementations can call real subsystems here
        if (ctx.neuralMesh?.remember) {
            ctx.neuralMesh.remember({
                source: "OctopusExecutor",
                arm: name,
                task,
                timestamp: Date.now(),
            });
        }
    };
}
const defaultArmConfigs = [
    { id: "deploy", enabled: true, maxParallel: 2 },
    { id: "batch", enabled: true, maxParallel: 4 },
    { id: "streams", enabled: true, maxParallel: 2 },
    { id: "secrets", enabled: true, maxParallel: 1 },
    { id: "builds", enabled: true, maxParallel: 2 },
    { id: "watchers", enabled: true, maxParallel: 2 },
    { id: "cleanup", enabled: true, maxParallel: 2 },
    { id: "analytics", enabled: true, maxParallel: 2 },
];
export function registerDefaultArms() {
    const handlerById = {
        deploy: createNoopHandler("deploy"),
        batch: createNoopHandler("batch"),
        streams: createNoopHandler("streams"),
        secrets: createNoopHandler("secrets"),
        builds: createNoopHandler("builds"),
        watchers: createNoopHandler("watchers"),
        cleanup: createNoopHandler("cleanup"),
        analytics: createNoopHandler("analytics"),
    };
    defaultArmConfigs.forEach((config) => {
        ArmRegistry.registerArm(config, handlerById[config.id]);
    });
}
