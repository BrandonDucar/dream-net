/**
 * Simple Swap Mini App Template
 * A template for building token swap mini apps on Base
 */

import React, { useState } from 'react';
import { useBase } from '@/providers/BaseProvider';
import { useContract } from '../hooks/useContract';
import { formatAddress } from '../utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownUp, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Example: Simple token transfer (not a real swap, but shows the pattern)
const SHEEP_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_SHEEP_TOKEN_ADDRESS || '0x...';
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export default function SimpleSwapApp() {
  const { address, isConnected, connect } = useBase();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { write } = useContract(SHEEP_TOKEN_ADDRESS, ERC20_ABI);

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // Convert amount to wei (assuming 18 decimals)
      const amountWei = BigInt(parseFloat(amount) * 10 ** 18);
      
      const receipt = await write('transfer', recipient, amountWei);
      
      toast({
        title: 'Success',
        description: `Transaction confirmed: ${receipt.transactionHash.slice(0, 10)}...`,
      });
      
      setRecipient('');
      setAmount('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Transaction failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownUp className="w-5 h-5" />
              Simple Swap Mini App
            </CardTitle>
            <CardDescription>
              Connect your Base wallet to swap tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connect} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownUp className="w-5 h-5" />
              Simple Swap Mini App
            </CardTitle>
            <CardDescription>
              Transfer tokens on Base L2
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button
              onClick={handleTransfer}
              disabled={loading || !recipient || !amount}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Transfer Tokens'}
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Connected: {formatAddress(address || '')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

