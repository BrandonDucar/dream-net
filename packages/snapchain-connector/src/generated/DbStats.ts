// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface DbStats {
  'numMessages'?: (number | string | Long);
  'numFidRegistrations'?: (number | string | Long);
  'approxSize'?: (number | string | Long);
}

export interface DbStats__Output {
  'numMessages': (string);
  'numFidRegistrations': (string);
  'approxSize': (string);
}
