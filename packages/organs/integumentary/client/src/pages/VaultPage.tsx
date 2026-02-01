import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Sparkles, BookOpen } from 'lucide-react';

const mockBlueprints = [
  { id: '1', title: 'DreamNet Core Blueprint', description: 'Complete architecture for DreamNet OS deployment', tags: ['core', 'infrastructure'] },
  { id: '2', title: 'Swarm Agent Template', description: 'Template for creating biomimetic swarm agents', tags: ['agent', 'swarm'] },
  { id: '3', title: 'Neural Mesh Integration', description: 'Blueprint for connecting subsystems via Neural Mesh', tags: ['integration', 'mesh'] },
];

const mockRituals = [
  { id: '1', title: 'Zen Garden Onboarding', description: 'Initialization ritual for new identities', tags: ['zen', 'init'] },
  { id: '2', title: 'Dream Seed Selection', description: 'Ritual for choosing and attaching to dreams', tags: ['dream', 'selection'] },
];

const mockTemplates = [
  { id: '1', title: 'Social Post Template', description: 'Template for creating social hub posts', tags: ['social', 'template'] },
  { id: '2', title: 'Agent Configuration', description: 'Template for agent setup and configuration', tags: ['agent', 'config'] },
];

export default function VaultPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            DreamVault
          </h1>
          <p className="text-xl text-muted-foreground">
            The blueprint library of DreamNet
          </p>
        </div>

        {/* Blueprints Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
            <h2 className={`text-2xl font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
              Blueprints
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mockBlueprints.map((blueprint) => (
              <Card 
                key={blueprint.id}
                className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 transition-colors' : ''}
              >
                <CardHeader>
                  <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                    {blueprint.title}
                  </CardTitle>
                  <CardDescription>{blueprint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {blueprint.tags.map((tag) => (
                      <span 
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          dreamNetMode 
                            ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Rituals Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
            <h2 className={`text-2xl font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
              Rituals
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockRituals.map((ritual) => (
              <Card 
                key={ritual.id}
                className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 transition-colors' : ''}
              >
                <CardHeader>
                  <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                    {ritual.title}
                  </CardTitle>
                  <CardDescription>{ritual.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {ritual.tags.map((tag) => (
                      <span 
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          dreamNetMode 
                            ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Box className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
            <h2 className={`text-2xl font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
              Templates
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockTemplates.map((template) => (
              <Card 
                key={template.id}
                className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 transition-colors' : ''}
              >
                <CardHeader>
                  <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                    {template.title}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span 
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          dreamNetMode 
                            ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

