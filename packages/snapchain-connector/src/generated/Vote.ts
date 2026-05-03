// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { VoteType as _VoteType, VoteType__Output as _VoteType__Output } from './VoteType';
import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { ShardHash as _ShardHash, ShardHash__Output as _ShardHash__Output } from './ShardHash';
import type { Long } from '@grpc/proto-loader';

export interface Vote {
  'type'?: (_VoteType);
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
  'value'?: (_ShardHash | null);
  'voter'?: (Buffer | Uint8Array | string);
}

export interface Vote__Output {
  'type': (_VoteType__Output);
  'height': (_Height__Output | null);
  'round': (string);
  'value': (_ShardHash__Output | null);
  'voter': (Buffer);
}
