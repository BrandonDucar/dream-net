import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing page for DreamNet. This replaces the simple command center
 * heading with a full‑screen hero, call‑to‑action buttons and a grid
 * of liquid‑glass style cards pointing to DreamNet’s core verticals.
 * The design leverages Tailwind CSS utilities defined in the client
 * configuration and is responsive across desktop and mobile.
 */
const Home: React.FC = () => {
  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[80vh] pt-20 pb-24 sm:pt-32 sm:pb-32">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-purple-700 to-cyan-600 opacity-40 blur-3xl"></div>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg text-white">
          Wake the Dream.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-slate-300">
          A living network of belief‑powered creation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/onboard"
            className="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-medium shadow-lg backdrop-blur hover:bg-white/20 hover:shadow-2xl transition-all"
          >
            Enter the Network
          </Link>
          <Link
            to="/dreamscope/live"
            className="px-6 py-3 rounded-full bg-purple-600/40 border border-purple-500/50 text-white font-medium shadow-lg backdrop-blur hover:bg-purple-600/60 hover:shadow-2xl transition-all"
          >
            Live Console
          </Link>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Military Card */}
          <Link
            to="/military"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Military</h3>
              <p className="text-sm text-slate-400">
                Simulate defence scenarios and strategise with confidence.
              </p>
            </div>
          </Link>
          {/* Travel Card */}
          <Link
            to="/travel"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Travel</h3>
              <p className="text-sm text-slate-400">
                Explore journeys powered by quantum dreaming and wanderlust.
              </p>
            </div>
          </Link>
          {/* Science Card */}
          <Link
            to="/science"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Science</h3>
              <p className="text-sm text-slate-400">
                Uncover new discoveries within an ever‑evolving neural lab.
              </p>
            </div>
          </Link>
          {/* Crypto Card */}
          <Link
            to="/crypto"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Crypto</h3>
              <p className="text-sm text-slate-400">
                Harness the power of decentralised finance and tokenisation.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
