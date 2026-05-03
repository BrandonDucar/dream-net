// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { StoreType as _StoreType, StoreType__Output as _StoreType__Output } from './StoreType';
import type { Long } from '@grpc/proto-loader';

export interface StorageLimit {
  'storeType'?: (_StoreType);
  'name'?: (string);
  'limit'?: (number | string | Long);
  'used'?: (number | string | Long);
  'earliestTimestamp'?: (number | string | Long);
  'earliestHash'?: (Buffer | Uint8Array | string);
}

export interface StorageLimit__Output {
  'storeType': (_StoreType__Output);
  'name': (string);
  'limit': (string);
  'used': (string);
  'earliestTimestamp': (string);
  'earliestHash': (Buffer);
}
