import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { useBase } from '@/providers/BaseProvider';
import { useToast } from '@/hooks/use-toast';
import { subscriptionHubAbi, subscriptionBadgeAbi, erc20Abi } from './abi.js';
import { SubscriptionPlan, TokenMetadata, UserSubscription } from './types.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react';

const HUB_ADDRESS = import.meta.env.VITE_SUBSCRIPTION_HUB_ADDRESS || '';
const BADGE_ADDRESS = import.meta.env.VITE_SUBSCRIPTION_BADGE_ADDRESS || '';
const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';
const BASE_CHAIN_ID = Number(import.meta.env.VITE_BASE_CHAIN_ID || 8453);

function formatPrice(plan: SubscriptionPlan): string {
  if (!plan.token) {
    return `${ethers.formatUnits(plan.price, 18)} tokens`;
  }

  try {
    const amount = Number(ethers.formatUnits(plan.price, plan.token.decimals));
    const rounded = amount >= 1 ? amount.toLocaleString() : amount.toPrecision(4);
    return `${rounded} ${plan.token.symbol}`;
  } catch (error) {
    console.error('Failed to format price', error);
    return `${plan.price.toString()} ${plan.token.symbol ?? ''}`;
  }
}

function formatDate(seconds?: number) {
  if (!seconds) return '—';
  const date = new Date(seconds * 1000);
  return date.toLocaleString();
}

export default function SubscriptionApp() {
  const {
    provider,
    signer,
    address,
    isConnected,
    connect,
    chainId,
  } = useBase();
  const { toast } = useToast();

  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubs, setUserSubs] = useState<Record<number, UserSubscription>>({});
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    token: '',
    price: '',
    intervalDays: '30',
    badgeURI: '',
  });
  const [creating, setCreating] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
  const [tokenMeta, setTokenMeta] = useState<TokenMetadata | null>(null);

  const tokenMetaCache = useRef<Record<string, TokenMetadata>>({});

  const fallbackProvider = useMemo(() => {
    try {
      return new ethers.JsonRpcProvider(BASE_RPC_URL, BASE_CHAIN_ID);
    } catch (error) {
      console.error('Failed to create fallback provider', error);
      return null;
    }
  }, []);

  const readProvider = provider ?? fallbackProvider;

  const hubRead = useMemo(() => {
    if (!HUB_ADDRESS || !readProvider) return null;
    return new ethers.Contract(HUB_ADDRESS, subscriptionHubAbi, readProvider);
  }, [readProvider]);

  const hubWrite = useMemo(() => {
    if (!HUB_ADDRESS || !signer) return null;
    return new ethers.Contract(HUB_ADDRESS, subscriptionHubAbi, signer);
  }, [signer]);

  const badgeRead = useMemo(() => {
    if (!BADGE_ADDRESS || !readProvider) return null;
    return new ethers.Contract(BADGE_ADDRESS, subscriptionBadgeAbi, readProvider);
  }, [readProvider]);

  const fetchTokenMetadata = useCallback(
    async (tokenAddress: string): Promise<TokenMetadata | null> => {
      if (!readProvider || !tokenAddress || tokenAddress.length !== 42) {
        return null;
      }

      const checksum = ethers.getAddress(tokenAddress);

      if (tokenMetaCache.current[checksum]) {
        return tokenMetaCache.current[checksum];
      }

      try {
        const token = new ethers.Contract(checksum, erc20Abi, readProvider);
        const [symbol, decimals] = await Promise.all([
          token.symbol(),
          token.decimals(),
        ]);
        const meta: TokenMetadata = {
          symbol,
          decimals: Number(decimals),
        };
        tokenMetaCache.current[checksum] = meta;
        return meta;
      } catch (error) {
        console.warn('Failed to fetch token metadata', error);
        return null;
      }
    },
    [readProvider]
  );

  const loadPlans = useCallback(async () => {
    if (!hubRead) return;
    setLoadingPlans(true);

    try {
      const nextPlan: bigint = await hubRead.nextPlanId();
      const planCount = Number(nextPlan);
      const results: SubscriptionPlan[] = [];

      for (let i = 1; i < planCount; i += 1) {
        const rawPlan = await hubRead.plans(i);
        if (!rawPlan || rawPlan.creator === ethers.ZeroAddress) {
          continue;
        }

        const meta = await fetchTokenMetadata(rawPlan.paymentToken);

        results.push({
          id: Number(rawPlan.id),
          creator: rawPlan.creator,
          paymentToken: rawPlan.paymentToken,
          price: BigInt(rawPlan.price),
          interval: Number(rawPlan.interval),
          badgeId: Number(rawPlan.badgeId),
          name: rawPlan.name,
          description: rawPlan.description,
          badgeURI: rawPlan.badgeURI,
          active: rawPlan.active,
          createdAt: Number(rawPlan.createdAt),
          token: meta ?? undefined,
        });
      }

      setPlans(results);

      if (address && results.length > 0) {
        const subs: Record<number, UserSubscription> = {};

        for (const plan of results) {
          const info = await hubRead.subscriptionInfo(plan.id, address);
          const expiresAt = Number(info.expiresAt);
          const badgeBalance = badgeRead
            ? await badgeRead.balanceOf(address, plan.badgeId)
            : 0n;

          subs[plan.id] = {
            planId: plan.id,
            startedAt: Number(info.startedAt),
            expiresAt,
            active: Boolean(info.active && expiresAt > Math.floor(Date.now() / 1000)),
            hasBadge: badgeBalance > 0n,
          };
        }

        setUserSubs(subs);
      } else {
        setUserSubs({});
      }
    } catch (error) {
      console.error('Failed to load plans', error);
      toast({
        title: 'Error loading plans',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlans(false);
    }
  }, [hubRead, badgeRead, address, fetchTokenMetadata, toast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    const tokenAddress = formState.token.trim();
    if (!tokenAddress) {
      setTokenMeta(null);
      return;
    }

    let cancelled = false;
    fetchTokenMetadata(tokenAddress).then((meta) => {
      if (!cancelled) {
        setTokenMeta(meta);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [formState.token, fetchTokenMetadata]);

  const isPlanCreator = useCallback(
    (plan: SubscriptionPlan) =>
      Boolean(
        address && plan.creator && address.toLowerCase() === plan.creator.toLowerCase()
      ),
    [address]
  );

  const handleSubscribe = useCallback(
    async (plan: SubscriptionPlan) => {
      if (!isConnected) {
        await connect();
        return;
      }

      if (!hubWrite || !signer || !address) {
        toast({
          title: 'Wallet not ready',
          description: 'Connect your wallet to subscribe.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setProcessingPlanId(plan.id);
        const token = new ethers.Contract(plan.paymentToken, erc20Abi, signer);
        const allowance: bigint = await token.allowance(address, HUB_ADDRESS);

        if (allowance < plan.price) {
          const approveTx = await token.approve(HUB_ADDRESS, ethers.MaxUint256);
          await approveTx.wait();
          toast({
            title: 'Token approved',
            description: `Approved ${plan.token?.symbol ?? 'token'} for subscriptions.`,
          });
        }

        const tx = await hubWrite.subscribe(plan.id);
        await tx.wait();

        toast({
          title: 'Subscription active',
          description: `You are now subscribed to ${plan.name}.`,
        });

        await loadPlans();
      } catch (error) {
        console.error('Failed to subscribe', error);
        toast({
          title: 'Subscription failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      } finally {
        setProcessingPlanId(null);
      }
    },
    [address, connect, hubWrite, isConnected, loadPlans, signer, toast]
  );

  const handleCancel = useCallback(
    async (plan: SubscriptionPlan) => {
      if (!hubWrite || !isConnected) {
        toast({
          title: 'Connect wallet',
          description: 'Connect your wallet to manage subscriptions.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setProcessingPlanId(plan.id);
        const tx = await hubWrite.cancel(plan.id);
        await tx.wait();

        toast({
          title: 'Subscription cancelled',
          description: `Cancelled subscription to ${plan.name}.`,
        });

        await loadPlans();
      } catch (error) {
        console.error('Failed to cancel subscription', error);
        toast({
          title: 'Cancellation failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      } finally {
        setProcessingPlanId(null);
      }
    },
    [hubWrite, isConnected, loadPlans, toast]
  );

  const handleCreatePlan = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!hubWrite || !signer || !isConnected) {
        toast({
          title: 'Connect wallet',
          description: 'Connect your wallet to create plans.',
          variant: 'destructive',
        });
        return;
      }

      const tokenAddress = formState.token.trim();
      const priceInput = formState.price.trim();
      const intervalDays = Number(formState.intervalDays || '30');

      if (!tokenAddress || !priceInput || Number.isNaN(intervalDays)) {
        toast({
          title: 'Missing information',
          description: 'Fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      const meta = tokenMeta ?? (await fetchTokenMetadata(tokenAddress));
      if (!meta) {
        toast({
          title: 'Invalid token',
          description: 'Could not fetch token metadata for the payment token.',
          variant: 'destructive',
        });
        return;
      }

      try {
        setCreating(true);

        const price = ethers.parseUnits(priceInput, meta.decimals);
        const intervalSeconds = BigInt(Math.max(1, Math.floor(intervalDays)) * 86400);
        const badgeURI = formState.badgeURI.trim();

        const tx = await hubWrite.createPlan(
          formState.name || 'Creator Plan',
          formState.description,
          ethers.getAddress(tokenAddress),
          price,
          Number(intervalSeconds),
          badgeURI || `https://dreamnet.ink/api/subscriptions/${Date.now()}.json`
        );

        await tx.wait();

        toast({
          title: 'Plan created',
          description: `${formState.name || 'Plan'} is now live.`,
        });

        setFormState({
          name: '',
          description: '',
          token: '',
          price: '',
          intervalDays: '30',
          badgeURI: '',
        });
        setTokenMeta(null);
        await loadPlans();
      } catch (error) {
        console.error('Failed to create plan', error);
        toast({
          title: 'Plan creation failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      } finally {
        setCreating(false);
      }
    },
    [fetchTokenMetadata, formState, hubWrite, isConnected, loadPlans, signer, toast, tokenMeta]
  );

  if (!HUB_ADDRESS) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Configure Subscription Hub</CardTitle>
              <CardDescription>
                Set the environment variable <code className="font-mono">VITE_SUBSCRIPTION_HUB_ADDRESS</code>{' '}
                to the deployed hub contract address.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            Base L2 Mini App
          </Badge>
          <h1 className="text-4xl font-bold">DreamNet Subscription Hub</h1>
          <p className="text-muted-foreground max-w-2xl">
            Launch creator subscriptions with on-chain billing, NFT access badges, and automated renewals.
          </p>
        </div>

        {!isConnected ? (
          <Button onClick={connect} className="bg-electric-cyan text-black w-fit">
            Connect Wallet
          </Button>
        ) : (
          <Badge variant="outline" className="w-fit">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)} (chain {chainId})
          </Badge>
        )}

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList>
            <TabsTrigger value="explore">Explore Plans</TabsTrigger>
            <TabsTrigger value="create">Creator Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>
                  Subscribe to premium DreamNet communities and unlock gated access with NFT badges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPlans ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading plans from Base...
                  </div>
                ) : plans.length === 0 ? (
                  <p className="text-muted-foreground">No creator plans yet. Check back soon!</p>
                ) : (
                  <div className="space-y-6">
                    {plans.map((plan) => {
                      const subscription = userSubs[plan.id];
                      const isActive = subscription?.active;
                      const expiresAt = subscription?.expiresAt;
                      const isCreator = isPlanCreator(plan);

                      return (
                        <Card key={plan.id} className="border border-white/10">
                          <CardHeader className="space-y-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <CardTitle className="text-2xl font-semibold">
                                  {plan.name || `Creator Plan #${plan.id}`}
                                </CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                              </div>
                              <Badge variant={plan.active ? 'default' : 'secondary'}>
                                {plan.active ? 'Active' : 'Paused'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="text-lg font-semibold">{formatPrice(plan)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Billing Interval</p>
                                <p className="text-lg font-semibold">
                                  {Math.round(plan.interval / 86400)} days
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Creator</p>
                                <p className="font-mono text-sm opacity-80">
                                  {plan.creator.slice(0, 6)}...{plan.creator.slice(-4)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Badge</p>
                                <p className="font-mono text-sm opacity-80">ID {plan.badgeId}</p>
                              </div>
                            </div>

                            {subscription && (
                              <div className="rounded-md border border-electric-cyan/30 bg-electric-cyan/10 p-4 flex items-center gap-3">
                                {subscription.hasBadge ? (
                                  <ShieldCheck className="h-5 w-5 text-electric-cyan" />
                                ) : (
                                  <ShieldOff className="h-5 w-5 text-yellow-500" />
                                )}
                                <div>
                                  <p className="text-sm font-semibold">
                                    {subscription.active ? 'Subscription active' : 'Subscription inactive'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Expires: {formatDate(expiresAt)}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {plan.active && (
                                <Button
                                  onClick={() => handleSubscribe(plan)}
                                  disabled={processingPlanId === plan.id}
                                >
                                  {processingPlanId === plan.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : subscription?.active ? (
                                    'Renew'
                                  ) : (
                                    'Subscribe'
                                  )}
                                </Button>
                              )}

                              {subscription?.active && (
                                <Button
                                  variant="secondary"
                                  onClick={() => handleCancel(plan)}
                                  disabled={processingPlanId === plan.id}
                                >
                                  Cancel
                                </Button>
                              )}

                              {isCreator && (
                                <Badge variant="outline" className="uppercase tracking-wide">
                                  You are the creator
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a Subscription Plan</CardTitle>
                <CardDescription>
                  Define your pricing, billing interval, and badge metadata. Subscribers will pay in the token you select.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <Button onClick={connect}>Connect wallet to create a plan</Button>
                ) : (
                  <form className="space-y-6" onSubmit={handleCreatePlan}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                          id="name"
                          placeholder="DreamNet Elite"
                          value={formState.name}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, name: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interval">Billing Interval (days)</Label>
                        <Input
                          id="interval"
                          type="number"
                          min={1}
                          value={formState.intervalDays}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, intervalDays: event.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder="Describe the perks subscribers get."
                        value={formState.description}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, description: event.target.value }))
                        }
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="token">Payment Token Address</Label>
                        <Input
                          id="token"
                          placeholder="0x..."
                          value={formState.token}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, token: event.target.value }))
                          }
                          required
                        />
                        {tokenMeta ? (
                          <p className="text-xs text-muted-foreground">
                            Token detected: {tokenMeta.symbol} ({tokenMeta.decimals} decimals)
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Paste the ERC20 token address subscribers will pay with (e.g. USDC).
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price per Interval</Label>
                        <Input
                          id="price"
                          placeholder="25.00"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formState.price}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, price: event.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badge">Badge Metadata URI</Label>
                      <Input
                        id="badge"
                        placeholder="https://.../badge.json"
                        value={formState.badgeURI}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, badgeURI: event.target.value }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: custom metadata URI for the ERC1155 badge minted to subscribers.
                      </p>
                    </div>

                    <Button type="submit" disabled={creating} className="min-w-[180px]">
                      {creating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating plan...
                        </>
                      ) : (
                        'Create Subscription Plan'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {plans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Plans</CardTitle>
                  <CardDescription>Existing plans you have created.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans
                    .filter((plan) => isPlanCreator(plan))
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-lg border border-white/10 p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{plan.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(plan)} • {Math.round(plan.interval / 86400)} day cycle
                            </p>
                          </div>
                          <Badge variant={plan.active ? 'default' : 'secondary'}>
                            {plan.active ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created {formatDate(plan.createdAt)} • Badge ID {plan.badgeId}
                        </p>
                      </div>
                    ))}

                  {plans.filter((plan) => isPlanCreator(plan)).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      You have not created any plans yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
