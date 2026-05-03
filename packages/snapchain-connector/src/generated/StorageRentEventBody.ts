// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto


export interface StorageRentEventBody {
  'payer'?: (Buffer | Uint8Array | string);
  'units'?: (number);
  'expiry'?: (number);
}

export interface StorageRentEventBody__Output {
  'payer': (Buffer);
  'units': (number);
  'expiry': (number);
}
