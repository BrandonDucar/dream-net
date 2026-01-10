"use strict";
/**
 * TravelNet Blueprint
 * A stub blueprint for a travel-focused DreamNet vertical
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelNetBlueprint = void 0;
const define_1 = require("./define");
const constants_1 = require("./constants");
exports.TravelNetBlueprint = (0, define_1.defineNetworkBlueprint)({
    id: constants_1.TRAVELNET_CORE_ID,
    label: "TravelNet Core Network",
    citizens: [
        {
            id: "CIT-TINA",
            label: "Travel Pioneer",
            type: "citizen",
        },
    ],
    dreams: [
        {
            id: "DREAM-TRAVEL-0001",
            label: "TravelNet Core",
            type: "dream",
        },
    ],
    agents: [],
    ports: [],
    conduits: [],
});
