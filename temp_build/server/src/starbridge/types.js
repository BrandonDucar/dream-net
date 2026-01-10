"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarbridgeSource = exports.StarbridgeTopic = void 0;
var StarbridgeTopic;
(function (StarbridgeTopic) {
    StarbridgeTopic["Governor"] = "Governor";
    StarbridgeTopic["Deploy"] = "Deploy";
    StarbridgeTopic["System"] = "System";
    StarbridgeTopic["Economy"] = "Economy";
    StarbridgeTopic["Vault"] = "Vault";
})(StarbridgeTopic || (exports.StarbridgeTopic = StarbridgeTopic = {}));
var StarbridgeSource;
(function (StarbridgeSource) {
    StarbridgeSource["Runtime"] = "Runtime";
    StarbridgeSource["ComputeGovernor"] = "ComputeGovernor";
    StarbridgeSource["DeployKeeper"] = "DeployKeeper";
    StarbridgeSource["DreamKeeper"] = "DreamKeeper";
    StarbridgeSource["RelayBot"] = "RelayBot";
    StarbridgeSource["External"] = "External";
})(StarbridgeSource || (exports.StarbridgeSource = StarbridgeSource = {}));
