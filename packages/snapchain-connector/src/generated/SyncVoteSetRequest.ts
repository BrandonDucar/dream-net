// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { Long } from '@grpc/proto-loader';

export interface SyncVoteSetRequest {
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
}

export interface SyncVoteSetRequest__Output {
  'height': (_Height__Output | null);
  'round': (string);
}
