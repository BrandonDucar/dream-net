// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/node_state.proto

import type { Long } from '@grpc/proto-loader';

export interface OnChainEventState {
  'lastL2Block'?: (number | string | Long);
}

export interface OnChainEventState__Output {
  'lastL2Block': (string);
}
