// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { OnChainEvent as _OnChainEvent, OnChainEvent__Output as _OnChainEvent__Output } from './OnChainEvent';
import type { FnameTransfer as _FnameTransfer, FnameTransfer__Output as _FnameTransfer__Output } from './FnameTransfer';
import type { BlockEvent as _BlockEvent, BlockEvent__Output as _BlockEvent__Output } from './BlockEvent';

export interface ValidatorMessage {
  'onChainEvent'?: (_OnChainEvent | null);
  'fnameTransfer'?: (_FnameTransfer | null);
  'blockEvent'?: (_BlockEvent | null);
}

export interface ValidatorMessage__Output {
  'onChainEvent': (_OnChainEvent__Output | null);
  'fnameTransfer': (_FnameTransfer__Output | null);
  'blockEvent': (_BlockEvent__Output | null);
}
