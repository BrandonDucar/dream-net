// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { Commits as _Commits, Commits__Output as _Commits__Output } from './Commits';

export interface SyncValueResponse {
  'height'?: (_Height | null);
  'fullValue'?: (Buffer | Uint8Array | string);
  'commits'?: (_Commits | null);
}

export interface SyncValueResponse__Output {
  'height': (_Height__Output | null);
  'fullValue': (Buffer);
  'commits': (_Commits__Output | null);
}
