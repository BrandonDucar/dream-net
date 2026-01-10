import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EvolutionVault {
  vaultId: string;
  type: string;
  linkedDreamId: string;
  goal: number;
  current: number;
  contributors: string[];
  autoUnlockEnabled: boolean;
  milestones: Array<{
    target: number;
    unlock: string;
  }>;
}

interface EvolutionVaultProps {
  vaultData?: EvolutionVault;
}

export default function EvolutionVault({ vaultData }: EvolutionVaultProps) {
  const [vault, setVault] = useState<EvolutionVault>(vaultData || {
    vaultId: "vault_019",
    type: "Evolution Vault",
    linkedDreamId: "dream001",
    goal: 25000,
    current: 12400,
    contributors: ["0xBrandon", "0xTina", "0xFlutter"],
    autoUnlockEnabled: true,
    milestones: [
      {"target": 10000, "unlock": "Visual Skin Upgrade"},
      {"target": 20000, "unlock": "Dream Animation"},
      {"target": 25000, "unlock": "Cloud Integration"}
    ]
  });

  const [contributionAmount, setContributionAmount] = useState<number>(1000);

  const progressPercentage = (vault.current / vault.goal) * 100;
  
  const getCompletedMilestones = () => {
    return vault.milestones.filter(milestone => vault.current >= milestone.target);
  };

  const getNextMilestone = () => {
    return vault.milestones.find(milestone => vault.current < milestone.target);
  };

  const handleContribute = async () => {
    try {
      // Simulate contribution API call
      const newCurrent = vault.current + contributionAmount;
      setVault(prev => ({
        ...prev,
        current: Math.min(newCurrent, prev.goal)
      }));
      
      // Add contributor if not already in list
      const userWallet = "0xYourWallet"; // This would come from auth context
      if (!vault.contributors.includes(userWallet)) {
        setVault(prev => ({
          ...prev,
          contributors: [...prev.contributors, userWallet]
        }));
      }
    } catch (error) {
      console.error('Failed to contribute:', error);
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const completedMilestones = getCompletedMilestones();
  const nextMilestone = getNextMilestone();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                🧬 {vault.vaultId}
                <Badge className="bg-purple-600 text-purple-100">{vault.type}</Badge>
              </CardTitle>
              <p className="text-purple-200 mt-1">
                Linked to Dream: <span className="text-cyan-400 font-mono">{vault.linkedDreamId}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 text-2xl font-bold">{formatNumber(vault.current)}</div>
              <div className="text-purple-200 text-sm">of {formatNumber(vault.goal)} $SHEEP</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Section */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            📈 Evolution Progress
            {vault.autoUnlockEnabled && (
              <Badge className="bg-green-600 text-green-100">Auto-Unlock Enabled</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Progress to Goal</span>
              <span className="text-white">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {nextMilestone && (
            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">Next Milestone</h4>
                  <p className="text-cyan-400">{nextMilestone.unlock}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{formatNumber(nextMilestone.target)}</div>
                  <div className="text-zinc-400 text-sm">
                    {formatNumber(nextMilestone.target - vault.current)} to go
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Progress 
                  value={(vault.current / nextMilestone.target) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">🎯 Evolution Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vault.milestones.map((milestone, index) => {
              const isCompleted = vault.current >= milestone.target;
              const isCurrent = nextMilestone?.target === milestone.target;
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-900 border-green-600' 
                      : isCurrent
                      ? 'bg-yellow-900 border-yellow-600'
                      : 'bg-zinc-800 border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' : isCurrent ? 'bg-yellow-500' : 'bg-zinc-600'
                    }`}>
                      {isCompleted ? '✓' : isCurrent ? '⏳' : '○'}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{milestone.unlock}</h4>
                      <p className="text-zinc-400 text-sm">{formatNumber(milestone.target)} $SHEEP</p>
                    </div>
                  </div>
                  <Badge className={
                    isCompleted 
                      ? 'bg-green-600 text-green-100' 
                      : isCurrent
                      ? 'bg-yellow-600 text-yellow-100'
                      : 'bg-zinc-600 text-zinc-100'
                  }>
                    {isCompleted ? 'Unlocked' : isCurrent ? 'In Progress' : 'Locked'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            👥 Contributors ({vault.contributors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {vault.contributors.map((contributor, index) => (
              <Badge key={index} className="bg-purple-600 text-purple-100 font-mono">
                {formatWalletAddress(contributor)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Interface */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">💰 Contribute to Evolution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-zinc-400 text-sm block mb-2">
                Contribution Amount ($SHEEP)
              </label>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white"
                placeholder="Enter amount"
                min="1"
                max="10000"
              />
            </div>
            <Button
              onClick={handleContribute}
              className="bg-cyan-600 hover:bg-cyan-700 mt-6"
              disabled={vault.current >= vault.goal}
            >
              {vault.current >= vault.goal ? 'Goal Reached' : 'Contribute'}
            </Button>
          </div>
          
          <div className="text-xs text-zinc-500">
            Your contribution helps unlock new evolution features for this dream. 
            {vault.autoUnlockEnabled && " Auto-unlock is enabled - features will activate automatically when milestones are reached."}
          </div>
        </CardContent>
      </Card>

      {/* Completed Milestones Showcase */}
      {completedMilestones.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900 to-teal-900 border-green-600">
          <CardHeader>
            <CardTitle className="text-green-200">🎉 Unlocked Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMilestones.map((milestone, index) => (
                <div key={index} className="bg-green-800 border border-green-600 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-green-100 font-semibold">{milestone.unlock}</h4>
                      <p className="text-green-300 text-sm">Unlocked at {formatNumber(milestone.target)} $SHEEP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}