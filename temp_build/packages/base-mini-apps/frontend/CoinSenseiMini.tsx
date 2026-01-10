/**
 * CoinSensei 2.0 Mini App
 * Crypto portfolio analytics interface
 * 
 * SECURITY: READ_ONLY = true
 * - Only accepts public wallet addresses (read-only portfolio)
 * - NEVER accepts or stores private keys, seeds, mnemonics, or 2FA codes
 * - Returns analytics only (P&L, allocation, suggestions)
 * - NEVER offers send, trade, swap, or bridge actions
 * - Educational analytics only (no financial/tax/legal advice)
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';

interface ManualEntry {
  token: string;
  amount: number;
  buy_price: number;
  current_price?: number;
  buy_date: string;
}

export function CoinSenseiMini() {
  const [entries, setEntries] = useState<ManualEntry[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState<ManualEntry>({
    token: '',
    amount: 0,
    buy_price: 0,
    buy_date: new Date().toISOString().split('T')[0],
  });

  const addEntry = () => {
    if (newEntry.token && newEntry.amount > 0 && newEntry.buy_price > 0) {
      setEntries([...entries, { ...newEntry }]);
      setNewEntry({
        token: '',
        amount: 0,
        buy_price: 0,
        buy_date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const analyzePortfolio = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coinsensei/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manual_entries: entries,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🪙 CoinSensei 2.0
            </CardTitle>
            <CardDescription>
              Unified crypto portfolio analytics - Read-only educational tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="input">Input Data</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="insights">Smart Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Token Symbol</Label>
                    <Input
                      value={newEntry.token}
                      onChange={(e) => setNewEntry({ ...newEntry, token: e.target.value.toUpperCase() })}
                      placeholder="BTC"
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={newEntry.amount || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.5"
                    />
                  </div>
                  <div>
                    <Label>Buy Price (USD)</Label>
                    <Input
                      type="number"
                      value={newEntry.buy_price || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, buy_price: parseFloat(e.target.value) || 0 })}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label>Buy Date</Label>
                    <Input
                      type="date"
                      value={newEntry.buy_date}
                      onChange={(e) => setNewEntry({ ...newEntry, buy_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addEntry} className="w-full">
                  Add Entry
                </Button>

                {entries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Your Entries ({entries.length})</h3>
                    <div className="space-y-2">
                      {entries.map((entry, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                          <span>{entry.token}</span>
                          <span>{entry.amount}</span>
                          <span>@ ${entry.buy_price}</span>
                          <span className="text-sm text-gray-400">{entry.buy_date}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEntries(entries.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={analyzePortfolio} className="w-full mt-4" disabled={loading}>
                      {loading ? 'Analyzing...' : 'Analyze Portfolio'}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis">
                {analysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-gray-700">
                        <CardContent className="pt-6">
                          <div className="text-sm text-gray-400">Total Value</div>
                          <div className="text-2xl font-bold">
                            ${analysis.summary?.total_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700">
                        <CardContent className="pt-6">
                          <div className="text-sm text-gray-400">Total P&L</div>
                          <div className={`text-2xl font-bold ${analysis.summary?.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${analysis.summary?.total_pnl?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700">
                        <CardContent className="pt-6">
                          <div className="text-sm text-gray-400">ROI</div>
                          <div className={`text-2xl font-bold ${analysis.summary?.roi_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {analysis.summary?.roi_pct >= 0 ? '+' : ''}{analysis.summary?.roi_pct?.toFixed(2) || '0.00'}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700">
                        <CardContent className="pt-6">
                          <div className="text-sm text-gray-400">Tokens</div>
                          <div className="text-2xl font-bold">{analysis.summary?.token_count || 0}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-700">
                      <CardHeader>
                        <CardTitle>Portfolio Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{analysis.summary?.summary_text}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-700">
                      <CardHeader>
                        <CardTitle>Top Holdings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.summary?.top_holdings?.slice(0, 5).map((holding: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                              <span className="font-semibold">{holding.symbol}</span>
                              <span>${holding.total_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              <span className="text-sm text-gray-400">{holding.allocation_pct?.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Add entries and click "Analyze Portfolio" to see results
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insights">
                {analysis ? (
                  <div className="space-y-4">
                    {analysis.dca_suggestions && analysis.dca_suggestions.length > 0 && (
                      <Card className="bg-gray-700 border-green-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-green-400" />
                            DCA Opportunities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.dca_suggestions.map((suggestion: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-600 rounded">
                                <div className="font-semibold">{suggestion.token}</div>
                                <div className="text-sm text-gray-400">{suggestion.reason}</div>
                                <div className="text-sm mt-1">
                                  Current: ${suggestion.current_price} | Avg Cost: ${suggestion.avg_cost} | Discount: {suggestion.discount_pct.toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.rebalance_suggestions && analysis.rebalance_suggestions.length > 0 && (
                      <Card className="bg-gray-700 border-yellow-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-yellow-400" />
                            Rebalancing Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.rebalance_suggestions.map((suggestion: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-600 rounded">
                                <div className="font-semibold">{suggestion.token}</div>
                                <div className="text-sm text-gray-400">{suggestion.reason}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.hygiene_issues && analysis.hygiene_issues.length > 0 && (
                      <Card className="bg-gray-700 border-red-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            Data Quality Issues
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.hygiene_issues.map((issue: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-600 rounded">
                                <div className="font-semibold text-red-400">{issue.type}</div>
                                <div className="text-sm">{issue.description}</div>
                                {issue.suggested_fix && (
                                  <div className="text-sm text-gray-400 mt-1">Fix: {issue.suggested_fix}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Run analysis to see smart insights
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

