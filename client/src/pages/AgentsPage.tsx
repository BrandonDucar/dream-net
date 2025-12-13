import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Network, Zap, Shield } from 'lucide-react';
import { AgentMarketplace } from '@/components/AgentMarketplace';
import { GuardianStatus } from '@/components/GuardianStatus';

const agents = [
  { id: 'dreamops', name: 'DreamOps', role: 'Infra', description: 'Main orchestrator for DreamNet operations' },
  { id: 'deploykeeper', name: 'DeployKeeper', role: 'Infra', description: 'Manages deployments and CI/CD integrity' },
  { id: 'envkeeper', name: 'EnvKeeper', role: 'Infra', description: 'Environment variable hygiene and security' },
  { id: 'wolfpack', name: 'WolfPack', role: 'Swarm', description: 'Predatory anomaly-hunting subsystem' },
  { id: 'swarmpatrol', name: 'Swarm Patrol', role: 'Swarm', description: 'Micro-agent repair patrol' },
  { id: 'fieldlayer', name: 'Field Layer Engine', role: 'Economy', description: 'Global parameter fields (risk, trust, liquidity)' },
  { id: 'economy', name: 'Economic Engine Core', role: 'Economy', description: 'Rewards and token simulation layer' },
  { id: 'zengarden', name: 'Zen Garden Core', role: 'Wellness', description: 'Ritual and activity tracking' },
  { id: 'dreamtank', name: 'Dream Tank Incubator', role: 'Governance', description: 'Dream incubation and progression' },
  { id: 'socialhub', name: 'Social Hub Core', role: 'Social', description: 'Social feed and posts layer' },
  { id: 'agentregistry', name: 'Agent Registry Core', role: 'System', description: 'Agent catalog and health tracking' },
];

const biomimeticSystems = [
  { name: 'Slime-Mold Router', description: 'Adaptive routing based on pheromone trails' },
  { name: 'Ant-Trail Scheduler', description: 'Task scheduling inspired by ant colony optimization' },
  { name: 'Bee-Quorum Merge Guard', description: 'Consensus-based merge protection' },
  { name: 'Predator/Scavenger Loop', description: 'Self-healing metabolic cycle' },
  { name: 'Star-Bridge Lungs', description: 'Cross-chain breathing and health monitoring' },
  { name: 'Neural Mesh', description: 'Unified nervous system connecting all subsystems' },
];

export default function AgentsPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            Agents & Swarm
          </h1>
          <p className="text-xl text-muted-foreground">
            The biomimetic agents and systems that power DreamNet
          </p>
        </div>

        {/* Agent Roster */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
            Agent Roster
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card 
                key={agent.id}
                className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 transition-colors' : ''}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bot className={`w-5 h-5 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                    <div>
                      <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                        {agent.name}
                      </CardTitle>
                      <span className={`text-xs px-2 py-1 rounded ${
                        dreamNetMode 
                          ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {agent.role}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{agent.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* GPT Agent Marketplace */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
            GPT Agent Marketplace
          </h2>
          <AgentMarketplace />
        </section>

        {/* Guardian Framework Status */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
            <h2 className={`text-2xl font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
              Guardian Framework
            </h2>
          </div>
          <GuardianStatus />
        </section>

        {/* Biomimetic Systems */}
        <section>
          <h2 className={`text-2xl font-semibold mb-6 ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
            Biomimetic Systems
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biomimeticSystems.map((system) => (
              <Card 
                key={system.name}
                className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50 hover:border-electric-cyan/50 transition-colors' : ''}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Network className={`w-5 h-5 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                    <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                      {system.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{system.description}</CardDescription>
                  {/* Simple animation placeholder */}
                  {dreamNetMode && (
                    <div className="mt-4 h-20 relative overflow-hidden rounded">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-electric-cyan neural-glow"
                            style={{
                              left: `${20 + i * 20}%`,
                              animationDelay: `${i * 0.3}s`,
                            }}
                          />
                        ))}
                      </div>
                      <svg className="w-full h-full opacity-30">
                        <line
                          x1="10%"
                          y1="50%"
                          x2="90%"
                          y2="50%"
                          stroke="#00ffff"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      </svg>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

