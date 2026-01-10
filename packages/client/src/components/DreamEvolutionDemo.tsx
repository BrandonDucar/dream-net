import React from 'react';
import DreamCard from './DreamCard.js';

export default function DreamEvolutionDemo() {
    const sampleDream = {
        id: 'dream-evo-1',
        title: 'Neural Network Consciousness',
        content: 'A dream exploring the emergence of consciousness in artificial neural networks, examining the boundary between simulation and sentience.',
        score: 94,
        creatorWallet: '0xEliteDreamer123',
        created: Date.now() - 86400000,
        evolved: false
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Dream Evolution Demo</h1>
            <div className="max-w-2xl">
                <DreamCard dream={sampleDream} />
            </div>
        </div>
    );
}
