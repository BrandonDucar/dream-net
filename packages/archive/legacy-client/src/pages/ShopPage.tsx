import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag } from 'lucide-react';

const mockOffers = [
  {
    id: '1',
    title: 'DreamNet Core Blueprint (Founder Access)',
    description: 'Complete access to DreamNet Core architecture and deployment blueprints',
    tags: ['blueprint', 'founder'],
    price: 'Coming Soon',
  },
  {
    id: '2',
    title: 'Zen Garden Ritual Pack',
    description: 'Collection of wellness rituals and activity templates',
    tags: ['ritual', 'zen'],
    price: 'Coming Soon',
  },
  {
    id: '3',
    title: 'DreamBet Play Access (Demo)',
    description: 'Early access to DreamBet gaming platform',
    tags: ['game', 'demo'],
    price: 'Coming Soon',
  },
  {
    id: '4',
    title: 'Agent Slot: Custom Agent Integration (Future)',
    description: 'Reserve a slot for custom agent integration into DreamNet',
    tags: ['agent', 'future'],
    price: 'Coming Soon',
  },
];

export default function ShopPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            DreamShop
          </h1>
          <p className="text-xl text-muted-foreground">
            Marketplace for DreamNet blueprints, rituals, and services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mockOffers.map((offer) => (
            <Card 
              key={offer.id}
              className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 transition-colors' : ''}
            >
              <CardHeader>
                <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                  {offer.title}
                </CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {offer.tags.map((tag) => (
                    <span 
                      key={tag}
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        dreamNetMode 
                          ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-semibold ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
                    {offer.price}
                  </span>
                  <Button 
                    disabled
                    variant={dreamNetMode ? 'outline' : 'default'}
                    className={dreamNetMode ? 'border-electric-cyan/30 text-electric-cyan' : ''}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

