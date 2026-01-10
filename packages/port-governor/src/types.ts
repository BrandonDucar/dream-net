/**
 * Port Governor Types
 * Governed ports with roles, limits, and access control
 */

import type { TierId, PortId, PortDirection, PortLimits, PortProfile } from "@dreamnet/shared";
import type { OfficeId, CabinetId } from "@dreamnet/dreamstate";

export type { TierId, PortId, PortDirection, PortLimits, PortProfile };

export interface PortGovernorContext {
  portId: PortId;
  tierId: TierId;
  officeIds?: OfficeId[];
  cabinetIds?: CabinetId[];
  traceId?: string;
}

