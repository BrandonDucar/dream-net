// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { SyncValueRequest as _SyncValueRequest, SyncValueRequest__Output as _SyncValueRequest__Output } from './SyncValueRequest';
import type { SyncVoteSetRequest as _SyncVoteSetRequest, SyncVoteSetRequest__Output as _SyncVoteSetRequest__Output } from './SyncVoteSetRequest';

export interface SyncRequest {
  'value'?: (_SyncValueRequest | null);
  'voteSet'?: (_SyncVoteSetRequest | null);
  'syncRequest'?: "value"|"voteSet";
}

export interface SyncRequest__Output {
  'value'?: (_SyncValueRequest__Output | null);
  'voteSet'?: (_SyncVoteSetRequest__Output | null);
  'syncRequest'?: "value"|"voteSet";
}
