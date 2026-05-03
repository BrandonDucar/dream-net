// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/rpc.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Block as _Block, Block__Output as _Block__Output } from './Block';
import type { BlocksRequest as _BlocksRequest, BlocksRequest__Output as _BlocksRequest__Output } from './BlocksRequest';
import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';
import type { CastsByParentRequest as _CastsByParentRequest, CastsByParentRequest__Output as _CastsByParentRequest__Output } from './CastsByParentRequest';
import type { EventRequest as _EventRequest, EventRequest__Output as _EventRequest__Output } from './EventRequest';
import type { EventsRequest as _EventsRequest, EventsRequest__Output as _EventsRequest__Output } from './EventsRequest';
import type { EventsResponse as _EventsResponse, EventsResponse__Output as _EventsResponse__Output } from './EventsResponse';
import type { FidAddressTypeRequest as _FidAddressTypeRequest, FidAddressTypeRequest__Output as _FidAddressTypeRequest__Output } from './FidAddressTypeRequest';
import type { FidAddressTypeResponse as _FidAddressTypeResponse, FidAddressTypeResponse__Output as _FidAddressTypeResponse__Output } from './FidAddressTypeResponse';
import type { FidRequest as _FidRequest, FidRequest__Output as _FidRequest__Output } from './FidRequest';
import type { FidTimestampRequest as _FidTimestampRequest, FidTimestampRequest__Output as _FidTimestampRequest__Output } from './FidTimestampRequest';
import type { FidsRequest as _FidsRequest, FidsRequest__Output as _FidsRequest__Output } from './FidsRequest';
import type { FidsResponse as _FidsResponse, FidsResponse__Output as _FidsResponse__Output } from './FidsResponse';
import type { GetConnectedPeersRequest as _GetConnectedPeersRequest, GetConnectedPeersRequest__Output as _GetConnectedPeersRequest__Output } from './GetConnectedPeersRequest';
import type { GetConnectedPeersResponse as _GetConnectedPeersResponse, GetConnectedPeersResponse__Output as _GetConnectedPeersResponse__Output } from './GetConnectedPeersResponse';
import type { GetInfoRequest as _GetInfoRequest, GetInfoRequest__Output as _GetInfoRequest__Output } from './GetInfoRequest';
import type { GetInfoResponse as _GetInfoResponse, GetInfoResponse__Output as _GetInfoResponse__Output } from './GetInfoResponse';
import type { HubEvent as _HubEvent, HubEvent__Output as _HubEvent__Output } from './HubEvent';
import type { IdRegistryEventByAddressRequest as _IdRegistryEventByAddressRequest, IdRegistryEventByAddressRequest__Output as _IdRegistryEventByAddressRequest__Output } from './IdRegistryEventByAddressRequest';
import type { LinkRequest as _LinkRequest, LinkRequest__Output as _LinkRequest__Output } from './LinkRequest';
import type { LinksByFidRequest as _LinksByFidRequest, LinksByFidRequest__Output as _LinksByFidRequest__Output } from './LinksByFidRequest';
import type { LinksByTargetRequest as _LinksByTargetRequest, LinksByTargetRequest__Output as _LinksByTargetRequest__Output } from './LinksByTargetRequest';
import type { Message as _Message, Message__Output as _Message__Output } from './Message';
import type { MessagesResponse as _MessagesResponse, MessagesResponse__Output as _MessagesResponse__Output } from './MessagesResponse';
import type { OnChainEvent as _OnChainEvent, OnChainEvent__Output as _OnChainEvent__Output } from './OnChainEvent';
import type { OnChainEventRequest as _OnChainEventRequest, OnChainEventRequest__Output as _OnChainEventRequest__Output } from './OnChainEventRequest';
import type { OnChainEventResponse as _OnChainEventResponse, OnChainEventResponse__Output as _OnChainEventResponse__Output } from './OnChainEventResponse';
import type { ReactionRequest as _ReactionRequest, ReactionRequest__Output as _ReactionRequest__Output } from './ReactionRequest';
import type { ReactionsByFidRequest as _ReactionsByFidRequest, ReactionsByFidRequest__Output as _ReactionsByFidRequest__Output } from './ReactionsByFidRequest';
import type { ReactionsByTargetRequest as _ReactionsByTargetRequest, ReactionsByTargetRequest__Output as _ReactionsByTargetRequest__Output } from './ReactionsByTargetRequest';
import type { ShardChunksRequest as _ShardChunksRequest, ShardChunksRequest__Output as _ShardChunksRequest__Output } from './ShardChunksRequest';
import type { ShardChunksResponse as _ShardChunksResponse, ShardChunksResponse__Output as _ShardChunksResponse__Output } from './ShardChunksResponse';
import type { SignerRequest as _SignerRequest, SignerRequest__Output as _SignerRequest__Output } from './SignerRequest';
import type { SignerResponse as _SignerResponse, SignerResponse__Output as _SignerResponse__Output } from './SignerResponse';
import type { SignersByFidResponse as _SignersByFidResponse, SignersByFidResponse__Output as _SignersByFidResponse__Output } from './SignersByFidResponse';
import type { StorageLimitsResponse as _StorageLimitsResponse, StorageLimitsResponse__Output as _StorageLimitsResponse__Output } from './StorageLimitsResponse';
import type { SubmitBulkMessagesRequest as _SubmitBulkMessagesRequest, SubmitBulkMessagesRequest__Output as _SubmitBulkMessagesRequest__Output } from './SubmitBulkMessagesRequest';
import type { SubmitBulkMessagesResponse as _SubmitBulkMessagesResponse, SubmitBulkMessagesResponse__Output as _SubmitBulkMessagesResponse__Output } from './SubmitBulkMessagesResponse';
import type { SubscribeRequest as _SubscribeRequest, SubscribeRequest__Output as _SubscribeRequest__Output } from './SubscribeRequest';
import type { TrieNodeMetadataRequest as _TrieNodeMetadataRequest, TrieNodeMetadataRequest__Output as _TrieNodeMetadataRequest__Output } from './TrieNodeMetadataRequest';
import type { TrieNodeMetadataResponse as _TrieNodeMetadataResponse, TrieNodeMetadataResponse__Output as _TrieNodeMetadataResponse__Output } from './TrieNodeMetadataResponse';
import type { UserDataRequest as _UserDataRequest, UserDataRequest__Output as _UserDataRequest__Output } from './UserDataRequest';
import type { UserNameProof as _UserNameProof, UserNameProof__Output as _UserNameProof__Output } from './UserNameProof';
import type { UsernameProofRequest as _UsernameProofRequest, UsernameProofRequest__Output as _UsernameProofRequest__Output } from './UsernameProofRequest';
import type { UsernameProofsResponse as _UsernameProofsResponse, UsernameProofsResponse__Output as _UsernameProofsResponse__Output } from './UsernameProofsResponse';
import type { ValidationResponse as _ValidationResponse, ValidationResponse__Output as _ValidationResponse__Output } from './ValidationResponse';
import type { VerificationRequest as _VerificationRequest, VerificationRequest__Output as _VerificationRequest__Output } from './VerificationRequest';

export interface HubServiceClient extends grpc.Client {
  GetAllCastMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllCastMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllCastMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllCastMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllCastMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllCastMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllCastMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllCastMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetAllLendStorageMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLendStorageMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLendStorageMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLendStorageMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLendStorageMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLendStorageMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLendStorageMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLendStorageMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetAllLinkMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLinkMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLinkMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllLinkMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLinkMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLinkMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLinkMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllLinkMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetAllReactionMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllReactionMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllReactionMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllReactionMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllReactionMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllReactionMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllReactionMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllReactionMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetAllUserDataMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllUserDataMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllUserDataMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllUserDataMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllUserDataMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllUserDataMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllUserDataMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllUserDataMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetAllVerificationMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllVerificationMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllVerificationMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetAllVerificationMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllVerificationMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllVerificationMessagesByFid(argument: _FidTimestampRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllVerificationMessagesByFid(argument: _FidTimestampRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getAllVerificationMessagesByFid(argument: _FidTimestampRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetBlocks(argument: _BlocksRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_Block__Output>;
  GetBlocks(argument: _BlocksRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_Block__Output>;
  getBlocks(argument: _BlocksRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_Block__Output>;
  getBlocks(argument: _BlocksRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_Block__Output>;
  
  GetCast(argument: _CastId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetCast(argument: _CastId, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetCast(argument: _CastId, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetCast(argument: _CastId, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getCast(argument: _CastId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getCast(argument: _CastId, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getCast(argument: _CastId, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getCast(argument: _CastId, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  GetCastsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetCastsByMention(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByMention(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByMention(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByMention(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByMention(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByMention(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByMention(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByMention(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetCastsByParent(argument: _CastsByParentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByParent(argument: _CastsByParentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByParent(argument: _CastsByParentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetCastsByParent(argument: _CastsByParentRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByParent(argument: _CastsByParentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByParent(argument: _CastsByParentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByParent(argument: _CastsByParentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getCastsByParent(argument: _CastsByParentRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetConnectedPeers(argument: _GetConnectedPeersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  GetConnectedPeers(argument: _GetConnectedPeersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  GetConnectedPeers(argument: _GetConnectedPeersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  GetConnectedPeers(argument: _GetConnectedPeersRequest, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  getConnectedPeers(argument: _GetConnectedPeersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  getConnectedPeers(argument: _GetConnectedPeersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  getConnectedPeers(argument: _GetConnectedPeersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  getConnectedPeers(argument: _GetConnectedPeersRequest, callback: grpc.requestCallback<_GetConnectedPeersResponse__Output>): grpc.ClientUnaryCall;
  
  GetCurrentStorageLimitsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  GetCurrentStorageLimitsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  GetCurrentStorageLimitsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  GetCurrentStorageLimitsByFid(argument: _FidRequest, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  getCurrentStorageLimitsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  getCurrentStorageLimitsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  getCurrentStorageLimitsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  getCurrentStorageLimitsByFid(argument: _FidRequest, callback: grpc.requestCallback<_StorageLimitsResponse__Output>): grpc.ClientUnaryCall;
  
  GetEvent(argument: _EventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  GetEvent(argument: _EventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  GetEvent(argument: _EventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  GetEvent(argument: _EventRequest, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  getEvent(argument: _EventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  getEvent(argument: _EventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  getEvent(argument: _EventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  getEvent(argument: _EventRequest, callback: grpc.requestCallback<_HubEvent__Output>): grpc.ClientUnaryCall;
  
  GetEvents(argument: _EventsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  GetEvents(argument: _EventsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  GetEvents(argument: _EventsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  GetEvents(argument: _EventsRequest, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  getEvents(argument: _EventsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  getEvents(argument: _EventsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  getEvents(argument: _EventsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  getEvents(argument: _EventsRequest, callback: grpc.requestCallback<_EventsResponse__Output>): grpc.ClientUnaryCall;
  
  GetFidAddressType(argument: _FidAddressTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  GetFidAddressType(argument: _FidAddressTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  GetFidAddressType(argument: _FidAddressTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  GetFidAddressType(argument: _FidAddressTypeRequest, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  getFidAddressType(argument: _FidAddressTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  getFidAddressType(argument: _FidAddressTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  getFidAddressType(argument: _FidAddressTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  getFidAddressType(argument: _FidAddressTypeRequest, callback: grpc.requestCallback<_FidAddressTypeResponse__Output>): grpc.ClientUnaryCall;
  
  GetFids(argument: _FidsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  GetFids(argument: _FidsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  GetFids(argument: _FidsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  GetFids(argument: _FidsRequest, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  getFids(argument: _FidsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  getFids(argument: _FidsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  getFids(argument: _FidsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  getFids(argument: _FidsRequest, callback: grpc.requestCallback<_FidsResponse__Output>): grpc.ClientUnaryCall;
  
  GetIdRegistryOnChainEvent(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEvent(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEvent(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEvent(argument: _FidRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEvent(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEvent(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEvent(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEvent(argument: _FidRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  
  GetIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getIdRegistryOnChainEventByAddress(argument: _IdRegistryEventByAddressRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  
  GetInfo(argument: _GetInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  GetInfo(argument: _GetInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  GetInfo(argument: _GetInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  GetInfo(argument: _GetInfoRequest, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  getInfo(argument: _GetInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  getInfo(argument: _GetInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  getInfo(argument: _GetInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  getInfo(argument: _GetInfoRequest, callback: grpc.requestCallback<_GetInfoResponse__Output>): grpc.ClientUnaryCall;
  
  GetLink(argument: _LinkRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetLink(argument: _LinkRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetLink(argument: _LinkRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetLink(argument: _LinkRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getLink(argument: _LinkRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getLink(argument: _LinkRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getLink(argument: _LinkRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getLink(argument: _LinkRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  GetLinkCompactStateMessageByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinkCompactStateMessageByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinkCompactStateMessageByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinkCompactStateMessageByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinkCompactStateMessageByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinkCompactStateMessageByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinkCompactStateMessageByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinkCompactStateMessageByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetLinksByFid(argument: _LinksByFidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByFid(argument: _LinksByFidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByFid(argument: _LinksByFidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByFid(argument: _LinksByFidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByFid(argument: _LinksByFidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByFid(argument: _LinksByFidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByFid(argument: _LinksByFidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByFid(argument: _LinksByFidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetLinksByTarget(argument: _LinksByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByTarget(argument: _LinksByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByTarget(argument: _LinksByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetLinksByTarget(argument: _LinksByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByTarget(argument: _LinksByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByTarget(argument: _LinksByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByTarget(argument: _LinksByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getLinksByTarget(argument: _LinksByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetOnChainEvents(argument: _OnChainEventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainEvents(argument: _OnChainEventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainEvents(argument: _OnChainEventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainEvents(argument: _OnChainEventRequest, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainEvents(argument: _OnChainEventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainEvents(argument: _OnChainEventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainEvents(argument: _OnChainEventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainEvents(argument: _OnChainEventRequest, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  
  GetOnChainSigner(argument: _SignerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetOnChainSigner(argument: _SignerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetOnChainSigner(argument: _SignerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  GetOnChainSigner(argument: _SignerRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getOnChainSigner(argument: _SignerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getOnChainSigner(argument: _SignerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getOnChainSigner(argument: _SignerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  getOnChainSigner(argument: _SignerRequest, callback: grpc.requestCallback<_OnChainEvent__Output>): grpc.ClientUnaryCall;
  
  GetOnChainSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainSignersByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  GetOnChainSignersByFid(argument: _FidRequest, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainSignersByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  getOnChainSignersByFid(argument: _FidRequest, callback: grpc.requestCallback<_OnChainEventResponse__Output>): grpc.ClientUnaryCall;
  
  GetReaction(argument: _ReactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetReaction(argument: _ReactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetReaction(argument: _ReactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetReaction(argument: _ReactionRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getReaction(argument: _ReactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getReaction(argument: _ReactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getReaction(argument: _ReactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getReaction(argument: _ReactionRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  GetReactionsByCast(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByCast(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByCast(argument: _ReactionsByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByCast(argument: _ReactionsByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByCast(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByCast(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByCast(argument: _ReactionsByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByCast(argument: _ReactionsByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetReactionsByFid(argument: _ReactionsByFidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByFid(argument: _ReactionsByFidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByFid(argument: _ReactionsByFidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByFid(argument: _ReactionsByFidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByFid(argument: _ReactionsByFidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByFid(argument: _ReactionsByFidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByFid(argument: _ReactionsByFidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByFid(argument: _ReactionsByFidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetReactionsByTarget(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByTarget(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByTarget(argument: _ReactionsByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetReactionsByTarget(argument: _ReactionsByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByTarget(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByTarget(argument: _ReactionsByTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByTarget(argument: _ReactionsByTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getReactionsByTarget(argument: _ReactionsByTargetRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetShardChunks(argument: _ShardChunksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  GetShardChunks(argument: _ShardChunksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  GetShardChunks(argument: _ShardChunksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  GetShardChunks(argument: _ShardChunksRequest, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  getShardChunks(argument: _ShardChunksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  getShardChunks(argument: _ShardChunksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  getShardChunks(argument: _ShardChunksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  getShardChunks(argument: _ShardChunksRequest, callback: grpc.requestCallback<_ShardChunksResponse__Output>): grpc.ClientUnaryCall;
  
  GetSigner(argument: _SignerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  GetSigner(argument: _SignerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  GetSigner(argument: _SignerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  GetSigner(argument: _SignerRequest, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  getSigner(argument: _SignerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  getSigner(argument: _SignerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  getSigner(argument: _SignerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  getSigner(argument: _SignerRequest, callback: grpc.requestCallback<_SignerResponse__Output>): grpc.ClientUnaryCall;
  
  GetSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  GetSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  GetSignersByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  GetSignersByFid(argument: _FidRequest, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  getSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  getSignersByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  getSignersByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  getSignersByFid(argument: _FidRequest, callback: grpc.requestCallback<_SignersByFidResponse__Output>): grpc.ClientUnaryCall;
  
  GetTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  getTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  getTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  getTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  getTrieMetadataByPrefix(argument: _TrieNodeMetadataRequest, callback: grpc.requestCallback<_TrieNodeMetadataResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserData(argument: _UserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetUserData(argument: _UserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetUserData(argument: _UserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetUserData(argument: _UserDataRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getUserData(argument: _UserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getUserData(argument: _UserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getUserData(argument: _UserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getUserData(argument: _UserDataRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  GetUserDataByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetUserDataByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetUserDataByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetUserDataByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getUserDataByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getUserDataByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getUserDataByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getUserDataByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserNameProofsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  GetUserNameProofsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  GetUserNameProofsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  GetUserNameProofsByFid(argument: _FidRequest, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  getUserNameProofsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  getUserNameProofsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  getUserNameProofsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  getUserNameProofsByFid(argument: _FidRequest, callback: grpc.requestCallback<_UsernameProofsResponse__Output>): grpc.ClientUnaryCall;
  
  GetUsernameProof(argument: _UsernameProofRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  GetUsernameProof(argument: _UsernameProofRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  GetUsernameProof(argument: _UsernameProofRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  GetUsernameProof(argument: _UsernameProofRequest, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  getUsernameProof(argument: _UsernameProofRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  getUsernameProof(argument: _UsernameProofRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  getUsernameProof(argument: _UsernameProofRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  getUsernameProof(argument: _UsernameProofRequest, callback: grpc.requestCallback<_UserNameProof__Output>): grpc.ClientUnaryCall;
  
  GetVerification(argument: _VerificationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetVerification(argument: _VerificationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetVerification(argument: _VerificationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  GetVerification(argument: _VerificationRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getVerification(argument: _VerificationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getVerification(argument: _VerificationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getVerification(argument: _VerificationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  getVerification(argument: _VerificationRequest, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  GetVerificationsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetVerificationsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetVerificationsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  GetVerificationsByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getVerificationsByFid(argument: _FidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getVerificationsByFid(argument: _FidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getVerificationsByFid(argument: _FidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  getVerificationsByFid(argument: _FidRequest, callback: grpc.requestCallback<_MessagesResponse__Output>): grpc.ClientUnaryCall;
  
  SubmitBulkMessages(argument: _SubmitBulkMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  SubmitBulkMessages(argument: _SubmitBulkMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  SubmitBulkMessages(argument: _SubmitBulkMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  SubmitBulkMessages(argument: _SubmitBulkMessagesRequest, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  submitBulkMessages(argument: _SubmitBulkMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  submitBulkMessages(argument: _SubmitBulkMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  submitBulkMessages(argument: _SubmitBulkMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  submitBulkMessages(argument: _SubmitBulkMessagesRequest, callback: grpc.requestCallback<_SubmitBulkMessagesResponse__Output>): grpc.ClientUnaryCall;
  
  SubmitMessage(argument: _Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  SubmitMessage(argument: _Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  SubmitMessage(argument: _Message, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  SubmitMessage(argument: _Message, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  submitMessage(argument: _Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  submitMessage(argument: _Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  submitMessage(argument: _Message, options: grpc.CallOptions, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  submitMessage(argument: _Message, callback: grpc.requestCallback<_Message__Output>): grpc.ClientUnaryCall;
  
  Subscribe(argument: _SubscribeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_HubEvent__Output>;
  Subscribe(argument: _SubscribeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_HubEvent__Output>;
  subscribe(argument: _SubscribeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_HubEvent__Output>;
  subscribe(argument: _SubscribeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_HubEvent__Output>;
  
  ValidateMessage(argument: _Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateMessage(argument: _Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateMessage(argument: _Message, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateMessage(argument: _Message, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateMessage(argument: _Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateMessage(argument: _Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateMessage(argument: _Message, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateMessage(argument: _Message, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface HubServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAllCastMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetAllLendStorageMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetAllLinkMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetAllReactionMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetAllUserDataMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetAllVerificationMessagesByFid: grpc.handleUnaryCall<_FidTimestampRequest__Output, _MessagesResponse>;
  
  GetBlocks: grpc.handleServerStreamingCall<_BlocksRequest__Output, _Block>;
  
  GetCast: grpc.handleUnaryCall<_CastId__Output, _Message>;
  
  GetCastsByFid: grpc.handleUnaryCall<_FidRequest__Output, _MessagesResponse>;
  
  GetCastsByMention: grpc.handleUnaryCall<_FidRequest__Output, _MessagesResponse>;
  
  GetCastsByParent: grpc.handleUnaryCall<_CastsByParentRequest__Output, _MessagesResponse>;
  
  GetConnectedPeers: grpc.handleUnaryCall<_GetConnectedPeersRequest__Output, _GetConnectedPeersResponse>;
  
  GetCurrentStorageLimitsByFid: grpc.handleUnaryCall<_FidRequest__Output, _StorageLimitsResponse>;
  
  GetEvent: grpc.handleUnaryCall<_EventRequest__Output, _HubEvent>;
  
  GetEvents: grpc.handleUnaryCall<_EventsRequest__Output, _EventsResponse>;
  
  GetFidAddressType: grpc.handleUnaryCall<_FidAddressTypeRequest__Output, _FidAddressTypeResponse>;
  
  GetFids: grpc.handleUnaryCall<_FidsRequest__Output, _FidsResponse>;
  
  GetIdRegistryOnChainEvent: grpc.handleUnaryCall<_FidRequest__Output, _OnChainEvent>;
  
  GetIdRegistryOnChainEventByAddress: grpc.handleUnaryCall<_IdRegistryEventByAddressRequest__Output, _OnChainEvent>;
  
  GetInfo: grpc.handleUnaryCall<_GetInfoRequest__Output, _GetInfoResponse>;
  
  GetLink: grpc.handleUnaryCall<_LinkRequest__Output, _Message>;
  
  GetLinkCompactStateMessageByFid: grpc.handleUnaryCall<_FidRequest__Output, _MessagesResponse>;
  
  GetLinksByFid: grpc.handleUnaryCall<_LinksByFidRequest__Output, _MessagesResponse>;
  
  GetLinksByTarget: grpc.handleUnaryCall<_LinksByTargetRequest__Output, _MessagesResponse>;
  
  GetOnChainEvents: grpc.handleUnaryCall<_OnChainEventRequest__Output, _OnChainEventResponse>;
  
  GetOnChainSigner: grpc.handleUnaryCall<_SignerRequest__Output, _OnChainEvent>;
  
  GetOnChainSignersByFid: grpc.handleUnaryCall<_FidRequest__Output, _OnChainEventResponse>;
  
  GetReaction: grpc.handleUnaryCall<_ReactionRequest__Output, _Message>;
  
  GetReactionsByCast: grpc.handleUnaryCall<_ReactionsByTargetRequest__Output, _MessagesResponse>;
  
  GetReactionsByFid: grpc.handleUnaryCall<_ReactionsByFidRequest__Output, _MessagesResponse>;
  
  GetReactionsByTarget: grpc.handleUnaryCall<_ReactionsByTargetRequest__Output, _MessagesResponse>;
  
  GetShardChunks: grpc.handleUnaryCall<_ShardChunksRequest__Output, _ShardChunksResponse>;
  
  GetSigner: grpc.handleUnaryCall<_SignerRequest__Output, _SignerResponse>;
  
  GetSignersByFid: grpc.handleUnaryCall<_FidRequest__Output, _SignersByFidResponse>;
  
  GetTrieMetadataByPrefix: grpc.handleUnaryCall<_TrieNodeMetadataRequest__Output, _TrieNodeMetadataResponse>;
  
  GetUserData: grpc.handleUnaryCall<_UserDataRequest__Output, _Message>;
  
  GetUserDataByFid: grpc.handleUnaryCall<_FidRequest__Output, _MessagesResponse>;
  
  GetUserNameProofsByFid: grpc.handleUnaryCall<_FidRequest__Output, _UsernameProofsResponse>;
  
  GetUsernameProof: grpc.handleUnaryCall<_UsernameProofRequest__Output, _UserNameProof>;
  
  GetVerification: grpc.handleUnaryCall<_VerificationRequest__Output, _Message>;
  
  GetVerificationsByFid: grpc.handleUnaryCall<_FidRequest__Output, _MessagesResponse>;
  
  SubmitBulkMessages: grpc.handleUnaryCall<_SubmitBulkMessagesRequest__Output, _SubmitBulkMessagesResponse>;
  
  SubmitMessage: grpc.handleUnaryCall<_Message__Output, _Message>;
  
  Subscribe: grpc.handleServerStreamingCall<_SubscribeRequest__Output, _HubEvent>;
  
  ValidateMessage: grpc.handleUnaryCall<_Message__Output, _ValidationResponse>;
  
}

export interface HubServiceDefinition extends grpc.ServiceDefinition {
  GetAllCastMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetAllLendStorageMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetAllLinkMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetAllReactionMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetAllUserDataMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetAllVerificationMessagesByFid: MethodDefinition<_FidTimestampRequest, _MessagesResponse, _FidTimestampRequest__Output, _MessagesResponse__Output>
  GetBlocks: MethodDefinition<_BlocksRequest, _Block, _BlocksRequest__Output, _Block__Output>
  GetCast: MethodDefinition<_CastId, _Message, _CastId__Output, _Message__Output>
  GetCastsByFid: MethodDefinition<_FidRequest, _MessagesResponse, _FidRequest__Output, _MessagesResponse__Output>
  GetCastsByMention: MethodDefinition<_FidRequest, _MessagesResponse, _FidRequest__Output, _MessagesResponse__Output>
  GetCastsByParent: MethodDefinition<_CastsByParentRequest, _MessagesResponse, _CastsByParentRequest__Output, _MessagesResponse__Output>
  GetConnectedPeers: MethodDefinition<_GetConnectedPeersRequest, _GetConnectedPeersResponse, _GetConnectedPeersRequest__Output, _GetConnectedPeersResponse__Output>
  GetCurrentStorageLimitsByFid: MethodDefinition<_FidRequest, _StorageLimitsResponse, _FidRequest__Output, _StorageLimitsResponse__Output>
  GetEvent: MethodDefinition<_EventRequest, _HubEvent, _EventRequest__Output, _HubEvent__Output>
  GetEvents: MethodDefinition<_EventsRequest, _EventsResponse, _EventsRequest__Output, _EventsResponse__Output>
  GetFidAddressType: MethodDefinition<_FidAddressTypeRequest, _FidAddressTypeResponse, _FidAddressTypeRequest__Output, _FidAddressTypeResponse__Output>
  GetFids: MethodDefinition<_FidsRequest, _FidsResponse, _FidsRequest__Output, _FidsResponse__Output>
  GetIdRegistryOnChainEvent: MethodDefinition<_FidRequest, _OnChainEvent, _FidRequest__Output, _OnChainEvent__Output>
  GetIdRegistryOnChainEventByAddress: MethodDefinition<_IdRegistryEventByAddressRequest, _OnChainEvent, _IdRegistryEventByAddressRequest__Output, _OnChainEvent__Output>
  GetInfo: MethodDefinition<_GetInfoRequest, _GetInfoResponse, _GetInfoRequest__Output, _GetInfoResponse__Output>
  GetLink: MethodDefinition<_LinkRequest, _Message, _LinkRequest__Output, _Message__Output>
  GetLinkCompactStateMessageByFid: MethodDefinition<_FidRequest, _MessagesResponse, _FidRequest__Output, _MessagesResponse__Output>
  GetLinksByFid: MethodDefinition<_LinksByFidRequest, _MessagesResponse, _LinksByFidRequest__Output, _MessagesResponse__Output>
  GetLinksByTarget: MethodDefinition<_LinksByTargetRequest, _MessagesResponse, _LinksByTargetRequest__Output, _MessagesResponse__Output>
  GetOnChainEvents: MethodDefinition<_OnChainEventRequest, _OnChainEventResponse, _OnChainEventRequest__Output, _OnChainEventResponse__Output>
  GetOnChainSigner: MethodDefinition<_SignerRequest, _OnChainEvent, _SignerRequest__Output, _OnChainEvent__Output>
  GetOnChainSignersByFid: MethodDefinition<_FidRequest, _OnChainEventResponse, _FidRequest__Output, _OnChainEventResponse__Output>
  GetReaction: MethodDefinition<_ReactionRequest, _Message, _ReactionRequest__Output, _Message__Output>
  GetReactionsByCast: MethodDefinition<_ReactionsByTargetRequest, _MessagesResponse, _ReactionsByTargetRequest__Output, _MessagesResponse__Output>
  GetReactionsByFid: MethodDefinition<_ReactionsByFidRequest, _MessagesResponse, _ReactionsByFidRequest__Output, _MessagesResponse__Output>
  GetReactionsByTarget: MethodDefinition<_ReactionsByTargetRequest, _MessagesResponse, _ReactionsByTargetRequest__Output, _MessagesResponse__Output>
  GetShardChunks: MethodDefinition<_ShardChunksRequest, _ShardChunksResponse, _ShardChunksRequest__Output, _ShardChunksResponse__Output>
  GetSigner: MethodDefinition<_SignerRequest, _SignerResponse, _SignerRequest__Output, _SignerResponse__Output>
  GetSignersByFid: MethodDefinition<_FidRequest, _SignersByFidResponse, _FidRequest__Output, _SignersByFidResponse__Output>
  GetTrieMetadataByPrefix: MethodDefinition<_TrieNodeMetadataRequest, _TrieNodeMetadataResponse, _TrieNodeMetadataRequest__Output, _TrieNodeMetadataResponse__Output>
  GetUserData: MethodDefinition<_UserDataRequest, _Message, _UserDataRequest__Output, _Message__Output>
  GetUserDataByFid: MethodDefinition<_FidRequest, _MessagesResponse, _FidRequest__Output, _MessagesResponse__Output>
  GetUserNameProofsByFid: MethodDefinition<_FidRequest, _UsernameProofsResponse, _FidRequest__Output, _UsernameProofsResponse__Output>
  GetUsernameProof: MethodDefinition<_UsernameProofRequest, _UserNameProof, _UsernameProofRequest__Output, _UserNameProof__Output>
  GetVerification: MethodDefinition<_VerificationRequest, _Message, _VerificationRequest__Output, _Message__Output>
  GetVerificationsByFid: MethodDefinition<_FidRequest, _MessagesResponse, _FidRequest__Output, _MessagesResponse__Output>
  SubmitBulkMessages: MethodDefinition<_SubmitBulkMessagesRequest, _SubmitBulkMessagesResponse, _SubmitBulkMessagesRequest__Output, _SubmitBulkMessagesResponse__Output>
  SubmitMessage: MethodDefinition<_Message, _Message, _Message__Output, _Message__Output>
  Subscribe: MethodDefinition<_SubscribeRequest, _HubEvent, _SubscribeRequest__Output, _HubEvent__Output>
  ValidateMessage: MethodDefinition<_Message, _ValidationResponse, _Message__Output, _ValidationResponse__Output>
}
