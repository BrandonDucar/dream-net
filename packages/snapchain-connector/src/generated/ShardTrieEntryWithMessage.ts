// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';
import type { OnChainEvent as _OnChainEvent, OnChainEvent__Output as _OnChainEvent__Output } from './OnChainEvent';
import type { FnameTransfer as _FnameTransfer, FnameTransfer__Output as _FnameTransfer__Output } from './FnameTransfer';

export interface ShardTrieEntryWithMessage {
  'trieKey'?: (Buffer | Uint8Array | string);
  'userMessage'?: (_Message | null);
  'onChainEvent'?: (_OnChainEvent | null);
  'fnameTransfer'?: (_FnameTransfer | null);
  'trieMessage'?: "userMessage"|"onChainEvent"|"fnameTransfer";
}

export interface ShardTrieEntryWithMessage__Output {
  'trieKey': (Buffer);
  'userMessage'?: (_Message__Output | null);
  'onChainEvent'?: (_OnChainEvent__Output | null);
  'fnameTransfer'?: (_FnameTransfer__Output | null);
  'trieMessage'?: "userMessage"|"onChainEvent"|"fnameTransfer";
}
