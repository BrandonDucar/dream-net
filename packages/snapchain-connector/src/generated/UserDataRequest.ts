// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { UserDataType as _UserDataType, UserDataType__Output as _UserDataType__Output } from './UserDataType';
import type { Long } from '@grpc/proto-loader';

export interface UserDataRequest {
  'fid'?: (number | string | Long);
  'userDataType'?: (_UserDataType);
}

export interface UserDataRequest__Output {
  'fid': (string);
  'userDataType': (_UserDataType__Output);
}
