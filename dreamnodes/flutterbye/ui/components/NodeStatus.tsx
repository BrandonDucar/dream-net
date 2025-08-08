import React from 'react';
import type { NodeStatus as NodeStatusType } from '../../../types/node';

interface NodeStatusProps {
  status: NodeStatusType;
  walletAddress: string;
}

export default function NodeStatus({ status, walletAddress }: NodeStatusProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatLastActivity = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const getStatusColor = (online: boolean) => {
    return online ? '#00ff88' : '#ff4444';
  };

  return (
    <div className="node-status">
      <h3>📊 Node Status</h3>
      
      <div className="status-grid">
        <div className="status-card">
          <div className="status-icon">🟢</div>
          <div className="status-info">
            <h4>Connection Status</h4>
            <div 
              className="status-value"
              style={{ color: getStatusColor(status.online) }}
            >
              {status.online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon">📨</div>
          <div className="status-info">
            <h4>Messages Processed</h4>
            <div className="status-value">
              {formatNumber(status.messagesProcessed)}
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon">🪙</div>
          <div className="status-info">
            <h4>Tokens Delivered</h4>
            <div className="status-value">
              {formatNumber(status.tokensDelivered)}
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon">⭐</div>
          <div className="status-info">
            <h4>Trust Score</h4>
            <div className="status-value">
              {status.trustScore}/100
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon">⏰</div>
          <div className="status-info">
            <h4>Last Activity</h4>
            <div className="status-value">
              {formatLastActivity(status.lastActivity)}
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon">🔗</div>
          <div className="status-info">
            <h4>Connected Wallet</h4>
            <div className="status-value wallet-address">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        </div>
      </div>

      <div className="node-metrics">
        <h4>Performance Metrics</h4>
        
        <div className="metric-row">
          <span>Messages/Hour:</span>
          <span>{Math.round(status.messagesProcessed / 24)} avg</span>
        </div>
        
        <div className="metric-row">
          <span>Success Rate:</span>
          <span>98.5%</span>
        </div>
        
        <div className="metric-row">
          <span>Average Delivery Time:</span>
          <span>2.3 minutes</span>
        </div>
        
        <div className="metric-row">
          <span>Network Latency:</span>
          <span>45ms</span>
        </div>
      </div>

      <div className="node-info">
        <h4>Node Information</h4>
        <div className="info-grid">
          <div>Node ID: flutterbye</div>
          <div>Version: 1.0.0</div>
          <div>Type: Messenger</div>
          <div>Tier: Premium</div>
        </div>
      </div>
    </div>
  );
}