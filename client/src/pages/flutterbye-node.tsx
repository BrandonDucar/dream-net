import { useState } from 'react';

export default function FlutterByeNodePage() {
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b8C94d5C1b9F78d8e9');
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'outbox' | 'status'>('inbox');

  const mockMessages = [
    {
      id: 'msg_1',
      fromWallet: '0xSender1',
      content: 'Welcome to the Dream Network! Here are your first FLBY tokens.',
      tokens: { amount: 100, token: 'FLBY' },
      timestamp: Date.now() - 3600000,
      validated: true
    },
    {
      id: 'msg_2', 
      fromWallet: '0xSender2',
      content: 'Your dream was approved! Bonus SHEEP tokens incoming.',
      tokens: { amount: 50, token: 'SHEEP' },
      timestamp: Date.now() - 1800000,
      validated: true
    }
  ];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  🪽 Flutterbye Node
                </h1>
                <p className="text-gray-400 mt-2">Isolated FLBY token messaging system | Trust Boundary: 80+</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">ISOLATED</span>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">CANVAS + ROOT</span>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">FLBY TOKEN</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-800/30 rounded-lg p-1 mb-8">
            <div className="flex gap-1">
              {[
                { id: 'inbox' as const, label: '📥 Inbox', count: 2 },
                { id: 'compose' as const, label: '✍️ Compose' },
                { id: 'outbox' as const, label: '📤 Outbox', count: 1 },
                { id: 'status' as const, label: '📊 Status' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
            
            {activeTab === 'inbox' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">Incoming Messages</h3>
                
                <div className="space-y-4">
                  {mockMessages.map(message => (
                    <div key={message.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-cyan-300">
                            From: {message.fromWallet}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                        <div className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                          {message.tokens.amount} {message.tokens.token}
                        </div>
                      </div>
                      
                      <div className="text-gray-200 mb-4">
                        {message.content}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                          Claim Tokens
                        </button>
                        <span className="text-green-400 text-sm">✓ Validated</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compose' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">Compose New Message</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Wallet</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Write your message here..."
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Token Amount</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Token Type</label>
                      <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none">
                        <option value="FLBY">FLBY</option>
                        <option value="SHEEP">SHEEP</option>
                      </select>
                    </div>
                  </div>
                  
                  <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition-colors">
                    Send Message + Tokens
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'outbox' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">Sent Messages</h3>
                <div className="bg-gray-700/30 rounded-lg p-8 text-center">
                  <div className="text-gray-400">No sent messages yet</div>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">Node Status & Configuration</h3>
                
                {/* Node Configuration */}
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6 mb-8">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4">🔒 Isolation Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300">Node ID:</span>
                      <span className="ml-2 text-cyan-400">flutterbye</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Primary Token:</span>
                      <span className="ml-2 text-purple-400">FLBY</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Trust Boundary:</span>
                      <span className="ml-2 text-orange-400">80+ Required</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Isolation:</span>
                      <span className="ml-2 text-red-400">Enabled</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-300">Agent Visibility:</span>
                      <span className="ml-2 text-blue-400">CANVAS, ROOT</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-300">Allowed Access:</span>
                      <span className="ml-2 text-green-400">inbox, outbox, mint</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="text-lg font-semibold text-green-400">Online</div>
                    <div className="text-sm text-gray-400">Connection Status</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">📨</div>
                    <div className="text-lg font-semibold">247</div>
                    <div className="text-sm text-gray-400">Messages Processed</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🪙</div>
                    <div className="text-lg font-semibold">15,420</div>
                    <div className="text-sm text-gray-400">FLBY Delivered</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-lg font-semibold text-orange-400">87/100</div>
                    <div className="text-sm text-gray-400">Trust Score</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-semibold">2.3min</div>
                    <div className="text-sm text-gray-400">Avg Delivery</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="text-lg font-semibold text-red-400">Isolated</div>
                    <div className="text-sm text-gray-400">Export Status</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}