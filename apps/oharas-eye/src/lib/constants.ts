import { type AccountAssociation } from '@farcaster/miniapp-core/src/manifest';

export const APP_NAME: string = 'oharas-eye';
export const APP_DESCRIPTION: string = 'The Utmost Authority in Social Scanning';
export const APP_URL: string = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
export const APP_OG_IMAGE_URL: string = `${APP_URL}/og-image.png`;
export const APP_ICON_URL: string = `${APP_URL}/icon.png`;
export const APP_SPLASH_URL: string = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR: string = '#f7f7f7';

export const RETURN_URL: string | undefined = undefined;
export const ANALYTICS_ENABLED: boolean = true;
export const USE_WALLET: boolean = true;

export const APP_PRIMARY_CATEGORY: string = 'social';
export const APP_BUTTON_TEXT: string = 'ACTIVATE EYE';
export const APP_TAGS: string[] = ['farcaster', 'snail', 'oath', 'tech-homeostasis'];

export const APP_REQUIRED_CHAINS: string[] = ['eip155:8453']; // Base Mainnet

// Neynar Config
export const NEYNAR_API_KEY: string = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
export const APP_WEBHOOK_URL: string = `${APP_URL}/api/webhook`;
export const APP_ACCOUNT_ASSOCIATION: AccountAssociation | undefined = undefined;

// Farcaster SignedKeyRequestValidator Domain
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: 'Farcaster SignedKeyRequestValidator',
  version: '1',
  chainId: 10,
  verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
};

export const SIGNED_KEY_REQUEST_TYPE = [
  { name: 'requestFid', type: 'uint256' },
  { name: 'key', type: 'bytes' },
  { name: 'deadline', type: 'uint256' },
];
