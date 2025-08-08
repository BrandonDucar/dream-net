import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SwarmDashboard() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Swarm Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-300">Agent swarm coordination interface...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}