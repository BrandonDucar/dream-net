// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto


export interface FidsRequest {
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  'shardId'?: (number);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface FidsRequest__Output {
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  'shardId': (number);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
