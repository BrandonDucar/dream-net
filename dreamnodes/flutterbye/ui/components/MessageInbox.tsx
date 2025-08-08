import React, { useState, useEffect } from 'react';
import type { NodeMessage } from '../../../types/node';

interface MessageInboxProps {
  walletAddress: string;
  mode?: 'inbox' | 'outbox';
}

export default function MessageInbox({ walletAddress, mode = 'inbox' }: MessageInboxProps) {
  const [messages, setMessages] = useState<NodeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'claimed'>('all');

  useEffect(() => {
    fetchMessages();
  }, [walletAddress, mode, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const endpoint = mode === 'inbox' 
        ? `/api/dreamnodes/flutterbye/inbox/${walletAddress}`
        : `/api/dreamnodes/flutterbye/outbox/${walletAddress}`;
      
      const params = new URLSearchParams({
        limit: '20',
        offset: '0'
      });
      
      if (mode === 'inbox' && filter === 'unread') {
        params.append('unreadOnly', 'true');
      }

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTokens = async (messageId: string) => {
    try {
      const response = await fetch(`/api/dreamnodes/flutterbye/inbox/${messageId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      
      if (response.ok) {
        // Refresh messages after claiming
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to claim tokens:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="message-inbox">
      <div className="inbox-header">
        <h3>{mode === 'inbox' ? 'Incoming Messages' : 'Sent Messages'}</h3>
        
        {mode === 'inbox' && (
          <div className="filter-tabs">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
        )}
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages found</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <div className="sender-info">
                  <strong>
                    {mode === 'inbox' ? 'From:' : 'To:'} {' '}
                    {mode === 'inbox' ? message.fromWallet : message.toWallet}
                  </strong>
                  <span className="timestamp">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className="token-badge">
                  {message.tokens.amount} {message.tokens.token}
                </div>
              </div>
              
              <div className="message-content">
                {message.content}
              </div>
              
              <div className="message-actions">
                {mode === 'inbox' && (
                  <button
                    className="claim-button"
                    onClick={() => handleClaimTokens(message.id)}
                  >
                    Claim Tokens
                  </button>
                )}
                
                <span className={`status ${message.validated ? 'validated' : 'pending'}`}>
                  {message.validated ? '✓ Validated' : '⏳ Pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}