import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { SentientAgentCard } from '@/components/SentientAgentCard';
import agentLibrary from '@/data/agentLibrary';

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
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
            }`}>
            Agents & Swarm
          </h1>
          <p className="text-xl text-muted-foreground">
            The biomimetic agents and systems that power DreamNet
          </p>
        </div>

        {/* Agent Library */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className={`text-3xl font-black uppercase tracking-tighter ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
                Sentient Agent Library
              </h2>
              <p className="text-sm text-muted-foreground mt-2 italic">A foundational collection of high-fidelity identities for the sovereign swarm.</p>
            </div>
            <button className="px-4 py-2 bg-electric-cyan text-black font-black uppercase text-[10px] rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:scale-105 transition-transform">
              + Mint_New_Agent
            </button>
          </div>
          <div className="flex flex-wrap gap-10 justify-center">
            {agentLibrary.map((agent) => (
              <SentientAgentCard
                key={agent.id}
                agent={agent}
              />
            ))}
          </div>
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

