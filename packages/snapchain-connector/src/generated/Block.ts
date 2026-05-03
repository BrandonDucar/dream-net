// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { BlockHeader as _BlockHeader, BlockHeader__Output as _BlockHeader__Output } from './BlockHeader';
import type { ShardWitness as _ShardWitness, ShardWitness__Output as _ShardWitness__Output } from './ShardWitness';
import type { Commits as _Commits, Commits__Output as _Commits__Output } from './Commits';
import type { Transaction as _Transaction, Transaction__Output as _Transaction__Output } from './Transaction';
import type { BlockEvent as _BlockEvent, BlockEvent__Output as _BlockEvent__Output } from './BlockEvent';

export interface Block {
  'header'?: (_BlockHeader | null);
  'hash'?: (Buffer | Uint8Array | string);
  'shardWitness'?: (_ShardWitness | null);
  'commits'?: (_Commits | null);
  'transactions'?: (_Transaction)[];
  'events'?: (_BlockEvent)[];
}

export interface Block__Output {
  'header': (_BlockHeader__Output | null);
  'hash': (Buffer);
  'shardWitness': (_ShardWitness__Output | null);
  'commits': (_Commits__Output | null);
  'transactions': (_Transaction__Output)[];
  'events': (_BlockEvent__Output)[];
}
