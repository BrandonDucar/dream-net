// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { SyncValueResponse as _SyncValueResponse, SyncValueResponse__Output as _SyncValueResponse__Output } from './SyncValueResponse';
import type { SyncVoteSetResponse as _SyncVoteSetResponse, SyncVoteSetResponse__Output as _SyncVoteSetResponse__Output } from './SyncVoteSetResponse';

export interface SyncResponse {
  'value'?: (_SyncValueResponse | null);
  'voteSet'?: (_SyncVoteSetResponse | null);
  'syncResponse'?: "value"|"voteSet";
}

export interface SyncResponse__Output {
  'value'?: (_SyncValueResponse__Output | null);
  'voteSet'?: (_SyncVoteSetResponse__Output | null);
  'syncResponse'?: "value"|"voteSet";
}
