// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Long } from '@grpc/proto-loader';

export interface Validator {
  'fid'?: (number | string | Long);
  'signer'?: (Buffer | Uint8Array | string);
  'rpcAddress'?: (string);
  'shardIndex'?: (number);
  'currentHeight'?: (number | string | Long);
}

export interface Validator__Output {
  'fid': (string);
  'signer': (Buffer);
  'rpcAddress': (string);
  'shardIndex': (number);
  'currentHeight': (string);
}
