// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { ShardHeader as _ShardHeader, ShardHeader__Output as _ShardHeader__Output } from './ShardHeader';
import type { Transaction as _Transaction, Transaction__Output as _Transaction__Output } from './Transaction';
import type { Commits as _Commits, Commits__Output as _Commits__Output } from './Commits';

export interface ShardChunk {
  'header'?: (_ShardHeader | null);
  'hash'?: (Buffer | Uint8Array | string);
  'transactions'?: (_Transaction)[];
  'commits'?: (_Commits | null);
}

export interface ShardChunk__Output {
  'header': (_ShardHeader__Output | null);
  'hash': (Buffer);
  'transactions': (_Transaction__Output)[];
  'commits': (_Commits__Output | null);
}
