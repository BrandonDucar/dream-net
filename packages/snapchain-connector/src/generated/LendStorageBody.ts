// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { StorageUnitType as _StorageUnitType, StorageUnitType__Output as _StorageUnitType__Output } from './StorageUnitType';
import type { Long } from '@grpc/proto-loader';

export interface LendStorageBody {
  'toFid'?: (number | string | Long);
  'numUnits'?: (number | string | Long);
  'unitType'?: (_StorageUnitType);
}

export interface LendStorageBody__Output {
  'toFid': (string);
  'numUnits': (string);
  'unitType': (_StorageUnitType__Output);
}
