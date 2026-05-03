// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { Vote as _Vote, Vote__Output as _Vote__Output } from './Vote';
import type { Long } from '@grpc/proto-loader';

export interface SyncVoteSetResponse {
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
  'votes'?: (_Vote)[];
  'signatures'?: (Buffer | Uint8Array | string)[];
}

export interface SyncVoteSetResponse__Output {
  'height': (_Height__Output | null);
  'round': (string);
  'votes': (_Vote__Output)[];
  'signatures': (Buffer)[];
}
