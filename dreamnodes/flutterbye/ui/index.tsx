import React, { useState, useEffect } from 'react';
import MessageInbox from './components/MessageInbox';
// import MessageComposer from './components/MessageComposer';
// import NodeStatus from './components/NodeStatus';

interface FlutterByeNodeProps {
  walletAddress: string;
  onMessageSent?: (messageId: string) => void;
}

export default function FlutterByeNode({ walletAddress, onMessageSent }: FlutterByeNodeProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'outbox' | 'status'>('inbox');
  const [nodeStatus, setNodeStatus] = useState({
    online: true,
    messagesProcessed: 0,
    tokensDelivered: 0,
    lastActivity: Date.now()
  });

  useEffect(() => {
    // Fetch node status on mount
    fetchNodeStatus();
    
    // Set up periodic status updates
    const interval = setInterval(fetchNodeStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNodeStatus = async () => {
    try {
      const response = await fetch('/api/dreamnodes/flutterbye/status');
      const status = await response.json();
      setNodeStatus(status);
    } catch (error) {
      console.error('Failed to fetch node status:', error);
    }
  };

  const handleMessageSent = (messageId: string) => {
    onMessageSent?.(messageId);
    setActiveTab('outbox'); // Switch to outbox to show sent message
  };

  return (
    <div className="flutterbye-node">
      <div className="node-header">
        <h2>🪽 FlutterBye Messenger Node</h2>
        <div className="node-indicator">
          <div className={`status-dot ${nodeStatus.online ? 'online' : 'offline'}`} />
          <span>{nodeStatus.online ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="node-tabs">
        <button
          className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          📥 Inbox
        </button>
        <button
          className={`tab ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          ✍️ Compose
        </button>
        <button
          className={`tab ${activeTab === 'outbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('outbox')}
        >
          📤 Outbox
        </button>
        <button
          className={`tab ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          📊 Status
        </button>
      </div>

      <div className="node-content">
        {activeTab === 'inbox' && (
          <MessageInbox walletAddress={walletAddress} />
        )}
        
        {activeTab === 'compose' && (
          <div>Message Composer - Coming Soon</div>
        )}
        
        {activeTab === 'outbox' && (
          <MessageInbox 
            walletAddress={walletAddress} 
            mode="outbox" 
          />
        )}
        
        {activeTab === 'status' && (
          <div>Node Status - Coming Soon</div>
        )}
      </div>
    </div>
  );
}