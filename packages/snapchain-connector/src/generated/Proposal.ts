// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { ShardHash as _ShardHash, ShardHash__Output as _ShardHash__Output } from './ShardHash';
import type { Long } from '@grpc/proto-loader';

export interface Proposal {
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
  'polRound'?: (number | string | Long);
  'proposer'?: (Buffer | Uint8Array | string);
  'value'?: (_ShardHash | null);
}

export interface Proposal__Output {
  'height': (_Height__Output | null);
  'round': (string);
  'polRound': (string);
  'proposer': (Buffer);
  'value': (_ShardHash__Output | null);
}
