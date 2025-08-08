import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Eye,
  Zap,
  Loader2,
  TreePine
} from 'lucide-react';

interface DreamNode {
  id: string;
  title: string;
  content: string;
  score: number;
  creatorWallet: string;
  created: number;
  evolved?: boolean;
  evolutionPath?: string;
  specialAbility?: string;
  originalScore?: number;
  forkedFrom?: string;
  remixes?: DreamNode[];
  evolutions?: DreamNode[];
}

interface DreamTreeProps {
  dreamId: string;
}

export default function DreamTree({ dreamId }: DreamTreeProps) {
  const { data: dreamTree, isLoading, error } = useQuery<DreamNode>({
    queryKey: [`/api/dreams/${dreamId}/tree`],
  });

  // Generate ASCII tree representation
  const generateAsciiTree = (node: DreamNode, prefix: string = '', isLast: boolean = true): string => {
    const connector = isLast ? '└── ' : '├── ';
    const icon = getTreeIcon(node);
    const scoreColor = node.score >= 80 ? '🌈' : node.score >= 60 ? '🟡' : '🔴';
    
    let result = `${prefix}${connector}${icon} "${node.title}" (Score: ${node.score}) ${scoreColor}\n`;
    
    const children = [...(node.remixes || []), ...(node.evolutions || [])];
    children.forEach((child, index) => {
      const isChildLast = index === children.length - 1;
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      result += generateAsciiTree(child, childPrefix, isChildLast);
    });
    
    return result;
  };

  const getTreeIcon = (node: DreamNode): string => {
    if (node.evolved) {
      switch (node.evolutionPath) {
        case 'Visionary': return '👁️';
        case 'Protean': return '✨';
        case 'Oracle': return '⚡';
        default: return '🔮';
      }
    }
    if (node.score >= 90) return '🌳';
    if (node.score >= 70) return '🪄';
    if (node.score >= 50) return '🔥';
    return '🧨';
  };

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

  const renderDreamNode = (dream: DreamNode, level: number = 0) => {
    const hasChildren = (dream.remixes && dream.remixes.length > 0) || 
                       (dream.evolutions && dream.evolutions.length > 0);
    
    return (
      <div key={dream.id} className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
        {/* Connection Line */}
        {level > 0 && (
          <div className="flex items-center mb-2">
            <div className="w-6 h-px bg-slate-600"></div>
            <ArrowRight className="w-4 h-4 text-slate-600 mx-1" />
          </div>
        )}
        
        {/* Dream Card */}
        <Card className={`${dream.evolved ? getEvolutionColor(dream.evolutionPath) : 'border-cyan-500/30 bg-slate-900/50'} hover:border-cyan-500/50 transition-all`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-base font-bold">{dream.title}</h3>
                {dream.evolved && (
                  <div className="flex items-center gap-1">
                    {getEvolutionIcon(dream.evolutionPath)}
                    <Badge variant="outline" className="text-xs">
                      {dream.evolutionPath}
                    </Badge>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
                {dream.score}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            <p className="text-slate-300 text-sm line-clamp-2">
              {dream.content}
            </p>

            {dream.evolved && dream.specialAbility && (
              <div className="p-2 rounded border border-green-500/30 bg-green-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-green-300">Special Ability</span>
                </div>
                <p className="text-xs text-green-400">{dream.specialAbility}</p>
                {dream.originalScore && (
                  <p className="text-xs text-slate-400 mt-1">
                    Evolved: {dream.originalScore} → {dream.score}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{dream.creatorWallet?.slice(0, 8)}...</span>
              <span>{new Date(dream.created).toLocaleDateString()}</span>
            </div>

            {/* Branch Indicators */}
            {hasChildren && (
              <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
                {dream.remixes && dream.remixes.length > 0 && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <GitBranch className="w-3 h-3" />
                    <span className="text-xs">{dream.remixes.length} remix{dream.remixes.length !== 1 ? 'es' : ''}</span>
                  </div>
                )}
                {dream.evolutions && dream.evolutions.length > 0 && (
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowDown className="w-3 h-3" />
                    <span className="text-xs">{dream.evolutions.length} evolution{dream.evolutions.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Render child nodes */}
        {dream.remixes && dream.remixes.map(remix => 
          renderDreamNode(remix, level + 1)
        )}
        {dream.evolutions && dream.evolutions.map(evolution => 
          renderDreamNode(evolution, level + 1)
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-900/50">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-slate-300">Loading dream tree...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-red-400 mb-2">Tree Load Error</h3>
          <p className="text-red-300">Unable to load dream tree structure</p>
        </CardContent>
      </Card>
    );
  }

  if (!dreamTree) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardContent className="p-6 text-center">
          <TreePine className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-400 mb-2">Dream Not Found</h3>
          <p className="text-slate-500">The requested dream tree could not be located</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <TreePine className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Dream Evolution Tree</h2>
      </div>

      {/* ASCII Tree View */}
      <Card className="border-slate-700 bg-slate-900/30 mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Tree Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre">
            {generateAsciiTree(dreamTree)}
          </pre>
        </CardContent>
      </Card>
      
      <div className="relative">
        {renderDreamNode(dreamTree)}
      </div>
      
      <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-800/30">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Tree Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3 h-3 text-blue-400" />
            <span className="text-slate-400">Remixed Dreams</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3 h-3 text-green-400" />
            <span className="text-slate-400">Evolution Path</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-purple-400" />
            <span className="text-slate-400">Visionary Form</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-slate-400">Protean Form</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-slate-400">Oracle Form</span>
          </div>
        </div>
      </div>
    </div>
  );
}