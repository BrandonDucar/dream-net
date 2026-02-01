/**
 * TravelNet Blueprint
 * A stub blueprint for a travel-focused DreamNet vertical
 */

import { defineNetworkBlueprint } from './define.js';
import { TRAVELNET_CORE_ID } from './constants.js';

export const TravelNetBlueprint = defineNetworkBlueprint({
  id: TRAVELNET_CORE_ID,
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

