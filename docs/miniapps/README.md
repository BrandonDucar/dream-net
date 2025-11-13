# Base Mini Apps Framework

A framework for building mini applications on Base L2 within the DreamNet ecosystem.

## Overview

Mini apps are self-contained applications that run on Base L2 and integrate with the DreamNet platform. They can interact with smart contracts, use the Base wallet, and leverage the $SHEEP token economy.

## Quick Start

### 1. Create a New Mini App

Create a new component in `client/src/miniapps/`:

```tsx
// client/src/miniapps/my-app/MyMiniApp.tsx
import { useBase } from '@/providers/BaseProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyMiniApp() {
  const { address, isConnected, connect } = useBase();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Mini App</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={connect}>Connect Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6">
      <h1>My Mini App</h1>
      <p>Connected: {address}</p>
    </div>
  );
}
```

### 2. Register Your Mini App

Add your mini app to `client/src/miniapps/registry.ts`:

```tsx
import MyMiniApp from './my-app/MyMiniApp';

export const MINI_APPS: MiniAppConfig[] = [
  // ... existing apps
  {
    id: 'my-mini-app',
    name: 'My Mini App',
    description: 'A description of what your app does',
    route: '/miniapps/my-mini-app',
    category: 'utility', // 'defi' | 'nft' | 'social' | 'gaming' | 'utility' | 'other'
    requiresWallet: true,
    version: '1.0.0',
  },
];

export const MINI_APP_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // ... existing components
  'my-mini-app': MyMiniApp,
};
```

### 3. Access Your Mini App

Your mini app will be available at `/miniapps/my-mini-app` and listed in the mini apps directory at `/miniapps`.

## Available Hooks

### `useBase()`

Access Base wallet connection:

```tsx
import { useBase } from '@/providers/BaseProvider';

const { address, isConnected, provider, signer, connect, disconnect, switchToBase } = useBase();
```

### `useTokenBalance()`

Fetch ERC20 token balance:

```tsx
import { useTokenBalance } from '@/miniapps/hooks/useTokenBalance';

const { balance, loading, error } = useTokenBalance(
  provider,
  tokenAddress,
  userAddress
);
```

### `useContract()`

Interact with smart contracts:

```tsx
import { useContract } from '@/miniapps/hooks/useContract';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address, uint256) returns (bool)',
];

const { contract, read, write, loading, error } = useContract(
  tokenAddress,
  ERC20_ABI
);

// Read
const balance = await read('balanceOf', userAddress);

// Write
const receipt = await write('transfer', recipient, amount);
```

## Utilities

### Token Operations

```tsx
import { getTokenBalance, formatTokenAmount, formatAddress } from '@/miniapps/utils';

// Get token balance
const balance = await getTokenBalance(provider, tokenAddress, userAddress);

// Format amounts
const formatted = formatTokenAmount('1000000000000000000', 18); // "1.0000"

// Format addresses
const short = formatAddress('0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e'); // "0x742d...3a8e"
```

### Network Info

```tsx
import { getBaseNetworkInfo, getTransactionLink, getAddressLink } from '@/miniapps/utils';

const network = getBaseNetworkInfo(chainId);
const txLink = getTransactionLink(txHash, chainId);
const addrLink = getAddressLink(address, chainId);
```

## Example Mini Apps

### Token Balance Viewer

See `client/src/miniapps/template/TokenBalanceApp.tsx` for a complete example of viewing token balances.

### Simple Token Transfer

See `client/src/miniapps/template/SimpleSwapApp.tsx` for an example of token transfers.

## Best Practices

1. **Always check wallet connection**: Use `isConnected` before performing transactions
2. **Handle errors gracefully**: Wrap contract calls in try-catch blocks
3. **Show loading states**: Use the `loading` state from hooks
4. **Validate inputs**: Check addresses and amounts before submitting transactions
5. **Provide feedback**: Use toast notifications for success/error states
6. **Test on Base Sepolia**: Always test on testnet before mainnet deployment

## Smart Contract Integration

### Deploying Contracts

Contracts are deployed using Hardhat. See `hardhat.config.ts` for Base network configuration.

### Contract Addresses

Store contract addresses in environment variables:

```env
NEXT_PUBLIC_SHEEP_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_DREAMER_PASS_ADDRESS=0x...
```

### Reading Contract State

```tsx
const { read } = useContract(contractAddress, abi);
const result = await read('functionName', ...args);
```

### Writing to Contracts

```tsx
const { write } = useContract(contractAddress, abi);
const receipt = await write('functionName', ...args);
```

## Styling

Mini apps use the same design system as the main DreamNet app:

- Tailwind CSS for styling
- shadcn/ui components (`@/components/ui/*`)
- Dark mode by default
- Base L2 branding colors (`electric-cyan`, `soft-gold`)

## Deployment

Mini apps are automatically included when deploying the main DreamNet application. No separate deployment is needed.

## Resources

- [Base Documentation](https://docs.base.org)
- [ethers.js Documentation](https://docs.ethers.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [DreamNet Architecture](../architecture.md)

