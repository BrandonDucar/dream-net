// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

import type { TierType as _TierType, TierType__Output as _TierType__Output } from './TierType';
import type { Long } from '@grpc/proto-loader';

export interface TierPurchaseBody {
  'tierType'?: (_TierType);
  'forDays'?: (number | string | Long);
  'payer'?: (Buffer | Uint8Array | string);
}

export interface TierPurchaseBody__Output {
  'tierType': (_TierType__Output);
  'forDays': (string);
  'payer': (Buffer);
}
