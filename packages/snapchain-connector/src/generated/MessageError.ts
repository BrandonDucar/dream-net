// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto


export interface MessageError {
  'hash'?: (Buffer | Uint8Array | string);
  'errCode'?: (string);
  'message'?: (string);
}

export interface MessageError__Output {
  'hash': (Buffer);
  'errCode': (string);
  'message': (string);
}
