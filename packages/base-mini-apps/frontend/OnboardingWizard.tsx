import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';
import { ethers } from 'ethers';

// Try to import BaseProvider, fallback to direct ethers if not available
let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {
  // BaseProvider not available, will use direct ethers connection
}

const PASSPORT_ABI = [
  {
    name: 'mintPassport',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'flags', type: 'string[]' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'hasPassport',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
];

const AVAILABLE_PORTS = [
  { id: 'dreamnet-core', label: 'DreamNet Core', fiber: 'ALPHA' },
  { id: 'shield-core', label: 'Shield Core', fiber: 'BETA' },
  { id: 'mesh-core', label: 'Mesh Core', fiber: 'GAMMA' },
  { id: 'travelnet-core', label: 'TravelNet Core', fiber: 'GAMMA' },
  { id: 'milnet-core', label: 'MILNET Core', fiber: 'BETA' },
];

export function OnboardingWizard() {
  const baseHook = useBase ? useBase() : null;
  const signer = baseHook?.signer || null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [tier, setTier] = useState<string>('dreamer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadProfile();
    }
  }, [address]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`/api/onboarding/profile/${address}`);
      const data = await res.json();
      setProfile(data);

      // Set current step based on progress
      if (data.steps?.mintPassport) {
        setCurrentStep(3);
      } else if (data.steps?.connectWallet) {
        setCurrentStep(2);
      }
    } catch (err: any) {
      console.error('Failed to load profile:', err);
    }
  };

  const completeStep = async (step: string, data?: any) => {
    if (!address) return;

    try {
      const res = await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, step, ...data }),
      });

      if (!res.ok) throw new Error('Failed to complete step');
      await loadProfile();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
      await completeStep('connectWallet');
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMintPassport = async () => {
    if (!signer || !address) return;

    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(CONTRACT_ADDRESSES.DreamPassport, PASSPORT_ABI, signer);
      const tierMap: Record<string, number> = {
        visitor: 0,
        dreamer: 1,
        citizen: 2,
        operator: 3,
        architect: 4,
        founder: 5,
      };

      const tx = await contract.mintPassport(address, tierMap[tier], []);
      await tx.wait();

      await completeStep('mintPassport');
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to mint passport');
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePorts = async () => {
    if (selectedPorts.length === 0) {
      setError('Please select at least one port');
      return;
    }

    try {
      await completeStep('choosePorts', { ports: selectedPorts });
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const togglePort = (portId: string) => {
    setSelectedPorts(prev =>
      prev.includes(portId)
        ? prev.filter(id => id !== portId)
        : [...prev, portId]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome to Dream State</h1>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`w-1/4 h-2 rounded ${
                step <= currentStep ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Connect</span>
          <span>Passport</span>
          <span>Ports</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Step 1: Connect Wallet */}
      {currentStep === 1 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Step 1: Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Connect your wallet to get started with Dream State. We support MetaMask and other Web3 wallets.
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded text-lg"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Step 2: Mint Passport */}
      {currentStep === 2 && isConnected && (
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Step 2: Mint Your Passport</h2>
          <p className="text-gray-300 mb-6">
            Your Dream State passport is your identity in the network. Choose your tier to get started.
          </p>

          <div className="mb-6">
            <label className="text-gray-300 text-sm mb-2 block">Passport Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            >
              <option value="visitor">Visitor</option>
              <option value="dreamer">Dreamer</option>
              <option value="citizen">Citizen</option>
              <option value="operator">Operator</option>
              <option value="architect">Architect</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          <button
            onClick={handleMintPassport}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white px-6 py-3 rounded text-lg"
          >
            {loading ? 'Minting...' : 'Mint Passport'}
          </button>
        </div>
      )}

      {/* Step 3: Choose Ports */}
      {currentStep === 3 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Step 3: Choose Your Ports</h2>
          <p className="text-gray-300 mb-6">
            Select the ports you want to join. You can change these later.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {AVAILABLE_PORTS.map((port) => (
              <div
                key={port.id}
                onClick={() => togglePort(port.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPorts.includes(port.id)
                    ? 'bg-cyan-500/20 border-cyan-500'
                    : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{port.label}</h3>
                    <p className="text-gray-400 text-sm">{port.fiber} Fiber</p>
                  </div>
                  {selectedPorts.includes(port.id) && (
                    <span className="text-cyan-400">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleChoosePorts}
            disabled={selectedPorts.length === 0}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded text-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 4 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-green-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">🎉 Welcome to Dream State!</h2>
          <p className="text-gray-300 mb-6">
            You've completed onboarding. You can now explore all the mini-apps and start creating dreams.
          </p>
          <a
            href="/"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded text-lg"
          >
            Go to Hub
          </a>
        </div>
      )}
    </div>
  );
}

