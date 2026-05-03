// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { ShardTrieEntryWithMessage as _ShardTrieEntryWithMessage, ShardTrieEntryWithMessage__Output as _ShardTrieEntryWithMessage__Output } from './ShardTrieEntryWithMessage';
import type { FidAccountRootHash as _FidAccountRootHash, FidAccountRootHash__Output as _FidAccountRootHash__Output } from './FidAccountRootHash';

export interface GetShardTransactionsResponse {
  'trieMessages'?: (_ShardTrieEntryWithMessage)[];
  'fidAccountRoots'?: (_FidAccountRootHash)[];
  'nextPageToken'?: (string);
  '_nextPageToken'?: "nextPageToken";
}

export interface GetShardTransactionsResponse__Output {
  'trieMessages': (_ShardTrieEntryWithMessage__Output)[];
  'fidAccountRoots': (_FidAccountRootHash__Output)[];
  'nextPageToken'?: (string);
  '_nextPageToken'?: "nextPageToken";
}
