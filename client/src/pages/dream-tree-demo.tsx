import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DreamTreeDemo() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Dream Tree Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-cyan-300">Dream tree visualization demo coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}