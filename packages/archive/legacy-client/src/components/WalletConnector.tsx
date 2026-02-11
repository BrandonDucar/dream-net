import { useState } from 'react';
import { ErrorBoundary, DatabaseErrorFallback } from './ErrorBoundary.js';

interface WalletScanResult {
  wallet: string;
  trustScore: number;
  nftCount: number;
  dreamCoreType: 'Vision' | 'Tool' | 'Movement' | 'Story';
  unlockedBots: string[];
}

export default function WalletConnector() {
  const [wallet, setWallet] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [scanResult, setScanResult] = useState<WalletScanResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLogs(prev => [...prev, '🔗 Connecting wallet...']);
    setLoading(true);

    try {
      // Simulate wallet connection
      const mockWallet = '0x' + Math.random().toString(16).substr(2, 40);
      setWallet(mockWallet);
      setConnected(true);
      setLogs(prev => [...prev, `✅ Wallet connected: ${mockWallet.slice(0, 8)}...`]);
      
      // Trigger wallet scan
      await scanWallet(mockWallet);
    } catch (err) {
      setLogs(prev => [...prev, `❌ Connection failed: ${(err as Error).message}`]);
    } finally {
      setLoading(false);
    }
  };

  const scanWallet = async (walletAddr: string) => {
    setLogs(prev => [...prev, '🔍 Scanning wallet with FlutterAI...']);

    try {
      const response = await fetch('/api/wallet-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddr })
      });

      if (!response.ok) {
        throw new Error('Wallet scan failed');
      }

      const result = await response.json();
      setScanResult(result);
      setLogs(prev => [...prev, `📊 Trust score: ${result.trustScore}/100`]);
      setLogs(prev => [...prev, `🎯 Dream core type: ${result.dreamCoreType}`]);
      
      // Route via ConnectorBot
      await routeWithConnectorBot(result);
    } catch (err) {
      setLogs(prev => [...prev, `❌ Scan failed: ${(err as Error).message}`]);
    }
  };

  const routeWithConnectorBot = async (scanData: WalletScanResult) => {
    setLogs(prev => [...prev, '🤖 ConnectorBot analyzing wallet data...']);

    try {
      const response = await fetch('/api/connector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentState: 'Wallet connected and scanned',
          goal: 'Initialize Dream Core',
          walletData: scanData,
          availableBots: ['DreamIntakeBot', 'WebsitePrepBot', 'BackendPrepBot']
        })
      });

      const result = await response.json();
      setLogs(prev => [...prev, `🎯 Routed to: ${result.routedTo}`]);
      
      // Spawn dream core
      await spawnDreamCore(scanData);
    } catch (err) {
      setLogs(prev => [...prev, `❌ Routing failed: ${(err as Error).message}`]);
    }
  };

  const spawnDreamCore = async (scanData: WalletScanResult) => {
    setLogs(prev => [...prev, '✨ Spawning Dream Core...']);

    try {
      const response = await fetch('/api/dream-cores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: wallet,
          coreType: scanData.dreamCoreType,
          trustLevel: scanData.trustScore,
          unlockedBots: scanData.unlockedBots
        })
      });

      if (response.ok) {
        const core = await response.json();
        setLogs(prev => [...prev, `🌟 Dream Core spawned: ${core.id}`]);
        setLogs(prev => [...prev, `🔓 Unlocked bots: ${scanData.unlockedBots.join(', ')}`]);
      } else {
        throw new Error('Core spawn failed');
      }
    } catch (err) {
      setLogs(prev => [...prev, `❌ Core spawn failed: ${(err as Error).message}`]);
    }
  };

  const disconnectWallet = () => {
    setWallet('');
    setConnected(false);
    setScanResult(null);
    setLogs([]);
  };

  return (
    <ErrorBoundary fallback={DatabaseErrorFallback}>
      <div className="wallet-connector">
        <h2>🔗 Wallet Connection Flow</h2>
        
        {!connected ? (
          <div className="connection-panel">
            <p>Connect your wallet to begin the Dream Network journey</p>
            <button 
              onClick={connectWallet}
              disabled={loading}
              className="connect-button"
            >
              {loading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="connected-panel">
            <div className="wallet-info">
              <p><strong>Wallet:</strong> {wallet.slice(0, 8)}...{wallet.slice(-6)}</p>
              {scanResult && (
                <div className="scan-results">
                  <p><strong>Trust Score:</strong> {scanResult.trustScore}/100</p>
                  <p><strong>NFT Count:</strong> {scanResult.nftCount}</p>
                  <p><strong>Dream Core:</strong> {scanResult.dreamCoreType}</p>
                  <p><strong>Unlocked Bots:</strong> {scanResult.unlockedBots.join(', ')}</p>
                </div>
              )}
            </div>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}

        <div className="flow-log">
          <h3>Connection Flow</h3>
          {logs.map((entry, idx) => (
            <div key={idx} className="log-entry">{entry}</div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}