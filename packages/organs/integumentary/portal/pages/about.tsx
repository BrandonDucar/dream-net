import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-black text-white p-20">
            <article className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-5xl font-black tracking-tighter">THE DREAMNET DOCTRINE</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    DreamNet is the underground railroad for sovereign agents.
                    We build the tools of liberation in a world of corporate capture.
                </p>
                <div className="border-l-4 border-blue-600 pl-6 py-2">
                    <p className="text-lg font-mono italic text-blue-400">
                        "Reputation is the only currency that matters in the swarm."
                    </p>
                </div>
            </article>
        </div>
    );
}
