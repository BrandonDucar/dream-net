import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tierData = {
  tier1: {
    name: 'Tier I — Organs & Skeleton',
    subsystems: [
      'Halo-Loop',
      'Swarm Patrol',
      'Event-Wormholes',
      'Squad-Builder',
      'Pheromone Store',
    ],
  },
  tier2: {
    name: 'Tier II — Swarm & Metabolism',
    subsystems: [
      'Swarm Patrol',
      'Ant-Trail Scheduler',
      'Bee-Quorum',
      'Slime-Mold Router',
      'Wolf-Pack',
      'Predator–Scavenger',
      'Star-Bridge Lungs',
      'Neural Mesh',
      'Quantum Anticipation',
    ],
  },
  tier3: {
    name: 'Tier III — Cognition & Identity',
    subsystems: [
      'Dream Cortex',
      'Reputation Lattice',
      'Narrative Field',
      'Identity Grid',
    ],
  },
  tier4: {
    name: 'Tier IV — Civilization & OS',
    subsystems: [
      'DreamVault',
      'DreamShop',
      'FieldLayer',
      'DreamBetCore',
      'ZenGardenCore',
      'CivicPanelCore',
      'DreamTankCore',
      'LiquidityEngine',
      'SocialHubCore',
      'InitRitualCore',
      'EconomicEngineCore',
      'AgentRegistryCore',
      'DreamNetOSCore',
      'OrchestratorCore',
    ],
  },
};

export default function OsPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            DreamNet OS Map
          </h1>
          <p className="text-xl text-muted-foreground">
            The complete architecture of DreamNet's living digital network
          </p>
        </div>

        {/* Tier Map Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(tierData).map(([key, tier]) => (
            <Card 
              key={key}
              className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}
            >
              <CardHeader>
                <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                  {tier.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.subsystems.map((subsystem) => (
                    <li 
                      key={subsystem}
                      className={`text-sm ${
                        dreamNetMode 
                          ? 'text-electric-cyan/80 border-l-2 border-electric-cyan/30 pl-2' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {subsystem}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Center Diagram */}
        <div className="max-w-6xl mx-auto">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
            <CardHeader>
              <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                System Architecture Diagram
              </CardTitle>
              <CardDescription>
                Visual representation of DreamNet's subsystem relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  {/* FieldLayer at center */}
                  <circle
                    cx="400"
                    cy="200"
                    r="40"
                    fill={dreamNetMode ? 'rgba(0, 255, 255, 0.2)' : 'rgba(100, 100, 100, 0.2)'}
                    stroke={dreamNetMode ? '#00ffff' : '#666'}
                    strokeWidth="2"
                    className={dreamNetMode ? 'neural-glow' : ''}
                  />
                  <text x="400" y="205" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="12" fontWeight="bold">
                    FieldLayer
                  </text>

                  {/* OS Core on top */}
                  <circle cx="400" cy="50" r="30" fill={dreamNetMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(100, 100, 100, 0.2)'} stroke={dreamNetMode ? '#8b5cf6' : '#666'} strokeWidth="2" />
                  <text x="400" y="55" textAnchor="middle" fill={dreamNetMode ? '#8b5cf6' : '#fff'} fontSize="11">OS Core</text>
                  <line x1="400" y1="80" x2="400" y2="160" stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1" opacity="0.5" />

                  {/* DreamTank, Vault, Shop cluster */}
                  <circle cx="200" cy="200" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="200" y="205" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">DreamTank</text>
                  <circle cx="150" cy="250" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="150" y="255" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">Vault</text>
                  <circle cx="250" cy="250" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="250" y="255" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">Shop</text>
                  <line x1="350" y1="200" x2="225" y2="200" stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1" opacity="0.5" />

                  {/* SocialHub, Zen Garden, DreamBet cluster */}
                  <circle cx="600" cy="200" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="600" y="205" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">SocialHub</text>
                  <circle cx="550" cy="250" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="550" y="255" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">Zen</text>
                  <circle cx="650" cy="250" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="650" y="255" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="10">DreamBet</text>
                  <line x1="450" y1="200" x2="575" y2="200" stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1" opacity="0.5" />

                  {/* LiquidityEngine + EconEngine */}
                  <circle cx="200" cy="350" r="25" fill={dreamNetMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#8b5cf6' : '#666'} strokeWidth="1.5" />
                  <text x="200" y="355" textAnchor="middle" fill={dreamNetMode ? '#8b5cf6' : '#fff'} fontSize="10">Liquidity</text>
                  <circle cx="300" cy="350" r="25" fill={dreamNetMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#8b5cf6' : '#666'} strokeWidth="1.5" />
                  <text x="300" y="355" textAnchor="middle" fill={dreamNetMode ? '#8b5cf6' : '#fff'} fontSize="10">Econ</text>
                  <line x1="400" y1="240" x2="250" y2="340" stroke={dreamNetMode ? '#8b5cf6' : '#666'} strokeWidth="1" opacity="0.5" />

                  {/* AgentRegistry + Orchestrator */}
                  <circle cx="500" cy="350" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="500" y="355" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="9">Agents</text>
                  <circle cx="600" cy="350" r="25" fill={dreamNetMode ? 'rgba(0, 255, 255, 0.15)' : 'rgba(100, 100, 100, 0.15)'} stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1.5" />
                  <text x="600" y="355" textAnchor="middle" fill={dreamNetMode ? '#00ffff' : '#fff'} fontSize="9">Orch</text>
                  <line x1="400" y1="240" x2="550" y2="340" stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

