/**
 * Mini App Page
 * Dynamic route for individual mini apps
 */

import React from 'react';
import { useRoute } from 'wouter';
import { getMiniApp, getMiniAppComponent } from '@/miniapps/registry';
import { useBase } from '@/providers/BaseProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function MiniAppPage() {
  const [match, params] = useRoute('/miniapps/:id');
  const { isConnected, connect } = useBase();

  if (!match || !params) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const app = getMiniApp(params.id);
  const Component = getMiniAppComponent(params.id);

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If wallet required but not connected, show connect prompt
  if (app.requiresWallet && !isConnected && Component) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/miniapps">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mini Apps
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This mini app requires a connected wallet.</p>
              <Button onClick={connect}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render the mini app component
  if (!Component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app component not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/miniapps">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mini Apps
            </Button>
          </Link>
        </div>
      </div>
      <Component />
    </div>
  );
}

