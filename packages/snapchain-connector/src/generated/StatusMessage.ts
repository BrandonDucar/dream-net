// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';

export interface StatusMessage {
  'peerId'?: (Buffer | Uint8Array | string);
  'height'?: (_Height | null);
  'minHeight'?: (_Height | null);
}

export interface StatusMessage__Output {
  'peerId': (Buffer);
  'height': (_Height__Output | null);
  'minHeight': (_Height__Output | null);
}
