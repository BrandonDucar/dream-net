/**
 * Billable Actions Dashboard
 * Monitor billable actions, charges, and financial operations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, DollarSign, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface BillableStats {
  total: number;
  pending: number;
  confirmed: number;
  charged: number;
  failed: number;
  totalAmount: number;
}

interface BillableAction {
  id: string;
  traceId: string;
  idempotencyKey: string;
  action: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'charged' | 'failed';
  createdAt: number;
  confirmedAt?: number;
  chargedAt?: number;
  response?: any;
}

export default function BillableDashboard() {
  const [stats, setStats] = useState<BillableStats | null>(null);
  const [actions, setActions] = useState<BillableAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, actionsRes] = await Promise.all([
        fetch('/api/billable/stats'),
        fetch('/api/billable/stats'), // We'll need to add an actions endpoint
      ]);

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Failed to fetch billable stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAction = async (actionId: string) => {
    try {
      const response = await fetch(`/api/billable/${actionId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedAction(actionId);
      }
    } catch (error) {
      console.error('Failed to fetch action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load billable stats</div>;
  }

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    charged: 'bg-green-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billable Actions Dashboard</h1>
          <p className="text-muted-foreground">Monitor charges, payments, and financial operations</p>
        </div>
        <Button onClick={fetchStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Charged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.charged}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Total Amount */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Total Amount Charged</CardTitle>
          <CardDescription>Sum of all successfully charged actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            ${stats.totalAmount.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Count</span>
                <span className="font-bold">{stats.pending}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Confirmed Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Count</span>
                <span className="font-bold">{stats.confirmed}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(stats.confirmed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Charged Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Count</span>
                <span className="font-bold">{stats.charged}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(stats.charged / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Failed Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Count</span>
                <span className="font-bold">{stats.failed}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Phase Commit Pattern</CardTitle>
          <CardDescription>How billable actions work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Badge variant="outline">Phase 1</Badge>
            <div>
              <strong>Reserve Charge:</strong> Before operation executes, charge is reserved
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline">Phase 2</Badge>
            <div>
              <strong>Confirm & Charge:</strong> After response is confirmed stored, charge is executed
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded">
            <p className="text-xs">
              <strong>Idempotency Protection:</strong> All billable actions require{' '}
              <code className="bg-background px-1 rounded">X-Idempotency-Key</code> header to prevent
              double-charging.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

