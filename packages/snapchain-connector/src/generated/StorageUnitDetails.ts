// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { StorageUnitType as _StorageUnitType, StorageUnitType__Output as _StorageUnitType__Output } from './StorageUnitType';

export interface StorageUnitDetails {
  'unitType'?: (_StorageUnitType);
  'unitSize'?: (number);
  'purchasedUnitSize'?: (number);
  'lentUnitSize'?: (number);
  'borrowedUnitSize'?: (number);
}

export interface StorageUnitDetails__Output {
  'unitType': (_StorageUnitType__Output);
  'unitSize': (number);
  'purchasedUnitSize': (number);
  'lentUnitSize': (number);
  'borrowedUnitSize': (number);
}
