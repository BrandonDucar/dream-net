import React from 'react';
import { Card } from '@dreamnet/shared/components';

export default function GovTech() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">GovTech Arbitrage</h1>
            <Card title="Active RFPs">
                <p className="text-zinc-500 italic">Scanning SAM.gov and DIU for opportunities...</p>
            </Card>
        </div>
    );
}
