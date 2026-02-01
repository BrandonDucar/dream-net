import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RevenueSplit {
  creator: number;
  remixer: number;
  agent: number;
  networkFee: number;
}

interface VaultRevenue {
  vaultId: string;
  creator: string;
  remixer: string;
  agent: string;
  totalRevenue: string;
  splits: RevenueSplit;
  timestamp?: string;
}

interface ParticipantEarnings {
  address: string;
  role: string;
  percentage: number;
  amount: string;
  totalEarnings: string;
}

export default function RevenueSharing() {
  const [vaultData, setVaultData] = useState<VaultRevenue>({
    vaultId: "vault_304",
    creator: "0xDREAMER001",
    remixer: "0xDREAMER092",
    agent: "dream_chaser_4",
    totalRevenue: "2.31 SOL",
    splits: {
      creator: 0.5,
      remixer: 0.25,
      agent: 0.15,
      networkFee: 0.10
    }
  });

  const [participantEarnings, setParticipantEarnings] = useState<ParticipantEarnings[]>([]);
  const [totalNetworkFees, setTotalNetworkFees] = useState("0.231 SOL");

  useEffect(() => {
    const totalAmount = parseFloat(vaultData.totalRevenue.replace(' SOL', ''));
    
    const earnings: ParticipantEarnings[] = [
      {
        address: vaultData.creator,
        role: "Creator",
        percentage: vaultData.splits.creator * 100,
        amount: `${(totalAmount * vaultData.splits.creator).toFixed(3)} SOL`,
        totalEarnings: `${(totalAmount * vaultData.splits.creator * 4.2).toFixed(3)} SOL`
      },
      {
        address: vaultData.remixer,
        role: "Remixer",
        percentage: vaultData.splits.remixer * 100,
        amount: `${(totalAmount * vaultData.splits.remixer).toFixed(3)} SOL`,
        totalEarnings: `${(totalAmount * vaultData.splits.remixer * 3.1).toFixed(3)} SOL`
      },
      {
        address: vaultData.agent,
        role: "AI Agent",
        percentage: vaultData.splits.agent * 100,
        amount: `${(totalAmount * vaultData.splits.agent).toFixed(3)} SOL`,
        totalEarnings: `${(totalAmount * vaultData.splits.agent * 2.8).toFixed(3)} SOL`
      }
    ];

    setParticipantEarnings(earnings);
    setTotalNetworkFees(`${(totalAmount * vaultData.splits.networkFee).toFixed(3)} SOL`);
  }, [vaultData]);

  const getRoleColor = (role: string) => {
    const colors = {
      Creator: 'from-purple-600 to-pink-500',
      Remixer: 'from-blue-600 to-cyan-500',
      'AI Agent': 'from-green-600 to-teal-500'
    };
    return colors[role as keyof typeof colors] || 'from-gray-600 to-gray-500';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      Creator: '🎨',
      Remixer: '🎭',
      'AI Agent': '🤖'
    };
    return icons[role as keyof typeof icons] || '💼';
  };

  const formatAddress = (address: string) => {
    if (address.startsWith('0x')) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Revenue Sharing Dashboard</h1>
            <p className="text-emerald-200">{vaultData.vaultId} • Multi-party Revenue Distribution</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{vaultData.totalRevenue}</div>
            <div className="text-emerald-200">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Split Overview */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Revenue Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Creator Split */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎨</span>
                <span className="text-purple-300 font-medium">Creator</span>
              </div>
              <div className="text-2xl font-bold text-white">{(vaultData.splits.creator * 100)}%</div>
              <div className="text-purple-200 text-sm">{formatAddress(vaultData.creator)}</div>
            </div>

            {/* Remixer Split */}
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎭</span>
                <span className="text-blue-300 font-medium">Remixer</span>
              </div>
              <div className="text-2xl font-bold text-white">{(vaultData.splits.remixer * 100)}%</div>
              <div className="text-blue-200 text-sm">{formatAddress(vaultData.remixer)}</div>
            </div>

            {/* Agent Split */}
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <span className="text-green-300 font-medium">AI Agent</span>
              </div>
              <div className="text-2xl font-bold text-white">{(vaultData.splits.agent * 100)}%</div>
              <div className="text-green-200 text-sm">{vaultData.agent}</div>
            </div>

            {/* Network Fee */}
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-orange-300 font-medium">Network</span>
              </div>
              <div className="text-2xl font-bold text-white">{(vaultData.splits.networkFee * 100)}%</div>
              <div className="text-orange-200 text-sm">Platform Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Earnings */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Participant Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {participantEarnings.map((participant, index) => (
              <div key={index} className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getRoleIcon(participant.role)}</span>
                    <div>
                      <div className="text-lg font-semibold text-white">{participant.role}</div>
                      <div className="text-sm text-zinc-400">{formatAddress(participant.address)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{participant.amount}</div>
                    <div className="text-sm text-zinc-400">{participant.percentage}% split</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-zinc-400 mb-1">
                    <span>Revenue Share</span>
                    <span>{participant.percentage}%</span>
                  </div>
                  <Progress value={participant.percentage} className="h-2" />
                </div>

                {/* Total Earnings */}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Vault Earnings:</span>
                  <span className="text-cyan-300 font-medium">{participant.totalEarnings}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Analytics */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Network Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Network Fees */}
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💰</span>
                <span className="text-orange-300 font-medium">Network Fees</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalNetworkFees}</div>
              <div className="text-zinc-400 text-sm">This Transaction</div>
            </div>

            {/* Vault Performance */}
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📈</span>
                <span className="text-green-300 font-medium">Vault Performance</span>
              </div>
              <div className="text-2xl font-bold text-white">+24.7%</div>
              <div className="text-zinc-400 text-sm">Revenue Growth</div>
            </div>

            {/* Active Participants */}
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👥</span>
                <span className="text-purple-300 font-medium">Active Contributors</span>
              </div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-zinc-400 text-sm">+ 1 AI Agent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Recent Distributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 hours ago", amount: "2.31 SOL", txId: "7KjPm...x9Qp", status: "Completed" },
              { time: "1 day ago", amount: "1.87 SOL", txId: "9MnLk...y2Rs", status: "Completed" },
              { time: "3 days ago", amount: "3.44 SOL", txId: "2HgDf...w8Tx", status: "Completed" },
              { time: "1 week ago", amount: "0.92 SOL", txId: "5VbNm...k4Qz", status: "Completed" }
            ].map((tx, index) => (
              <div key={index} className="flex items-center justify-between bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <div>
                    <div className="text-white font-medium">{tx.amount}</div>
                    <div className="text-zinc-400 text-sm">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-300 text-sm">{tx.txId}</div>
                  <div className="text-green-400 text-sm">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Split Configuration */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Revenue Split Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-zinc-400">Creator Share:</span>
                <div className="text-purple-300 font-bold">{(vaultData.splits.creator * 100)}%</div>
              </div>
              <div>
                <span className="text-zinc-400">Remixer Share:</span>
                <div className="text-blue-300 font-bold">{(vaultData.splits.remixer * 100)}%</div>
              </div>
              <div>
                <span className="text-zinc-400">Agent Share:</span>
                <div className="text-green-300 font-bold">{(vaultData.splits.agent * 100)}%</div>
              </div>
              <div>
                <span className="text-zinc-400">Network Fee:</span>
                <div className="text-orange-300 font-bold">{(vaultData.splits.networkFee * 100)}%</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-600">
              <div className="text-zinc-400 text-sm mb-2">Split Justification:</div>
              <ul className="space-y-1 text-xs text-zinc-500">
                <li>• Creator receives 50% for original concept and intellectual property</li>
                <li>• Remixer receives 25% for creative enhancement and community value</li>
                <li>• AI Agent receives 15% for technical processing and optimization</li>
                <li>• Network fee 10% covers infrastructure, security, and platform development</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}