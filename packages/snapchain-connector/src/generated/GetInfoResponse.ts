// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { DbStats as _DbStats, DbStats__Output as _DbStats__Output } from './DbStats';
import type { ShardInfo as _ShardInfo, ShardInfo__Output as _ShardInfo__Output } from './ShardInfo';
import type { Long } from '@grpc/proto-loader';

export interface GetInfoResponse {
  'version'?: (string);
  'dbStats'?: (_DbStats | null);
  'peerId'?: (string);
  'numShards'?: (number);
  'shardInfos'?: (_ShardInfo)[];
  'nextEngineVersionTimestamp'?: (number | string | Long);
}

export interface GetInfoResponse__Output {
  'version': (string);
  'dbStats': (_DbStats__Output | null);
  'peerId': (string);
  'numShards': (number);
  'shardInfos': (_ShardInfo__Output)[];
  'nextEngineVersionTimestamp': (string);
}
