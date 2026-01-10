import React, { useState } from 'react';

type Step = 'wallet' | 'passport' | 'ports' | 'complete';

export function OnboardingWizardMini() {
  const [currentStep, setCurrentStep] = useState<Step>('wallet');
  const [walletConnected, setWalletConnected] = useState(false);
  const [passportMinted, setPassportMinted] = useState(false);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);

  const AVAILABLE_PORTS = [
    { id: 'dreamnet-core', label: 'DreamNet Core', fiber: 'ALPHA' },
    { id: 'shield-core', label: 'Shield Core', fiber: 'BETA' },
    { id: 'mesh-core', label: 'Mesh Core', fiber: 'GAMMA' },
    { id: 'travelnet-core', label: 'TravelNet Core', fiber: 'GAMMA' },
    { id: 'milnet-core', label: 'MILNET Core', fiber: 'BETA' },
  ];

  const steps: Step[] = ['wallet', 'passport', 'ports', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleWalletConnect = () => {
    // TODO: Integrate with actual wallet connection
    setWalletConnected(true);
    setTimeout(() => setCurrentStep('passport'), 1000);
  };

  const handlePassportMint = () => {
    // TODO: Call passport mint contract
    setPassportMinted(true);
    setTimeout(() => setCurrentStep('ports'), 1000);
  };

  const togglePort = (portId: string) => {
    setSelectedPorts(prev =>
      prev.includes(portId)
        ? prev.filter(id => id !== portId)
        : [...prev, portId]
    );
  };

  const handleJoinPorts = () => {
    // TODO: Call /api/onboarding/join-ports with selectedPorts
    setCurrentStep('complete');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🎯 Onboarding Wizard Mini
          </h1>
          <p className="text-gray-400 mb-6">Get started with DreamNet</p>

          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      idx < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : idx === currentStepIndex
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs mt-2 capitalize">{step}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 'wallet' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6">
                  Connect your Base wallet to get started
                </p>
                <button
                  onClick={handleWalletConnect}
                  disabled={walletConnected}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {walletConnected ? 'Connected ✓' : 'Connect Wallet'}
                </button>
              </div>
            )}

            {currentStep === 'passport' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Mint Your Passport</h2>
                <p className="text-gray-400 mb-6">
                  Get your DreamNet passport NFT to access the ecosystem
                </p>
                <button
                  onClick={handlePassportMint}
                  disabled={passportMinted}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {passportMinted ? 'Minted ✓' : 'Mint Passport'}
                </button>
              </div>
            )}

            {currentStep === 'ports' && (
              <div className="py-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Join Ports</h2>
                <p className="text-gray-400 mb-6 text-center">
                  Select which ports you'd like to join
                </p>
                <div className="space-y-2">
                  {AVAILABLE_PORTS.map(port => (
                    <label
                      key={port.id}
                      className="flex items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-500/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPorts.includes(port.id)}
                        onChange={() => togglePort(port.id)}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-semibold">{port.label}</div>
                        <div className="text-sm text-gray-400">Fiber: {port.fiber}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleJoinPorts}
                  disabled={selectedPorts.length === 0}
                  className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join Selected Ports
                </button>
              </div>
            )}

            {currentStep === 'complete' && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-4">Welcome to DreamNet!</h2>
                <p className="text-gray-400 mb-6">
                  You're all set up. Start exploring the Hub!
                </p>
                <button
                  onClick={() => {
                    setCurrentStep('wallet');
                    setWalletConnected(false);
                    setPassportMinted(false);
                    setSelectedPorts([]);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Integrate with actual wallet connection (Base Wallet SDK)
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Wire passport mint to DreamPassport contract
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Connect port joining to /api/onboarding/join-ports endpoint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

