// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto


export interface KeyRemoveBody {
  'key'?: (Buffer | Uint8Array | string);
  'signature'?: (Buffer | Uint8Array | string);
  'signatureType'?: (number);
  'deadline'?: (number);
  'nonce'?: (number);
}

export interface KeyRemoveBody__Output {
  'key': (Buffer);
  'signature': (Buffer);
  'signatureType': (number);
  'deadline': (number);
  'nonce': (number);
}
