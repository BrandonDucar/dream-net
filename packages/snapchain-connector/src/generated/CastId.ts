// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { Long } from '@grpc/proto-loader';

export interface CastId {
  'fid'?: (number | string | Long);
  'hash'?: (Buffer | Uint8Array | string);
}

export interface CastId__Output {
  'fid': (string);
  'hash': (Buffer);
}
