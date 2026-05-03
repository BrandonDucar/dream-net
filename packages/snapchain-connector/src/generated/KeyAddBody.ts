// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto


export interface KeyAddBody {
  'key'?: (Buffer | Uint8Array | string);
  'keyType'?: (number);
  'custodySignature'?: (Buffer | Uint8Array | string);
  'deadline'?: (number);
  'nonce'?: (number);
  'metadata'?: (Buffer | Uint8Array | string);
  'metadataType'?: (number);
  'registrationTxHash'?: (Buffer | Uint8Array | string);
  'scopes'?: (number)[];
  'ttl'?: (number);
}

export interface KeyAddBody__Output {
  'key': (Buffer);
  'keyType': (number);
  'custodySignature': (Buffer);
  'deadline': (number);
  'nonce': (number);
  'metadata': (Buffer);
  'metadataType': (number);
  'registrationTxHash': (Buffer);
  'scopes': (number)[];
  'ttl': (number);
}
