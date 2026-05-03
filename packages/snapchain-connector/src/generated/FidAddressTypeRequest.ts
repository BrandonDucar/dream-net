// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface FidAddressTypeRequest {
  'fid'?: (number | string | Long);
  'address'?: (Buffer | Uint8Array | string);
}

export interface FidAddressTypeRequest__Output {
  'fid': (string);
  'address': (Buffer);
}
