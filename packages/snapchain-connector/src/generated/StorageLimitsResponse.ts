// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { StorageLimit as _StorageLimit, StorageLimit__Output as _StorageLimit__Output } from './StorageLimit';
import type { StorageUnitDetails as _StorageUnitDetails, StorageUnitDetails__Output as _StorageUnitDetails__Output } from './StorageUnitDetails';
import type { TierDetails as _TierDetails, TierDetails__Output as _TierDetails__Output } from './TierDetails';

export interface StorageLimitsResponse {
  'limits'?: (_StorageLimit)[];
  'units'?: (number);
  'unitDetails'?: (_StorageUnitDetails)[];
  'tierSubscriptions'?: (_TierDetails)[];
}

export interface StorageLimitsResponse__Output {
  'limits': (_StorageLimit__Output)[];
  'units': (number);
  'unitDetails': (_StorageUnitDetails__Output)[];
  'tierSubscriptions': (_TierDetails__Output)[];
}
