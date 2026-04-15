# Mini App Examples

Complete examples of Base mini apps for the DreamNet ecosystem.

## Example 1: Token Balance Viewer

A simple app that displays token balances.

```tsx
import { useBase } from '@/providers/BaseProvider';
import { useTokenBalance } from '@/miniapps/hooks/useTokenBalance';
import { formatAddress, formatTokenAmount } from '@/miniapps/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TOKEN_ADDRESS = '0x...';

export default function TokenBalanceViewer() {
  const { address, isConnected, connect } = useBase();
  const { balance, loading } = useTokenBalance(
    useBase().provider,
    TOKEN_ADDRESS,
    address
  );

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={connect}>Connect Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : balance ? (
          <div>
            <p>{balance.symbol}</p>
            <p className="text-2xl font-bold">
              {formatTokenAmount(balance.formatted, balance.decimals)}
            </p>
          </div>
        ) : (
          <p>No balance found</p>
        )}
      </CardContent>
    </Card>
  );
}
```

## Example 2: Token Transfer

Transfer tokens between addresses.

```tsx
import { useState } from 'react';
import { useBase } from '@/providers/BaseProvider';
import { useContract } from '@/miniapps/hooks/useContract';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TOKEN_ADDRESS = '0x...';
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
];

export default function TokenTransfer() {
  const { address, isConnected } = useBase();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { write, loading } = useContract(TOKEN_ADDRESS, ERC20_ABI);

  const handleTransfer = async () => {
    try {
      const amountWei = BigInt(parseFloat(amount) * 10 ** 18);
      const receipt = await write('transfer', recipient, amountWei);
      
      toast({
        title: 'Success',
        description: `Transferred ${amount} tokens`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={handleTransfer} disabled={loading}>
        {loading ? 'Processing...' : 'Transfer'}
      </Button>
    </div>
  );
}
```

## Example 3: NFT Viewer

View ERC721/ERC1155 NFTs owned by a wallet.

```tsx
import { useState, useEffect } from 'react';
import { useBase } from '@/providers/BaseProvider';
import { useContract } from '@/miniapps/hooks/useContract';
import { Card, CardContent } from '@/components/ui/card';

const NFT_CONTRACT = '0x...';
const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

export default function NFTViewer() {
  const { address, isConnected } = useBase();
  const { read } = useContract(NFT_CONTRACT, ERC721_ABI);
  const [tokens, setTokens] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchTokens = async () => {
      setLoading(true);
      try {
        const balance = await read('balanceOf', address);
        const tokenIds = [];
        
        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await read('tokenOfOwnerByIndex', address, i);
          tokenIds.push(Number(tokenId));
        }
        
        setTokens(tokenIds);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [isConnected, address, read]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {tokens.map((tokenId) => (
        <Card key={tokenId}>
          <CardContent>
            <p>Token #{tokenId}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

## Example 4: DeFi Staking

Stake tokens and earn rewards.

```tsx
import { useState, useEffect } from 'react';
import { useBase } from '@/providers/BaseProvider';
import { useContract } from '@/miniapps/hooks/useContract';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STAKING_CONTRACT = '0x...';
const STAKING_ABI = [
  'function stake(uint256 amount) returns (bool)',
  'function unstake(uint256 amount) returns (bool)',
  'function getStakedBalance(address user) view returns (uint256)',
  'function getRewards(address user) view returns (uint256)',
];

export default function StakingApp() {
  const { address, isConnected } = useBase();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewards, setRewards] = useState('0');
  const { read, write, loading } = useContract(STAKING_CONTRACT, STAKING_ABI);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchData = async () => {
      const staked = await read('getStakedBalance', address);
      const reward = await read('getRewards', address);
      setStakedBalance(staked.toString());
      setRewards(reward.toString());
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [isConnected, address, read]);

  const handleStake = async () => {
    try {
      const amountWei = BigInt(parseFloat(stakeAmount) * 10 ** 18);
      await write('stake', amountWei);
      toast({ title: 'Success', description: 'Tokens staked!' });
      setStakeAmount('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p>Staked: {stakedBalance}</p>
        <p>Rewards: {rewards}</p>
      </div>
      <Input
        type="number"
        placeholder="Amount to stake"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
      />
      <Button onClick={handleStake} disabled={loading}>
        Stake
      </Button>
    </div>
  );
}
```

## Example 5: Multi-Token Portfolio

View balances of multiple tokens.

```tsx
import { useBase } from '@/providers/BaseProvider';
import { useTokenBalance } from '@/miniapps/hooks/useTokenBalance';
import { Card, CardContent } from '@/components/ui/card';

const TOKENS = [
  { address: '0x...', symbol: 'SHEEP' },
  { address: '0x...', symbol: 'USDC' },
  { address: '0x...', symbol: 'WETH' },
];

export default function Portfolio() {
  const { address, isConnected, provider } = useBase();

  return (
    <div className="space-y-4">
      {TOKENS.map((token) => {
        const { balance, loading } = useTokenBalance(
          provider,
          token.address,
          address
        );

        return (
          <Card key={token.address}>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : balance ? (
                <div>
                  <p className="font-bold">{balance.symbol}</p>
                  <p>{balance.formatted}</p>
                </div>
              ) : (
                <p>0 {token.symbol}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

## Tips

1. **Error Handling**: Always wrap contract calls in try-catch blocks
2. **Loading States**: Show loading indicators during async operations
3. **Validation**: Validate user inputs before submitting transactions
4. **Feedback**: Use toast notifications for user feedback
5. **Refresh**: Consider auto-refreshing data periodically for live updates

