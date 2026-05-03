// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { ShardHash as _ShardHash, ShardHash__Output as _ShardHash__Output } from './ShardHash';
import type { CommitSignature as _CommitSignature, CommitSignature__Output as _CommitSignature__Output } from './CommitSignature';
import type { Long } from '@grpc/proto-loader';

export interface Commits {
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
  'value'?: (_ShardHash | null);
  'signatures'?: (_CommitSignature)[];
}

export interface Commits__Output {
  'height': (_Height__Output | null);
  'round': (string);
  'value': (_ShardHash__Output | null);
  'signatures': (_CommitSignature__Output)[];
}
