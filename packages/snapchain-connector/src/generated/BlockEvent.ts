// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { BlockEventData as _BlockEventData, BlockEventData__Output as _BlockEventData__Output } from './BlockEventData';

export interface BlockEvent {
  'hash'?: (Buffer | Uint8Array | string);
  'data'?: (_BlockEventData | null);
}

export interface BlockEvent__Output {
  'hash': (Buffer);
  'data': (_BlockEventData__Output | null);
}
