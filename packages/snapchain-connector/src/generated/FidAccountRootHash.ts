// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { Long } from '@grpc/proto-loader';

export interface FidAccountRootHash {
  'fid'?: (number | string | Long);
  'accountRootHash'?: (Buffer | Uint8Array | string);
  'numMessages'?: (number | string | Long);
}

export interface FidAccountRootHash__Output {
  'fid': (string);
  'accountRootHash': (Buffer);
  'numMessages': (string);
}
