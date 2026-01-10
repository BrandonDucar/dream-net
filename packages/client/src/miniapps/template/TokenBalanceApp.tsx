/**
 * Token Balance Mini App Template
 * A starter template for building Base mini apps
 */

import React from 'react';
import { useBase } from '@/providers/BaseProvider';
import { useTokenBalance } from '../hooks/useTokenBalance.js';
import { formatAddress, formatTokenAmount } from '@dreamnet/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';

// SHEEP Token contract address
const SHEEP_TOKEN_ADDRESS = '0xDA7ec9832268606052003D7257B239C6bEDEfDf8';

export default function TokenBalanceApp() {
    const { address, isConnected, connect, chainId } = useBase();
    const { balance, loading, error } = useTokenBalance(
        useBase().provider,
        SHEEP_TOKEN_ADDRESS,
        address
    );

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            Token Balance Mini App
                        </CardTitle>
                        <CardDescription>
                            Connect your Base wallet to view your token balance
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
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            Token Balance Mini App
                        </CardTitle>
                        <CardDescription>
                            View your token balances on Base L2
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Connected Wallet</p>
                                <p className="font-mono text-sm">{formatAddress(address || '')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Network</p>
                                <p className="text-sm font-semibold">
                                    {chainId === 8453 ? 'Base Mainnet' : chainId === 84532 ? 'Base Sepolia' : 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Token Balances</h3>

                            {loading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            ) : balance ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{balance.symbol}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatAddress(balance.address)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">
                                                    {formatTokenAmount(balance.formatted, balance.decimals)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{balance.symbol}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        No token balance found. Make sure the token contract address is correct.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
