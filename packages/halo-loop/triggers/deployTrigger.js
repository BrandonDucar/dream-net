let lastDeploy = null;
export function registerDeployTrigger(_engine) {
    return {
        name: "deployTrigger",
        stop: () => {
            lastDeploy = null;
        },
    };
}
export function notifyDeploy(engine, metadata) {
    lastDeploy = new Date().toISOString();
    void engine.runCycle("deployTrigger", { metadata });
}
export function getLastDeploy() {
    return lastDeploy;
}
