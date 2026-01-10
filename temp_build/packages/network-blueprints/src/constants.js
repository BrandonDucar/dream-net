"use strict";
/**
 * Network Blueprint Constants
 *
 * Centralized constants for network blueprint IDs, port IDs, event types, and fiber channels.
 * These constants ensure consistency across blueprint definitions and internal infrastructure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARCHIMEDES_FIBER = exports.ARCHIMEDES_EVENT_TYPE = exports.ARCHIMEDES_PORT_ID = exports.ARCHIMEDES_FLEET_ID = exports.OTT_FIBER = exports.OTT_EVENT_TYPE = exports.OTT_PORT_ID = exports.OTT_FLEET_ID = exports.AEGIS_FIBER = exports.AEGIS_EVENT_TYPE = exports.AEGIS_PORT_ID = exports.AEGIS_FLEET_ID = exports.DREAMNET_FIBER = exports.DREAMNET_EVENT_TYPE = exports.DREAMNET_PORT_ID = exports.DREAMNET_CORE_ID = exports.TRAVELNET_FIBER = exports.TRAVELNET_EVENT_TYPE = exports.TRAVELNET_PORT_ID = exports.TRAVELNET_CORE_ID = void 0;
/**
 * TravelNet Core Constants
 */
exports.TRAVELNET_CORE_ID = "TRAVELNET_CORE";
exports.TRAVELNET_PORT_ID = "travelnet-core"; // Matches PORT_IDS.TRAVELNET_CORE in @dreamnet/internal-ports
exports.TRAVELNET_EVENT_TYPE = "travelnet.event";
exports.TRAVELNET_FIBER = "GAMMA"; // Exploration/travel semantics
/**
 * DreamNet Core Constants
 */
exports.DREAMNET_CORE_ID = "DREAMNET_CORE";
exports.DREAMNET_PORT_ID = "dreamnet-core";
exports.DREAMNET_EVENT_TYPE = "dreamnet.event";
exports.DREAMNET_FIBER = "ALPHA";
/**
 * Aegis Fleet Constants
 */
exports.AEGIS_FLEET_ID = "AEGIS_FLEET";
exports.AEGIS_PORT_ID = "aegis-fleet";
exports.AEGIS_EVENT_TYPE = "aegis.event";
exports.AEGIS_FIBER = "BETA"; // Defense/military semantics
/**
 * OTT Fleet Constants
 */
exports.OTT_FLEET_ID = "OTT_FLEET";
exports.OTT_PORT_ID = "ott-fleet";
exports.OTT_EVENT_TYPE = "ott.event";
exports.OTT_FIBER = "DELTA"; // Communications/media semantics
/**
 * Science Fleet (Archimedes) Constants
 */
exports.ARCHIMEDES_FLEET_ID = "ARCHIMEDES_FLEET";
exports.ARCHIMEDES_PORT_ID = "archimedes-fleet";
exports.ARCHIMEDES_EVENT_TYPE = "archimedes.event";
exports.ARCHIMEDES_FIBER = "EPSILON"; // Research/science semantics
