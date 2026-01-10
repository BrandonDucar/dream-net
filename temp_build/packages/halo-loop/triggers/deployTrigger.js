"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeployTrigger = registerDeployTrigger;
exports.notifyDeploy = notifyDeploy;
exports.getLastDeploy = getLastDeploy;
let lastDeploy = null;
function registerDeployTrigger(_engine) {
    return {
        name: "deployTrigger",
        stop: () => {
            lastDeploy = null;
        },
    };
}
function notifyDeploy(engine, metadata) {
    lastDeploy = new Date().toISOString();
    void engine.runCycle("deployTrigger", { metadata });
}
function getLastDeploy() {
    return lastDeploy;
}
