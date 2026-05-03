// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Signer as _Signer, Signer__Output as _Signer__Output } from './Signer';

export interface SignersByFidResponse {
  'signers'?: (_Signer)[];
  'nextPageToken'?: (Buffer | Uint8Array | string);
  'gaslessSignerCount'?: (number);
  'gaslessSignerLimit'?: (number);
  '_nextPageToken'?: "nextPageToken";
}

export interface SignersByFidResponse__Output {
  'signers': (_Signer__Output)[];
  'nextPageToken'?: (Buffer);
  'gaslessSignerCount': (number);
  'gaslessSignerLimit': (number);
  '_nextPageToken'?: "nextPageToken";
}
