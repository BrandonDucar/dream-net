// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { TierType as _TierType, TierType__Output as _TierType__Output } from './TierType';
import type { Long } from '@grpc/proto-loader';

export interface TierDetails {
  'tierType'?: (_TierType);
  'expiresAt'?: (number | string | Long);
}

export interface TierDetails__Output {
  'tierType': (_TierType__Output);
  'expiresAt': (string);
}
