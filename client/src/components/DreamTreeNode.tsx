import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Eye, 
  Zap, 
  Star,
  User,
  Clock,
  TrendingUp,
  Coins
} from 'lucide-react';

interface DreamTreeNodeProps {
  id: string;
  title: string;
  content: string;
  score: number;
  creatorWallet: string;
  created?: number;
  evolved?: boolean;
  evolutionPath?: string;
  specialAbility?: string;
  originalScore?: number;
  claimable?: number;
  token?: string;
  yieldRate?: number;
  lastClaimed?: number;
  onClaim?: (dreamId: string) => void;
  onClaimSheep?: (dreamId: string) => void;
  sheepClaimable?: number;
  lastSheepClaim?: number;
}

export default function DreamTreeNode({
  id,
  title,
  content,
  score,
  creatorWallet,
  created,
  evolved,
  evolutionPath,
  specialAbility,
  originalScore,
  claimable = 0,
  token = 'DREAM',
  yieldRate = 0,
  lastClaimed,
  onClaim,
  onClaimSheep,
  sheepClaimable = 0,
  lastSheepClaim
}: DreamTreeNodeProps) {
  const getEvolutionIcon = (path?: string) => {
    switch (path) {
      case 'Visionary': return <Eye className="w-4 h-4 text-purple-400" />;
      case 'Protean': return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'Oracle': return <Zap className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const getEvolutionColor = (path?: string) => {
    switch (path) {
      case 'Visionary': return 'border-purple-500/30 bg-purple-500/5';
      case 'Protean': return 'border-blue-500/30 bg-blue-500/5';
      case 'Oracle': return 'border-yellow-500/30 bg-yellow-500/5';
      default: return 'border-cyan-500/30 bg-slate-900/50';
    }
  };

  const handleClaim = () => {
    if (onClaim && claimable > 0) {
      onClaim(id);
    }
  };

  const handleClaimSheep = () => {
    if (onClaimSheep && sheepClaimable > 0) {
      onClaimSheep(id);
    }
  };

  return (
    <Card className={`${evolved ? getEvolutionColor(evolutionPath) : 'border-cyan-500/30 bg-slate-900/50'} hover:border-cyan-500/50 transition-colors`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-white text-base font-bold">{title}</h3>
            {evolved && (
              <div className="flex items-center gap-1">
                {getEvolutionIcon(evolutionPath)}
                <Badge variant="outline" className="text-xs">
                  {evolutionPath}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              {score}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
          {content}
        </p>

        {/* Yield Information */}
        {(claimable > 0 || yieldRate > 0) && (
          <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Dream Yield</span>
              </div>
              {claimable > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClaim}
                  className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                >
                  Claim {claimable.toFixed(4)} {token}
                </Button>
              )}
            </div>
            
            {yieldRate > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>{yieldRate.toFixed(2)} {token}/day yield rate</span>
              </div>
            )}
            
            {lastClaimed && (
              <div className="text-xs text-slate-400 mt-1">
                Last claimed: {new Date(lastClaimed).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* SHEEP Rewards */}
        {sheepClaimable > 0 && (
          <div className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐑</span>
                <span className="text-sm font-medium text-orange-300">SHEEP Rewards</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClaimSheep}
                className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
              >
                Claim {sheepClaimable.toFixed(2)} SHEEP
              </Button>
            </div>
            
            {lastSheepClaim && (
              <div className="text-xs text-slate-400">
                Last SHEEP claim: {new Date(lastSheepClaim).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Evolution Special Ability */}
        {evolved && specialAbility && (
          <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-purple-300">Special Ability</span>
            </div>
            <p className="text-xs text-purple-400">{specialAbility}</p>
            {originalScore && (
              <p className="text-xs text-slate-400 mt-1">
                Evolved: {originalScore} → {score} points
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span className="font-mono">{creatorWallet?.slice(0, 8)}...</span>
          </div>
          {created && (
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{new Date(created).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}