import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, CheckCircle2, Circle } from 'lucide-react';

const stages = [
  { id: 'seed', name: 'Seed', description: 'Initial dream concept and planning', example: null },
  { id: 'cocoon', name: 'Cocoon', description: 'Dream is incubating and developing', example: 'DreamNet Core Stability' },
  { id: 'prototype', name: 'Prototype', description: 'Early implementation and testing', example: null },
  { id: 'beta', name: 'Beta', description: 'Beta testing with limited users', example: null },
  { id: 'launch-ready', name: 'Launch-Ready', description: 'Ready for full deployment', example: null },
  { id: 'launched', name: 'Launched', description: 'Fully deployed and operational', example: null },
];

const mockDream = {
  id: '1',
  title: 'DreamNet Core Stability',
  stage: 'cocoon',
  health: 'Stable',
  progress: 65,
  description: 'Ensuring the core DreamNet OS remains stable and self-healing',
};

export default function DreamTankPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            DreamTank
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            DreamNet's incubator — where dreams evolve from seeds to fully launched ecosystems
          </p>
        </div>

        {/* Stage Timeline */}
        <section className="mb-12">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
            <CardHeader>
              <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                Dream Lifecycle Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-between gap-4">
                {stages.map((stage, index) => {
                  const isActive = stage.id === mockDream.stage;
                  const isPast = stages.findIndex(s => s.id === mockDream.stage) > index;
                  
                  return (
                    <div key={stage.id} className="flex-1 min-w-[120px]">
                      <div className="flex items-center gap-2 mb-2">
                        {isPast ? (
                          <CheckCircle2 className={`w-5 h-5 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                        ) : isActive ? (
                          <Circle className={`w-5 h-5 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'} fill-current`} />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className={`font-semibold ${isActive && dreamNetMode ? 'text-electric-cyan' : ''}`}>
                          {stage.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{stage.description}</p>
                      {stage.example && (
                        <p className="text-xs italic text-muted-foreground">e.g. {stage.example}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example Incubated Dream */}
        <section>
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FlaskConical className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                <div>
                  <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                    {mockDream.title}
                  </CardTitle>
                  <CardDescription>Incubated Dream Example</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stage</span>
                    <span className={`text-sm font-semibold capitalize ${
                      dreamNetMode ? 'text-electric-cyan' : ''
                    }`}>
                      {mockDream.stage}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Health</span>
                    <span className="text-sm font-semibold text-green-500">
                      {mockDream.health}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-semibold">{mockDream.progress}%</span>
                  </div>
                  <Progress 
                    value={mockDream.progress} 
                    className={dreamNetMode ? 'bg-electric-cyan/20' : ''}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{mockDream.description}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}

