// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface SignerRequest {
  'fid'?: (number | string | Long);
  'signer'?: (Buffer | Uint8Array | string);
}

export interface SignerRequest__Output {
  'fid': (string);
  'signer': (Buffer);
}
