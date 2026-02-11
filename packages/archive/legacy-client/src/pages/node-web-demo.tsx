import NodeWeb from '@/components/NodeWeb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Bot } from 'lucide-react';

const demoSwarmBots = [
  {
    id: 'LUCID-01',
    zone: 'DREAM_ACTIVATION',
    priority: 'WAKE',
    token: 'FLBY',
    status: 'ACTIVE',
    lastAction: Date.now() - 300000,
    nextAction: 'SCAN_DORMANT_DREAMS'
  },
  {
    id: 'CANVAS-02', 
    zone: 'NODE_LINKING',
    priority: 'CONNECT',
    token: 'SHEEP',
    status: 'EXECUTING',
    lastAction: Date.now() - 120000,
    nextAction: 'ESTABLISH_DREAM_LINKS'
  },
  {
    id: 'ROOT-03',
    zone: 'CORE_BUILDING',
    priority: 'BUILD',
    token: 'CORE',
    status: 'ACTIVE',
    lastAction: Date.now() - 600000,
    nextAction: 'STRENGTHEN_CORES'
  },
  {
    id: 'ECHO-04',
    zone: 'YIELD_OPTIMIZATION',
    priority: 'MONETIZE',
    token: 'ROOT',
    status: 'IDLE',
    lastAction: Date.now() - 900000,
    nextAction: 'OPTIMIZE_YIELDS'
  }
];

export default function NodeWebDemo() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Network className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Node Web Demo</h1>
          <p className="text-slate-300">Interactive trust-based node visualization</p>
        </div>
      </div>

      {/* Demo Info */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Node Network Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Trust Levels:</h4>
              <ul className="space-y-1 text-slate-300">
                <li>• God Mode: 100% (Full Control)</li>
                <li>• Operator: 91% (High Access)</li>
                <li>• Swarm Bots: 85-95% (Variable Trust)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Node Actions:</h4>
              <ul className="space-y-1 text-slate-300">
                <li>• Send Pulse: Network activation</li>
                <li>• Wake Agent: Bot reactivation</li>
                <li>• View Bounties: Task overview</li>
                <li>• Assign Task: Direct control</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Web Component */}
      <NodeWeb swarmBots={demoSwarmBots} />

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{demoSwarmBots.length + 2}</div>
            <div className="text-sm text-slate-400">Total Nodes</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {demoSwarmBots.filter(bot => bot.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-slate-400">Active Bots</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">95%</div>
            <div className="text-sm text-slate-400">Avg Trust</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">4</div>
            <div className="text-sm text-slate-400">Token Types</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}