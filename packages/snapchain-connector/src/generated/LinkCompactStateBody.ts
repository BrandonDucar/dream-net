// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { Long } from '@grpc/proto-loader';

export interface LinkCompactStateBody {
  'type'?: (string);
  'targetFids'?: (number | string | Long)[];
}

export interface LinkCompactStateBody__Output {
  'type': (string);
  'targetFids': (string)[];
}
