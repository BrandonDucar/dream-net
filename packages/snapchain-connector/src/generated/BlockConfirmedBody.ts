// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/hub_event.proto

import type { Long } from '@grpc/proto-loader';

export interface BlockConfirmedBody {
  'blockNumber'?: (number | string | Long);
  'shardIndex'?: (number);
  'timestamp'?: (number | string | Long);
  'blockHash'?: (Buffer | Uint8Array | string);
  'totalEvents'?: (number | string | Long);
  'eventCountsByType'?: ({[key: number]: number | string | Long});
  'maxBlockEventSeqnum'?: (number | string | Long);
}

export interface BlockConfirmedBody__Output {
  'blockNumber': (string);
  'shardIndex': (number);
  'timestamp': (string);
  'blockHash': (Buffer);
  'totalEvents': (string);
  'eventCountsByType': ({[key: number]: string});
  'maxBlockEventSeqnum': (string);
}
