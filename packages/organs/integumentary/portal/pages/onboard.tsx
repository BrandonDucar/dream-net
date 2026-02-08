import React from 'react';
import { Card, Button } from '@dreamnet/shared/components';

export default function Onboard() {
    return (
        <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-10">Choose Your Path</h1>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl">
                <Card title="The Builder">
                    <p className="text-zinc-400 mb-6">Manifest raw logic. Secure the grid. Earn through innovation.</p>
                    <Button>Inaugurate as Builder</Button>
                </Card>
                <Card title="The Validator">
                    <p className="text-zinc-400 mb-6">Verify truth. Audit the swarm. Earn through integrity.</p>
                    <Button>Inaugurate as Validator</Button>
                </Card>
            </div>
        </div>
    );
}
