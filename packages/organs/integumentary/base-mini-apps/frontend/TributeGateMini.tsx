import React, { useState } from 'react';

type TargetType = 'Dream' | 'Agent' | 'Node';

interface TributeTarget {
  id: string;
  name: string;
  type: TargetType;
}

export function TributeGateMini() {
  const [targetType, setTargetType] = useState<TargetType>('Dream');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [tokenName, setTokenName] = useState('DREAM');
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const mockTargets: Record<TargetType, TributeTarget[]> = {
    Dream: [
      { id: 'dream-001', name: 'Neural Mesh Protocol', type: 'Dream' },
      { id: 'dream-002', name: 'Quantum Anticipation Engine', type: 'Dream' },
      { id: 'dream-003', name: 'Dream Cortex System', type: 'Dream' },
    ],
    Agent: [
      { id: 'agent-001', name: 'LUCID Agent', type: 'Agent' },
      { id: 'agent-002', name: 'CANVAS Agent', type: 'Agent' },
      { id: 'agent-003', name: 'ROOT Agent', type: 'Agent' },
    ],
    Node: [
      { id: 'node-001', name: 'DreamNet Core Node', type: 'Node' },
      { id: 'node-002', name: 'Shield Core Node', type: 'Node' },
      { id: 'node-003', name: 'Mesh Core Node', type: 'Node' },
    ],
  };

  const availableTokens = ['DREAM', 'SHEEP', 'CORE', 'ROOT', 'FLBY'];

  const handleSendTribute = () => {
    if (!selectedTarget || !amount || parseFloat(amount) <= 0) return;
    setShowConfirmation(true);
    // TODO: Call /api/tribute/send with target, token, amount
  };

  const handleConfirm = () => {
    // TODO: Execute actual tribute transfer
    alert(`Tribute sent!\n\n${amount} ${tokenName} to ${mockTargets[targetType].find(t => t.id === selectedTarget)?.name}\n\nTODO: Connect to tribute contract`);
    setShowConfirmation(false);
    setAmount('');
    setSelectedTarget('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🎁 Tribute Gate Mini
          </h1>
          <p className="text-gray-400 mb-6">Send tributes to Dreams, Agents, or Nodes</p>

          {!showConfirmation ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Target Type</label>
                <select
                  value={targetType}
                  onChange={(e) => {
                    setTargetType(e.target.value as TargetType);
                    setSelectedTarget('');
                  }}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                >
                  <option value="Dream">Dream</option>
                  <option value="Agent">Agent</option>
                  <option value="Node">Node</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Select Target</label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Choose a {targetType.toLowerCase()}...</option>
                  {mockTargets[targetType].map(target => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Token</label>
                <select
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                >
                  {availableTokens.map(token => (
                    <option key={token} value={token}>{token}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
                  placeholder="0.0"
                  min="0"
                  step="0.0001"
                />
              </div>

              <button
                onClick={handleSendTribute}
                disabled={!selectedTarget || !amount || parseFloat(amount) <= 0}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send Tribute
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold mb-4">Confirm Tribute</h2>
              <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
                <p className="text-lg mb-2">
                  Sending <span className="font-bold text-cyan-400">{amount} {tokenName}</span>
                </p>
                <p className="text-gray-300">
                  To: {mockTargets[targetType].find(t => t.id === selectedTarget)?.name}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleConfirm}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to tribute contract for actual token transfers
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Fetch real targets from /api/dreams, /api/agents, /api/nodes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

