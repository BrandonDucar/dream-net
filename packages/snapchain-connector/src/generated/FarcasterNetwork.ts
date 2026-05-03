// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const FarcasterNetwork = {
  FARCASTER_NETWORK_NONE: 'FARCASTER_NETWORK_NONE',
  FARCASTER_NETWORK_MAINNET: 'FARCASTER_NETWORK_MAINNET',
  FARCASTER_NETWORK_TESTNET: 'FARCASTER_NETWORK_TESTNET',
  FARCASTER_NETWORK_DEVNET: 'FARCASTER_NETWORK_DEVNET',
} as const;

export type FarcasterNetwork =
  | 'FARCASTER_NETWORK_NONE'
  | 0
  | 'FARCASTER_NETWORK_MAINNET'
  | 1
  | 'FARCASTER_NETWORK_TESTNET'
  | 2
  | 'FARCASTER_NETWORK_DEVNET'
  | 3

export type FarcasterNetwork__Output = typeof FarcasterNetwork[keyof typeof FarcasterNetwork]
